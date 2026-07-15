"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Flags — flip live without a redesign ── */
const PRESS_ENABLED = false; // set true once real coverage exists

const INSTAGRAM = "https://www.instagram.com/inkpotindia_/";

/* ── The three About pillars ── */
const PILLARS = [
  {
    num: "I",
    title: "Stories that Preserve Heritage",
    body: "Narratives that reconnect us with the places, people and traditions that define our cultural identity.",
    img: "/images/thelivingtable/TLT-12.jpg",
    alt: "A storyteller at The Living Table",
    mod: "1",
  },
  {
    num: "II",
    title: "Cuisine with a Sense of Place",
    body: "Menus crafted by acclaimed chefs, inspired by history and rooted in regional flavours.",
    img: "/images/thelivingtable/TLT-17.jpg",
    alt: "A plated dish from the evening",
    mod: "2",
  },
  {
    num: "III",
    title: "Spaces with Soul",
    body: "Extraordinary venues that provide an authentic setting for meaningful conversations and shared experiences.",
    img: "/images/thelivingtable/DSC_0066.JPG",
    alt: "The candlelit haveli interior at Kathika Cultural Centre",
    mod: "3",
  },
];

/* ── Moments — hand-curated stills from the inaugural evening ── */
const GALLERY = "/images/thelivingtable/gallery%20images";
const MOMENTS = [
  { src: `${GALLERY}/TLT-03.jpg`,   alt: "A moment from the inaugural Living Table", caption: "A moment from the inaugural Living Table" },
  { src: `${GALLERY}/DSC_0074.JPG`, alt: "Guests gathered at The Living Table",      caption: "" },
  { src: `${GALLERY}/TLT-04.jpg`,   alt: "The table set for the evening",             caption: "The table set for the evening" },
  { src: `${GALLERY}/DSC_0429.JPG`, alt: "Conversation over dinner",                  caption: "" },
  { src: `${GALLERY}/TLT-11.jpg`,   alt: "A dish served at The Living Table",         caption: "A dish served at The Living Table" },
  { src: `${GALLERY}/DSC_0444.JPG`, alt: "The haveli, lit for the evening",           caption: "The haveli, lit for the evening" },
  { src: `${GALLERY}/TLT-13.jpg`,   alt: "Guests in conversation",                    caption: "Guests in conversation" },
  { src: `${GALLERY}/DSC_0447.JPG`, alt: "A moment from the inaugural Living Table",  caption: "A moment from the inaugural Living Table" },
  { src: `${GALLERY}/TLT-15.jpg`,   alt: "Stories shared at the table",               caption: "Stories shared at the table" },
  { src: `${GALLERY}/DSC_0499.JPG`, alt: "The evening at Kathika Cultural Centre",    caption: "The evening at Kathika Cultural Centre" },
  { src: `${GALLERY}/DSC_0558.JPG`, alt: "Guests at The Living Table",                caption: "" },
  { src: `${GALLERY}/DSC_0571.JPG`, alt: "A course from the menu",                    caption: "" },
  { src: `${GALLERY}/DSC_0650.JPG`, alt: "The table during dinner",                   caption: "The table during dinner" },
  { src: `${GALLERY}/DSC_0667.JPG`, alt: "A closing moment from the evening",         caption: "A closing moment from the evening" },
];

/* ── Press clippings — placeholders behind PRESS_ENABLED ── */
const CLIPPINGS = [
  { img: "/images/thelivingtable/45.png", pub: "[PUBLICATION]", date: "[DATE]", headline: "[Headline of the press piece goes here]", pull: "[One-line pull quote from the coverage.]" },
  { img: "/images/thelivingtable/47.png", pub: "[PUBLICATION]", date: "[DATE]", headline: "[Headline of the press piece goes here]", pull: "[One-line pull quote from the coverage.]" },
  { img: "/images/thelivingtable/Thelivingtable_1.png", pub: "[PUBLICATION]", date: "[DATE]", headline: "[Headline of the press piece goes here]", pull: "[One-line pull quote from the coverage.]" },
];

