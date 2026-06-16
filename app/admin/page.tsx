"use client";

import { useState, useCallback } from "react";

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
  created_at: string;
}

interface Stats {
  seats_sold: number;
  seats_remaining: number;
  checked_in_count: number;
}

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

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed]     = useState(false);
  const [pw, setPw]             = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [tickets, setTickets]   = useState<Ticket[]>([]);
  const [stats, setStats]       = useState<Stats | null>(null);
  const [filter, setFilter]     = useState<"all" | "paid" | "pending" | "checked_in">("all");
  const [search, setSearch]     = useState("");
  const [resending, setResending]   = useState<string | null>(null);
  const [resendResult, setResendResult] = useState<Record<string, "ok" | "err">>({});

  const fetchData = useCallback(async (p: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/guests`, { headers: { "x-admin-password": p } });
      const data = await res.json();
      if (!res.ok) { setError("Wrong password."); return; }
      setTickets(data.tickets);
      setStats(data.stats);
      setAuthed(true);
      setPw(p);
    } catch {
      setError("Failed to connect.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = () => fetchData(pw);

  async function handleResend(ticketId: string) {
    setResending(ticketId);
    try {
      const res = await fetch("/api/admin/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      setResendResult(prev => ({ ...prev, [ticketId]: res.ok ? "ok" : "err" }));
    } catch {
      setResendResult(prev => ({ ...prev, [ticketId]: "err" }));
    } finally {
      setResending(null);
    }
  }

  function exportCSV() {
    const headers = ["Seat(s)", "Name", "Email", "Phone", "Qty", "Amount", "Meals", "Status", "Checked In", "Check-in Time", "Booked At"];
    const rows = tickets.map(t => [
      fmtSeats(t),
      t.buyer_name,
      t.buyer_email,
      t.buyer_phone,
      t.qty,
      fmtAmount(t.amount),
      (t.meal_preferences ?? []).join(", "),
      t.payment_status,
      t.checked_in ? "Yes" : "No",
      t.checked_in_at ? fmtDate(t.checked_in_at) : "",
      fmtDate(t.created_at),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "living-table-guests.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = tickets.filter(t => {
    if (filter === "paid"       && t.payment_status !== "paid")  return false;
    if (filter === "pending"    && t.payment_status !== "pending") return false;
    if (filter === "checked_in" && !t.checked_in)                return false;
    if (search) {
      const q = search.toLowerCase();
      return t.buyer_name.toLowerCase().includes(q) || t.buyer_email.toLowerCase().includes(q) || t.buyer_phone.includes(q);
    }
    return true;
  });

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm p-10 border-t-4 border-[#901A1C]">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#901A1C] mb-1">Inkpot India</p>
          <h1 className="text-2xl font-light text-black mb-8" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            Admin Dashboard
          </h1>
          <form onSubmit={e => { e.preventDefault(); fetchData(password); }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-black/20 px-4 py-3 text-sm text-black outline-none focus:border-[#901A1C] mb-3"
            />
            {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#901A1C] text-white text-[10px] tracking-[0.2em] uppercase py-3 disabled:opacity-50"
            >
              {loading ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4EFE6] p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#901A1C] mb-1">Inkpot India</p>
            <h1 className="text-3xl font-light text-black" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              The Living Table
            </h1>
            <p className="text-xs text-black/40 mt-1 tracking-wide">28th June 2026 — Guest List</p>
          </div>
          <div className="flex gap-3 mt-1">
            <button onClick={refresh} className="text-[10px] tracking-[0.15em] uppercase text-black/50 border border-black/20 px-4 py-2 hover:border-black/50 transition-colors">
              Refresh
            </button>
            <button onClick={exportCSV} className="text-[10px] tracking-[0.15em] uppercase bg-[#901A1C] text-white px-4 py-2 hover:bg-[#7a1517] transition-colors">
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Seats Sold", value: `${stats?.seats_sold ?? 0} / ${TOTAL}` },
            { label: "Seats Remaining", value: stats?.seats_remaining ?? TOTAL },
            { label: "Checked In", value: `${stats?.checked_in_count ?? 0} / ${stats?.seats_sold ?? 0}` },
          ].map(s => (
            <div key={s.label} className="bg-white p-6 border-t-2 border-[#901A1C]">
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#901A1C] mb-2">{s.label}</p>
              <p className="text-3xl font-light text-black" style={{ fontFamily: "Georgia, serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {(["all", "paid", "pending", "checked_in"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[9px] tracking-[0.2em] uppercase px-4 py-2 transition-colors ${filter === f ? "bg-[#901A1C] text-white" : "bg-white text-black/50 border border-black/20 hover:border-black/50"}`}
            >
              {f === "checked_in" ? "Checked In" : f}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search name / email / phone"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ml-auto border border-black/20 px-4 py-2 text-sm text-black outline-none focus:border-[#901A1C] w-64"
          />
        </div>

        {/* Table */}
        <div className="bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                {["Seat(s)", "Name", "Email", "Phone", "Qty", "Amount", "Meals", "Status", "Check-in", "Booked", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-black/40 font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-sm text-black/30">
                    No guests yet.
                  </td>
                </tr>
              )}
              {filtered.map((t, i) => (
                <tr key={t.id} className={`border-b border-black/5 hover:bg-[#F4EFE6]/50 transition-colors ${i % 2 === 0 ? "" : "bg-black/[0.01]"}`}>
                  <td className="px-4 py-3 font-mono text-xs text-[#901A1C] whitespace-nowrap">{fmtSeats(t)}</td>
                  <td className="px-4 py-3 text-black whitespace-nowrap">{t.buyer_name}</td>
                  <td className="px-4 py-3 text-black/60 whitespace-nowrap">{t.buyer_email}</td>
                  <td className="px-4 py-3 text-black/60 whitespace-nowrap">{t.buyer_phone}</td>
                  <td className="px-4 py-3 text-black/60 text-center">{t.qty}</td>
                  <td className="px-4 py-3 text-black/60 whitespace-nowrap">{fmtAmount(t.amount)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {(t.meal_preferences ?? []).length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {(t.meal_preferences ?? []).map((m, mi) => (
                          <span key={mi} className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 ${m === "veg" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {m}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-black/25 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[9px] tracking-[0.15em] uppercase px-2 py-1 ${t.payment_status === "paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                      {t.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {t.checked_in
                      ? <span className="text-[9px] tracking-[0.15em] uppercase px-2 py-1 bg-blue-50 text-blue-700">✓ In</span>
                      : <span className="text-[9px] tracking-[0.15em] uppercase text-black/25">—</span>}
                  </td>
                  <td className="px-4 py-3 text-black/40 text-xs whitespace-nowrap">{fmtDate(t.created_at)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {t.payment_status === "paid" ? (
                      <button
                        onClick={() => handleResend(t.id)}
                        disabled={resending === t.id}
                        className={`text-[9px] tracking-[0.15em] uppercase px-2 py-1 transition-colors ${
                          resendResult[t.id] === "ok"  ? "bg-green-50 text-green-700" :
                          resendResult[t.id] === "err" ? "bg-red-50 text-red-700" :
                          "border border-black/20 text-black/40 hover:border-[#901A1C] hover:text-[#901A1C]"
                        }`}
                      >
                        {resending === t.id ? "…" :
                         resendResult[t.id] === "ok"  ? "✓ Sent" :
                         resendResult[t.id] === "err" ? "✗ Error" :
                         "Resend"}
                      </button>
                    ) : (
                      <span className="text-black/20 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-black/30 mt-4 text-right">{filtered.length} of {tickets.length} guests shown</p>
      </div>
    </div>
  );
}
