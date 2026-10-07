"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SESSIONS, type SessionId } from "@/lib/sotsCoffee";

const SWAN_LOGO = "/images/Songs of the stone/Pio Swan White.svg";
const WORDMARK = "/images/Songs of the stone/Pio Logo for dark background.svg";
const BROWN = "#4B2E1E";
const CREAM = "#F4EFE6";
const GREEN = "#166534";
const GREEN_BG = "#E8F3EA";

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

const Icon = {
  doc: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
  clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
  search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>,
  calendar: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  cup: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" /><path d="M17 9h2a2 2 0 0 1 0 4h-2" /></svg>,
  person: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-3.9 3.6-7 8-7s8 3.1 8 7" /></svg>,
  phone: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>,
  check: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>,
};

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: active ? BROWN : "#ffffff", color: active ? "#ffffff" : "rgba(0,0,0,0.55)",
        border: `1px solid ${active ? BROWN : "rgba(0,0,0,0.12)"}`,
        borderRadius: "8px", padding: "9px 14px",
        fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.04em",
        whiteSpace: "nowrap", cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div style={{ minWidth: "64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#ffffff" }}>
        {icon}
        <span style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 700, lineHeight: 1 }}>{value}</span>
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "9.5px", color: "rgba(255,255,255,0.55)", marginTop: "4px" }}>{label}</div>
    </div>
  );
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
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, served: true, served_at: new Date().toISOString() } : o));
    try {
      const res = await fetch("/api/coffee/vendor/mark-served", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-vendor-password": pwRef.current },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchOrders(pwRef.current, true);
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
      <div style={{ minHeight: "100dvh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ background: "#ffffff", width: "100%", maxWidth: "380px", borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 28px rgba(0,0,0,0.08)" }}>
          <div style={{ background: BROWN, padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <img src={SWAN_LOGO} alt="" width={30} height={30} style={{ marginBottom: "12px", opacity: 0.9 }} />
            <img src={WORDMARK} alt="Songs of the Stone" style={{ height: "15px", width: "auto", opacity: 0.9 }} />
          </div>
          <div style={{ padding: "32px" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "24px", color: "#1a1a1a", margin: "0 0 4px" }}>Coffee Vendor</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.35)", margin: "0 0 28px" }}>Order pickup console</p>
            <form onSubmit={e => { e.preventDefault(); pwRef.current = password; fetchOrders(password); }}>
              <input
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                style={{ display: "block", width: "100%", border: "none", borderBottom: "1px solid rgba(0,0,0,0.2)", padding: "8px 0", fontFamily: "var(--font-body)", fontSize: "15px", color: "#1a1a1a", outline: "none", background: "transparent", marginBottom: "20px", boxSizing: "border-box" }}
              />
              {error && <p style={{ color: "#901A1C", fontSize: "12px", marginBottom: "16px" }}>{error}</p>}
              <button
                type="submit" disabled={loading || !password}
                style={{ width: "100%", background: BROWN, color: "#ffffff", border: "none", borderRadius: "8px", padding: "15px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", cursor: loading || !password ? "default" : "pointer", opacity: loading || !password ? 0.5 : 1 }}
              >
                {loading ? "Verifying…" : "Enter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: CREAM, paddingBottom: "60px" }}>
      <style>{`
        .vendor-wrap  { max-width: 1100px; margin: 0 auto; padding: 0 16px; }
        .vendor-head  { display: flex; flex-direction: column; gap: 16px; }
        .vendor-stats { display: flex; gap: 20px; flex-wrap: wrap; }
        .vendor-grid  { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px) {
          .vendor-head  { flex-direction: row; align-items: center; justify-content: space-between; }
          .vendor-grid  { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .vendor-grid  { grid-template-columns: 1fr 1fr 1fr; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: BROWN }}>
        <div className="vendor-wrap vendor-head" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={SWAN_LOGO} alt="" width={28} height={28} style={{ opacity: 0.9, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", margin: 0 }}>Songs of the Stone</p>
              <h1 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "19px", color: "#ffffff", margin: "2px 0 0" }}>Coffee Vendor</h1>
            </div>
          </div>
          <div className="vendor-stats">
            <StatTile icon={<Icon.doc />} value={orders.length} label="Orders" />
            <StatTile icon={<Icon.clock />} value={unservedCount} label="Pending" />
            <StatTile icon="₹" value={fmtAmount(revenue * 100).replace("₹", "")} label="Collected" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="vendor-wrap" style={{ paddingTop: "20px" }}>
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(0,0,0,0.35)", pointerEvents: "none" }}>
            <Icon.search />
          </span>
          <input
            type="text" placeholder="Search order #, name or phone"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", background: "#ffffff", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "8px", padding: "12px 14px 12px 42px", fontFamily: "var(--font-body)", fontSize: "13px", color: "#1a1a1a", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
          <Pill active={tab === "unserved"} onClick={() => setTab("unserved")}><Icon.clock />Pending</Pill>
          <Pill active={tab === "served"} onClick={() => setTab("served")}><Icon.check />Served</Pill>
          <Pill active={tab === "all"} onClick={() => setTab("all")}><Icon.doc />All Orders</Pill>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "22px" }}>
          <Pill active={sessionFilter === "all"} onClick={() => setSessionFilter("all")}><Icon.calendar />Both Sessions</Pill>
          {SESSIONS.map(s => (
            <Pill key={s.id} active={sessionFilter === s.id} onClick={() => setSessionFilter(s.id)}><Icon.calendar />{s.label}</Pill>
          ))}
        </div>
      </div>

      {/* Order cards */}
      <div className="vendor-wrap">
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(0,0,0,0.35)", padding: "70px 0" }}>No orders here.</p>
        )}
        <div className="vendor-grid">
          {filtered.map(o => (
            <div key={o.id} style={{ background: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 10px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "18px 18px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "26px", color: "#1a1a1a", margin: 0, lineHeight: 1 }}>#{String(o.order_number).padStart(3, "0")}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "9.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", margin: "8px 0 0" }}>{sessionLabel(o.session)}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px", color: "rgba(0,0,0,0.4)", fontSize: "10px" }}>
                    <Icon.clock />{fmtTime(o.created_at)}
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "16px", color: "#1a1a1a", margin: "4px 0 0" }}>{fmtAmount(o.amount_paise)}</p>
                </div>
              </div>

              <div style={{ padding: "0 18px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(0,0,0,0.7)" }}>
                  <Icon.person /><span style={{ fontFamily: "var(--font-body)", fontSize: "13.5px" }}>{o.buyer_name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <Icon.phone />
                  <a href={`tel:${o.buyer_phone}`} style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.5)", textDecoration: "underline" }}>{o.buyer_phone}</a>
                  {o.coupon_code && (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "9.5px", background: GREEN_BG, color: GREEN, borderRadius: "20px", padding: "2px 9px" }}>{o.coupon_code}</span>
                  )}
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", padding: "12px 18px", flex: 1 }}>
                {o.items.map((it, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "3px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(0,0,0,0.7)", minWidth: 0 }}>
                      <span style={{ flexShrink: 0 }}><Icon.cup /></span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.4)", margin: 0, flexShrink: 0 }}>
                      ×{it.qty}{it.free_qty > 0 ? ` (${it.free_qty} free)` : ""}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ padding: "14px 18px 18px" }}>
                {!o.served ? (
                  <button
                    onClick={() => markServed(o.id)}
                    disabled={marking === o.id}
                    style={{ width: "100%", background: BROWN, color: "#ffffff", border: "none", borderRadius: "8px", padding: "13px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", cursor: marking === o.id ? "default" : "pointer", opacity: marking === o.id ? 0.5 : 1 }}
                  >
                    {marking === o.id ? "Marking…" : "Mark Served"}
                  </button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", background: GREEN_BG, color: GREEN, borderRadius: "8px", padding: "11px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
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