/* ── Fade-up on scroll, respects prefers-reduced-motion ── */
function Fade({ children, delay = 0, y = 28, amount = 0.2, style }: { children: ReactNode; delay?: number; y?: number; amount?: number; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.85, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Moments: masonry on desktop, swipe carousel on mobile ── */
function MomentsGrid() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return <MomentsCarousel />;

  return (
    <div className="tlt-moments">
      {MOMENTS.map((m, i) => (
        <div key={m.src + i} className="tlt-moment">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={m.src} alt={m.alt} loading="lazy" />
        </div>
      ))}
    </div>
  );
}

/* ── Mobile horizontal snap-carousel — centred photo scales up, neighbours recede ── */
function MomentsCarousel() {
  const reduce = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slides = Array.from(scroller.querySelectorAll<HTMLElement>("[data-slide]"));
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            setActive(Number((e.target as HTMLElement).dataset.slide));
          }
        });
      },
      { root: scroller, threshold: [0.6, 0.9] }
    );
    slides.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <div ref={scrollerRef} className="tlt-hscroll" role="list">
        {MOMENTS.map((m, i) => (
          <div
            key={m.src + i}
            data-slide={i}
            className={`tlt-slide${active === i ? " is-active" : ""}`}
            role="listitem"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.src} alt={m.alt} loading="lazy" />
          </div>
        ))}
      </div>

      <div className="tlt-slide-meta">
        <motion.span
          key={active}
          initial={reduce ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="tlt-slide-cap"
        >
          {MOMENTS[active].caption}
        </motion.span>
        <span className="tlt-slide-count">{String(active + 1).padStart(2, "0")} / {MOMENTS.length}</span>
      </div>
    </div>
  );
}

