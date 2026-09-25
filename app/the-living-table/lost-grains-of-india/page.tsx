"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoplayVideo from "@/components/AutoplayVideo";
import { EDITIONS } from "@/lib/editions";

/* Single source of truth for price / venue / date / programme. */
const ED = EDITIONS["lost-grains-of-india"];
const EDITION_SLUG = ED.slug;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";
const INSTAGRAM = "https://www.instagram.com/inkpotindia_/";
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(ED.mapQuery)}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ED.mapQuery)}`;

type Flow = "browse" | "form" | "paying" | "confirmed";

interface TicketInfo {
  ticketId: string;
  ticketNumber: number;
  buyerName: string;
  buyerEmail: string;
  qty: number;
}

const TERMS = [
  { title: "All Sales Are Final", body: "Tickets are non-refundable. Once your booking is confirmed, no cancellations or exchanges are permitted under any circumstances." },
  { title: "Non-Transferable", body: "Tickets are issued in the buyer's name and cannot be transferred to another person or resold." },
  { title: "Age Restriction — 18 and Above", body: "This is a strictly adults-only event. A valid government-issued photo ID is required at entry. Entry will be refused without it." },
  { title: "No Children or Pets", body: "Guests under 18 years of age and pets are not permitted at the venue." },
  { title: "Right to Refuse Entry", body: "Inkpot India reserves the right to refuse entry to any guest who appears intoxicated, disruptive, or unable to produce valid identification." },
  { title: "Event Changes", body: "In the unlikely event of a cancellation or significant change by the organiser, registered guests will be notified via the email address provided at booking." },
];

/* ── Things to know — venue-specific details still TBC are omitted rather than guessed ── */
const KNOW: { icon: ReactNode; label: string }[] = [
  { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>, label: "Duration approx. 3 hours" },
  { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 12h20M2 12a2 2 0 0 0 2-2V7h16v3a2 2 0 0 0 2 2M2 12a2 2 0 0 1 2 2v3h16v-3a2 2 0 0 1 2-2" /><line x1="12" y1="7" x2="12" y2="17" /></svg>, label: "Minimum age 18+" },
  { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>, label: "Sit-down, five-course dinner" },
  { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M9 22V12h6v10" /></svg>, label: "Indoor seating" },
  { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 22h8M12 11v11M5 8l1.5 6h11L19 8" /><path d="M5 8h14M9 8V4h6v4" /></svg>, label: "Two cocktail pairings and an open bar" },
  { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 22h8M12 11v11M5 8l1.5 6h11L19 8" /><path d="M5 8h14M9 8V4h6v4" /></svg>, label: "In Association with Dewar’s Experiences" },
  { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="12" cy="7" r="3.5" /><path d="M5 21c0-3.5 3.1-6 7-6s7 2.5 7 6" /><line x1="4" y1="4" x2="20" y2="20" /></svg>, label: "Kids not allowed" },
  { icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><ellipse cx="12" cy="16" rx="5" ry="4" /><circle cx="7.5" cy="9.5" r="1.5" /><circle cx="16.5" cy="9.5" r="1.5" /><line x1="4" y1="4" x2="20" y2="20" /></svg>, label: "Pets not allowed" },
];

/* ── The printed menu (TLT_Chapter_2/TLT 2 MENU (1).png), transcribed.
      Print typos corrected: "banyard" → "barnyard", "naturallysweetened" → "naturally sweetened". ── */
const MENU_DISHES: { name: string; body: string }[] = [
  { name: "Spiced Kashifal & Maize Cold Soup", body: "Chilled pumpkin and sweet maize soup, delicately scented with fresh celery and locally sourced nutmeg." },
  { name: "Watermelon, Young Peas & Amaranth", body: "Macerated watermelon, cucumber ribbons and young peas, with toasted amaranth, basil oil and a delicate lime blossom dressing." },
  { name: "Ragi Roti with BBQ Cauliflower & Hemp Chutney", body: "An earthy ragi roti layered with green pea mash, BBQ cauliflower, hemp chutney, shredded cabbage, lemon onion and mint ranch." },
  { name: "Calangute Millet Caldin with Roasted Vegetables", body: "A preparation of warm barnyard millet and roasted vegetables, paired with a delicate Goan-inspired caldin, lentil patty and aromatic peepli pepper." },
  { name: "Ragi Chocolate Cake, Seasonal Strawberry & Coconut", body: "Ragi chocolate sponge layered with dark chocolate ganache and seasonal strawberry compote, finished with coconut whipped cream." },
  { name: "Seabuckthorn Berry Bloom", body: "A vibrant iced tea of Ladakhi seabuckthorn, raspberry, passion fruit and green tea, naturally sweetened with jaggery." },
];

const MENU_PAIRINGS: { course: string; name: string; notes: string[] }[] = [
  { course: "Welcome",       name: "Dewar’s 12 — The Golden Highball", notes: ["Dewar’s 12", "Darjeeling Tea", "Peach", "Bajra", "Soda"] },
  { course: "Second Course", name: "Dewar’s 15 — Grain & Garden",      notes: ["Dewar’s 15", "Toasted Barley Honey", "Apricot", "Lemon"] },
  { course: "Fourth Course", name: "Dewar’s 18 — The Final Chapter",   notes: ["Dewar’s 18", "Coffee Liqueur", "Dark Chocolate", "Toasted Gobindbhog Rice", "Demerara", "Bitters"] },
];

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

function Fade({ children, delay = 0, y = 26, amount = 0.2, style }: { children: ReactNode; delay?: number; y?: number; amount?: number; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function LostGrainsPage() {
  const [flow, setFlow]           = useState<Flow>("browse");
  const [available, setAvailable] = useState<number | null>(null);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [qty, setQty]             = useState(1);
  const [coupon, setCoupon]       = useState("");
  const [discount, setDiscount]   = useState(0);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [ticket, setTicket]       = useState<TicketInfo | null>(null);
  const [qr, setQr]               = useState("");
  const [showModal, setShowModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpen, setTermsOpen]         = useState(false);
  const formRef    = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const termsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/tickets/count?edition=${EDITION_SLUG}`)
      .then(r => r.json())
      .then(d => setAvailable(d.available))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!ticket) return;
    import("qrcode").then(QRCode =>
      QRCode.toDataURL(`${SITE_URL}/ticket/${ticket.ticketId}`, {
        width: 220, margin: 2,
        color: { dark: "#111111", light: "#F4EFE6" },
      }).then(setQr).catch(() => {})
    );
  }, [ticket]);

  const scrollToForm = () => {
    setFlow("form");
    requestAnimationFrame(() => {
      const target = window.innerWidth < 769 ? bookingRef.current : formRef.current;
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tickets/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edition: EDITION_SLUG,
          name, email, phone, qty,
          coupon_code: coupon.trim() || undefined,
          terms_accepted: termsAccepted,
        }),
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
        requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
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
        description: `The Living Table — Lost Grains of India (${qty} seat${qty > 1 ? "s" : ""})`,
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
            }),
          });
          const vd = await vr.json();
          if (!vr.ok) { setError(vd.error); setFlow("form"); return; }
          setTicket({ ...vd.ticket, qty });
          setAvailable(p => (p !== null ? Math.max(0, p - qty) : p));
          setFlow("confirmed");
          requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
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

  const maxQty = available !== null ? Math.max(1, Math.min(ED.maxPerEmail, available)) : ED.maxPerEmail;
  const total  = qty * ED.priceRupees;
  const soldOut = ED.soldOut || available === 0;

  return (
    <>
      <Navbar />
      <main style={{ background: "#F4EFE6", overflowX: "hidden" }}>
        <style>{`
          .lg-experience  { display: grid; grid-template-columns: 1fr 1fr; background: #ffffff; min-height: clamp(380px, 48vw, 600px); }
          .lg-evening     { display: grid; grid-template-columns: 1fr 1fr; background: #ffffff; }
          .lg-know-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 0 clamp(32px, 6vw, 80px); max-width: 680px; }
          .lg-venue-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 3vw, 44px); align-items: stretch; }
          .lg-map         { width: 100%; height: 100%; min-height: 300px; border: 0; display: block; filter: grayscale(0.25) contrast(1.02); }
          .lg-prev        { display: grid; grid-template-columns: 1fr 1fr; }
          .lg-menu-grid   { display: flex; flex-direction: column; gap: clamp(32px, 4vw, 52px); max-width: 1120px; margin: 0 auto; }
          .lg-menu-dishes { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 3.4vw, 46px) clamp(40px, 6vw, 96px); }
          .lg-menu-div    { display: none; }
          .lg-menu-pairs  { display: grid; grid-template-columns: repeat(3, 1fr); }
          .lg-pair        { padding: 4px clamp(16px, 2.4vw, 36px); }
          .lg-pair + .lg-pair { border-left: 1px solid rgba(138,70,50,0.22); }
          @media (max-width: 900px) {
            .lg-experience, .lg-evening, .lg-venue-grid, .lg-prev { grid-template-columns: 1fr !important; }
            .lg-menu-dishes { grid-template-columns: 1fr; gap: 0; }
            .lg-menu-div    { display: block; }
            .lg-menu-pairs  { grid-template-columns: 1fr; }
            .lg-pair        { padding: clamp(16px, 2vw, 22px) 0; }
            .lg-pair + .lg-pair { border-left: none; border-top: 1px solid rgba(138,70,50,0.22); }
            .lg-know-grid { grid-template-columns: 1fr !important; }
            .lg-map { min-height: 260px; }
          }
          @media (max-width: 768px) {
            .lg-hero { min-height: 560px !important; }
          }
        `}</style>

        {/* ── 1. HERO ── */}
        <section className="lg-hero" style={{ position: "relative", height: "100dvh", minHeight: "560px", overflow: "hidden", display: "flex" }}>
          <AutoplayVideo
            poster="/images/thelivingtable/TLT_Chapter_2/hero_poster_potrait.jpeg"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          >
            <source src="/images/thelivingtable/TLT_Chapter_2/hero_video_landscpae.mp4" type="video/mp4" />
            <track kind="captions" src="/empty.vtt" srcLang="en" label="No dialogue" />
          </AutoplayVideo>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,6,0.22) 0%, rgba(10,8,6,0.52) 55%, rgba(10,8,6,0.94) 100%)" }} />

          <a
            href="/the-living-table"
            style={{
              position: "absolute", zIndex: 3,
              top: "clamp(78px, 9vw, 112px)", left: "clamp(18px, 5vw, 44px)",
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "var(--font-body)", fontSize: "10px",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(244,239,230,0.7)", textDecoration: "none", transition: "color 0.25s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(244,239,230,0.7)")}
          >
            <span style={{ fontSize: "13px", lineHeight: 1 }}>←</span> The Living Table
          </a>

          <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(88px, 12vh, 112px) 24px clamp(36px, 6vh, 60px)" }}>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.3 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(9px, 2.4vw, 11px)", letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(244,239,230,0.7)", margin: "0 0 10px" }}
            >
              Inkpot India Presents · Chapter Two
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5 }}
              style={{ marginBottom: "6px" }}
            >
              <Image
                src="/images/thelivingtable/logo_the_right_one_1.svg"
                alt="The Living Table"
                width={280} height={280}
                style={{ width: "clamp(132px, 34vw, 230px)", height: "auto", filter: "brightness(0) invert(1)", opacity: 0.94 }}
                priority
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.0 }}
              style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px, 4.2vw, 34px)", color: "#F4EFE6", letterSpacing: "0.01em", margin: "0 0 8px" }}
            >
              <span className="sr-only">The Living Table, Chapter Two — </span>
              Lost Grains of India
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.15 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(10px, 2.4vw, 12px)", color: "rgba(244,239,230,0.62)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 18px" }}
            >
              {ED.dayLabel}, {ED.dateLabel}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
            >
              {soldOut ? (
                <div style={{ background: "#901A1C", color: "#ffffff", padding: "14px 52px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", boxShadow: "0 0 32px rgba(144,26,28,0.55)" }}>
                  Sold Out
                </div>
              ) : (
                <>
                  <button
                    onClick={scrollToForm}
                    style={{ background: "#901A1C", color: "#ffffff", padding: "15px 46px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "background 0.25s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#7a1517")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#901A1C")}
                  >
                    Reserve Your Seat
                  </button>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12px, 2.8vw, 14px)", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    Greenr Café, GK 1
                  </span>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.5 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", marginTop: "clamp(16px, 3vh, 26px)" }}
            >
              <span style={{ fontFamily: "var(--font-body)", fontSize: "7.5px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(244,239,230,0.45)" }}>
                In Association with
              </span>
              <Image
                src="/images/thelivingtable/TLT_Chapter_2/Dewars_Xperiences_Logo_White_Transparent.png"
                alt="Dewar’s Experiences"
                width={160} height={160}
                style={{ width: "clamp(54px, 12vw, 74px)", height: "auto", opacity: 0.9 }}
              />
            </motion.div>
          </div>
        </section>

        {/* ── 2. THE EVENING (editorial) + BOOKING FORM ── */}
        <section ref={formRef} className="lg-experience">
          <motion.div
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1 }}
            style={{ padding: "clamp(44px, 6vw, 80px) clamp(24px, 5vw, 72px)", display: "flex", flexDirection: "column", justifyContent: "center", background: "#ffffff" }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 26px" }}>
              THE LIVING TABLE : LOST GRAINS OF INDIA
            </p>
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(21px, 3vw, 34px)", color: "#1a1a1a", lineHeight: 1.32, margin: "0 0 24px" }}>
              A conversation on India’s food history, fusion music, a little mystery, and a table where the past finds a new expression.
            </p>
            <div style={{ width: "40px", height: "1px", background: "rgba(0,0,0,0.15)", margin: "0 0 24px" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)", color: "rgba(0,0,0,0.55)", lineHeight: 1.95, margin: 0 }}>
              Join us for a sit-down dinner alongside the journey of India’s forgotten grains — from Ragi, Millets and Amaranth - the grains that once shaped how we cultivated, cooked and lived. Ancient Indian grains meet a contemporary five-course dinner, with Greenr Café’s global, grain-infused approach bringing these ingredients into unexpected forms and flavours.
            </p>
          </motion.div>

          {/* Booking form */}
          <div ref={bookingRef} style={{ background: "#F4EFE6", padding: "clamp(28px, 3vw, 48px) clamp(28px, 4vw, 60px)", display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "480px" }}>
              <AnimatePresence mode="wait">
                {flow === "confirmed" && ticket ? (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
                    style={{ textAlign: "center", paddingTop: "24px" }}
                  >
                    <div style={{ width: "56px", height: "56px", border: "1px solid rgba(144,26,28,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#901A1C" strokeWidth="1.8" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#901A1C", marginBottom: "14px" }}>Booking Confirmed</p>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px, 4vw, 40px)", color: "#1a1a1a", marginBottom: "10px", lineHeight: 1.1 }}>
                      Your seat is reserved.
                    </h2>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(0,0,0,0.45)", lineHeight: 1.9, marginBottom: "28px" }}>
                      {ticket.qty} seat{ticket.qty > 1 ? "s" : ""} &middot; {ticket.buyerName}
                      <br />Confirmation + QR sent to {ticket.buyerEmail}
                    </p>
                    {qr ? (
                      <div style={{ display: "inline-block", background: "#ffffff", padding: "22px", marginBottom: "20px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
                        <img src={qr} alt="Your entry QR code" width={170} height={170} style={{ display: "block" }} />
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginTop: "12px" }}>Present at entry</p>
                      </div>
                    ) : (
                      <div style={{ width: "170px", height: "170px", background: "rgba(0,0,0,0.05)", margin: "0 auto 20px" }} />
                    )}
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(0,0,0,0.35)", lineHeight: 1.8 }}>
                      {ED.venueName}<br />{ED.venueAddressLines.join(", ")}
                    </p>
                    <a
                      href={`/ticket/${ticket.ticketId}`}
                      style={{ display: "inline-block", marginTop: "16px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(0,0,0,0.15)", paddingBottom: "2px", textDecoration: "none" }}
                    >
                      Open ticket page →
                    </a>
                  </motion.div>
                ) : (
                  <motion.div
                    key="book"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
                  >
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#901A1C", marginBottom: "8px" }}>
                      Reserve Your Seats
                    </p>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(24px, 2.8vw, 34px)", lineHeight: 1.05, color: "#1a1a1a", marginBottom: "26px" }}>
                      Join us at the table.
                    </h2>

                    {soldOut ? (
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#901A1C", color: "#ffffff", padding: "10px 20px", marginBottom: "24px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff", flexShrink: 0, display: "inline-block" }} />
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}>Sold Out</span>
                        </div>
                        <a
                          href={INSTAGRAM}
                          target="_blank" rel="noopener noreferrer"
                          style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", color: "#901A1C", textDecoration: "none", letterSpacing: "0.06em", borderBottom: "1px solid rgba(144,26,28,0.25)", paddingBottom: "2px" }}
                        >
                          Follow @inkpotindia_ for future events →
                        </a>
                      </div>
                    ) : (
                      <div>
                        {/* Seats stepper */}
                        <div style={{ marginBottom: "24px" }}>
                          <label style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.58)", display: "block", marginBottom: "12px" }}>
                            Number of Seats
                          </label>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} style={{ width: "36px", height: "36px", background: "transparent", border: "1px solid rgba(0,0,0,0.18)", cursor: qty <= 1 ? "default" : "pointer", fontSize: "18px", color: qty <= 1 ? "rgba(0,0,0,0.2)" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)" }}>−</button>
                            <div style={{ width: "52px", height: "36px", borderTop: "1px solid rgba(0,0,0,0.18)", borderBottom: "1px solid rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: "20px", color: "#1a1a1a" }}>{qty}</div>
                            <button type="button" onClick={() => setQty(q => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} style={{ width: "36px", height: "36px", background: "transparent", border: "1px solid rgba(0,0,0,0.18)", cursor: qty >= maxQty ? "default" : "pointer", fontSize: "18px", color: qty >= maxQty ? "rgba(0,0,0,0.2)" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)" }}>+</button>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", padding: "16px 0", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.4)", margin: 0 }}>{qty} seat{qty > 1 ? "s" : ""} × ₹{ED.priceRupees.toLocaleString("en-IN")}</p>
                          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "22px", color: "#1a1a1a", margin: 0 }}>₹{total.toLocaleString("en-IN")}</p>
                        </div>

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
          <div className="lg-know-grid">
            {KNOW.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "11px", alignItems: "center", padding: "13px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.38)" }}>
                <div style={{ flexShrink: 0 }}>{item.icon}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12px, 1.1vw, 13px)", color: "rgba(0,0,0,0.58)", margin: 0, lineHeight: 1.45 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. THE PROGRAMME + EVENT DETAILS ── */}
        <section className="lg-evening">
          {/* The Evening */}
          <div style={{ background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(28px, 4vw, 48px) clamp(20px, 3.5vw, 44px)" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "440px", background: "#ffffff", padding: "clamp(28px, 3.2vw, 42px) clamp(24px, 3vw, 38px)", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #901A1C 30%, #901A1C 70%, transparent)" }} />
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(9px, 1vw, 10px)", letterSpacing: "0.32em", textTransform: "uppercase", color: "#901A1C", textAlign: "center", margin: "0 0 12px" }}>
                THE EVENING
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.55)", textAlign: "center", margin: "0 0 2px", letterSpacing: "0.04em" }}>
                6:30 PM onwards · 26 September
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.55)", textAlign: "center", margin: "0 0 26px", letterSpacing: "0.04em" }}>
                Greenr Café, GK 1
              </p>
              {ED.programme.map((item, i) => (
                <div key={item.title} style={{ padding: "clamp(13px, 1.5vw, 17px) 0", borderBottom: i < ED.programme.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(15px, 1.6vw, 19px)", color: "#1a1a1a", lineHeight: 1.3, margin: "0 0 6px" }}>{item.title}</p>
                  {item.body && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12px, 1.15vw, 13px)", color: "rgba(0,0,0,0.55)", lineHeight: 1.75, margin: 0 }}>{item.body}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Event details card */}
          <div style={{ position: "relative", background: "#F4EFE6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(36px, 4vw, 60px) clamp(32px, 5vw, 64px)" }}>
            <div style={{ width: "100%", maxWidth: "360px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 24px rgba(0,0,0,0.06)", padding: "clamp(28px, 3.5vw, 44px) clamp(24px, 3vw, 36px)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.32em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 6px" }}>
                The Living Table
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "16px", color: "#1a1a1a", margin: "0 0 24px" }}>
                Lost Grains of India
              </p>
              {[
                { label: ED.dateLabel, sub: ED.dayLabel },
                { label: ED.timeLabel, sub: "" },
                { label: ED.venueName, sub: ED.venueAddressLines.join("\n") },
                { label: `₹${ED.priceRupees.toLocaleString("en-IN")} per seat`, sub: "Dinner included" },
                { label: "In Association with Dewar’s Experiences", sub: "" },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", paddingBottom: i < arr.length - 1 ? "16px" : 0, marginBottom: i < arr.length - 1 ? "16px" : 0, borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
                  <div style={{ marginTop: "4px", flexShrink: 0, width: "6px", height: "6px", borderRadius: "50%", background: "rgba(144,26,28,0.5)" }} />
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#1a1a1a", margin: "0 0 3px", letterSpacing: "0.02em" }}>{item.label}</p>
                    {item.sub && item.sub.split("\n").map((line, j) => (
                      <p key={j} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(0,0,0,0.6)", margin: "1px 0 0", lineHeight: 1.6 }}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4.5 THE MENU ── */}
        <section id="menu" style={{ background: "#5E6636", padding: "clamp(56px, 5.5vw, 76px) clamp(20px, 6vw, 110px)" }}>
          <Fade style={{ textAlign: "center", marginBottom: "clamp(34px, 3.6vw, 48px)" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(244,239,230,0.75)", margin: "0 0 16px" }}>
              The Menu
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(24px, 3.4vw, 40px)", letterSpacing: "0.02em", color: "#F4EFE6", lineHeight: 1.2, margin: "0 0 12px" }}>
              Lost Grains of India
            </h2>
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(14px, 1.5vw, 17px)", color: "#EBD9AE", margin: 0 }}>
              Through forgotten grains and familiar rituals
            </p>
          </Fade>

          <div className="lg-menu-grid">
            {/* Dishes */}
            <ul className="lg-menu-dishes" style={{ listStyle: "none", margin: 0, padding: 0, textAlign: "center" }}>
              {MENU_DISHES.map((dish, i) => (
                <li key={dish.name}>
                  <Fade y={18} amount={0.3}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(18px, 2vw, 23px)", color: "#ffffff", lineHeight: 1.3, margin: "0 0 10px" }}>
                      {dish.name}
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12.5px, 1.2vw, 14px)", color: "#EBD9AE", lineHeight: 1.75, margin: "0 auto", maxWidth: "520px" }}>
                      {dish.body}
                    </p>
                  </Fade>
                  {i < MENU_DISHES.length - 1 && (
                    <div aria-hidden="true" className="lg-menu-div" style={{ width: "36px", height: "1px", background: "rgba(235,217,174,0.55)", margin: "clamp(20px, 2.6vw, 30px) auto" }} />
                  )}
                </li>
              ))}
            </ul>

            {/* Dewar's pairings */}
            <Fade style={{ background: "#EFE4CB", padding: "clamp(28px, 3.4vw, 44px) clamp(22px, 2.8vw, 36px)", boxShadow: "0 10px 40px rgba(0,0,0,0.22)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: "#8A4632", textAlign: "center", margin: "0 0 6px" }}>
                In Association with
              </p>
              <h3 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px, 2.2vw, 26px)", color: "#3a2a20", textAlign: "center", lineHeight: 1.2, margin: "0 0 clamp(18px, 2.2vw, 26px)" }}>
                Dewar’s Experiences
              </h3>
              <div className="lg-menu-pairs" style={{ borderTop: "1px solid rgba(138,70,50,0.22)", paddingTop: "clamp(12px, 1.6vw, 22px)" }}>
                {MENU_PAIRINGS.map(p => (
                  <div key={p.course} className="lg-pair" style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8A4632", margin: "0 0 8px" }}>
                      {p.course}
                    </p>
                    <p style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(15px, 1.6vw, 18px)", color: "#2b2019", lineHeight: 1.35, margin: "0 0 6px" }}>
                      {p.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(13px, 1.3vw, 15px)", color: "rgba(43,32,25,0.72)", lineHeight: 1.6, margin: 0 }}>
                      {p.notes.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
        </section>

        {/* ── 5. VENUE & MAP ── */}
        <section style={{ background: "#F4EFE6", padding: "clamp(56px, 8vw, 110px) clamp(24px, 6vw, 110px)" }}>
          <Fade style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 16px" }}>
              Venue
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3.4vw, 40px)", color: "#1a1a1a", lineHeight: 1.2, margin: 0 }}>
              {ED.venueName}
            </h2>
          </Fade>
          <div className="lg-venue-grid">
            <Fade style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", padding: "clamp(28px, 4vw, 48px)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)", color: "#1a1a1a", lineHeight: 1.9, margin: "0 0 8px", fontWeight: 500 }}>
                {ED.venueName}
              </p>
              {ED.venueAddressLines.map((line, i) => (
                <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12px, 1.2vw, 14px)", color: "rgba(0,0,0,0.55)", lineHeight: 1.8, margin: 0 }}>{line}</p>
              ))}
              <a
                href={MAP_LINK}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "22px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#901A1C", textDecoration: "none", borderBottom: "1px solid rgba(144,26,28,0.3)", paddingBottom: "3px", alignSelf: "flex-start" }}
              >
                Get directions →
              </a>
            </Fade>
            <Fade style={{ minHeight: "300px", background: "#e8e2d6", border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <iframe
                title={`Map to ${ED.venueName}`}
                className="lg-map"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </Fade>
          </div>
        </section>

        {/* ── 6. PREVIOUS EDITION ── */}
        <section className="lg-prev" style={{ background: "#ffffff" }}>
          <div style={{ position: "relative", minHeight: "clamp(210px, 27vw, 340px)", overflow: "hidden" }}>
            <Image src="/images/thelivingtable/TLT-05.jpg" alt="The inaugural Living Table at Kathika Cultural Centre" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center" }} loading="lazy" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(34px, 4vw, 56px) clamp(26px, 4.5vw, 64px)", background: "#F4EFE6" }}>
            <Fade>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 16px" }}>
                Previous Edition
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3vw, 36px)", color: "#1a1a1a", lineHeight: 1.15, margin: "0 0 10px" }}>
                The Inaugural Edition
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", margin: "0 0 18px" }}>
                28 June 2026 · Kathika Cultural Centre, Old Delhi
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12.5px, 1.25vw, 14px)", color: "rgba(0,0,0,0.55)", lineHeight: 1.85, margin: "0 0 22px", maxWidth: "440px" }}>
                Our first table traced butter chicken from Peshawar to Delhi, with the Gujral family, Sadaf Husain and Salma Husain — an evening of food, memory and migration inside a restored haveli.
              </p>
              <a
                href="/the-living-table/archive/june-2026"
                style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#901A1C", textDecoration: "none", borderBottom: "1px solid rgba(144,26,28,0.3)", paddingBottom: "3px", alignSelf: "flex-start" }}
              >
                View Previous Event →
              </a>
            </Fade>
          </div>
        </section>

        {/* ── 7. TERMS & CONDITIONS ── */}
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
                  {TERMS.map((item, i, arr) => (
                    <div key={i} style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", margin: "0 0 5px" }}>{item.title}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.5)", lineHeight: 1.85, margin: 0 }}>{item.body}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
              style={{ background: "#ffffff", width: "100%", maxWidth: "440px", padding: "clamp(32px, 4vw, 48px)", position: "relative", borderTop: "3px solid #901A1C", maxHeight: "90vh", overflowY: "auto" }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "16px", right: "20px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "rgba(0,0,0,0.28)", lineHeight: 1 }}>×</button>

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
                    onChange={e => { setCoupon(e.target.value.toUpperCase()); setDiscount(0); }}
                    placeholder="ENTER CODE"
                    style={{ width: "100%", border: "none", borderBottom: "1px solid rgba(0,0,0,0.18)", padding: "10px 0", fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.1em", color: "#1a1a1a", outline: "none", background: "transparent", boxSizing: "border-box" }}
                  />
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
                    id="lg-terms"
                    required
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    style={{ marginTop: "3px", flexShrink: 0, accentColor: "#901A1C", cursor: "pointer", width: "14px", height: "14px" }}
                  />
                  <label htmlFor="lg-terms" style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(0,0,0,0.5)", lineHeight: 1.75, cursor: "pointer" }}>
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => { setShowModal(false); setTimeout(() => { termsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); setTermsOpen(true); }, 280); }}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#901A1C", fontFamily: "var(--font-body)", fontSize: "11px", textDecoration: "underline" }}
                    >
                      Terms &amp; Conditions
                    </button>
                    . Tickets are non-refundable, non-cancellable, and non-transferable.
                  </label>
                </div>

                {error && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#901A1C", lineHeight: 1.7, marginBottom: "16px" }}>{error}</p>
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
  label: string; value: string; onChange: (v: string) => void; type: string; placeholder: string;
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
        style={{ display: "block", width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${focused ? "#901A1C" : "rgba(0,0,0,0.18)"}`, padding: "7px 0", fontFamily: "var(--font-body)", fontSize: "14px", color: "#1a1a1a", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
      />
    </div>
  );
}
