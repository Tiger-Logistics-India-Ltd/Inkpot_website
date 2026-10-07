"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SESSIONS, type SessionId } from "@/lib/sotsCoffee";

const SWAN_LOGO = "/images/Songs of the stone/Pio Swan White.svg";
const WORDMARK = "/images/Songs of the stone/Pio Logo for dark background.svg";
const BROWN = "#4B2E1E";

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

/* ── Icons — simple outline style, matches the admin dashboard's inline-SVG pattern ── */
const Icon = {
  doc: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
  clock: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
  search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>,
  filters: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" /><line x1="4" y1="12" x2="20" y2="12" /><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="9" cy="18" r="2" fill="currentColor" stroke="none" /></svg>,
  calendar: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  cup: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" /><path d="M17 9h2a2 2 0 0 1 0 4h-2" /><path d="M6 2c0 1-1 1-1 2s1 1 1 2M10 2c0 1-1 1-1 2s1 1 1 2" /></svg>,
  person: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-3.9 3.6-7 8-7s8 3.1 8 7" /></svg>,
  phone: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>,
  check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>,
};

export default function SOTSCoffeeVendorPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed]     = useState(false);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState<Tab>("unserved");
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("all");
  const [search, setSearch]     = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
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
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm overflow-hidden">
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
                className="w-full bg-[#4B2E1E] text-white text-[10px] tracking-[0.22em] uppercase py-4 rounded-lg disabled:opacity-40 hover:bg-[#3A2316] transition-colors">
                {loading ? "Verifying…" : "Enter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const StatBlock = ({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) => (
    <div>
      <div className="flex items-center gap-1.5 text-white">
        {icon}
        <span className="text-base font-semibold leading-none">{value}</span>
      </div>
      <div className="text-[10px] text-white/55 mt-1">{label}</div>
    </div>
  );

  const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:px-5 py-2.5 rounded-lg text-[11px] tracking-[0.08em] uppercase border transition-colors ${active ? "bg-[#4B2E1E] text-white border-[#4B2E1E]" : "bg-white text-black/55 border-black/10"}`}
    >
      {children}
    </button>
  );

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
          <div className="flex gap-5 sm:gap-8">
            <StatBlock icon={<Icon.doc />} value={orders.length} label="Orders" />
            <StatBlock icon={<Icon.clock />} value={unservedCount} label="Pending" />
            <StatBlock icon="₹" value={fmtAmount(revenue * 100).replace("₹", "")} label="Collected" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"><Icon.search /></span>
            <input
              type="text" placeholder="Search order #, name or phone"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-black/12 rounded-lg pl-11 pr-4 py-3 text-sm text-black outline-none focus:border-[#4B2E1E]"
            />
          </div>
          <button
            onClick={() => setFiltersOpen(v => !v)}
            className={`sm:hidden flex items-center gap-1.5 px-4 rounded-lg text-[11px] uppercase tracking-[0.05em] border ${filtersOpen ? "bg-[#4B2E1E] text-white border-[#4B2E1E]" : "bg-white text-black/55 border-black/12"}`}
          >
            <Icon.filters /> Filters
          </button>
        </div>

        <div className={`${filtersOpen ? "flex" : "hidden"} sm:flex flex-col gap-2 mb-6`}>
          <div className="flex gap-2">
            <TabButton active={tab === "unserved"} onClick={() => setTab("unserved")}><Icon.clock />Pending</TabButton>
            <TabButton active={tab === "served"} onClick={() => setTab("served")}><Icon.check />Served</TabButton>
            <TabButton active={tab === "all"} onClick={() => setTab("all")}><Icon.doc />All Orders</TabButton>
          </div>
          <div className="flex gap-2">
            <TabButton active={sessionFilter === "all"} onClick={() => setSessionFilter("all")}><Icon.calendar />Both Sessions</TabButton>
            {SESSIONS.map(s => (
              <TabButton key={s.id} active={sessionFilter === s.id} onClick={() => setSessionFilter(s.id)}><Icon.calendar />{s.label}</TabButton>
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
            <div key={o.id} className={`bg-white rounded-xl shadow-sm border ${o.served ? "border-black/5 opacity-60" : "border-black/8"} flex flex-col`}>
              <div className="px-5 pt-5 pb-4 flex items-start justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-black leading-none tracking-tight">
                    #{String(o.order_number).padStart(3, "0")}
                  </p>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-black/35 mt-2">{sessionLabel(o.session)}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-black/40 text-[10px]"><Icon.clock />{fmtTime(o.created_at)}</div>
                  <p className="text-lg font-bold text-black mt-1">{fmtAmount(o.amount_paise)}</p>
                </div>
              </div>

              <div className="px-5 pb-4 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-black/70">
                  <Icon.person /><span className="text-sm">{o.buyer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-black/50 flex-wrap">
                  <Icon.phone /><a href={`tel:${o.buyer_phone}`} className="text-xs underline">{o.buyer_phone}</a>
                  {o.coupon_code && (
                    <span className="text-[10px] bg-[#e8f3ea] text-[#166534] rounded-full px-2 py-0.5">{o.coupon_code}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-black/8 px-5 py-4 flex-1">
                {o.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 py-0.5">
                    <div className="flex items-center gap-1.5 text-black/70">
                      <Icon.cup /><span className="text-xs">{it.name}</span>
                    </div>
                    <p className="text-xs text-black/40 flex-shrink-0">×{it.qty}{it.free_qty > 0 ? ` (${it.free_qty} free)` : ""}</p>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-5">
                {!o.served ? (
                  <button
                    onClick={() => markServed(o.id)}
                    disabled={marking === o.id}
                    className="w-full bg-[#4B2E1E] text-white text-[11px] tracking-[0.18em] uppercase py-3.5 rounded-lg disabled:opacity-50 hover:bg-[#3A2316] transition-colors"
                  >
                    {marking === o.id ? "Marking…" : "Mark Served"}
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[#166534] bg-[#e8f3ea] rounded-lg py-3">
                    <Icon.check />Served {o.served_at ? fmtTime(o.served_at) : ""}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
