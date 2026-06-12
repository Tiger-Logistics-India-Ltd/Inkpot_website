"use client";

import { useState, useEffect, useRef } from "react";
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



const PROGRAMME = [
  { time: "6:30 PM", label: "Arrival & Welcome" },
  { time: "7:00 PM", label: "First Course" },
  { time: "7:30 PM", label: "Stories of Old Delhi" },
  { time: "8:00 PM", label: "Musical Interlude" },
  { time: "8:30 PM", label: "Shared Table Experience" },
];


function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Payment gateway failed to load"));
    document.body.appendChild(s);
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
  const formRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ name, email, phone, qty, coupon_code: coupon.trim() || undefined, meals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.discount_paise > 0) setDiscount(data.discount_paise);

      // Free booking (100% coupon) — skip Razorpay entirely
      if (data.free) {
        setTicket({ ...data.ticket, qty });
        setFlow("confirmed");
        setLoading(false);
        requestAnimationFrame(() =>
          formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        );
        return;
      }

      await loadRazorpay();
      setLoading(false);
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
        modal: { ondismiss: () => setFlow("form") },
      }).open();
    } catch (err: any) {
      setError(err.message);
      setFlow("form");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMeals(prev => Array.from({ length: qty }, (_, i) => prev[i] ?? "non-veg"));
  }, [qty]);

  const maxQty = available !== null ? Math.min(4, available) : 4;
  const total  = qty * 6500;

  return (
    <>
      <Navbar />
      <main style={{ background: "#0A0806" }}>
        <style>{`
          @media (max-width: 768px) {
            .tlt-experience   { grid-template-columns: 1fr !important; min-height: unset !important; }
            .tlt-why-grid     { grid-template-columns: 1fr !important; min-height: unset !important; }
            .tlt-why-video    { height: 260px !important; }
            .tlt-gallery      { grid-template-columns: 1fr !important; }
            .tlt-gallery-item { height: 260px !important; }
            .tlt-booking      { grid-template-columns: 1fr !important; }
            .tlt-booking-img  { display: none !important; }
          }
        `}</style>

        {/* ── 1. HERO ── */}
        <section style={{ position: "relative", height: "clamp(480px, 75vh, 100dvh)", overflow: "hidden" }}>
          <video
            autoPlay muted loop playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            poster="/images/thelivingtable/38.png"
          >
            <source src="/images/thelivingtable/Dining_table_in_Old_Delhi_202606091648.mp4" type="video/mp4" />
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
        <section className="tlt-experience" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#ffffff", minHeight: "clamp(380px, 48vw, 600px)" }}>

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
              The Living Table is not a dinner.
            </p>

            <div style={{ width: "40px", height: "1px", background: "rgba(0,0,0,0.15)", margin: "0 0 22px" }} />

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)",
              color: "rgba(0,0,0,0.55)", lineHeight: 1.9, margin: "0 0 14px",
            }}>
              It is an evening where food, memory, music and conversation come together at a single table.
            </p>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)",
              color: "rgba(0,0,0,0.55)", lineHeight: 1.9, margin: 0,
            }}>
              Each course opens a story.<br />Each story opens a conversation.
            </p>
          </motion.div>

          {/* Right — Programme scroll (paper) */}
          <div style={{
            background: "#ffffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "clamp(28px, 4vw, 48px) clamp(20px, 3.5vw, 44px)",
          }}>
            {/* Paper card */}
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "400px",
              background: "#ffffff",
              padding: "clamp(28px, 3.2vw, 42px) clamp(24px, 3vw, 38px)",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 2px 0 rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.07), 4px 4px 0 rgba(0,0,0,0.03), 8px 8px 0 rgba(0,0,0,0.02)",
            }}>

              {/* Top red rule — brand accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #901A1C 30%, #901A1C 70%, transparent)" }} />

              {/* Heading */}
              <motion.p
                initial={{ opacity: 0, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(11px, 1.2vw, 14px)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", textAlign: "center", marginBottom: "16px" }}
              >
                The Programme
              </motion.p>

              {/* Ornamental divider */}
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

              {/* Programme items — magic blur reveal */}
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
        </section>

        {/* ── 4. WHY THIS EVENING EXISTS — auto-rotate images ── */}
        <div>
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
                <source src="/images/thelivingtable/VenueRevel_Video.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Right — quote + paragraph, white bg */}
            <div style={{
              padding: "clamp(40px, 5vw, 72px) clamp(24px, 4vw, 64px)",
              display: "flex", flexDirection: "column", justifyContent: "center",
              background: "#ffffff",
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

        {/* spacing after section 4 */}

        {/* ── 5. VENUE ── */}
        <section style={{ position: "relative", height: "clamp(240px, 38vh, 440px)", overflow: "hidden" }}>
          <Image
            src="/images/thelivingtable/banner_1.png"
            alt="Kathika Cultural Centre"
            fill
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

        {/* spacing after venue banner */}

        {/* ── 6. GALLERY ── */}
        <section className="tlt-gallery" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px", background: "#0A0806" }}>
          {["45", "47"].map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }} transition={{ duration: 1, delay: i * 0.12 }}
              className="tlt-gallery-item" style={{ position: "relative", height: "clamp(200px, 28vw, 380px)" }}
            >
              <Image src={`/images/thelivingtable/${src}.png`} alt="The Living Table" fill style={{ objectFit: "cover", objectPosition: "center" }} />
            </motion.div>
          ))}
        </section>

        {/* ── 7. BOOKING SECTION — two column ── */}
        <section ref={formRef} className="tlt-booking" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "auto", background: "#0A0806" }}>

          {/* LEFT: still image */}
          <div className="tlt-booking-img" style={{ position: "relative", overflow: "hidden", minHeight: "600px" }}>
            <Image
              src="/images/thelivingtable/46.png"
              alt="The Living Table"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>

          {/* RIGHT: booking form */}
          <div style={{ background: "#F4EFE6", padding: "clamp(40px, 4vw, 64px) clamp(24px, 3.5vw, 56px)", display: "flex", alignItems: "flex-start" }}>
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
                    key="form"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.65 }}
                  >
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#901A1C", marginBottom: "14px" }}>
                      Reserve Your Seats
                    </p>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.05, color: "#1a1a1a", marginBottom: "32px" }}>
                      Join us at the table.
                    </h2>

                    <div style={{ background: "#1a1a1a", padding: "18px 24px", marginBottom: "36px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
                      {[
                        ["Event",       "The Living Table"],
                        ["Date & Time", "28 June · 7:30 PM"],
                        ["Venue",       "Kathika Cultural Centre"],
                        ["Per Seat",    "₹6,500"],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.26em", textTransform: "uppercase", color: "#C9A84C", margin: "0 0 4px" }}>{label}</p>
                          <p style={{ fontFamily: label === "Event" ? "var(--font-heading)" : "var(--font-body)", fontStyle: label === "Event" ? "italic" : "normal", fontSize: "13px", color: "#F4EFE6", margin: 0, fontWeight: 400 }}>{val}</p>
                        </div>
                      ))}
                    </div>

                    {available === 0 ? (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(0,0,0,0.5)", lineHeight: 1.9 }}>
                        This event is sold out. Follow{" "}
                        <a href="https://www.instagram.com/inkpotindia_/" target="_blank" rel="noopener noreferrer" style={{ color: "#901A1C", textDecoration: "none", borderBottom: "1px solid #901A1C" }}>
                          @inkpotindia_
                        </a>{" "}
                        for future dates.
                      </p>
                    ) : (
                      <form onSubmit={handlePay}>
                        {[
                          { label: "Full Name",     value: name,  set: setName,  type: "text",  ph: "Your full name" },
                          { label: "Email Address", value: email, set: setEmail, type: "email", ph: "your@email.com" },
                          { label: "Phone Number",  value: phone, set: setPhone, type: "tel",   ph: "+91 98765 43210" },
                        ].map(f => (
                          <Field key={f.label} label={f.label} value={f.value} onChange={f.set} type={f.type} placeholder={f.ph} />
                        ))}

                        <div style={{ marginBottom: "32px" }}>
                          <label style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "14px" }}>
                            Number of Seats
                          </label>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => setQty(q => Math.max(1, q - 1))}
                              disabled={qty <= 1}
                              style={{
                                width: "44px", height: "44px", background: "transparent",
                                border: "1px solid rgba(0,0,0,0.18)", cursor: qty <= 1 ? "default" : "pointer",
                                fontSize: "18px", color: qty <= 1 ? "rgba(0,0,0,0.2)" : "#1a1a1a",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "var(--font-body)", transition: "border-color 0.2s",
                              }}
                            >−</button>
                            <div style={{
                              width: "64px", height: "44px",
                              borderTop: "1px solid rgba(0,0,0,0.18)", borderBottom: "1px solid rgba(0,0,0,0.18)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontFamily: "var(--font-heading)", fontSize: "20px", color: "#1a1a1a", fontWeight: 400,
                            }}>
                              {qty}
                            </div>
                            <button
                              type="button"
                              onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                              disabled={qty >= maxQty}
                              style={{
                                width: "44px", height: "44px", background: "transparent",
                                border: "1px solid rgba(0,0,0,0.18)", cursor: qty >= maxQty ? "default" : "pointer",
                                fontSize: "18px", color: qty >= maxQty ? "rgba(0,0,0,0.2)" : "#1a1a1a",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "var(--font-body)", transition: "border-color 0.2s",
                              }}
                            >+</button>
                          </div>
                        </div>

                        {/* Meal preferences */}
                        <div style={{ marginBottom: "32px" }}>
                          <label style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "14px" }}>
                            Meal Preference{qty > 1 ? "s" : ""}
                          </label>
                          {Array.from({ length: qty }, (_, i) => (
                            <div key={i} style={{ marginBottom: i < qty - 1 ? "14px" : 0 }}>
                              {qty > 1 && (
                                <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.45)", letterSpacing: "0.08em", marginBottom: "8px" }}>
                                  Guest {i + 1}
                                </p>
                              )}
                              <div style={{ display: "flex", gap: "8px" }}>
                                {[
                                  { key: "veg",     label: "Vegetarian",     activeColor: "#166534", activeBg: "#dcfce7", borderColor: "#bbf7d0" },
                                  { key: "non-veg", label: "Non-Vegetarian", activeColor: "#7f1d1d", activeBg: "#fee2e2", borderColor: "#fca5a5" },
                                ].map(opt => {
                                  const active = meals[i] === opt.key;
                                  return (
                                    <button
                                      key={opt.key}
                                      type="button"
                                      onClick={() => setMeals(prev => {
                                        const next = [...prev];
                                        next[i] = opt.key;
                                        return next;
                                      })}
                                      style={{
                                        padding: "8px 16px",
                                        border: `1px solid ${active ? opt.borderColor : "rgba(0,0,0,0.18)"}`,
                                        background: active ? opt.activeBg : "transparent",
                                        color: active ? opt.activeColor : "rgba(0,0,0,0.45)",
                                        fontFamily: "var(--font-body)",
                                        fontSize: "11px",
                                        letterSpacing: "0.08em",
                                        cursor: "pointer",
                                        transition: "all 0.18s",
                                        fontWeight: active ? 600 : 400,
                                      }}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Coupon code */}
                        <div style={{ marginBottom: "24px" }}>
                          <label style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "10px" }}>
                            Coupon Code (optional)
                          </label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <input
                              type="text"
                              value={coupon}
                              onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponStatus(null); setDiscount(0); }}
                              placeholder="ENTER CODE"
                              style={{ flex: 1, border: "1px solid rgba(0,0,0,0.15)", padding: "10px 14px", fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.1em", color: "#1a1a1a", outline: "none", background: "transparent" }}
                            />
                          </div>
                          {couponStatus && (
                            <p style={{ fontSize: "11px", marginTop: "6px", color: couponStatus.valid ? "#166534" : "#901A1C", fontFamily: "var(--font-body)" }}>
                              {couponStatus.msg}
                            </p>
                          )}
                        </div>

                        <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", borderBottom: "1px solid rgba(0,0,0,0.1)", padding: "18px 0", marginBottom: "28px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", margin: "0 0 4px" }}>Subtotal</p>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.4)", margin: 0 }}>
                                {qty} seat{qty > 1 ? "s" : ""} × ₹6,500
                              </p>
                            </div>
                            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "22px", color: "#1a1a1a", margin: 0 }}>
                              ₹{total.toLocaleString("en-IN")}
                            </p>
                          </div>
                          {discount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#166534", margin: 0 }}>
                                Coupon discount
                              </p>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#166534", fontWeight: 600, margin: 0 }}>
                                − ₹{(discount / 100).toLocaleString("en-IN")}
                              </p>
                            </div>
                          )}
                          {discount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed rgba(0,0,0,0.1)" }}>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", margin: 0 }}>Total Payable</p>
                              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(20px, 2.5vw, 26px)", color: "#901A1C", margin: 0 }}>
                                ₹{((total * 100 - discount) / 100).toLocaleString("en-IN")}
                              </p>
                            </div>
                          )}
                        </div>

                        {error && (
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#901A1C", lineHeight: 1.7, marginBottom: "16px" }}>
                            {error}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={loading || flow === "paying"}
                          style={{
                            background: loading || flow === "paying" ? "rgba(144,26,28,0.45)" : "#901A1C",
                            color: "#ffffff", width: "100%", padding: "18px",
                            fontFamily: "var(--font-body)", fontSize: "10px",
                            letterSpacing: "0.24em", textTransform: "uppercase",
                            border: "none", cursor: loading || flow === "paying" ? "default" : "pointer",
                            transition: "background 0.25s",
                          }}
                          onMouseEnter={e => { if (!loading && flow !== "paying") e.currentTarget.style.background = "#7a1517"; }}
                          onMouseLeave={e => { if (!loading && flow !== "paying") e.currentTarget.style.background = "#901A1C"; }}
                        >
                          {loading ? "Creating order…" : flow === "paying" ? "Complete payment in popup…" : "Continue to Payment →"}
                        </button>

                        <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.28)", marginTop: "16px", textAlign: "center", lineHeight: 1.7 }}>
                          Secure payment via Razorpay · UPI · Cards · Net Banking
                        </p>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

      </main>
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
    <div style={{ marginBottom: "28px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "10px" }}>
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
          padding: "10px 0", fontFamily: "var(--font-body)", fontSize: "15px",
          color: "#1a1a1a", outline: "none", transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
