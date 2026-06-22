"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Flow = "browse" | "form" | "paying" | "confirmed";

interface TicketInfo {
  ticketId: string;
  ticketNumber: number;
  buyerName: string;
  buyerEmail: string;
  qty: number;
}



const menuFrontVariants = {
  hidden: { opacity: 0, y: 50, rotate: 0, x: 0 },
  show:   { opacity: 1, y: 0,  rotate: -3, x: 0,  transition: { duration: 0.95, delay: 0.14, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  hover:  { y: -8,  rotate: -8, x: -20,           transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};
const menuBackVariants = {
  hidden: { opacity: 0, y: 60, rotate: 0, x: 0 },
  show:   { opacity: 1, y: 10, rotate: 5,  x: 0,  transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  hover:  { y: 18,  rotate: 10, x: 20,            transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

const PROGRAMME = [
  { time: "6:30 PM", label: "Arrival & Welcome" },
  { time: "7:00 PM", label: "Conversations on Food & Memory" },
  { time: "8:00 PM", label: "Dining, Stories & Music" },
  { time: "10:00 PM", label: "The Evening Concludes" },
];


function waitForRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) { resolve(); return; }
    // Inject Razorpay script on first use — not on page load
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

export default function LivingTablePage() {
  const [flow, setFlow]           = useState<Flow>("browse");
  const [available, setAvailable] = useState<number | null>(null);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [qty, setQty]             = useState(1);
  const [coupon, setCoupon]       = useState("");
  const [couponStatus, setCouponStatus] = useState<{ msg: string; valid: boolean } | null>(null);
  const [discount, setDiscount]   = useState(0);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [meals, setMeals]         = useState<string[]>(["non-veg"]);
  const [ticket, setTicket]       = useState<TicketInfo | null>(null);
  const [qr, setQr]               = useState("");
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpen, setTermsOpen]         = useState(false);
  const formRef      = useRef<HTMLDivElement>(null);
  const termsRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tickets/count")
      .then(r => r.json())
      .then(d => setAvailable(d.available))
      .catch(() => {});
  }, []);




  useEffect(() => {
    if (!ticket) return;
    import("qrcode").then(QRCode =>
      QRCode.toDataURL(`INKPOT-TLT-${ticket.ticketId}`, {
        width: 200, margin: 2,
        color: { dark: "#111111", light: "#F4EFE6" },
      }).then(setQr)
    );
  }, [ticket]);

  const scrollToForm = () => {
    setFlow("form");
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/tickets/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, qty, coupon_code: coupon.trim() || undefined, meals, terms_accepted: termsAccepted }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.discount_paise > 0) setDiscount(data.discount_paise);

      // Free booking (100% coupon) — skip Razorpay entirely
      if (data.free) {
        setTicket({ ...data.ticket, qty });
        setFlow("confirmed");
        setShowModal(false);
        setLoading(false);
        requestAnimationFrame(() =>
          formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        );
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
        description: `The Living Table — 28th June 2026 (${qty} seat${qty > 1 ? "s" : ""})`,
        order_id: data.order_id,
        image: "/images/Inkpot/inkpot_final.svg",
        handler: async (r: any) => {
          const vr = await fetch("/api/tickets/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: r.razorpay_order_id,
              razorpay_payment_id: r.razorpay_payment_id,
              razorpay_signature: r.razorpay_signature,
              ticket_id: data.ticket_id,
              buyer_name: name,
              buyer_email: email,
              qty,
              amount: data.amount,
            }),
          });
          const vd = await vr.json();
          if (!vr.ok) { setError(vd.error); setFlow("form"); return; }
          setTicket({ ...vd.ticket, qty });
          setAvailable(p => p !== null ? Math.max(0, p - qty) : p);
          setFlow("confirmed");
          requestAnimationFrame(() =>
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          );
        },
        prefill: { name, email, contact: phone },
        theme: { color: "#901A1C" },
        modal: { ondismiss: () => setFlow("browse") },
      }).open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMeals(prev => Array.from({ length: qty }, (_, i) => prev[i] ?? "non-veg"));
  }, [qty]);

  const maxQty = available !== null ? Math.min(8, available) : 8;
  const total  = qty * 6500;

  return (
    <>
      <Navbar />
      <main style={{ background: "#0A0806" }}>
        <style>{`
          @media (max-width: 768px) {
            .tlt-experience      { grid-template-columns: 1fr !important; min-height: unset !important; }
            .tlt-why-grid        { grid-template-columns: 1fr !important; min-height: unset !important; }
            .tlt-why-video       { height: 56vw !important; margin: 0 16px !important; border-radius: 12px !important; overflow: hidden !important; }
            .tlt-gallery         { padding: 0 16px !important; }
            .tlt-gallery-item    { height: 52vw !important; }
            .tlt-gallery         { grid-template-columns: 1fr !important; }
            .tlt-gallery-item    { height: 260px !important; }
            .tlt-booking         { grid-template-columns: 1fr !important; }
            .tlt-know-grid       { grid-template-columns: 1fr !important; }
            .tlt-venue-desktop   { display: none !important; }
            .tlt-venue-mobile    { display: block !important; }
            .tlt-menu-grid       { grid-template-columns: 1fr !important; }
          }
          @media (min-width: 769px) {
            .tlt-venue-mobile    { display: none !important; }
          }
        `}</style>

        {/* ── 1. HERO ── */}
        <section style={{ position: "relative", height: "100dvh", minHeight: "480px", overflow: "hidden" }}>
          <video
            autoPlay muted loop playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          >
            <source src="/images/thelivingtable/hero.webm" type="video/webm" />
            <source src="/images/thelivingtable/Dining_table_in_Old_Delhi_202606091648.mp4" type="video/mp4" />
            <track kind="captions" src="/empty.vtt" srcLang="en" label="No dialogue" />
          </video>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,6,0.18) 0%, rgba(10,8,6,0.52) 55%, rgba(10,8,6,0.96) 100%)" }} />

          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "0 24px",
          }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              style={{ marginBottom: "16px" }}
            >
              <Image
                src="/images/thelivingtable/logo_the_right_one_1.svg"
                alt="The Living Table"
                width={380} height={380}
                style={{ width: "clamp(180px, 52vw, 380px)", height: "auto", filter: "brightness(0) invert(1)", opacity: 0.92 }}
                priority
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.0 }}
              style={{
                fontFamily: "var(--font-heading)", fontStyle: "italic",
                fontSize: "clamp(13px, 3.5vw, 20px)",
                color: "rgba(244,239,230,0.62)", letterSpacing: "0.02em", marginBottom: "32px",
              }}
            >
              Where stories find their way onto the plate
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
            >
              <button
                onClick={scrollToForm}
                style={{
                  background: "#901A1C", color: "#ffffff", padding: "14px 44px",
                  fontFamily: "var(--font-body)", fontSize: "10px",
                  letterSpacing: "0.24em", textTransform: "uppercase",
                  border: "none", cursor: "pointer", transition: "background 0.25s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7a1517")}
                onMouseLeave={e => (e.currentTarget.style.background = "#901A1C")}
              >
                Reserve Your Seat
              </button>
              {available !== null && available > 0 && (
                <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(244,239,230,0.35)", letterSpacing: "0.08em" }}>
                  Limited seats available
                </span>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── 2. THE EXPERIENCE ── */}
        <section ref={formRef} className="tlt-experience" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#ffffff", minHeight: "clamp(380px, 48vw, 600px)" }}>

          {/* Left — editorial text */}
          <motion.div
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1 }}
            style={{
              padding: "clamp(44px, 6vw, 80px) clamp(24px, 5vw, 72px)",
              display: "flex", flexDirection: "column", justifyContent: "center",
              background: "#ffffff",
            }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 28px" }}>
              The Experience
            </p>

            <p style={{
              fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(22px, 3.2vw, 42px)", color: "#1a1a1a",
              lineHeight: 1.25, margin: "0 0 22px",
            }}>
              About The Living Table
            </p>

            <div style={{ width: "40px", height: "1px", background: "rgba(0,0,0,0.15)", margin: "0 0 22px" }} />

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)",
              color: "rgba(0,0,0,0.55)", lineHeight: 1.9, margin: "0 0 18px",
            }}>
              An intimate dining experience of food, stories and cultural memory awaits in the heart of Old Delhi, hosted within the restored haveli Kathika Cultural Centre.
            </p>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)",
              color: "rgba(0,0,0,0.55)", lineHeight: 1.9, margin: "0 0 18px",
            }}>
              We will be joined by the Gujral family credited with inventing butter chicken, tracing its journey from Peshawar to Delhi through the lens of Partition, memory, migration, and food, exploring how one dish came to carry histories far beyond the table.
            </p>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "10px",
              color: "rgba(0,0,0,0.4)", lineHeight: 1.85, margin: "0 0 10px",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              Speakers
            </p>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)",
              color: "rgba(0,0,0,0.55)", lineHeight: 1.9, margin: "0 0 10px",
            }}>
              <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>Monish Gujral</strong> — Author, Chef &amp; Entrepreneur, owner of Moti Mahal, and the family behind the invention of Butter Chicken.
            </p>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)",
              color: "rgba(0,0,0,0.55)", lineHeight: 1.9, margin: "0 0 10px",
            }}>
              <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>Sadaf Husain</strong> — Author, Chef and Food Writer.
            </p>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)",
              color: "rgba(0,0,0,0.55)", lineHeight: 1.9, margin: 0,
            }}>
              <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>Salma Husain</strong> — Food Historian and Author, whose knowledge of Persian allows her remarkable access to the history of food from the Mughal era.
            </p>
          </motion.div>

          {/* Right — Booking form */}
          <div style={{ background: "#F4EFE6", padding: "clamp(28px, 3vw, 48px) clamp(28px, 4vw, 60px)", display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "480px" }}>
              <AnimatePresence mode="wait">

                {flow === "confirmed" && ticket ? (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
                    style={{ textAlign: "center", paddingTop: "40px" }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{ width: "56px", height: "56px", border: "1px solid rgba(144,26,28,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#901A1C" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </motion.div>

                    <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#901A1C", marginBottom: "14px" }}>Booking Confirmed</p>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 4vw, 44px)", color: "#1a1a1a", marginBottom: "10px", lineHeight: 1.1 }}>
                      Your Seat is Reserved.
                    </h2>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(0,0,0,0.45)", lineHeight: 1.9, marginBottom: "36px" }}>
                      {ticket.qty} seat{ticket.qty > 1 ? "s" : ""} &middot; {ticket.buyerName}
                      <br />Confirmation + QR sent to {ticket.buyerEmail}
                    </p>

                    {qr ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{ display: "inline-block", background: "#ffffff", padding: "24px", marginBottom: "24px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}
                      >
                        <img src={qr} alt="QR Code" width={160} height={160} style={{ display: "block" }} />
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginTop: "14px", textAlign: "center" }}>
                          Present at entry
                        </p>
                      </motion.div>
                    ) : (
                      <div style={{ width: "160px", height: "160px", background: "rgba(0,0,0,0.05)", margin: "0 auto 24px" }} />
                    )}

                    <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(0,0,0,0.35)", lineHeight: 1.8 }}>
                      Kathika Cultural Centre<br />Gali Khatikan, Kucha Pati Ram, Sitaram Bazar, Delhi
                    </p>
                    <a
                      href={`/ticket/${ticket.ticketId}`}
                      style={{ display: "inline-block", marginTop: "16px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(0,0,0,0.15)", paddingBottom: "2px", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#901A1C")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,0,0,0.35)")}
                    >
                      Save ticket page →
                    </a>
                  </motion.div>

                ) : (
                  <motion.div
                    key="book"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.65 }}
                  >
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#901A1C", marginBottom: "8px" }}>
                      Reserve Your Seats
                    </p>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(24px, 2.8vw, 36px)", lineHeight: 1.05, color: "#1a1a1a", marginBottom: "28px" }}>
                      Join us at the table.
                    </h2>

                    {available === 0 ? (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(0,0,0,0.5)", lineHeight: 1.9 }}>
                        This event is sold out. Follow{" "}
                        <a href="https://www.instagram.com/inkpotindia_/" target="_blank" rel="noopener noreferrer" style={{ color: "#901A1C", textDecoration: "none", borderBottom: "1px solid #901A1C" }}>
                          @inkpotindia_
                        </a>{" "}
                        for future dates.
                      </p>
                    ) : (
                      <div>
                        {/* Seats stepper */}
                        <div style={{ marginBottom: "24px" }}>
                          <label style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.58)", display: "block", marginBottom: "12px" }}>
                            Number of Seats
                          </label>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} style={{ width: "36px", height: "36px", background: "transparent", border: "1px solid rgba(0,0,0,0.18)", cursor: qty <= 1 ? "default" : "pointer", fontSize: "18px", color: qty <= 1 ? "rgba(0,0,0,0.2)" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)" }}>−</button>
                            <div style={{ width: "52px", height: "36px", borderTop: "1px solid rgba(0,0,0,0.18)", borderBottom: "1px solid rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: "20px", color: "#1a1a1a", fontWeight: 400 }}>{qty}</div>
                            <button type="button" onClick={() => setQty(q => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} style={{ width: "36px", height: "36px", background: "transparent", border: "1px solid rgba(0,0,0,0.18)", cursor: qty >= maxQty ? "default" : "pointer", fontSize: "18px", color: qty >= maxQty ? "rgba(0,0,0,0.2)" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)" }}>+</button>
                          </div>
                        </div>

                        {/* Meal preferences */}
                        <div style={{ marginBottom: "28px" }}>
                          <label style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.58)", display: "block", marginBottom: "14px" }}>
                            Meal Preference{qty > 1 ? "s" : ""}
                          </label>
                          {Array.from({ length: qty }, (_, i) => (
                            <div key={i} style={{ marginBottom: i < qty - 1 ? "14px" : 0 }}>
                              {qty > 1 && <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.45)", letterSpacing: "0.08em", marginBottom: "8px" }}>Guest {i + 1}</p>}
                              <div style={{ display: "flex", gap: "8px" }}>
                                {[
                                  { key: "veg",     label: "Vegetarian",     activeColor: "#166534", activeBg: "#dcfce7", borderColor: "#bbf7d0" },
                                  { key: "non-veg", label: "Non-Vegetarian", activeColor: "#7f1d1d", activeBg: "#fee2e2", borderColor: "#fca5a5" },
                                ].map(opt => {
                                  const active = meals[i] === opt.key;
                                  return (
                                    <button key={opt.key} type="button"
                                      onClick={() => setMeals(prev => { const next = [...prev]; next[i] = opt.key; return next; })}
                                      style={{ padding: "6px 14px", border: `1px solid ${active ? opt.borderColor : "rgba(0,0,0,0.18)"}`, background: active ? opt.activeBg : "transparent", color: active ? opt.activeColor : "rgba(0,0,0,0.6)", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.18s", fontWeight: active ? 600 : 400 }}>
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Price */}
                        <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", padding: "16px 0", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.4)", margin: 0 }}>{qty} seat{qty > 1 ? "s" : ""} × ₹6,500</p>
                          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "22px", color: "#1a1a1a", margin: 0 }}>₹{total.toLocaleString("en-IN")}</p>
                        </div>

                        {/* Book Now */}
                        <button
                          type="button"
                          onClick={() => { setError(""); setShowModal(true); }}
                          style={{ background: "#901A1C", color: "#ffffff", width: "100%", padding: "18px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "background 0.25s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#7a1517")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#901A1C")}
                        >
                          Book Now
                        </button>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.5)", marginTop: "14px", textAlign: "center", lineHeight: 1.7 }}>
                          Secure payment via Razorpay · UPI · Cards · Net Banking
                        </p>

                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ── 3. THINGS TO KNOW ── */}
        <section style={{ background: "#F4EFE6", padding: "clamp(40px, 5vw, 64px) clamp(24px, 8vw, 120px)" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 28px" }}>
            Things to Know
          </p>
          <div className="tlt-know-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 clamp(32px, 6vw, 80px)", maxWidth: "680px" }}>
            {([
              { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>, label: "Duration 3 Hours" },
              { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 12h20M2 12a2 2 0 0 0 2-2V7h16v3a2 2 0 0 0 2 2M2 12a2 2 0 0 1 2 2v3h16v-3a2 2 0 0 1 2-2"/><line x1="12" y1="7" x2="12" y2="17"/></svg>, label: "Minimum Age 18+" },
              { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>, label: "Sit Down Dinner" },
              { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 22V12h6v10"/></svg>, label: "Layout Indoor" },
              { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="5" y="11" width="14" height="5" rx="1"/><path d="M7 11V7a2 2 0 0 1 4 0v4M7 16v3M17 16v3"/></svg>, label: "Seating Arrangement Seated & Standing" },
              { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-3.5 3.1-6 7-6s7 2.5 7 6"/><line x1="4" y1="4" x2="20" y2="20"/></svg>, label: "Kids not allowed" },
              { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><ellipse cx="12" cy="16" rx="5" ry="4"/><circle cx="7.5" cy="9.5" r="1.5"/><circle cx="16.5" cy="9.5" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="19" cy="13" r="1.5"/><line x1="4" y1="4" x2="20" y2="20"/></svg>, label: "Pets not allowed" },
              { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 22h8M12 11v11M5 8l1.5 6h11L19 8"/><path d="M5 8h14M9 8V4h6v4"/></svg>, label: "Liquor included — 2 drinks per person" },
            ] as { icon: React.ReactNode; label: string }[]).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "11px", alignItems: "center", padding: "13px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.38)" }}>
                <div style={{ flexShrink: 0 }}>{item.icon}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12px, 1.1vw, 13px)", color: "rgba(0,0,0,0.58)", margin: 0, lineHeight: 1.45 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3.5 THE MENU ── tap to reveal ── */}
        <section style={{ background: "#901A1C" }}>

          {/* Trigger row */}
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "clamp(22px, 3vw, 36px) clamp(24px, 8vw, 120px)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px",
              transition: "background 0.25s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", margin: "0 0 8px" }}>
                The Menu
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px, 2.4vw, 30px)", color: "#ffffff", margin: 0, lineHeight: 1.2 }}>
                {menuOpen ? "Close the menu" : "See what's on the table"}
              </p>
            </div>

            {/* Animated circle arrow */}
            <motion.div
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flexShrink: 0,
                width: "clamp(40px, 4.5vw, 52px)", height: "clamp(40px, 4.5vw, 52px)",
                borderRadius: "50%", border: "1px solid rgba(255,255,255,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>
          </button>

          {/* Expandable menu panel */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                key="menu-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div
                  className="tlt-menu-grid"
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: "clamp(16px, 2.5vw, 40px)",
                    padding: "0 clamp(24px, 8vw, 120px) clamp(40px, 5vw, 64px)",
                  }}
                >
                  {(["11", "12"] as const).map((n, i) => (
                    <motion.div
                      key={n}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.6)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/thelivingtable/${n}.svg`}
                        alt={`Menu page ${i + 1}`}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* white space */}
        <div style={{ height: "clamp(48px, 6vw, 96px)", background: "#F4EFE6" }} />

        {/* ── 4. WHY THIS EVENING EXISTS — auto-rotate images ── */}
        <div style={{ background: "#F4EFE6" }}>
          <div className="tlt-why-grid" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            background: "#0A0806", minHeight: "clamp(380px, 48vw, 600px)",
            overflow: "hidden",
          }}>
            {/* Left — venue video */}
            <div className="tlt-why-video" style={{ position: "relative", overflow: "hidden" }}>
              <video
                autoPlay muted loop playsInline
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
              >
                <source src="/images/thelivingtable/VenueRevel_Video.webm" type="video/webm" />
                <source src="/images/thelivingtable/VenueRevel_Video.mp4" type="video/mp4" />
                <track kind="captions" src="/empty.vtt" srcLang="en" label="No dialogue" />
              </video>
            </div>

            {/* Right — quote + paragraph, white bg */}
            <div style={{
              padding: "clamp(40px, 5vw, 72px) clamp(24px, 4vw, 64px)",
              display: "flex", flexDirection: "column", justifyContent: "center",
              background: "#F4EFE6",
            }}>
              <p style={{
                fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400,
                fontSize: "clamp(22px, 3vw, 40px)", color: "#901A1C",
                lineHeight: 1.4, margin: "0 0 36px",
              }}>
                Food remembers<br />what cities forget.
              </p>
              <div style={{ width: "40px", height: "1px", background: "rgba(0,0,0,0.15)", margin: "0 0 36px" }} />
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(13px, 1.4vw, 16px)",
                color: "rgba(0,0,0,0.55)",
                lineHeight: 2.1, margin: "0 0 24px",
              }}>
                Old Delhi has always known how to feed a city. Its narrow lanes hold centuries of recipes — each one carrying the memory of the hands that made it, the occasions it marked, the families it gathered.
              </p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(13px, 1.4vw, 16px)",
                color: "rgba(0,0,0,0.55)",
                lineHeight: 2.1, margin: 0,
              }}>
                The Living Table is an attempt to bring those memories back. Not just as food, but as conversation. As an evening that asks: what does a city taste like when it remembers itself?
              </p>
            </div>
          </div>
        </div>

        {/* white space before venue */}
        <div style={{ height: "clamp(64px, 8vw, 120px)", background: "#F4EFE6" }} />

        {/* ── 5. VENUE ── */}
        <section style={{ position: "relative", height: "clamp(240px, 38vh, 440px)", overflow: "hidden" }}>
          <Image
            src="/images/thelivingtable/banner_1.png"
            alt="Kathika Cultural Centre"
            fill
            className="tlt-venue-desktop"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <Image
            src="/images/thelivingtable/landscape.png"
            alt="Kathika Cultural Centre"
            fill
            className="tlt-venue-mobile"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.2) 50%, rgba(10,8,6,0.04) 100%)" }} />
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9 }}
            style={{
              position: "absolute", bottom: "clamp(40px, 6vw, 72px)",
              left: "clamp(24px, 6vw, 80px)", zIndex: 2,
            }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A84C", margin: "0 0 12px" }}>
              Venue
            </p>
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(22px, 3vw, 36px)", color: "#F4EFE6", margin: "0 0 8px", lineHeight: 1.2 }}>
              Kathika Cultural Centre
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(244,239,230,0.45)", letterSpacing: "0.08em", margin: 0 }}>
              Gali Khatikan, Kucha Pati Ram, Sitaram Bazar, Delhi
            </p>
          </motion.div>
        </section>

        {/* white space */}
        <div style={{ height: "clamp(64px, 8vw, 120px)", background: "#F4EFE6" }} />

        {/* ── 6. GALLERY ── */}
        <section className="tlt-gallery" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 2vw, 32px)", background: "#F4EFE6", padding: "0 clamp(24px, 5vw, 100px)" }}>
          {["45", "47"].map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }} transition={{ duration: 1, delay: i * 0.12 }}
              className="tlt-gallery-item" style={{ position: "relative", height: "clamp(200px, 28vw, 380px)" }}
            >
              <Image src={`/images/thelivingtable/${src}.png`} alt="The Living Table" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center" }} />
            </motion.div>
          ))}
        </section>

        {/* white space */}
        <div style={{ height: "clamp(64px, 8vw, 120px)", background: "#F4EFE6" }} />

        {/* ── 7. BOOKING SECTION — two column ── */}
        <section className="tlt-booking" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "auto", background: "#ffffff" }}>

          {/* LEFT: Programme */}
          <div style={{
            background: "#ffffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "clamp(28px, 4vw, 48px) clamp(20px, 3.5vw, 44px)",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "400px",
              background: "#ffffff",
              padding: "clamp(28px, 3.2vw, 42px) clamp(24px, 3vw, 38px)",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 2px 0 rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.07), 4px 4px 0 rgba(0,0,0,0.03), 8px 8px 0 rgba(0,0,0,0.02)",
            }}>

              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #901A1C 30%, #901A1C 70%, transparent)" }} />

              <motion.p
                initial={{ opacity: 0, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(11px, 1.2vw, 14px)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", textAlign: "center", marginBottom: "16px" }}
              >
                The Programme
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scaleX: 0.6 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
                style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "22px" }}
              >
                <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
                <svg width="14" height="8" viewBox="0 0 16 8" fill="rgba(144,26,28,0.35)">
                  <circle cx="8" cy="4" r="2" /><circle cx="2" cy="4" r="1.2" /><circle cx="14" cy="4" r="1.2" />
                </svg>
                <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
              </motion.div>

              {PROGRAMME.map((item, i) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, filter: "blur(12px)", y: 5 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.2, delay: 0.42 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "68px 1fr",
                    gap: "12px",
                    alignItems: "baseline",
                    padding: "clamp(11px, 1.3vw, 15px) 0",
                    borderBottom: i < PROGRAMME.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(8px, 0.9vw, 10px)", letterSpacing: "0.06em", color: "rgba(0,0,0,0.32)", fontWeight: 600 }}>
                    {item.time}
                  </span>
                  <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(14px, 1.5vw, 18px)", color: "#1a1a1a", lineHeight: 1.25 }}>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: Event details */}
          <div style={{ position: "relative", overflow: "hidden", background: "#F4EFE6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(36px, 4vw, 60px) clamp(32px, 5vw, 64px)" }}>

            {/* White card */}
            <div style={{
              position: "relative", zIndex: 2, width: "100%", maxWidth: "360px",
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
              padding: "clamp(28px, 3.5vw, 44px) clamp(24px, 3vw, 36px)",
              overflow: "hidden",
            }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.32em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 28px" }}>
                The Living Table
              </p>

              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(144,26,28,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
                  label: "28 June 2026",
                  sub: "Sunday",
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(144,26,28,0.5)" strokeWidth="1.4" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
                  label: "6:30 PM Onwards",
                  sub: "",
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(144,26,28,0.5)" strokeWidth="1.4" strokeLinecap="round"><path d="M12 21s-8-6.5-8-12a8 8 0 1 1 16 0c0 5.5-8 12-8 12z"/><circle cx="12" cy="9" r="2.5"/></svg>,
                  label: "Kathika Cultural Centre",
                  sub: "Gali Khatikan, Kucha Pati Ram\nSitaram Bazar, Delhi",
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(144,26,28,0.5)" strokeWidth="1.4" strokeLinecap="round"><path d="M8 22h8M12 11v11M5 8l1.5 6h11L19 8H5z"/><path d="M5 8h14"/></svg>,
                  label: "Liquor Included",
                  sub: "2 drinks per person",
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(144,26,28,0.5)" strokeWidth="1.4" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
                  label: "Dinner Included",
                  sub: "",
                },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", paddingBottom: i < 4 ? "16px" : 0, marginBottom: i < 4 ? "16px" : "24px", borderBottom: i < 4 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
                  <div style={{ marginTop: "1px", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#1a1a1a", margin: "0 0 3px", letterSpacing: "0.02em" }}>{item.label}</p>
                    {item.sub && item.sub.split("\n").map((line, j) => (
                      <p key={j} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(0,0,0,0.6)", margin: "1px 0 0", lineHeight: 1.6 }}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Kathika sketch inside card */}
              <div style={{ pointerEvents: "none", marginTop: "4px", opacity: 1 }}>
                <Image
                  src="/images/thelivingtable/kathika.png"
                  alt=""
                  width={280} height={130}
                  style={{ width: "85%", height: "auto", margin: "0 auto", display: "block" }}
                />
              </div>
            </div>

            {/* Flower — outside card, bottom-left of panel */}
            <div style={{ position: "absolute", bottom: "-10px", left: "-8px", zIndex: 3, pointerEvents: "none" }}>
              <Image
                src="/images/thelivingtable/flower.png"
                alt=""
                width={190} height={230}
                style={{ width: "clamp(130px, 14vw, 190px)", height: "auto" }}
              />
            </div>
          </div>
        </section>

        {/* ── CTA strip ── */}
        <div style={{ background: "#F4EFE6", padding: "clamp(36px, 4.5vw, 60px) 24px", textAlign: "center" }}>
          <button
            onClick={scrollToForm}
            style={{ background: "#901A1C", color: "#ffffff", padding: "16px 52px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "background 0.25s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7a1517")}
            onMouseLeave={e => (e.currentTarget.style.background = "#901A1C")}
          >
            Reserve Your Seat →
          </button>
          {available !== null && available > 0 && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.5)", marginTop: "12px", letterSpacing: "0.08em" }}>
              Limited seats available
            </p>
          )}
        </div>

        {/* ── 8. TERMS & CONDITIONS ── */}
        <div ref={termsRef} id="terms" style={{ background: "#F4EFE6", padding: "clamp(28px, 3.5vw, 48px) clamp(24px, 8vw, 120px)", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <button
            type="button"
            onClick={() => setTermsOpen(o => !o)}
            style={{ width: "100%", background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", gap: "16px" }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 600, margin: 0 }}>
              Terms &amp; Conditions
            </p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transition: "transform 0.3s", transform: termsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <AnimatePresence>
            {termsOpen && (
              <motion.div
                key="terms-body"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ paddingTop: "28px", maxWidth: "680px" }}>
                  {([
                    { title: "All Sales Are Final", body: "Tickets are non-refundable. Once your booking is confirmed, no cancellations or exchanges are permitted under any circumstances." },
                    { title: "Non-Transferable", body: "Tickets are issued in the buyer's name and cannot be transferred to another person or resold." },
                    { title: "Meal Preferences Are Locked", body: "Vegetarian or non-vegetarian preferences selected at checkout cannot be changed after your booking is confirmed." },
                    { title: "Age Restriction — 18 and Above", body: "This is a strictly adults-only event. A valid government-issued photo ID is required at entry. Entry will be refused without it." },
                    { title: "No Children or Pets", body: "Guests under 18 years of age and pets are not permitted at the venue." },
                    { title: "Right to Refuse Entry", body: "Inkpot India reserves the right to refuse entry to any guest who appears intoxicated, disruptive, or unable to produce valid identification." },
                    { title: "Event Changes", body: "In the unlikely event of a cancellation or significant change by the organiser, registered guests will be notified via the email address provided at booking." },
                  ] as { title: string; body: string }[]).map((item, i, arr) => (
                    <div key={i} style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", margin: "0 0 5px" }}>
                        {item.title}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.5)", lineHeight: 1.85, margin: 0 }}>
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* ── CONTACT MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: "fixed", inset: 0, background: "rgba(10,8,6,0.72)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "#ffffff", width: "100%", maxWidth: "440px", padding: "clamp(32px, 4vw, 48px)", position: "relative", borderTop: "3px solid #901A1C", maxHeight: "90vh", overflowY: "auto" }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{ position: "absolute", top: "16px", right: "20px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "rgba(0,0,0,0.28)", lineHeight: 1 }}
              >×</button>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#901A1C", marginBottom: "6px" }}>
                Your Details
              </p>
              <h3 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(22px, 3vw, 30px)", color: "#1a1a1a", marginBottom: "8px", lineHeight: 1.1 }}>
                Complete your booking.
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.4)", marginBottom: "28px", lineHeight: 1.7 }}>
                {qty} seat{qty > 1 ? "s" : ""} · ₹{total.toLocaleString("en-IN")}
              </p>

              <form onSubmit={handlePay}>
                {[
                  { label: "Full Name",     value: name,  set: setName,  type: "text",  ph: "Your full name" },
                  { label: "Email Address", value: email, set: setEmail, type: "email", ph: "your@email.com" },
                  { label: "Phone Number",  value: phone, set: setPhone, type: "tel",   ph: "+91 98765 43210" },
                ].map(f => (
                  <Field key={f.label} label={f.label} value={f.value} onChange={f.set} type={f.type} placeholder={f.ph} />
                ))}

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "10px" }}>
                    Coupon Code (optional)
                  </label>
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponStatus(null); setDiscount(0); }}
                    placeholder="ENTER CODE"
                    style={{ width: "100%", border: "none", borderBottom: "1px solid rgba(0,0,0,0.18)", padding: "10px 0", fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.1em", color: "#1a1a1a", outline: "none", background: "transparent", boxSizing: "border-box" }}
                  />
                  {couponStatus && (
                    <p style={{ fontSize: "11px", marginTop: "6px", color: couponStatus.valid ? "#166534" : "#901A1C", fontFamily: "var(--font-body)" }}>
                      {couponStatus.msg}
                    </p>
                  )}
                </div>

                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px dashed rgba(0,0,0,0.1)" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#166534", margin: 0 }}>Coupon discount</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#166534", fontWeight: 600, margin: 0 }}>− ₹{(discount / 100).toLocaleString("en-IN")}</p>
                  </div>
                )}

                <div style={{ margin: "24px 0 20px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <input
                    type="checkbox"
                    id="tlt-terms"
                    required
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    style={{ marginTop: "3px", flexShrink: 0, accentColor: "#901A1C", cursor: "pointer", width: "14px", height: "14px" }}
                  />
                  <label htmlFor="tlt-terms" style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(0,0,0,0.5)", lineHeight: 1.75, cursor: "pointer" }}>
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setTimeout(() => { termsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); setTermsOpen(true); }, 280);
                      }}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#901A1C", fontFamily: "var(--font-body)", fontSize: "11px", textDecoration: "underline" }}
                    >
                      Terms &amp; Conditions
                    </button>
                    . Tickets are non-refundable, non-cancellable, and non-transferable.
                  </label>
                </div>

                {error && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#901A1C", lineHeight: 1.7, marginBottom: "16px" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || flow === "paying"}
                  style={{ background: loading || flow === "paying" ? "rgba(144,26,28,0.45)" : "#901A1C", color: "#ffffff", width: "100%", padding: "16px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", border: "none", cursor: loading || flow === "paying" ? "default" : "pointer", transition: "background 0.25s" }}
                  onMouseEnter={e => { if (!loading && flow !== "paying") e.currentTarget.style.background = "#7a1517"; }}
                  onMouseLeave={e => { if (!loading && flow !== "paying") e.currentTarget.style.background = "#901A1C"; }}
                >
                  {loading ? "Creating order…" : flow === "paying" ? "Opening payment…" : "Continue to Payment →"}
                </button>

                <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.5)", marginTop: "14px", textAlign: "center", lineHeight: 1.7 }}>
                  Secure payment via Razorpay · UPI · Cards · Net Banking
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

function Field({ label, value, onChange, type, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type: string; placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type={type} value={value} required
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display: "block", width: "100%", background: "transparent",
          border: "none", borderBottom: `1px solid ${focused ? "#901A1C" : "rgba(0,0,0,0.18)"}`,
          padding: "7px 0", fontFamily: "var(--font-body)", fontSize: "14px",
          color: "#1a1a1a", outline: "none", transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
