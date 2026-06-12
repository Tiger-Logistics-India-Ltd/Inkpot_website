"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CachedTicket {
  id: string;
  ticket_number: number | null;
  seat_numbers: number[];
  buyer_name: string;
  qty: number;
  payment_status: string;
  checked_in: boolean;
  checked_in_at: string | null;
}

type ScanStatus = "valid" | "duplicate" | "invalid" | null;

interface ScanResult {
  status: ScanStatus;
  message: string;
  ticket?: CachedTicket;
}

function fmtSeats(t: CachedTicket): string {
  if (!t.seat_numbers?.length) return t.ticket_number ? `TLT-${String(t.ticket_number).padStart(4, "0")}` : "—";
  return t.seat_numbers.map(n => `TLT-${String(n).padStart(4, "0")}`).join(", ");
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";

function extractTicketId(raw: string): string | null {
  // Handles full URL: https://www.inkpotindia.com/ticket/UUID
  // Or bare UUID
  const urlMatch = raw.match(/\/ticket\/([a-f0-9-]{36})/i);
  if (urlMatch) return urlMatch[1];
  const uuidMatch = raw.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i);
  if (uuidMatch) return raw;
  return null;
}

export default function ScanPage() {
  const [password, setPassword] = useState("");
  const [pw, setPw]             = useState("");
  const [authed, setAuthed]     = useState(false);
  const [authError, setAuthError] = useState("");
  const [cache, setCache]       = useState<CachedTicket[]>([]);
  const [cacheTime, setCacheTime] = useState<Date | null>(null);

  const [result, setResult]     = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualSerial, setManualSerial] = useState("");
  const [manualResult, setManualResult] = useState<CachedTicket | null | "notfound">(null);
  const [checkingIn, setCheckingIn] = useState(false);

  const scannerRef   = useRef<any>(null);
  const resultTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load guest cache ──────────────────────────────────────────────────────
  const loadCache = useCallback(async (p: string) => {
    try {
      const res = await fetch(`/api/admin/check-in?pw=${encodeURIComponent(p)}`);
      if (!res.ok) { setAuthError("Wrong password."); return false; }
      const data = await res.json();
      setCache(data.tickets);
      setCacheTime(new Date());
      return true;
    } catch {
      return false;
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const ok = await loadCache(password);
    if (ok) { setPw(password); setAuthed(true); }
  }

  // ── QR Scanner ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed || !scanning) return;

    let html5Scanner: any;

    async function startScanner() {
      const { Html5Qrcode } = await import("html5-qrcode");
      html5Scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = html5Scanner;

      await html5Scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        async (decodedText: string) => {
          const id = extractTicketId(decodedText);
          if (!id) { showResult({ status: "invalid", message: "Not a valid ticket QR." }); return; }
          await checkIn(id);
        },
        () => {}
      );
    }

    startScanner().catch(err => {
      console.error(err);
      showResult({ status: "invalid", message: "Camera access denied or unavailable." });
      setScanning(false);
    });

    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, [authed, scanning]);

  // ── Check-in logic ────────────────────────────────────────────────────────
  async function checkIn(ticketId: string) {
    if (checkingIn) return;
    setCheckingIn(true);

    // Optimistic check from cache first
    const cached = cache.find(t => t.id === ticketId);
    if (cached?.checked_in) {
      showResult({ status: "duplicate", message: "Already checked in.", ticket: cached });
      setCheckingIn(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/check-in?pw=${encodeURIComponent(pw)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        showResult({ status: "invalid", message: data.error ?? "Server error." });
      } else {
        showResult({ status: data.status, message: data.message, ticket: data.ticket });
        // Update local cache
        setCache(prev => prev.map(t => t.id === ticketId ? { ...t, checked_in: true, checked_in_at: new Date().toISOString() } : t));
      }
    } catch {
      // Offline — use cache only
      if (cached) {
        showResult({ status: cached.payment_status === "paid" ? "valid" : "invalid", message: cached.payment_status === "paid" ? "(Offline) Guest found in cache." : "Not a paid ticket.", ticket: cached });
        setCache(prev => prev.map(t => t.id === ticketId ? { ...t, checked_in: true } : t));
      } else {
        showResult({ status: "invalid", message: "(Offline) Ticket not in cache." });
      }
    } finally {
      setCheckingIn(false);
    }
  }

  function showResult(r: ScanResult) {
    setResult(r);
    if (resultTimer.current) clearTimeout(resultTimer.current);
    resultTimer.current = setTimeout(() => setResult(null), 4000);
  }

  // ── Manual serial lookup ─────────────────────────────────────────────────
  function handleManualSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = manualSerial.replace(/TLT-?/i, "").trim();
    const num = parseInt(query, 10);
    if (isNaN(num)) { setManualResult("notfound"); return; }
    const found = cache.find(t => t.seat_numbers?.includes(num) || t.ticket_number === num);
    setManualResult(found ?? "notfound");
  }

  async function handleManualCheckIn(ticket: CachedTicket) {
    await checkIn(ticket.id);
    setManualResult(prev => (typeof prev === "object" && prev) ? { ...prev, checked_in: true } : prev);
  }

  const statusColors: Record<string, string> = {
    valid:     "bg-green-500",
    duplicate: "bg-amber-500",
    invalid:   "bg-red-600",
  };
  const statusIcons: Record<string, string> = {
    valid: "✓", duplicate: "⚠", invalid: "✕",
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-[#111] w-full max-w-xs p-8 border-t-4 border-[#901A1C]">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#901A1C] mb-1">Inkpot India</p>
          <h1 className="text-xl text-white mb-6" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            Door Scanner
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none focus:border-[#901A1C] mb-3"
            />
            {authError && <p className="text-red-400 text-xs mb-3">{authError}</p>}
            <button type="submit" className="w-full bg-[#901A1C] text-white text-[10px] tracking-[0.2em] uppercase py-3">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Scanner ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#901A1C]">The Living Table — 28 June</p>
          <p className="text-xs text-white/40 mt-0.5">
            {cache.length} guests cached
            {cacheTime && ` · ${cacheTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
          </p>
        </div>
        <button
          onClick={() => loadCache(pw)}
          className="text-[9px] tracking-[0.15em] uppercase text-white/40 border border-white/20 px-3 py-1.5"
        >
          Refresh
        </button>
      </div>

      {/* Scan result overlay */}
      {result && (
        <div className={`mx-4 mt-4 p-4 flex items-start gap-3 ${statusColors[result.status ?? "invalid"]}`}>
          <span className="text-2xl font-bold leading-none">{statusIcons[result.status ?? "invalid"]}</span>
          <div>
            <p className="text-sm font-semibold">{result.message}</p>
            {result.ticket && (
              <p className="text-xs mt-0.5 opacity-90">
                {result.ticket.buyer_name} · {fmtSeats(result.ticket)} · {result.ticket.qty} seat{result.ticket.qty > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Camera */}
      <div className="px-4 mt-4">
        {scanning ? (
          <div>
            <div id="qr-reader" className="w-full overflow-hidden rounded" />
            <button
              onClick={() => { scannerRef.current?.stop().catch(() => {}); setScanning(false); }}
              className="w-full mt-3 border border-white/20 text-white/50 text-[10px] tracking-[0.2em] uppercase py-2"
            >
              Stop Camera
            </button>
          </div>
        ) : (
          <button
            onClick={() => setScanning(true)}
            className="w-full bg-[#901A1C] text-white text-[11px] tracking-[0.2em] uppercase py-5 hover:bg-[#7a1517] transition-colors"
          >
            Start Camera Scanner
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 px-4 mt-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[9px] tracking-[0.2em] uppercase text-white/30">Or enter serial number</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Manual serial lookup */}
      <div className="px-4 mt-4">
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="TLT-0012 or just 12"
            value={manualSerial}
            onChange={e => { setManualSerial(e.target.value); setManualResult(null); }}
            className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none focus:border-[#901A1C] placeholder-white/30"
          />
          <button type="submit" className="bg-white/10 border border-white/20 text-white/60 text-[10px] tracking-[0.15em] uppercase px-4">
            Find
          </button>
        </form>

        {manualResult === "notfound" && (
          <div className="mt-3 p-4 bg-red-600">
            <p className="text-sm font-semibold">✕ Ticket not found</p>
            <p className="text-xs opacity-80 mt-0.5">Check the serial number and try again.</p>
          </div>
        )}

        {manualResult && manualResult !== "notfound" && (
          <div className={`mt-3 p-4 ${manualResult.checked_in ? "bg-amber-500" : manualResult.payment_status === "paid" ? "bg-green-700" : "bg-red-600"}`}>
            <p className="text-sm font-semibold">
              {manualResult.checked_in ? "⚠ Already Checked In" : manualResult.payment_status === "paid" ? "✓ Valid Ticket" : "✕ Payment Not Complete"}
            </p>
            <p className="text-xs mt-1 opacity-90">
              {manualResult.buyer_name} · {fmtSeats(manualResult)} · {manualResult.qty} seat{manualResult.qty > 1 ? "s" : ""}
            </p>
            {manualResult.checked_in_at && (
              <p className="text-xs mt-0.5 opacity-75">
                Checked in at {new Date(manualResult.checked_in_at).toLocaleTimeString("en-IN")}
              </p>
            )}
            {!manualResult.checked_in && manualResult.payment_status === "paid" && (
              <button
                onClick={() => handleManualCheckIn(manualResult)}
                disabled={checkingIn}
                className="mt-3 w-full bg-white/20 text-white text-[10px] tracking-[0.2em] uppercase py-2 disabled:opacity-50"
              >
                {checkingIn ? "Checking in…" : "Mark as Checked In"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick stats footer */}
      <div className="mt-auto border-t border-white/10 px-4 py-3 flex gap-6">
        <div>
          <p className="text-[9px] tracking-[0.2em] uppercase text-white/30">Checked In</p>
          <p className="text-lg text-white">{cache.filter(t => t.checked_in).length}</p>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.2em] uppercase text-white/30">Total Guests</p>
          <p className="text-lg text-white">{cache.length}</p>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.2em] uppercase text-white/30">Remaining</p>
          <p className="text-lg text-white">{cache.filter(t => !t.checked_in).length}</p>
        </div>
      </div>

    </div>
  );
}
