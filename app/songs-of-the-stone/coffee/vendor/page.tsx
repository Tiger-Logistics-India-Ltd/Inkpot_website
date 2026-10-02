"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface OrderItem { id: string; name: string; qty: number; unit_price_paise: number; free_qty: number }
interface Order {
  id: string;
  order_number: number;
  buyer_name: string;
  buyer_phone: string;
  items: OrderItem[];
  total_qty: number;
  amount_paise: number;
  coupon_code: string | null;
  served: boolean;
  served_at: string | null;
  created_at: string;
}

type Tab = "unserved" | "served" | "all";

function fmtAmount(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function SOTSCoffeeVendorPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed]     = useState(false);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState<Tab>("unserved");
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
        <div className="bg-white w-full max-w-sm p-10 shadow-sm border-t-4 border-[#4B2E1E]">
          <p className="text-[9px] tracking-[0.32em] uppercase text-[#4B2E1E] mb-2">Songs of the Stone</p>
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
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] pb-16">
      {/* Top bar */}
      <div className="bg-white border-b border-black/8 px-4 py-4 sticky top-0 z-10">
        <p className="text-[9px] tracking-[0.32em] uppercase text-[#4B2E1E]">Songs of the Stone</p>
        <h1 className="text-xl text-black mt-0.5 mb-3" style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 400 }}>
          Coffee Vendor
        </h1>
        <div className="flex gap-4 text-xs text-black/50">
          <span><strong className="text-black">{orders.length}</strong> orders</span>
          <span><strong className="text-black">{unservedCount}</strong> pending</span>
          <span><strong className="text-black">{fmtAmount(revenue * 100)}</strong> collected</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pt-4">
        <input
          type="text" placeholder="Search order #, name or phone"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-black/12 px-4 py-3 text-sm text-black outline-none focus:border-[#4B2E1E] mb-3"
        />
        <div className="flex gap-2 mb-2">
          {([
            { key: "unserved", label: "Pending" },
            { key: "served", label: "Served" },
            { key: "all", label: "All" },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 text-[11px] tracking-[0.1em] uppercase border ${tab === t.key ? "bg-[#4B2E1E] text-white border-[#4B2E1E]" : "bg-white text-black/50 border-black/12"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Order cards */}
      <div className="px-4 mt-3 flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-black/35 py-16">No orders here.</p>
        )}
        {filtered.map(o => (
          <div key={o.id} className={`bg-white border ${o.served ? "border-black/8 opacity-60" : "border-black/10"} p-4`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-2xl font-semibold text-black leading-none" style={{ fontFamily: "Georgia,serif" }}>#{String(o.order_number).padStart(3, "0")}</p>
                <p className="text-sm text-black mt-1">{o.buyer_name}</p>
                <a href={`tel:${o.buyer_phone}`} className="text-xs text-black/50 underline">{o.buyer_phone}</a>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-black">{fmtAmount(o.amount_paise)}</p>
                <p className="text-[10px] text-black/35 mt-1">{fmtTime(o.created_at)}</p>
                {o.coupon_code && <p className="text-[10px] text-[#166534] mt-1">{o.coupon_code}</p>}
              </div>
            </div>
            <div className="border-t border-black/8 pt-2 mb-3">
              {o.items.map((it, i) => (
                <p key={i} className="text-xs text-black/60">
                  {it.qty}× {it.name}{it.free_qty > 0 ? ` (${it.free_qty} free)` : ""}
                </p>
              ))}
            </div>
            {!o.served ? (
              <button
                onClick={() => markServed(o.id)}
                disabled={marking === o.id}
                className="w-full bg-[#4B2E1E] text-white text-[11px] tracking-[0.18em] uppercase py-3.5 disabled:opacity-50"
              >
                {marking === o.id ? "Marking…" : "Mark Served"}
              </button>
            ) : (
              <p className="text-center text-[11px] tracking-[0.1em] uppercase text-[#166534] py-1">
                Served {o.served_at ? fmtTime(o.served_at) : ""}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
