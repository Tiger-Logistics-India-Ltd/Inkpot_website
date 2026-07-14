"use client";

import { useState, useCallback, useRef, Fragment } from "react";

const TOTAL = 100;

interface Ticket {
  id: string;
  ticket_number: number | null;
  seat_numbers: number[];
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  qty: number;
  amount: number;
  payment_status: string;
  checked_in: boolean;
  checked_in_at: string | null;
  coupon_code: string | null;
  meal_preferences: string[] | null;
  archived: boolean;
  notes: string | null;
  created_at: string;
}

interface Stats {
  seats_sold: number;
  seats_remaining: number;
  checked_in_count: number;
}

interface Interest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string | null;
  created_at: string;
}

type FilterType = "all" | "paid" | "pending" | "checked_in" | "archived";
type ViewType = "guests" | "interest";

function fmtSeats(t: Ticket): string {
  if (!t.seat_numbers?.length) return t.ticket_number ? `TLT-${String(t.ticket_number).padStart(4, "0")}` : "—";
  return t.seat_numbers.map(n => `TLT-${String(n).padStart(4, "0")}`).join(", ");
}
function fmtAmount(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── SVG icons ──────────────────────────────────────────────────────────────
const NoteIcon = ({ filled }: { filled: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#C9A84C" : "none"} stroke={filled ? "#C9A84C" : "currentColor"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const ArchiveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);
const RestoreIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
  </svg>
);

export default function AdminPage() {
  const [password, setPassword]   = useState("");
  const [authed, setAuthed]       = useState(false);
  const [pw, setPw]               = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [tickets, setTickets]     = useState<Ticket[]>([]);
  const [stats, setStats]         = useState<Stats | null>(null);
  const [filter, setFilter]       = useState<FilterType>("all");
  const [search, setSearch]       = useState("");

  // Interest list
  const [view, setView]                     = useState<ViewType>("guests");
  const [interest, setInterest]             = useState<Interest[]>([]);
  const [interestSearch, setInterestSearch] = useState("");
  const [interestError, setInterestError]   = useState("");

  // Action states
  const [resending, setResending]           = useState<string | null>(null);
  const [resendResult, setResendResult]     = useState<Record<string, "ok" | "err">>({});
  const [markingPaid, setMarkingPaid]       = useState<string | null>(null);
  const [markPaidResult, setMarkPaidResult] = useState<Record<string, "ok" | "err">>({});
  const [archiving, setArchiving]           = useState<string | null>(null);
  const [unchecking, setUnchecking]         = useState<string | null>(null);

  // Guidelines
  const [showGuidelines, setShowGuidelines]       = useState(false);
  const [guidelinesSending, setGuidelinesSending] = useState(false);
  const [guidelinesResult, setGuidelinesResult]   = useState<{ sent?: number; failed?: number; total?: number; test?: boolean; to?: string; error?: string } | null>(null);

  // QR Test
  const [showQrTest, setShowQrTest]         = useState(false);
  const [qrTestEmail, setQrTestEmail]       = useState("saurav.chaudhary70@gmail.com");
  const [qrTestSending, setQrTestSending]   = useState(false);
  const [qrTestResult, setQrTestResult]     = useState<{ ok?: boolean; to?: string; error?: string } | null>(null);

  // Notes
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [noteDraft, setNoteDraft]         = useState("");
  const [savingNote, setSavingNote]       = useState<string | null>(null);

  const fetchData = useCallback(async (p: string) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/guests", { headers: { "x-admin-password": p } });
      const data = await res.json();
      if (res.status === 401) { setError("Wrong password."); return; }
      if (!res.ok) { setError(data.error ?? "Server error — run the pending Supabase migration."); return; }
      setTickets(data.tickets);
      setStats(data.stats);
      setAuthed(true);
      setPw(p);
      fetchInterest(p);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  }, []);

  // Non-fatal — a missing interest table must never block the guest list
  const fetchInterest = useCallback(async (p: string) => {
    setInterestError("");
    try {
      const res = await fetch("/api/admin/interest", { headers: { "x-admin-password": p } });
      const data = await res.json();
      if (!res.ok) { setInterestError(data.error ?? "Failed to load interest list."); setInterest([]); return; }
      setInterest(data.interest ?? []);
    } catch { setInterestError("Failed to load interest list."); }
  }, []);

  const refresh = () => { fetchData(pw); };

  async function handleResend(ticketId: string) {
    setResending(ticketId);
    try {
      const res = await fetch("/api/admin/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      setResendResult(prev => ({ ...prev, [ticketId]: res.ok ? "ok" : "err" }));
    } catch { setResendResult(prev => ({ ...prev, [ticketId]: "err" })); }
    finally { setResending(null); }
  }

  async function handleMarkPaid(ticketId: string) {
    if (!confirm("Mark this ticket as paid and send the confirmation email?")) return;
    setMarkingPaid(ticketId);
    try {
      const res = await fetch("/api/admin/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      setMarkPaidResult(prev => ({ ...prev, [ticketId]: res.ok ? "ok" : "err" }));
      if (res.ok) setTimeout(refresh, 800);
    } catch { setMarkPaidResult(prev => ({ ...prev, [ticketId]: "err" })); }
    finally { setMarkingPaid(null); }
  }

  async function handleUncheck(ticketId: string) {
    if (!confirm("Remove check-in for this guest?")) return;
    setUnchecking(ticketId);
    try {
      const res = await fetch("/api/admin/uncheck", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      if (res.ok) setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, checked_in: false, checked_in_at: null } : t));
    } finally { setUnchecking(null); }
  }

  async function handleArchive(ticketId: string, isArchived: boolean) {
    setArchiving(ticketId);
    try {
      const res = await fetch("/api/admin/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ ticket_id: ticketId, archived: !isArchived }),
      });
      if (res.ok) setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, archived: !isArchived } : t));
    } finally { setArchiving(null); }
  }

  function toggleNotes(ticket: Ticket) {
    if (expandedNotes === ticket.id) { setExpandedNotes(null); return; }
    setNoteDraft(ticket.notes ?? "");
    setExpandedNotes(ticket.id);
  }

  async function saveNote(ticketId: string) {
    setSavingNote(ticketId);
    try {
      await fetch("/api/admin/note", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ ticket_id: ticketId, notes: noteDraft }),
      });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, notes: noteDraft || null } : t));
      setExpandedNotes(null);
    } finally { setSavingNote(null); }
  }

  async function handleSendGuidelines(testEmail?: string) {
    const paidCount = tickets.filter(t => !t.archived && t.payment_status === "paid").length;
    const msg = testEmail
      ? `Send test to ${testEmail}?`
      : `Send guidelines to ALL ${paidCount} paid guests. This cannot be undone. Continue?`;
    if (!confirm(msg)) return;
    setGuidelinesSending(true);
    setGuidelinesResult(null);
    try {
      const res = await fetch("/api/admin/send-guidelines", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify(testEmail ? { test_email: testEmail } : {}),
      });
      const data = await res.json();
      setGuidelinesResult(data);
    } catch {
      setGuidelinesResult({ error: "Network error." });
    } finally {
      setGuidelinesSending(false);
    }
  }

  async function handleSendQrTest() {
    if (!qrTestEmail.trim()) return;
    setQrTestSending(true);
    setQrTestResult(null);
    try {
      const res = await fetch("/api/admin/send-qr-test", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ email: qrTestEmail.trim() }),
      });
      const data = await res.json();
      setQrTestResult(data);
    } catch {
      setQrTestResult({ error: "Network error." });
    } finally {
      setQrTestSending(false);
    }
  }

  function exportCSV() {
    const SITE = "https://www.inkpotindia.com";
    const headers = ["Seat(s)", "Name", "Email", "Phone", "Qty", "Amount", "Meals", "Status", "Checked In", "Check-in Time", "Archived", "Notes", "Booked At", "Ticket URL (for QR)"];
    const rows = tickets.map(t => [
      fmtSeats(t), t.buyer_name, t.buyer_email, t.buyer_phone, t.qty,
      fmtAmount(t.amount), (t.meal_preferences ?? []).join(", "), t.payment_status,
      t.checked_in ? "Yes" : "No", t.checked_in_at ? fmtDate(t.checked_in_at) : "",
      t.archived ? "Yes" : "No", t.notes ?? "", fmtDate(t.created_at),
      t.payment_status === "paid" ? `${SITE}/ticket/${t.id}` : "",
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "living-table-guests.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function exportInterestCSV() {
    const headers = ["Name", "Email", "Phone", "Source", "Received"];
    const rows = interest.map(r => [r.name, r.email, r.phone ?? "", r.source ?? "", fmtDate(r.created_at)]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "living-table-interest.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const filteredInterest = interest.filter(r => {
    if (!interestSearch) return true;
    const q = interestSearch.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || (r.phone ?? "").includes(q);
  });

  const filtered = tickets.filter(t => {
    if (filter === "archived") return !!t.archived;
    if (t.archived) return false;
    if (filter === "paid"       && t.payment_status !== "paid")   return false;
    if (filter === "pending"    && t.payment_status !== "pending") return false;
    if (filter === "checked_in" && !t.checked_in)                 return false;
    if (search) {
      const q = search.toLowerCase();
      return t.buyer_name.toLowerCase().includes(q) || t.buyer_email.toLowerCase().includes(q) || t.buyer_phone.includes(q);
    }
    return true;
  });

  const archivedCount = tickets.filter(t => t.archived).length;
  const pendingCount  = tickets.filter(t => !t.archived && t.payment_status === "pending").length;

  // Computed from non-archived paid tickets only
  const activePaid     = tickets.filter(t => !t.archived && t.payment_status === "paid");
  const seatsSold      = activePaid.reduce((s, t) => s + (t.qty ?? 1), 0);
  const seatsRemaining = TOTAL - seatsSold;
  const revenue        = seatsSold * 6500;
  const checkedInCount = activePaid.filter(t => t.checked_in).length;

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm p-10 shadow-sm border-t-4 border-[#901A1C]">
          <p className="text-[9px] tracking-[0.32em] uppercase text-[#901A1C] mb-2">Inkpot India</p>
          <h1 className="text-2xl text-black mb-1" style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 400 }}>
            Admin Dashboard
          </h1>
          <p className="text-xs text-black/35 mb-8">The Living Table · 28 June 2026</p>
          <form onSubmit={e => { e.preventDefault(); fetchData(password); }}>
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-b border-black/20 pb-2 text-sm text-black outline-none focus:border-[#901A1C] bg-transparent mb-6 placeholder-black/30"
            />
            {error && <p className="text-[#901A1C] text-xs mb-4">{error}</p>}
            <button type="submit" disabled={loading || !password}
              className="w-full bg-[#901A1C] text-white text-[10px] tracking-[0.22em] uppercase py-3.5 disabled:opacity-40 hover:bg-[#7a1517] transition-colors">
              {loading ? "Verifying…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4EFE6]">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-black/8 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[9px] tracking-[0.32em] uppercase text-[#901A1C]">Inkpot India</p>
            <h1 className="text-xl text-black mt-0.5" style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 400 }}>
              The Living Table &mdash; {view === "interest" ? "Interest List" : "Guest List"}
            </h1>
          </div>
          <div className="flex gap-2">
            <button onClick={refresh}
              className="text-[9px] tracking-[0.18em] uppercase text-black/45 border border-black/15 px-4 py-2 hover:border-black/40 transition-colors">
              Refresh
            </button>
            {view === "guests" && (
              <>
                <button onClick={exportCSV}
                  className="text-[9px] tracking-[0.18em] uppercase bg-[#901A1C] text-white px-4 py-2 hover:bg-[#7a1517] transition-colors">
                  Export CSV
                </button>
                <button onClick={() => { setShowGuidelines(v => !v); setGuidelinesResult(null); setShowQrTest(false); }}
                  className={`text-[9px] tracking-[0.18em] uppercase px-4 py-2 border transition-colors ${showGuidelines ? "bg-[#901A1C] text-white border-[#901A1C]" : "border-black/15 text-black/45 hover:border-black/40"}`}>
                  Send Guidelines
                </button>
                <button onClick={() => { setShowQrTest(v => !v); setQrTestResult(null); setShowGuidelines(false); }}
                  className={`text-[9px] tracking-[0.18em] uppercase px-4 py-2 border transition-colors ${showQrTest ? "bg-black text-white border-black" : "border-black/15 text-black/45 hover:border-black/40"}`}>
                  QR Test
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Send Guidelines Panel ── */}
      {view === "guests" && showGuidelines && (
        <div className="bg-white border-b border-black/8 px-6 py-5">
          <div className="max-w-screen-xl mx-auto">
            <p className="text-[9px] tracking-[0.28em] uppercase text-black/35 mb-3">Send Guest Guidelines Email</p>
            <p className="text-xs text-black/50 mb-4 leading-relaxed max-w-xl">
              Sends the event guidelines + QR ticket + PDF attachment to each guest. Use test first to verify.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => handleSendGuidelines("saurav.chaudhary70@gmail.com")}
                disabled={guidelinesSending}
                className="text-[9px] tracking-[0.18em] uppercase border border-black/20 px-4 py-2.5 hover:border-black/50 transition-colors disabled:opacity-40"
              >
                {guidelinesSending ? "Sending…" : "Send Test → saurav.chaudhary70@gmail.com"}
              </button>
              <button
                onClick={() => handleSendGuidelines()}
                disabled={guidelinesSending}
                className="text-[9px] tracking-[0.18em] uppercase bg-[#901A1C] text-white px-4 py-2.5 hover:bg-[#7a1517] transition-colors disabled:opacity-40"
              >
                {guidelinesSending ? "Sending…" : `Send to All ${tickets.filter(t => !t.archived && t.payment_status === "paid").length} Guests`}
              </button>
            </div>
            {guidelinesResult && (
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-xs ${guidelinesResult.error ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"}`}>
                {guidelinesResult.error
                  ? `Error: ${guidelinesResult.error}`
                  : guidelinesResult.test
                    ? `✓ Test sent to ${guidelinesResult.to}`
                    : `✓ Sent ${guidelinesResult.sent} / ${guidelinesResult.total}${guidelinesResult.failed ? ` · ${guidelinesResult.failed} failed` : ""}`
                }
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── QR Test Panel ── */}
      {view === "guests" && showQrTest && (
        <div className="bg-white border-b border-black/8 px-6 py-5">
          <div className="max-w-screen-xl mx-auto">
            <p className="text-[9px] tracking-[0.28em] uppercase text-black/35 mb-3">Send Scanner Test QR</p>
            <p className="text-xs text-black/50 mb-4 leading-relaxed max-w-xl">
              Sends a scannable QR to any address. Uses a dummy archived ticket (Saurav Chaudhary) — no real guest is affected. Safe to scan multiple times. If it checks in, hit <strong>Uncheck</strong> in the guest list to reset.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="email"
                value={qrTestEmail}
                onChange={e => { setQrTestEmail(e.target.value); setQrTestResult(null); }}
                placeholder="Enter email address"
                className="border border-black/20 px-4 py-2.5 text-sm text-black outline-none focus:border-black/50 w-72 bg-transparent placeholder-black/30"
              />
              <button
                onClick={handleSendQrTest}
                disabled={qrTestSending || !qrTestEmail.trim()}
                className="text-[9px] tracking-[0.18em] uppercase bg-black text-white px-5 py-2.5 hover:bg-black/80 transition-colors disabled:opacity-40"
              >
                {qrTestSending ? "Sending…" : "Send QR →"}
              </button>
            </div>
            {qrTestResult && (
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-xs ${qrTestResult.error ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"}`}>
                {qrTestResult.error ? `Error: ${qrTestResult.error}` : `✓ QR sent to ${qrTestResult.to}`}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-6 py-6">

        {/* ── View tabs ── */}
        <div className="flex gap-2 mb-6">
          {([
            { key: "guests",   label: "Guest List" },
            { key: "interest", label: `Interest${interest.length ? ` (${interest.length})` : ""}` },
          ] as { key: ViewType; label: string }[]).map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              className={`text-[9px] tracking-[0.18em] uppercase px-4 py-2 transition-colors ${
                view === v.key ? "bg-[#901A1C] text-white" : "bg-white text-black/40 border border-black/12 hover:border-black/35"
              }`}>
              {v.label}
            </button>
          ))}
        </div>

        {view === "guests" && (
        <>
        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Seats Sold",      value: `${seatsSold} / ${TOTAL}`,                              accent: false },
            { label: "Seats Remaining", value: seatsRemaining,                                          accent: false },
            { label: "Revenue",         value: `₹${revenue.toLocaleString("en-IN")}`,                  accent: false },
            { label: "Checked In",      value: `${checkedInCount} / ${seatsSold}`,                     accent: true },
          ].map(s => (
            <div key={s.label} className={`bg-white px-5 py-4 border-t-2 ${s.accent ? "border-[#901A1C]" : "border-black/8"} shadow-[0_1px_4px_rgba(0,0,0,0.06)]`}>
              <p className="text-[8px] tracking-[0.28em] uppercase text-black/35 mb-1.5">{s.label}</p>
              <p className="text-2xl font-light text-black" style={{ fontFamily: "Georgia,serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Filters + Search ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {([
            { key: "all",        label: "All active" },
            { key: "paid",       label: "Paid" },
            { key: "pending",    label: `Pending${pendingCount ? ` (${pendingCount})` : ""}` },
            { key: "checked_in", label: "Checked In" },
            { key: "archived",   label: `Archived${archivedCount ? ` (${archivedCount})` : ""}` },
          ] as { key: FilterType; label: string }[]).map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`text-[9px] tracking-[0.18em] uppercase px-3.5 py-1.5 transition-colors ${
                filter === f.key
                  ? f.key === "archived" ? "bg-black/70 text-white" : "bg-[#901A1C] text-white"
                  : "bg-white text-black/40 border border-black/12 hover:border-black/35"
              }`}>
              {f.label}
            </button>
          ))}
          <input type="text" placeholder="Search name / email / phone"
            value={search} onChange={e => setSearch(e.target.value)}
            className="ml-auto border-b border-black/18 pb-1.5 text-sm text-black outline-none focus:border-[#901A1C] bg-transparent w-60 placeholder-black/28"
          />
        </div>

        {/* ── Table ── */}
        <div className="bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-black/8">
                {["Seat(s)", "Guest", "Phone", "Qty · Amount", "Meals", "Status", "Check-in", "Booked", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[8px] tracking-[0.24em] uppercase text-black/30 font-normal whitespace-nowrap bg-white sticky top-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-black/25">No guests found.</td></tr>
              )}
              {filtered.map((t) => (
                <Fragment key={t.id}>
                  <tr
                    className={`border-b border-black/5 transition-colors ${
                      t.archived ? "opacity-40" : "hover:bg-[#F4EFE6]/40"
                    }`}
                  >
                    {/* Seat */}
                    <td className="px-4 py-3 font-mono text-xs text-[#901A1C] whitespace-nowrap">{fmtSeats(t)}</td>

                    {/* Guest: name + email stacked */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-black font-medium text-[13px] leading-tight">{t.buyer_name}</p>
                      <p className="text-black/38 text-[11px] mt-0.5">{t.buyer_email}</p>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 text-black/55 text-[12px] whitespace-nowrap">{t.buyer_phone}</td>

                    {/* Qty · Amount */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-black/55 text-[12px]">{t.qty} seat{t.qty > 1 ? "s" : ""}</p>
                      <p className="text-black/38 text-[11px] mt-0.5">{fmtAmount(t.amount)}</p>
                    </td>

                    {/* Meals */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {(t.meal_preferences ?? []).length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {(t.meal_preferences ?? []).map((m, mi) => (
                            <span key={mi} className={`text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${m === "veg" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                              {m}
                            </span>
                          ))}
                        </div>
                      ) : <span className="text-black/20 text-xs">—</span>}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[8px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full font-medium ${
                        t.payment_status === "paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {t.payment_status}
                      </span>
                    </td>

                    {/* Checked in */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {t.checked_in
                        ? <span className="text-[8px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">✓ In</span>
                        : <span className="text-black/20 text-xs">—</span>}
                    </td>

                    {/* Booked */}
                    <td className="px-4 py-3 text-black/35 text-[11px] whitespace-nowrap">{fmtDate(t.created_at)}</td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {/* Primary: resend / mark paid */}
                        {t.payment_status === "paid" ? (
                          <button onClick={() => handleResend(t.id)} disabled={resending === t.id}
                            className={`text-[8px] tracking-[0.14em] uppercase px-2 py-1 transition-colors ${
                              resendResult[t.id] === "ok"  ? "text-green-600" :
                              resendResult[t.id] === "err" ? "text-red-600" :
                              "text-black/35 border border-black/12 hover:border-[#901A1C] hover:text-[#901A1C]"
                            }`}>
                            {resending === t.id ? "…" : resendResult[t.id] === "ok" ? "✓ Sent" : resendResult[t.id] === "err" ? "✗ Err" : "Email"}
                          </button>
                        ) : (
                          <button onClick={() => handleMarkPaid(t.id)} disabled={markingPaid === t.id}
                            className={`text-[8px] tracking-[0.14em] uppercase px-2 py-1 transition-colors ${
                              markPaidResult[t.id] === "ok"  ? "text-green-600" :
                              markPaidResult[t.id] === "err" ? "text-red-600" :
                              "border border-amber-300 text-amber-600 hover:bg-amber-50"
                            }`}>
                            {markingPaid === t.id ? "…" : markPaidResult[t.id] === "ok" ? "✓ Paid" : markPaidResult[t.id] === "err" ? "✗ Err" : "Mark Paid"}
                          </button>
                        )}

                        {/* Note icon */}
                        <button onClick={() => toggleNotes(t)} title={t.notes ? `Note: ${t.notes}` : "Add note"}
                          className={`p-1 rounded transition-colors hover:bg-black/5 ${expandedNotes === t.id ? "text-[#C9A84C]" : t.notes ? "text-[#C9A84C]" : "text-black/25 hover:text-black/50"}`}>
                          <NoteIcon filled={!!t.notes} />
                        </button>

                        {/* Uncheck — only when checked in */}
                        {t.checked_in && (
                          <button onClick={() => handleUncheck(t.id)} disabled={unchecking === t.id}
                            title="Remove check-in"
                            className="text-[8px] tracking-[0.14em] uppercase px-2 py-1 border border-amber-300 text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-30">
                            {unchecking === t.id ? "…" : "Uncheck"}
                          </button>
                        )}

                        {/* Archive / restore icon */}
                        <button onClick={() => handleArchive(t.id, !!t.archived)} disabled={archiving === t.id}
                          title={t.archived ? "Restore" : "Archive"}
                          className="p-1 rounded transition-colors hover:bg-black/5 text-black/20 hover:text-black/50 disabled:opacity-30">
                          {t.archived ? <RestoreIcon /> : <ArchiveIcon />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* ── Expandable notes row ── */}
                  {expandedNotes === t.id && (
                    <tr className="border-b border-black/5 bg-amber-50/40">
                      <td colSpan={9} className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <p className="text-[8px] tracking-[0.22em] uppercase text-black/35 mt-2 whitespace-nowrap">Note for {t.buyer_name.split(" ")[0]}</p>
                          <textarea
                            className="flex-1 text-[12px] text-black/70 bg-white border border-black/12 px-3 py-2 outline-none focus:border-[#C9A84C] resize-none rounded"
                            rows={2}
                            placeholder="e.g. QR sent via WhatsApp, invitation emailed, dietary note, follow-up needed…"
                            value={noteDraft}
                            onChange={e => setNoteDraft(e.target.value)}
                            autoFocus
                          />
                          <div className="flex flex-col gap-1.5 mt-0.5">
                            <button onClick={() => saveNote(t.id)} disabled={savingNote === t.id}
                              className="text-[8px] tracking-[0.18em] uppercase bg-[#901A1C] text-white px-3 py-1.5 disabled:opacity-40 hover:bg-[#7a1517] whitespace-nowrap">
                              {savingNote === t.id ? "Saving…" : "Save"}
                            </button>
                            <button onClick={() => setExpandedNotes(null)}
                              className="text-[8px] tracking-[0.18em] uppercase text-black/30 border border-black/12 px-3 py-1.5 hover:border-black/35 whitespace-nowrap">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-[10px] text-black/28">
            {filtered.length} of {tickets.filter(t => filter === "archived" ? true : !t.archived).length} shown
            {archivedCount > 0 && filter !== "archived" && ` · ${archivedCount} archived`}
          </p>
          <p className="text-[10px] text-black/28">28th June 2026 · The Living Table</p>
        </div>
        </>
        )}

        {/* ── Interest List ── */}
        {view === "interest" && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="bg-white px-5 py-4 border-t-2 border-[#901A1C] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <p className="text-[8px] tracking-[0.28em] uppercase text-black/35 mb-1.5">Total Signups</p>
                <p className="text-2xl font-light text-black" style={{ fontFamily: "Georgia,serif" }}>{interest.length}</p>
              </div>
              <input type="text" placeholder="Search name / email / phone"
                value={interestSearch} onChange={e => setInterestSearch(e.target.value)}
                className="ml-auto border-b border-black/18 pb-1.5 text-sm text-black outline-none focus:border-[#901A1C] bg-transparent w-60 placeholder-black/28"
              />
              <button onClick={exportInterestCSV} disabled={!interest.length}
                className="text-[9px] tracking-[0.18em] uppercase bg-[#901A1C] text-white px-4 py-2 hover:bg-[#7a1517] transition-colors disabled:opacity-40">
                Export CSV
              </button>
            </div>

            {interestError && (
              <p className="text-[#901A1C] text-xs mb-4">{interestError}</p>
            )}

            {/* Table */}
            <div className="bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-black/8">
                    {["Name", "Email", "Phone", "Received"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[8px] tracking-[0.24em] uppercase text-black/30 font-normal whitespace-nowrap bg-white sticky top-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInterest.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-black/25">
                      {interestError ? "Could not load — run create_interest_table.sql in Supabase." : interestSearch ? "No matches." : "No signups yet."}
                    </td></tr>
                  )}
                  {filteredInterest.map(r => (
                    <tr key={r.id} className="border-b border-black/5 hover:bg-[#F4EFE6]/40 transition-colors">
                      <td className="px-4 py-3 text-black font-medium text-[13px] whitespace-nowrap">{r.name}</td>
                      <td className="px-4 py-3 text-black/55 text-[12px] whitespace-nowrap">{r.email}</td>
                      <td className="px-4 py-3 text-black/55 text-[12px] whitespace-nowrap">{r.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-black/35 text-[11px] whitespace-nowrap">{fmtDate(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-[10px] text-black/28">{filteredInterest.length} of {interest.length} shown</p>
              <p className="text-[10px] text-black/28">Register Your Interest · The Living Table</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
