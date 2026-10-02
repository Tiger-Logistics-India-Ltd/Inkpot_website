"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { COFFEE_ITEMS, COFFEE_PROMO, SOTS_EVENT, priceOrder, type CartLine } from "@/lib/sotsCoffee";

const BROWN = "#4B2E1E";
const BROWN_DARK = "#3A2316";
const CREAM = "#F4EFE6";

type Flow = "browse" | "paying" | "confirmed";

interface ConfirmedOrder {
  orderNumber: number;
  buyerName: string;
  items: { name: string; qty: number; free_qty: number }[];
  totalQty: number;
}

function waitForRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) { resolve(); return; }
    if (!document.querySelector('script[src*="checkout.razorpay.com"]')) {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      document.head.appendChild(s);
    }
    let attempts = 0;
    const poll = setInterval(() => {
      if ((window as any).Razorpay) { clearInterval(poll); resolve(); }
      else if (++attempts > 30) { clearInterval(poll); reject(new Error("Payment gateway failed to load. Please refresh and try again.")); }
    }, 200);
  });
}

function Fade({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Field({ label, value, onChange, type, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type: string; placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type={type} value={value} required
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ display: "block", width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${focused ? BROWN : "rgba(0,0,0,0.18)"}`, padding: "7px 0", fontFamily: "var(--font-body)", fontSize: "15px", color: "#1a1a1a", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
      />
    </div>
  );
}

export default function SOTSCoffeePage() {
  const [qtyById, setQtyById] = useState<Record<string, number>>({});
  const [coupon, setCoupon]   = useState("");
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [flow, setFlow]       = useState<Flow>("browse");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [order, setOrder]     = useState<ConfirmedOrder | null>(null);

  const cart: CartLine[] = useMemo(
    () => Object.entries(qtyById).filter(([, q]) => q > 0).map(([id, qty]) => ({ id, qty })),
    [qtyById]
  );
  const priced = useMemo(() => priceOrder(cart, coupon), [cart, coupon]);
  const promoValid = coupon.trim().toUpperCase() === COFFEE_PROMO.code;
  const hasItems = cart.length > 0;

  const setQty = (id: string, qty: number) => setQtyById(prev => ({ ...prev, [id]: Math.max(0, qty) }));

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/coffee/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, items: cart, coupon_code: coupon.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.free) {
        setOrder({ orderNumber: data.order.orderNumber, buyerName: data.order.buyerName, items: data.order.items, totalQty: data.order.totalQty });
        setFlow("confirmed");
        setShowModal(false);
        setLoading(false);
        return;
      }

      await waitForRazorpay();
      setLoading(false);
      setShowModal(false);
      setFlow("paying");

      new (window as any).Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "Inkpot India",
        description: `Songs of the Stone — Coffee (${priced.totalQty} cup${priced.totalQty > 1 ? "s" : ""})`,
        order_id: data.order_id,
        image: "/images/Inkpot/inkpot_final.svg",
        handler: async (r: any) => {
          const vr = await fetch("/api/coffee/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: r.razorpay_order_id,
              razorpay_payment_id: r.razorpay_payment_id,
              razorpay_signature: r.razorpay_signature,
              coffee_order_id: data.coffee_order_id,
            }),
          });
          const vd = await vr.json();
          if (!vr.ok) { setError(vd.error); setFlow("browse"); return; }
          setOrder({ orderNumber: vd.order.orderNumber, buyerName: vd.order.buyerName, items: vd.order.items, totalQty: vd.order.totalQty });
          setFlow("confirmed");
        },
        prefill: { name, contact: phone },
        theme: { color: BROWN },
        modal: { ondismiss: () => setFlow("browse") },
      }).open();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: CREAM, overflowX: "hidden" }}>
        <style>{`
          .sotsc-menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .sotsc-layout    { display: grid; grid-template-columns: 1fr 380px; gap: clamp(28px, 4vw, 56px); align-items: start; }
          @media (max-width: 860px) {
            .sotsc-menu-grid { grid-template-columns: 1fr; }
            .sotsc-layout    { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* ── TOP BANNER ── */}
        <div style={{ background: BROWN, padding: "10px 16px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(10.5px, 2.4vw, 12px)", letterSpacing: "0.04em", color: CREAM, margin: 0 }}>
            You can now pre-order your coffee for the venue — collect fresh at the counter.
          </p>
        </div>

        {/* ── COMPACT HEADER ── */}
        <section style={{ padding: "clamp(56px, 9vh, 88px) 20px clamp(8px, 2vw, 16px)", textAlign: "center" }}>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(9px, 2.2vw, 11px)", letterSpacing: "0.34em", textTransform: "uppercase", color: BROWN, margin: "0 0 14px" }}
          >
            {SOTS_EVENT.title} &middot; Coffee Counter
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px, 4.4vw, 42px)", color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.12 }}
          >
            Pre-order your coffee.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#166534", color: "#ffffff", padding: "8px 18px", margin: "0 0 16px" }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ffffff", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9.5px", letterSpacing: "0.18em", textTransform: "uppercase" }}>Pre-Booking Available Now</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12.5px, 1.6vw, 14px)", color: "rgba(0,0,0,0.5)", maxWidth: "440px", lineHeight: 1.85, margin: "0 auto" }}
          >
            Pay online, skip the queue, and collect at the counter when it&rsquo;s ready.
          </motion.p>
        </section>

        {/* ── MENU + ORDER ── */}
        <section style={{ padding: "clamp(24px, 4vw, 48px) clamp(20px, 5vw, 64px) clamp(48px, 7vw, 88px)", maxWidth: "1180px", margin: "0 auto" }}>
          <AnimatePresence mode="wait">
            {flow === "confirmed" && order ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
                style={{ textAlign: "center", maxWidth: "440px", margin: "0 auto", padding: "clamp(32px, 5vw, 56px) 0" }}
              >
                <div style={{ width: "56px", height: "56px", border: `1px solid ${BROWN}55`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BROWN} strokeWidth="1.8" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: BROWN, marginBottom: "10px" }}>Order Confirmed</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "6px" }}>Your Order Number</p>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(56px, 14vw, 96px)", color: "#1a1a1a", lineHeight: 1, margin: "0 0 20px" }}>
                  #{String(order.orderNumber).padStart(3, "0")}
                </p>
                <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", padding: "20px 24px", textAlign: "left", marginBottom: "22px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#1a1a1a", margin: "0 0 10px", fontWeight: 600 }}>{order.buyerName}</p>
                  {order.items.map((it, i) => (
                    <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", color: "rgba(0,0,0,0.6)", margin: "2px 0" }}>
                      {it.qty}× {it.name}{it.free_qty > 0 ? ` (${it.free_qty} free)` : ""}
                    </p>
                  ))}
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", color: "rgba(0,0,0,0.5)", lineHeight: 1.8, marginBottom: "26px" }}>
                  Show this number to the coffee counter to collect your order.
                </p>
                <button
                  onClick={() => { setOrder(null); setFlow("browse"); setQtyById({}); setCoupon(""); setName(""); setPhone(""); }}
                  style={{ background: "transparent", color: BROWN, border: `1px solid ${BROWN}55`, padding: "13px 32px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Place Another Order
                </button>
              </motion.div>
            ) : (
              <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <Fade>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: BROWN, margin: "0 0 14px", textAlign: "center" }}>
                    The Menu
                  </p>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px, 3.4vw, 38px)", color: "#1a1a1a", textAlign: "center", margin: "0 0 40px" }}>
                    Pick your cup.
                  </h2>
                </Fade>

                <div className="sotsc-layout">
                  {/* Items */}
                  <div className="sotsc-menu-grid">
                    {COFFEE_ITEMS.map((item, i) => {
                      const qty = qtyById[item.id] ?? 0;
                      return (
                        <Fade key={item.id} delay={i * 0.05}>
                          <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", padding: "22px 22px 20px", height: "100%", display: "flex", flexDirection: "column" }}>
                            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "19px", color: "#1a1a1a", margin: "0 0 6px" }}>{item.name}</p>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.5)", lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>{item.description}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#1a1a1a", fontWeight: 600, margin: 0 }}>₹{item.priceRupees}</p>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <button type="button" onClick={() => setQty(item.id, qty - 1)} disabled={qty <= 0} style={{ width: "28px", height: "28px", background: "transparent", border: "1px solid rgba(0,0,0,0.18)", cursor: qty <= 0 ? "default" : "pointer", fontSize: "15px", color: qty <= 0 ? "rgba(0,0,0,0.2)" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                <div style={{ width: "36px", height: "28px", borderTop: "1px solid rgba(0,0,0,0.18)", borderBottom: "1px solid rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: "15px", color: "#1a1a1a" }}>{qty}</div>
                                <button type="button" onClick={() => setQty(item.id, qty + 1)} style={{ width: "28px", height: "28px", background: "transparent", border: "1px solid rgba(0,0,0,0.18)", cursor: "pointer", fontSize: "15px", color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                              </div>
                            </div>
                          </div>
                        </Fade>
                      );
                    })}
                  </div>

                  {/* Order summary */}
                  <Fade delay={0.15}>
                    <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", padding: "26px 24px", position: "sticky", top: "90px" }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: BROWN, margin: "0 0 18px" }}>Your Order</p>

                      {!hasItems ? (
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(0,0,0,0.4)", lineHeight: 1.8 }}>Add a cup to get started.</p>
                      ) : (
                        <>
                          {priced.lines.map(l => (
                            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", color: "#1a1a1a", margin: 0 }}>
                                {l.qty}× {l.name}{l.freeQty > 0 ? ` (${l.freeQty} free)` : ""}
                              </p>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", color: "#1a1a1a", margin: 0 }}>₹{l.lineTotalRupees}</p>
                            </div>
                          ))}

                          <div style={{ marginTop: "16px", marginBottom: "14px" }}>
                            <label style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "8px" }}>
                              Promo Code
                            </label>
                            <input
                              type="text" value={coupon}
                              onChange={e => setCoupon(e.target.value.toUpperCase())}
                              placeholder="ENTER CODE"
                              style={{ width: "100%", border: "none", borderBottom: "1px solid rgba(0,0,0,0.18)", padding: "8px 0", fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.1em", color: "#1a1a1a", outline: "none", background: "transparent", boxSizing: "border-box" }}
                            />
                            {coupon.trim() && (
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "10.5px", color: promoValid ? "#166534" : "#901A1C", margin: "6px 0 0" }}>
                                {promoValid ? COFFEE_PROMO.description : "Invalid code."}
                              </p>
                            )}
                          </div>

                          {priced.discountRupees > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px dashed rgba(0,0,0,0.12)", marginBottom: "10px" }}>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#166534", margin: 0 }}>Promo discount</p>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", color: "#166534", fontWeight: 600, margin: 0 }}>− ₹{priced.discountRupees}</p>
                            </div>
                          )}

                          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.1)", marginBottom: "20px" }}>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#1a1a1a", margin: 0 }}>Total</p>
                            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "22px", color: "#1a1a1a", margin: 0 }}>₹{priced.payableTotalRupees}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => { setError(""); setShowModal(true); }}
                            style={{ background: BROWN, color: "#ffffff", width: "100%", padding: "16px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "background 0.25s" }}
                            onMouseEnter={e => (e.currentTarget.style.background = BROWN_DARK)}
                            onMouseLeave={e => (e.currentTarget.style.background = BROWN)}
                          >
                            {priced.payableTotalRupees === 0 ? "Claim Free Coffee" : "Continue to Payment"}
                          </button>
                        </>
                      )}
                    </div>
                  </Fade>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* ── DETAILS MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ position: "fixed", inset: 0, background: "rgba(10,8,6,0.72)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "#ffffff", width: "100%", maxWidth: "420px", padding: "clamp(30px, 4vw, 44px)", position: "relative", borderTop: `3px solid ${BROWN}`, maxHeight: "90vh", overflowY: "auto" }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "16px", right: "20px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "rgba(0,0,0,0.28)", lineHeight: 1 }}>×</button>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: BROWN, marginBottom: "6px" }}>Your Details</p>
              <h3 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(22px, 3vw, 28px)", color: "#1a1a1a", marginBottom: "8px", lineHeight: 1.1 }}>
                Who&rsquo;s this cup for?
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.4)", marginBottom: "26px", lineHeight: 1.7 }}>
                {priced.totalQty} cup{priced.totalQty > 1 ? "s" : ""} &middot; ₹{priced.payableTotalRupees}
              </p>

              <form onSubmit={handlePay}>
                <Field label="Full Name" value={name} onChange={setName} type="text" placeholder="Your full name" />
                <Field label="Phone Number" value={phone} onChange={setPhone} type="tel" placeholder="+91 98765 43210" />

                {error && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#901A1C", lineHeight: 1.7, margin: "4px 0 16px" }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || flow === "paying"}
                  style={{ background: loading || flow === "paying" ? `${BROWN}73` : BROWN, color: "#ffffff", width: "100%", padding: "16px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", border: "none", cursor: loading || flow === "paying" ? "default" : "pointer", marginTop: "8px" }}
                >
                  {loading ? "Creating order…" : flow === "paying" ? "Opening payment…" : priced.payableTotalRupees === 0 ? "Confirm Free Order" : "Continue to Payment →"}
                </button>
                {priced.payableTotalRupees > 0 && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.5)", marginTop: "14px", textAlign: "center", lineHeight: 1.7 }}>
                    Secure payment via Razorpay · UPI · Cards · Net Banking
                  </p>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