export default function LivingTablePage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F4EFE6", overflowX: "hidden" }}>
        <style>{`
          /* Pillar cards — scattered-photo layout */
          .tlt-pillars   { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(22px, 3vw, 44px); align-items: stretch; }
          .tlt-card      { background: #FAF7F2; height: 100%; display: flex; flex-direction: column; box-shadow: 0 14px 34px rgba(34,30,26,.13); transition: transform .5s cubic-bezier(.2,.7,.3,1), box-shadow .5s cubic-bezier(.2,.7,.3,1); will-change: transform; }
          .tlt-card:hover{ transform: translateY(-8px); box-shadow: 0 26px 56px rgba(34,30,26,.2); }

          /* Moments — column masonry */
          .tlt-moments   { column-count: 3; column-gap: clamp(14px, 2vw, 26px); }
          .tlt-moment    { display: block; break-inside: avoid; margin-bottom: clamp(14px, 2vw, 26px); position: relative; overflow: hidden; transition: transform .45s cubic-bezier(.2,.7,.3,1), box-shadow .45s cubic-bezier(.2,.7,.3,1); box-shadow: 0 8px 24px rgba(34,30,26,.10); }
          .tlt-moment:hover { transform: translateY(-6px); box-shadow: 0 20px 44px rgba(34,30,26,.20); }
          .tlt-moment img{ width: 100%; height: auto; display: block; }

          /* Moments — mobile swipe carousel */
          .tlt-hscroll { display: flex; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; padding: 12px 12vw 16px; scrollbar-width: none; }
          .tlt-hscroll::-webkit-scrollbar { display: none; }
          .tlt-slide { flex: 0 0 76vw; aspect-ratio: 3 / 4; scroll-snap-align: center; position: relative; overflow: hidden; display: block; transform: scale(.86); opacity: .5; box-shadow: 0 10px 30px rgba(34,30,26,.12); transition: transform .55s cubic-bezier(.2,.7,.3,1), opacity .55s cubic-bezier(.2,.7,.3,1), box-shadow .55s cubic-bezier(.2,.7,.3,1); }
          .tlt-slide.is-active { transform: scale(1); opacity: 1; box-shadow: 0 24px 60px rgba(34,30,26,.28); }
          .tlt-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
          .tlt-slide-meta { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 20px 16px 0; min-height: 20px; }
          .tlt-slide-cap { font-family: var(--font-heading); font-style: italic; font-size: 15px; color: rgba(0,0,0,.6); line-height: 1.4; }
          .tlt-slide-count { font-family: var(--font-body); font-size: 11px; letter-spacing: .16em; color: #901A1C; white-space: nowrap; }
          @media (prefers-reduced-motion: reduce) {
            .tlt-slide { transform: none !important; opacity: 1 !important; transition: none !important; }
          }

          .tlt-press-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(18px, 2.4vw, 32px); }
          .tlt-prev         { display: grid; grid-template-columns: 1fr 1fr; }

          @media (max-width: 900px) {
            .tlt-moments { column-count: 2; }
          }
          @media (max-width: 768px) {
            .tlt-hero         { height: 68dvh !important; min-height: 440px !important; }
            .tlt-pillars      { grid-template-columns: 1fr; gap: 28px; }
            .tlt-card, .tlt-card--1, .tlt-card--2, .tlt-card--3 { transform: none !important; }
            .tlt-card:hover   { transform: translateY(-6px) !important; }
            .tlt-press-grid   { grid-template-columns: 1fr; }
            .tlt-prev         { grid-template-columns: 1fr; }
            .tlt-upcoming     { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 540px) {
            .tlt-moments { column-count: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .tlt-card, .tlt-card--1, .tlt-card--2, .tlt-card--3 { transform: none !important; transition: none !important; }
            .tlt-moment { transition: none !important; }
          }
        `}</style>

        {/* ── 1. HERO ── */}
        <section className="tlt-hero" style={{ position: "relative", height: "100dvh", minHeight: "480px", overflow: "hidden" }}>
          <video
            autoPlay muted loop playsInline
            poster="/images/thelivingtable/banner_1.png"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          >
            <source src="/images/thelivingtable/Hero_video.mp4" type="video/mp4" />
            <track kind="captions" src="/empty.vtt" srcLang="en" label="No dialogue" />
          </video>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,6,0.22) 0%, rgba(10,8,6,0.52) 55%, rgba(10,8,6,0.94) 100%)" }} />

          <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.3 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(9px, 2.4vw, 11px)", letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(244,239,230,0.7)", margin: "0 0 20px" }}
            >
              Inkpot India Presents
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5 }}
              style={{ marginBottom: "14px" }}
            >
              <Image
                src="/images/thelivingtable/logo_the_right_one_1.svg"
                alt="The Living Table"
                width={380} height={380}
                style={{ width: "clamp(180px, 52vw, 380px)", height: "auto", filter: "brightness(0) invert(1)", opacity: 0.94 }}
                priority
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.0 }}
              style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "clamp(14px, 3.5vw, 21px)", color: "rgba(244,239,230,0.66)", letterSpacing: "0.02em", margin: "0 0 34px" }}
            >
              Where stories find their way onto the plate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
            >
              <a
                href="#register"
                style={{ background: "#901A1C", color: "#ffffff", padding: "15px 46px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.25s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7a1517")}
                onMouseLeave={e => (e.currentTarget.style.background = "#901A1C")}
              >
                Register Your Interest
              </a>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12px, 2.8vw, 15px)", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                Returns August 2026
              </span>
            </motion.div>
          </div> 
        </section>

        {/* ── 2. ABOUT — three pillars, layered cards ── */}
        <section style={{ background: "#EDE6DA", padding: "clamp(64px, 9vw, 130px) clamp(24px, 6vw, 110px)" }}>
          <Fade style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto clamp(52px, 6vw, 84px)" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 24px" }}>
              About 
            </p>
            {/* <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(26px, 4vw, 46px)", color: "#1a1a1a", lineHeight: 1.22, margin: "0 0 22px" }}>
              Where gastronomy and history come together to explore the stories, traditions and ideas that shape our culinary heritage
            </h2> */}
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(16px, 2vw, 22px)", color: "rgba(0,0,0,0.5)", margin: 0 }}>
              Where gastronomy and history come together to explore the stories, traditions and ideas that shape our culinary heritage.
            </p>
          </Fade>

          <div className="tlt-pillars">
            {PILLARS.map((p, i) => (
              <Fade key={p.num} delay={i * 0.12} amount={0.15} style={{ display: "flex", flexDirection: "column" }}>
                <article className={`tlt-card tlt-card--${p.mod}`}>
                  <div style={{ position: "relative", width: "100%", height: "250px", overflow: "hidden", flexShrink: 0 }}>
                    <Image src={p.img} alt={p.alt} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover", objectPosition: "center" }} loading="lazy" />
                  </div>
                  <div style={{ padding: "clamp(24px, 2.4vw, 34px) clamp(24px, 2.2vw, 32px) clamp(28px, 2.8vw, 38px)", flex: 1 }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(19px, 1.9vw, 25px)", color: "#1a1a1a", lineHeight: 1.25, margin: "0 0 14px" }}>
                      {p.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.15vw, 14px)", color: "rgba(0,0,0,0.55)", lineHeight: 1.85, margin: 0 }}>
                      {p.body}
                    </p>
                  </div>
                </article>
              </Fade>
            ))}
          </div>
        </section>

        {/* ── 3. UPCOMING EDITION — 40% portrait image / 60% text ── */}
        <section className="tlt-upcoming" style={{ background: "#0A0806", display: "grid", gridTemplateColumns: "2fr 3fr" }}>
          {/* Image — 40% */}
          <div style={{ position: "relative", minHeight: "clamp(380px, 56vw, 640px)", overflow: "hidden" }}>
            <Image
              src="/images/thelivingtable/DSC_0051.JPG"
              alt="The Living Table, set for the evening"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              loading="lazy"
            />
          </div>

          {/* Text — 60% */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(52px, 7vw, 104px) clamp(28px, 6vw, 96px)" }}>
            <Fade>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#C9A84C", margin: "0 0 22px" }}>
                Upcoming Edition
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(30px, 5vw, 54px)", color: "#F4EFE6", lineHeight: 1.15, margin: "0 0 18px" }}>
                The Next Edition
              </h2>
              <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(16px, 2.1vw, 23px)", color: "rgba(244,239,230,0.55)", lineHeight: 1.5, margin: "0 0 14px" }}>
                A new evening is being set.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12px, 1.3vw, 14px)", letterSpacing: "0.06em", color: "rgba(244,239,230,0.45)", margin: "0 0 40px" }}>
                Returns August 2026.
              </p>
              <a
                href="#register"
                style={{ display: "inline-block", alignSelf: "flex-start", background: "#901A1C", color: "#ffffff", padding: "16px 48px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.25s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7a1517")}
                onMouseLeave={e => (e.currentTarget.style.background = "#901A1C")}
              >
                Reserve Your Table →
              </a>
            </Fade>
          </div>
        </section>

        {/* ── 4. MOMENTS ── */}
        <section style={{ background: "#F4EFE6", padding: "clamp(64px, 9vw, 120px) clamp(24px, 6vw, 100px)" }}>
          <Fade style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 16px" }}>
              Moments
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3.4vw, 40px)", color: "#1a1a1a", lineHeight: 1.2, margin: 0 }}>
              From the first evening.
            </h2>
          </Fade>

          <MomentsGrid />

          <Fade style={{ textAlign: "center", marginTop: "clamp(36px, 4vw, 56px)" }}>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#901A1C", textDecoration: "none", letterSpacing: "0.04em", borderBottom: "1px solid rgba(144,26,28,0.25)", paddingBottom: "3px" }}
            >
              Follow @inkpotindia_ for more from the evening →
            </a>
          </Fade>
        </section>

        {/* ── 7. PRESS ── (behind PRESS_ENABLED flag) */}
        {PRESS_ENABLED && (
          <section style={{ background: "#F4EFE6", padding: "clamp(64px, 9vw, 120px) clamp(24px, 6vw, 110px)" }}>
            <Fade style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 60px)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 16px" }}>
                Press
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3.4vw, 40px)", color: "#1a1a1a", lineHeight: 1.2, margin: 0 }}>
                In the papers.
              </h2>
            </Fade>

            {/* Publication logo bar — placeholders */}
            <Fade style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "clamp(24px, 5vw, 64px)", marginBottom: "clamp(48px, 6vw, 72px)" }}>
              {["[PUBLICATION]", "[PUBLICATION]", "[PUBLICATION]", "[PUBLICATION]"].map((p, i) => (
                <span key={i} style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "clamp(15px, 1.8vw, 20px)", color: "rgba(0,0,0,0.28)", letterSpacing: "0.02em" }}>{p}</span>
              ))}
            </Fade>

            <div className="tlt-press-grid" style={{ marginBottom: "clamp(48px, 6vw, 72px)" }}>
              {CLIPPINGS.map((c, i) => (
                <Fade key={i} delay={i * 0.1} amount={0.15}>
                  <article style={{ background: "#FAF7F2", boxShadow: "0 12px 30px rgba(34,30,26,.1)", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden" }}>
                      <Image src={c.img} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover", objectPosition: "center" }} loading="lazy" />
                    </div>
                    <div style={{ padding: "clamp(22px, 2.2vw, 30px)", display: "flex", flexDirection: "column", flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 12px" }}>
                        {c.pub} · {c.date}
                      </p>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(18px, 1.8vw, 23px)", color: "#1a1a1a", lineHeight: 1.3, margin: "0 0 12px" }}>
                        {c.headline}
                      </h3>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(0,0,0,0.5)", lineHeight: 1.8, margin: "0 0 20px", flex: 1 }}>
                        {c.pull}
                      </p>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#901A1C" }}>
                        Read the piece →
                      </span>
                    </div>
                  </article>
                </Fade>
              ))}
            </div>

            <Fade style={{ textAlign: "center", background: "#EDE6DA", padding: "clamp(36px, 4vw, 56px) 24px", maxWidth: "720px", margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: "0 0 12px" }}>
                Media Enquiries
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px, 2.2vw, 26px)", color: "#1a1a1a", margin: "0 0 24px", lineHeight: 1.4 }}>
                Writing about The Living Table? We&rsquo;d love to help.
              </p>
              <a
                href="mailto:press@inkpotindia.com"
                style={{ display: "inline-block", background: "#901A1C", color: "#ffffff", padding: "14px 40px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.25s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7a1517")}
                onMouseLeave={e => (e.currentTarget.style.background = "#901A1C")}
              >
                press@inkpotindia.com
              </a>
            </Fade>
          </section>
        )}

        {/* ── 8. PREVIOUS EDITION ── */}
        <section className="tlt-prev" style={{ background: "#ffffff" }}>
          <div style={{ position: "relative", minHeight: "clamp(280px, 42vw, 520px)", overflow: "hidden" }}>
            <Image src="/images/thelivingtable/TLT-05.jpg" alt="The inaugural Living Table at Kathika Cultural Centre" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center" }} loading="lazy" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(48px, 6vw, 88px) clamp(28px, 5vw, 72px)", background: "#F4EFE6" }}>
            <Fade>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 22px" }}>
                From the Archive
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 3.6vw, 44px)", color: "#1a1a1a", lineHeight: 1.15, margin: "0 0 14px" }}>
                The Inaugural Edition
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", margin: "0 0 24px" }}>
                28 June 2026 · Kathika Cultural Centre, Old Delhi
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.4vw, 15px)", color: "rgba(0,0,0,0.55)", lineHeight: 1.9, margin: "0 0 32px", maxWidth: "440px" }}>
                Our first table traced butter chicken from Peshawar to Delhi, with the Gujral family, Sadaf Husain and Salma Husain. An evening of food, memory and migration inside a restored haveli.
              </p>
              <a
                href="/the-living-table/inaugural-edition"
                style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#901A1C", textDecoration: "none", borderBottom: "1px solid rgba(144,26,28,0.3)", paddingBottom: "3px", alignSelf: "flex-start" }}
              >
                View Previous Event →
              </a>
            </Fade>
          </div>
        </section>

        {/* breathing space before the register block */}
        <div style={{ height: "clamp(56px, 8vw, 110px)", background: "#F4EFE6" }} />

        {/* ── 9. REGISTER YOUR INTEREST ── */}
        <section id="register" style={{ background: "#0A0806", padding: "clamp(64px, 9vw, 130px) clamp(24px, 6vw, 24px)", scrollMarginTop: "110px" }}>
          <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
            <Fade>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#C9A84C", margin: "0 0 22px" }}>
                Register Your Interest
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(30px, 5vw, 52px)", color: "#F4EFE6", lineHeight: 1.12, margin: "0 0 16px" }}>
                Join us at the table.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.4vw, 15px)", color: "rgba(244,239,230,0.55)", lineHeight: 1.9, margin: "0 0 44px" }}>
                Be the first to know when the next edition opens.
              </p>
            </Fade>
            <RegisterInterest />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

