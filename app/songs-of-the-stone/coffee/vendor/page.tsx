"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SESSIONS, type SessionId } from "@/lib/sotsCoffee";

const SWAN_LOGO = "/images/Songs of the stone/Pio Swan White.svg";
const WORDMARK = "/images/Songs of the stone/Pio Logo for dark background.svg";

interface OrderItem { id: string; name: string; qty: number; unit_price_paise: number; free_qty: number }
interface Order {
  id: string;
  order_number: number;
  buyer_name: string;
  buyer_phone: string;
  session: SessionId;
  items: OrderItem[];
  total_qty: number;
  amount_paise: number;
  coupon_code: string | null;
  served: boolean;
  served_at: string | null;
  created_at: string;
}

type Tab = "unserved" | "served" | "all";
type SessionFilter = "all" | SessionId;

function fmtAmount(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function sessionLabel(id: SessionId): string {
  return SESSIONS.find(s => s.id === id)?.label ?? id;
}

export default function SOTSCoffeeVendorPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed]     = useState(false);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState<Tab>("unserved");
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("all");
  const [search, setSearch]     = useState("");
  const [marking, setMarking]   = useState<string | null>(null);
  const pwRef = useRef("");

  const fetchOrders = useCallback(async (pw: string, silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/coffee/vendor/orders", { headers: { "x-vendor-password": pw } });
      if (res.status === 401) { setError("Wrong password."); setAuthed(false); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data.orders);
      setAuthed(true);
    } catch (err: any) {
      if (!silent) setError(err.message ?? "Failed to load orders.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchOrders(pwRef.current, true), 6000);
    return () => clearInterval(interval);
  }, [authed, fetchOrders]);

  const markServed = async (orderId: string) => {
    setMarking(orderId);
    // Optimistic update — the counter needs this to feel instant.
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, served: true, served_at: new Date().toISOString() } : o));
    try {
      const res = await fetch("/api/coffee/vendor/mark-served", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-vendor-password": pwRef.current },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchOrders(pwRef.current, true); // reconcile on failure
    } finally {
      setMarking(null);
    }
  };

  const filtered = orders
    .filter(o => tab === "all" ? true : tab === "served" ? o.served : !o.served)
    .filter(o => sessionFilter === "all" ? true : o.session === sessionFilter)
    .filter(o => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return o.buyer_phone.includes(q) || String(o.order_number).includes(q) || o.buyer_name.toLowerCase().includes(q);
    });

  const unservedCount = orders.filter(o => !o.served).length;
  const revenue = Math.round(orders.reduce((s, o) => s + o.amount_paise, 0) / 100);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm shadow-sm overflow-hidden">
          <div className="bg-[#4B2E1E] px-10 py-8 flex flex-col items-center text-center">
            <img src={SWAN_LOGO} alt="" width={30} height={30} className="mb-3 opacity-90" />
            <img src={WORDMARK} alt="Songs of the Stone" style={{ height: "16px", width: "auto" }} className="opacity-90" />
          </div>
          <div className="p-10">
            <h1 className="text-2xl text-black mb-1" style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 400 }}>
              Coffee Vendor
            </h1>
            <p className="text-xs text-black/35 mb-8">Order pickup console</p>
            <form onSubmit={e => { e.preventDefault(); pwRef.current = password; fetchOrders(password); }}>
              <input
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                className="w-full border-b border-black/20 pb-2 text-base text-black outline-none focus:border-[#4B2E1E] bg-transparent mb-6 placeholder-black/30"
              />
              {error && <p className="text-[#901A1C] text-xs mb-4">{error}</p>}
              <button type="submit" disabled={loading || !password}
                className="w-full bg-[#4B2E1E] text-white text-[10px] tracking-[0.22em] uppercase py-4 disabled:opacity-40 hover:bg-[#3A2316] transition-colors">
                {loading ? "Verifying…" : "Enter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] pb-20">
      {/* Top bar */}
      <div className="bg-[#4B2E1E] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={SWAN_LOGO} alt="" width={26} height={26} className="opacity-90 flex-shrink-0" />
            <div>
              <p className="text-[8.5px] tracking-[0.3em] uppercase text-white/55">Songs of the Stone</p>
              <h1 className="text-lg text-white -mt-0.5" style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 400 }}>
                Coffee Vendor
              </h1>
            </div>
          </div>
          <div className="flex gap-5 sm:gap-7 text-xs text-white/55">
            <div><div className="text-white text-base font-semibold leading-none">{orders.length}</div><div className="mt-1">orders</div></div>
            <div><div className="text-white text-base font-semibold leading-none">{unservedCount}</div><div className="mt-1">pending</div></div>
            <div><div className="text-white text-base font-semibold leading-none">{fmtAmount(revenue * 100)}</div><div className="mt-1">collected</div></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6">
        <input
          type="text" placeholder="Search order #, name or phone"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-black/12 px-4 py-3 text-sm text-black outline-none focus:border-[#4B2E1E] mb-4"
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex gap-2 flex-1">
            {([
              { key: "unserved", label: "Pending" },
              { key: "served", label: "Served" },
              { key: "all", label: "All" },
            ] as { key: Tab; label: string }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 sm:flex-initial sm:px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase border ${tab === t.key ? "bg-[#4B2E1E] text-white border-[#4B2E1E]" : "bg-white text-black/50 border-black/12"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {([{ key: "all", label: "Both Sessions" }, ...SESSIONS.map(s => ({ key: s.id, label: s.label }))] as { key: SessionFilter; label: string }[]).map(s => (
              <button
                key={s.key}
                onClick={() => setSessionFilter(s.key)}
                className={`flex-1 sm:flex-initial sm:px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase border ${sessionFilter === s.key ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white text-black/50 border-black/12"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Order cards */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-black/35 py-20">No orders here.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(o => (
            <div key={o.id} className={`bg-white border ${o.served ? "border-black/8 opacity-60" : "border-black/10"} flex flex-col`}>
              <div className="px-5 pt-5 pb-4 flex items-start justify-between">
                <div>
                  <p className="text-3xl font-semibold text-black leading-none" style={{ fontFamily: "Georgia,serif" }}>
                    #{String(o.order_number).padStart(3, "0")}
                  </p>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-black/35 mt-2">{sessionLabel(o.session)}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-black">{fmtAmount(o.amount_paise)}</p>
                  <p className="text-[10px] text-black/35 mt-1">{fmtTime(o.created_at)}</p>
                </div>
              </div>

              <div className="px-5 pb-4">
                <p className="text-sm text-black font-medium">{o.buyer_name}</p>
                <a href={`tel:${o.buyer_phone}`} className="text-xs text-black/50 underline">{o.buyer_phone}</a>
                {o.coupon_code && (
                  <span className="inline-block ml-2 text-[10px] text-[#166534] align-middle">{o.coupon_code}</span>
                )}
              </div>

              <div className="border-t border-black/8 px-5 py-4 flex-1">
                {o.items.map((it, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-2 py-0.5">
                    <p className="text-xs text-black/70">{it.name}</p>
                    <p className="text-xs text-black/40 flex-shrink-0">×{it.qty}{it.free_qty > 0 ? ` (${it.free_qty} free)` : ""}</p>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-5">
                {!o.served ? (
                  <button
                    onClick={() => markServed(o.id)}
                    disabled={marking === o.id}
                    className="w-full bg-[#4B2E1E] text-white text-[11px] tracking-[0.18em] uppercase py-3.5 disabled:opacity-50 hover:bg-[#3A2316] transition-colors"
                  >
                    {marking === o.id ? "Marking…" : "Mark Served"}
                  </button>
                ) : (
                  <p className="text-center text-[11px] tracking-[0.1em] uppercase text-[#166534] py-1">
                    Served {o.served_at ? fmtTime(o.served_at) : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
