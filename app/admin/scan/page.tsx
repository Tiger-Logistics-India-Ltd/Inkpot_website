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

type ScanStatus = "valid" | "duplicate" | "invalid";

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

const POPUP_CONFIG: Record<ScanStatus, { bg: string; icon: string; label: string }> = {
  valid:     { bg: "#166534", icon: "✓", label: "Welcome!" },
  duplicate: { bg: "#92400e", icon: "⚠", label: "Already In" },
  invalid:   { bg: "#7f1d1d", icon: "✕", label: "Not Valid" },
};

const LS_KEY = "inkpot-scan-pw";

export default function ScanPage() {
  const [password, setPassword]   = useState("");
  const [pw, setPw]               = useState("");
  const [authed, setAuthed]       = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(true); // true while checking localStorage
  const [cache, setCache]         = useState<CachedTicket[]>([]);
  const [cacheTime, setCacheTime] = useState<Date | null>(null);

  const [popup, setPopup]         = useState<ScanResult | null>(null);
  const [scanning, setScanning]   = useState(false);
  const [manualSerial, setManualSerial] = useState("");
  const [manualLookup, setManualLookup] = useState<CachedTicket | null | "notfound">(null);
  const [checkingIn, setCheckingIn] = useState(false);

  const scannerRef  = useRef<any>(null);
  const popupTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Restore session from localStorage ───────────────────────────────────
  const loadCache = useCallback(async (p: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/check-in", { headers: { "x-admin-password": p } });
      if (!res.ok) return false;
      const data = await res.json();
      setCache(data.tickets);
      setCacheTime(new Date());
      return true;
    } catch { return false; }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      loadCache(saved).then(ok => {
        if (ok) { setPw(saved); setAuthed(true); }
        else { localStorage.removeItem(LS_KEY); }
        setAuthLoading(false);
      });
    } else {
      setAuthLoading(false);
    }
  }, [loadCache]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setAuthError("");
    const ok = await loadCache(password);
    if (ok) {
      localStorage.setItem(LS_KEY, password);
      setPw(password); setAuthed(true);
    } else {
      setAuthError("Wrong password.");
    }
  }

  function handleLogout() {
    localStorage.removeItem(LS_KEY);
    setAuthed(false); setPw(""); setPassword(""); setCache([]);
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
          if (!id) { showPopup({ status: "invalid", message: "Not a valid ticket QR." }); return; }
          await checkIn(id);
        },
        () => {}
      );
    }
    startScanner().catch(() => {
      showPopup({ status: "invalid", message: "Camera unavailable." });
      setScanning(false);
    });
    return () => { scannerRef.current?.stop().catch(() => {}); };
  }, [authed, scanning]);

  // ── Check-in ─────────────────────────────────────────────────────────────
  async function checkIn(ticketId: string) {
    if (checkingIn) return;
    setCheckingIn(true);
    const cached = cache.find(t => t.id === ticketId);
    if (cached?.checked_in) {
      showPopup({ status: "duplicate", message: "Already checked in.", ticket: cached });
      setCheckingIn(false); return;
    }
    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showPopup({ status: "invalid", message: data.error ?? "Server error." });
      } else {
        showPopup({ status: data.status, message: data.message, ticket: data.ticket });
        setCache(prev => prev.map(t => t.id === ticketId ? { ...t, checked_in: true, checked_in_at: new Date().toISOString() } : t));
      }
    } catch {
      if (cached) {
        showPopup({ status: cached.payment_status === "paid" ? "valid" : "invalid", message: "(Offline) Guest found in cache.", ticket: cached });
        setCache(prev => prev.map(t => t.id === ticketId ? { ...t, checked_in: true } : t));
      } else {
        showPopup({ status: "invalid", message: "(Offline) Ticket not in cache." });
      }
    } finally { setCheckingIn(false); }
  }

  function showPopup(r: ScanResult) {
    setPopup(r);
    if (popupTimer.current) clearTimeout(popupTimer.current);
    popupTimer.current = setTimeout(() => setPopup(null), 4500);
  }

  function handleManualSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = manualSerial.replace(/TLT-?/i, "").trim();
    const num = parseInt(query, 10);
    if (isNaN(num)) { setManualLookup("notfound"); return; }
    const found = cache.find(t => t.seat_numbers?.includes(num) || t.ticket_number === num);
    setManualLookup(found ?? "notfound");
  }

  async function handleManualCheckIn(ticket: CachedTicket) {
    await checkIn(ticket.id);
    setManualSerial(""); setManualLookup(null);
  }

  const checkedIn   = cache.filter(t => t.checked_in).length;
  const totalPaid   = cache.filter(t => t.payment_status === "paid").length;
  const remaining   = totalPaid - checkedIn;

  // ── Loading (checking localStorage) ────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#901A1C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-xs">
          <p className="text-[8px] tracking-[0.36em] uppercase text-[#901A1C] text-center mb-3">Inkpot India</p>
          <h1 className="text-2xl text-white text-center mb-1 font-light" style={{ fontFamily: "Georgia,serif", fontStyle: "italic" }}>
            Door Scanner
          </h1>
          <p className="text-[11px] text-white/25 text-center mb-10 tracking-wide">
            The Living Table · 28 June 2026
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password" placeholder="Admin password" value={password}
              onChange={e => setPassword(e.target.value)} autoFocus
              className="w-full bg-transparent border-b border-white/15 pb-3 text-base text-white outline-none focus:border-[#901A1C] placeholder-white/20 text-center tracking-widest"
            />
            {authError && <p className="text-red-400 text-xs text-center">{authError}</p>}
            <button type="submit" disabled={!password}
              className="w-full bg-[#901A1C] text-white text-[10px] tracking-[0.26em] uppercase py-4 hover:bg-[#7a1517] transition-colors disabled:opacity-30 mt-2">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Scanner (authed) ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col" style={{ maxWidth: "480px", margin: "0 auto" }}>

      {/* ── Full-screen result popup ── */}
      {popup && (() => {
        const cfg = POPUP_CONFIG[popup.status];
        return (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8 cursor-pointer"
            style={{ background: cfg.bg }}
            onClick={() => { setPopup(null); if (popupTimer.current) clearTimeout(popupTimer.current); }}
          >
            {/* Big icon */}
            <div className="text-[96px] leading-none mb-4 font-bold" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
              {cfg.icon}
            </div>

            {/* Status label */}
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/60 mb-3">{cfg.label}</p>

            {/* Guest name */}
            {popup.ticket ? (
              <>
                <h2 className="text-3xl font-light text-white text-center mb-2 leading-tight" style={{ fontFamily: "Georgia,serif" }}>
                  {popup.ticket.buyer_name}
                </h2>
                <p className="text-sm text-white/50 tracking-wider font-mono">{fmtSeats(popup.ticket)}</p>
                {popup.ticket.qty > 1 && (
                  <p className="text-xs text-white/35 mt-1">{popup.ticket.qty} seats</p>
                )}
              </>
            ) : (
              <p className="text-base text-white/70 text-center">{popup.message}</p>
            )}

            <p className="text-[10px] text-white/25 tracking-widest uppercase mt-12">tap to dismiss</p>
          </div>
        );
      })()}

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <div>
          <p className="text-[8px] tracking-[0.32em] uppercase text-[#901A1C]">Inkpot India</p>
          <p className="text-[13px] text-white/80 mt-0.5 font-light" style={{ fontFamily: "Georgia,serif", fontStyle: "italic" }}>
            The Living Table — 28 June
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => loadCache(pw)}
            className="text-[8px] tracking-[0.16em] uppercase text-white/25 border border-white/10 px-3 py-1.5 hover:border-white/25 transition-colors">
            Refresh
          </button>
          <button onClick={handleLogout}
            className="text-[8px] tracking-[0.16em] uppercase text-white/20 border border-white/8 px-3 py-1.5 hover:text-white/40 transition-colors">
            Log out
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="mx-5 mt-3 mb-5 grid grid-cols-3 gap-3">
        <div className="bg-white/4 rounded-lg px-3 py-3 text-center border border-white/6">
          <p className={`text-3xl font-light mb-0.5 ${checkedIn > 0 ? "text-green-400" : "text-white/30"}`}>{checkedIn}</p>
          <p className="text-[8px] tracking-[0.2em] uppercase text-white/22">Checked In</p>
        </div>
        <div className="bg-white/4 rounded-lg px-3 py-3 text-center border border-white/6">
          <p className="text-3xl font-light text-white/70 mb-0.5">{totalPaid}</p>
          <p className="text-[8px] tracking-[0.2em] uppercase text-white/22">Total</p>
        </div>
        <div className="bg-white/4 rounded-lg px-3 py-3 text-center border border-white/6">
          <p className={`text-3xl font-light mb-0.5 ${remaining > 0 ? "text-amber-400" : "text-white/30"}`}>{remaining}</p>
          <p className="text-[8px] tracking-[0.2em] uppercase text-white/22">Remaining</p>
        </div>
      </div>

      {/* ── Camera ── */}
      <div className="px-5 mb-5">
        {scanning ? (
          <div>
            <div id="qr-reader" className="w-full rounded-xl overflow-hidden border border-white/8" />
            <button
              onClick={() => { scannerRef.current?.stop().catch(() => {}); setScanning(false); }}
              className="w-full mt-3 py-3 border border-white/10 rounded-lg text-[9px] tracking-[0.22em] uppercase text-white/30 hover:border-white/25 hover:text-white/50 transition-colors"
            >
              Stop Camera
            </button>
          </div>
        ) : (
          <button
            onClick={() => setScanning(true)}
            className="w-full bg-[#901A1C] rounded-xl py-7 flex flex-col items-center gap-3 hover:bg-[#7a1517] active:bg-[#6b1214] transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" className="opacity-90">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/90 font-medium">Scan QR Code</span>
          </button>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-4 px-5 mb-5">
        <div className="flex-1 h-px bg-white/6" />
        <span className="text-[8px] tracking-[0.28em] uppercase text-white/18">or search by seat</span>
        <div className="flex-1 h-px bg-white/6" />
      </div>

      {/* ── Manual search ── */}
      <div className="px-5 pb-8">
        <form onSubmit={handleManualSearch} className="flex gap-0 rounded-lg overflow-hidden border border-white/10">
          <input
            type="text" placeholder="TLT-0012 or just 12"
            value={manualSerial}
            onChange={e => { setManualSerial(e.target.value); setManualLookup(null); }}
            className="flex-1 bg-white/5 px-4 py-3.5 text-[13px] text-white outline-none focus:bg-white/8 placeholder-white/18 transition-colors"
          />
          <button type="submit"
            className="bg-white/8 border-l border-white/10 text-white/45 text-[9px] tracking-[0.2em] uppercase px-5 hover:bg-white/14 transition-colors whitespace-nowrap">
            Find
          </button>
        </form>

        {/* Manual lookup result */}
        {manualLookup === "notfound" && (
          <div className="mt-3 rounded-lg bg-[#901A1C]/30 border border-[#901A1C]/50 px-4 py-3">
            <p className="text-[13px] font-medium text-white/80">✕ Ticket not found</p>
            <p className="text-[11px] text-white/40 mt-0.5">Check the seat number and try again.</p>
          </div>
        )}

        {manualLookup && manualLookup !== "notfound" && (
          <div className={`mt-3 rounded-lg border px-4 py-4 ${
            manualLookup.checked_in ? "bg-amber-900/30 border-amber-700/50" :
            manualLookup.payment_status === "paid" ? "bg-green-900/30 border-green-700/50" :
            "bg-red-900/30 border-red-800/50"
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium text-white/85">{manualLookup.buyer_name}</p>
                <p className="text-[11px] text-white/40 mt-0.5 font-mono">{fmtSeats(manualLookup)} · {manualLookup.qty} seat{manualLookup.qty > 1 ? "s" : ""}</p>
                {manualLookup.checked_in_at && (
                  <p className="text-[10px] text-white/30 mt-1">
                    Checked in {new Date(manualLookup.checked_in_at).toLocaleTimeString("en-IN")}
                  </p>
                )}
              </div>
              <span className={`text-[8px] tracking-[0.14em] uppercase px-2 py-1 rounded-full shrink-0 ${
                manualLookup.checked_in ? "bg-amber-500/30 text-amber-300" :
                manualLookup.payment_status === "paid" ? "bg-green-500/30 text-green-300" :
                "bg-red-500/30 text-red-300"
              }`}>
                {manualLookup.checked_in ? "Already In" : manualLookup.payment_status === "paid" ? "Valid" : "Unpaid"}
              </span>
            </div>

            {!manualLookup.checked_in && manualLookup.payment_status === "paid" && (
              <button
                onClick={() => handleManualCheckIn(manualLookup)}
                disabled={checkingIn}
                className="w-full mt-4 bg-green-700 hover:bg-green-600 text-white text-[10px] tracking-[0.22em] uppercase py-3 rounded-lg transition-colors disabled:opacity-40"
              >
                {checkingIn ? "Checking in…" : "Check In →"}
              </button>
            )}
          </div>
        )}

        {/* Cache info */}
        <p className="text-center text-[9px] text-white/15 mt-6 tracking-wide">
          {cache.length} guests cached
          {cacheTime && ` · ${cacheTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
        </p>
      </div>

    </div>
  );
}