/* ── Register Your Interest form ── */
function RegisterInterest() {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitError, setSubmitError] = useState("");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const next: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email address.";
    if (!phone.trim()) next.phone = "Please enter your phone number.";
    else if (phone.replace(/[^0-9]/g, "").length < 7) next.phone = "Please enter a valid phone number.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("success");
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        role="status"
        style={{ background: "rgba(244,239,230,0.04)", border: "1px solid rgba(244,239,230,0.14)", padding: "clamp(40px, 5vw, 56px) 28px", textAlign: "center" }}
      >
        <div style={{ width: "52px", height: "52px", border: "1px solid rgba(201,168,76,0.5)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h3 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3.4vw, 34px)", color: "#F4EFE6", margin: "0 0 12px" }}>
          You&rsquo;re on the list.
        </h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(244,239,230,0.5)", lineHeight: 1.8, margin: 0 }}>
          We&rsquo;ll only reach out when the next Living Table is live.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ textAlign: "left" }}>
      <DarkField label="Name" value={name} onChange={v => { setName(v); if (errors.name) setErrors(e => ({ ...e, name: undefined })); }} type="text" placeholder="Your full name" required error={errors.name} id="reg-name" />
      <DarkField label="Email" value={email} onChange={v => { setEmail(v); if (errors.email) setErrors(e => ({ ...e, email: undefined })); }} type="email" placeholder="your@email.com" required error={errors.email} id="reg-email" />
      <DarkField label="Phone" value={phone} onChange={v => { setPhone(v); if (errors.phone) setErrors(e => ({ ...e, phone: undefined })); }} type="tel" placeholder="+91 98765 43210" required error={errors.phone} id="reg-phone" />

      {submitError && (
        <p role="alert" style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#e8a5a6", lineHeight: 1.7, margin: "0 0 18px" }}>
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        style={{ background: status === "submitting" ? "rgba(144,26,28,0.5)" : "#901A1C", color: "#ffffff", width: "100%", padding: "17px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", border: "none", cursor: status === "submitting" ? "default" : "pointer", transition: "background 0.25s", marginTop: "8px" }}
        onMouseEnter={e => { if (status !== "submitting") e.currentTarget.style.background = "#7a1517"; }}
        onMouseLeave={e => { if (status !== "submitting") e.currentTarget.style.background = "#901A1C"; }}
      >
        {status === "submitting" ? "Adding you…" : "Notify Me"}
      </button>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(244,239,230,0.35)", marginTop: "16px", textAlign: "center", lineHeight: 1.7 }}>
        We&rsquo;ll only reach out when the next Living Table is live.
      </p>
    </form>
  );
}

/* ── Dark-themed labelled input for the register form ── */
function DarkField({ label, value, onChange, type, placeholder, required, error, id }: {
  label: string; value: string; onChange: (v: string) => void; type: string;
  placeholder: string; required?: boolean; error?: string; id: string;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? "#e8a5a6" : focused ? "#C9A84C" : "rgba(244,239,230,0.22)";
  return (
    <div style={{ marginBottom: "22px" }}>
      <label htmlFor={id} style={{ fontFamily: "var(--font-body)", fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(244,239,230,0.5)", display: "block", marginBottom: "8px" }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ display: "block", width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${borderColor}`, padding: "9px 0", fontFamily: "var(--font-body)", fontSize: "15px", color: "#F4EFE6", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
      />
      {error && (
        <p id={`${id}-error`} role="alert" style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#e8a5a6", margin: "8px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}
