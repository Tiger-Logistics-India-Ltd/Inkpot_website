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

function extractTicketId(raw: string): string | null {
  const urlMatch = raw.match(/\/ticket\/([a-f0-9-]{36})/i);
  if (urlMatch) return urlMatch[1];
  const uuidMatch = raw.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i);
  if (uuidMatch) return raw;
  return null;
}

const STATUS_STYLE: Record<string, { bg: string; border: string; icon: string }> = {
  valid:     { bg: "bg-green-600",  border: "border-green-500",  icon: "✓" },
  duplicate: { bg: "bg-amber-500",  border: "border-amber-400",  icon: "⚠" },
  invalid:   { bg: "bg-[#901A1C]",  border: "border-red-700",    icon: "✕" },
};

export default function ScanPage() {
  const [password, setPassword]   = useState("");
  const [pw, setPw]               = useState("");
  const [authed, setAuthed]       = useState(false);
  const [authError, setAuthError] = useState("");
  const [cache, setCache]         = useState<CachedTicket[]>([]);
  const [cacheTime, setCacheTime] = useState<Date | null>(null);

  const [result, setResult]         = useState<ScanResult | null>(null);
  const [scanning, setScanning]     = useState(false);
  const [manualSerial, setManualSerial] = useState("");
  const [manualResult, setManualResult] = useState<CachedTicket | null | "notfound">(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState<CachedTicket[]>([]);

  const scannerRef  = useRef<any>(null);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadCache = useCallback(async (p: string) => {
    try {
      const res = await fetch("/api/admin/check-in", { headers: { "x-admin-password": p } });
      if (!res.ok) { setAuthError("Wrong password."); return false; }
      const data = await res.json();
      setCache(data.tickets);
      setCacheTime(new Date());
      return true;
    } catch { return false; }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setAuthError("");
    const ok = await loadCache(password);
    if (ok) { setPw(password); setAuthed(true); }
  }

  // ── QR Scanner ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed || !scanning) return;
    let html5Scanner: any;
    async function startScanner() {
      const { Html5Qrcode } = await import("html5-qrcode");
      html5Scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = html5Scanner;
      await html5Scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
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
    return () => { scannerRef.current?.stop().catch(() => {}); };
  }, [authed, scanning]);

  // ── Check-in ────────────────────────────────────────────────────────────
  async function checkIn(ticketId: string) {
    if (checkingIn) return;
    setCheckingIn(true);
    const cached = cache.find(t => t.id === ticketId);
    if (cached?.checked_in) {
      showResult({ status: "duplicate", message: "Already checked in.", ticket: cached });
      setCheckingIn(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showResult({ status: "invalid", message: data.error ?? "Server error." });
      } else {
        showResult({ status: data.status, message: data.message, ticket: data.ticket });
        setCache(prev => prev.map(t => t.id === ticketId ? { ...t, checked_in: true, checked_in_at: new Date().toISOString() } : t));
        if (data.status === "valid" && data.ticket) {
          setRecentCheckIns(prev => [data.ticket, ...prev.slice(0, 4)]);
        }
      }
    } catch {
      if (cached) {
        showResult({ status: cached.payment_status === "paid" ? "valid" : "invalid", message: cached.payment_status === "paid" ? "(Offline) Guest found." : "Not a paid ticket.", ticket: cached });
        setCache(prev => prev.map(t => t.id === ticketId ? { ...t, checked_in: true } : t));
      } else {
        showResult({ status: "invalid", message: "(Offline) Ticket not in cache." });
      }
    } finally { setCheckingIn(false); }
  }

  function showResult(r: ScanResult) {
    setResult(r);
    if (resultTimer.current) clearTimeout(resultTimer.current);
    resultTimer.current = setTimeout(() => setResult(null), 5000);
  }

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

  const checkedIn   = cache.filter(t => t.checked_in).length;
  const totalGuests = cache.filter(t => t.payment_status === "paid").length;
  const remaining   = totalGuests - checkedIn;

  // ── Login ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <p className="text-[9px] tracking-[0.32em] uppercase text-[#901A1C] mb-2 text-center">Inkpot India</p>
          <h1 className="text-xl text-white text-center mb-1" style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 400 }}>
            Door Scanner
          </h1>
          <p className="text-xs text-white/25 text-center mb-8 tracking-wide">The Living Table · 28 June 2026</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input type="password" placeholder="Admin password" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-[#901A1C] placeholder-white/25"
            />
            {authError && <p className="text-red-400 text-xs">{authError}</p>}
            <button type="submit"
              className="w-full bg-[#901A1C] text-white text-[10px] tracking-[0.22em] uppercase py-3.5 hover:bg-[#7a1517] transition-colors">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Scanner ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col max-w-md mx-auto">

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          <p className="text-[8px] tracking-[0.32em] uppercase text-[#901A1C]">Inkpot India</p>
          <h1 className="text-base text-white mt-0.5" style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 400 }}>
            The Living Table — 28 June
          </h1>
          <p className="text-[10px] text-white/25 mt-0.5">
            {cache.length} guests cached
            {cacheTime && ` · ${cacheTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
          </p>
        </div>
        <button onClick={() => loadCache(pw)}
          className="text-[8px] tracking-[0.18em] uppercase text-white/30 border border-white/10 px-3 py-1.5 hover:border-white/30 transition-colors">
          Refresh
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div className="mx-5 mb-4 grid grid-cols-3 divide-x divide-white/8 border border-white/8 bg-white/3">
        {[
          { label: "Checked In", value: checkedIn,   color: checkedIn > 0 ? "text-green-400" : "text-white" },
          { label: "Total Paid",  value: totalGuests, color: "text-white" },
          { label: "Remaining",  value: remaining,   color: remaining > 0 ? "text-amber-400" : "text-white/40" },
        ].map(s => (
          <div key={s.label} className="px-3 py-3 text-center">
            <p className={`text-2xl font-light ${s.color}`}>{s.value}</p>
            <p className="text-[8px] tracking-[0.2em] uppercase text-white/25 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Scan result ── */}
      {result && (() => {
        const s = STATUS_STYLE[result.status ?? "invalid"];
        return (
          <div className={`mx-5 mb-4 p-4 border-l-4 ${s.bg} ${s.border} bg-opacity-90`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl font-bold leading-none mt-0.5">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13px]">{result.message}</p>
                {result.ticket && (
                  <p className="text-[11px] mt-0.5 opacity-85">
                    <strong>{result.ticket.buyer_name}</strong>
                    {" · "}{fmtSeats(result.ticket)}
                    {" · "}{result.ticket.qty} seat{result.ticket.qty > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Camera ── */}
      <div className="px-5 mb-5">
        {scanning ? (
          <div>
            <div id="qr-reader" className="w-full overflow-hidden rounded-sm border border-white/10" />
            <button onClick={() => { scannerRef.current?.stop().catch(() => {}); setScanning(false); }}
              className="w-full mt-3 border border-white/15 text-white/40 text-[9px] tracking-[0.22em] uppercase py-2.5 hover:border-white/30 transition-colors">
              Stop Camera
            </button>
          </div>
        ) : (
          <button onClick={() => setScanning(true)}
            className="w-full bg-[#901A1C] text-white py-5 hover:bg-[#7a1517] transition-colors flex items-center justify-center gap-3 group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="opacity-75 group-hover:opacity-100 transition-opacity">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
            <span className="text-[11px] tracking-[0.22em] uppercase font-medium">Start Camera Scanner</span>
          </button>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 px-5 mb-4">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-[8px] tracking-[0.22em] uppercase text-white/22">Or enter seat number</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* ── Manual lookup ── */}
      <div className="px-5 mb-5">
        <form onSubmit={handleManualSearch} className="flex gap-0">
          <input type="text" placeholder="TLT-0012 or just 12"
            value={manualSerial}
            onChange={e => { setManualSerial(e.target.value); setManualResult(null); }}
            className="flex-1 bg-white/5 border border-white/10 border-r-0 px-4 py-3 text-[13px] text-white outline-none focus:border-[#901A1C] placeholder-white/22"
          />
          <button type="submit"
            className="bg-white/8 border border-white/10 text-white/50 text-[9px] tracking-[0.18em] uppercase px-5 hover:bg-white/12 transition-colors whitespace-nowrap">
            Find
          </button>
        </form>

        {manualResult === "notfound" && (
          <div className="mt-3 p-4 bg-[#901A1C]/80 border border-[#901A1C]">
            <p className="text-[13px] font-semibold">✕ Ticket not found</p>
            <p className="text-[11px] opacity-75 mt-0.5">Check the number and try again.</p>
          </div>
        )}

        {manualResult && manualResult !== "notfound" && (
          <div className={`mt-3 p-4 border-l-4 ${
            manualResult.checked_in ? "bg-amber-600 border-amber-400" :
            manualResult.payment_status === "paid" ? "bg-green-700 border-green-400" :
            "bg-[#901A1C] border-red-600"
          }`}>
            <p className="text-[13px] font-semibold">
              {manualResult.checked_in ? "⚠ Already Checked In" :
               manualResult.payment_status === "paid" ? "✓ Valid Ticket" : "✕ Payment Incomplete"}
            </p>
            <p className="text-[11px] mt-1 opacity-85">
              {manualResult.buyer_name} · {fmtSeats(manualResult)} · {manualResult.qty} seat{manualResult.qty > 1 ? "s" : ""}
            </p>
            {manualResult.checked_in_at && (
              <p className="text-[10px] mt-0.5 opacity-65">
                Checked in {new Date(manualResult.checked_in_at).toLocaleTimeString("en-IN")}
              </p>
            )}
            {!manualResult.checked_in && manualResult.payment_status === "paid" && (
              <button onClick={() => handleManualCheckIn(manualResult)} disabled={checkingIn}
                className="mt-3 w-full bg-white/20 text-white text-[9px] tracking-[0.2em] uppercase py-2.5 hover:bg-white/30 transition-colors disabled:opacity-40">
                {checkingIn ? "Checking in…" : "Mark as Checked In →"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Recent check-ins ── */}
      {recentCheckIns.length > 0 && (
        <div className="px-5 mb-5">
          <p className="text-[8px] tracking-[0.26em] uppercase text-white/22 mb-2">Recent Check-ins</p>
          <div className="space-y-1">
            {recentCheckIns.map((t, i) => (
              <div key={`${t.id}-${i}`} className="flex items-center justify-between px-3 py-2 bg-white/4 border border-white/6">
                <p className="text-[12px] text-white/70">{t.buyer_name}</p>
                <p className="text-[10px] text-white/30 font-mono">{fmtSeats(t)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
