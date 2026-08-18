"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoplayVideo from "@/components/AutoplayVideo";
import Turnstile, { HoneypotField } from "@/components/Turnstile";

/* ── Flags — flip live without a redesign ── */
const PRESS_ENABLED = false; // set true once real coverage exists

const INSTAGRAM = "https://www.instagram.com/inkpotindia_/";

/* ── The three About pillars — rendered as alternating editorial rows.
      `pos` tunes each crop: the sources are a mix of 3:2 and 2:3, and the row
      media is a uniform 4:3, so the portrait frame needs its own focal point. ── */
const PILLARS = [
  {
    num: "I",
    title: "Stories that Preserve Heritage",
    body: "Narratives that reconnect us with the places, people and traditions that define our cultural identity.",
    img: "/images/thelivingtable/TLT-12.jpg",
    alt: "A storyteller at The Living Table",
    pos: "center 45%",
  },
  {
    num: "II",
    title: "Cuisine with a Sense of Place",
    body: "Menus crafted by acclaimed chefs, inspired by history and rooted in regional flavours.",
    img: "/images/thelivingtable/TLT-17.jpg",
    // Portrait source in a 4:3 frame — only the middle half survives; 55% centres the thali.
    alt: "A plated dish from the evening",
    pos: "center 55%",
  },
  {
    num: "III",
    title: "Spaces with Soul",
    body: "Extraordinary venues that provide an authentic setting for meaningful conversations and shared experiences.",
    img: "/images/thelivingtable/DSC_0066.JPG",
    alt: "The candlelit haveli interior at Kathika Cultural Centre",
    pos: "center 50%",
  },
];

/* ── Moments — the full set from the inaugural evening.
      True pixel dimensions travel with each frame: the rail is a fixed height and
      derives every width from `ratio`, so the 13 portraits stay narrow and the two
      landscapes open out. No crop, and no layout shift as they load. ── */
const GALLERY = "/images/thelivingtable/gallery%20images";
const MOMENTS = [
  { src: `${GALLERY}/The_living_table.jpeg`,                  alt: "The Living Table set beneath chandeliers in the haveli courtyard", caption: "The table, set beneath the chandeliers", ratio: 953 / 1433 },
  { src: `${GALLERY}/Old_haveli.jpeg`,                        alt: "The restored haveli at Kathika Cultural Centre",                   caption: "The old haveli, before the guests",     ratio: 1066 / 1600 },
  { src: `${GALLERY}/DSC_0429.JPG`,                           alt: "Conversation over dinner",                                          caption: "Conversation over dinner",              ratio: 2200 / 1467 },
  { src: `${GALLERY}/the_dinner_table.jpeg`,                  alt: "The dinner table laid for the evening",                             caption: "The dinner table, laid",                ratio: 1066 / 1600 },
  { src: `${GALLERY}/TLT-05.jpg`,                             alt: "The inaugural Living Table evening",                                caption: "The inaugural evening",                 ratio: 1467 / 2200 },
  { src: `${GALLERY}/Guest_at_The_Living_table.jpeg`,         alt: "A guest at The Living Table",                                       caption: "A guest at the table",                  ratio: 1066 / 1600 },
  { src: `${GALLERY}/DSC_0444.JPG`,                           alt: "The haveli, lit for the evening",                                   caption: "The haveli, lit for the evening",       ratio: 1467 / 2200 },
  { src: `${GALLERY}/TLT-11.jpg`,                             alt: "A dish served at The Living Table",                                 caption: "A dish from the menu",                  ratio: 1467 / 2200 },
  { src: `${GALLERY}/TLT-13.jpg`,                             alt: "Guests in conversation",                                            caption: "Guests in conversation",                ratio: 2200 / 1467 },
  { src: `${GALLERY}/Guest_at_the_living_table_kathika.jpeg`, alt: "A guest at Kathika Cultural Centre",                                caption: "An evening at Kathika",                 ratio: 1066 / 1600 },
  { src: `${GALLERY}/DSC_0558.JPG`,                           alt: "Guests at The Living Table",                                        caption: "Around the table",                      ratio: 1467 / 2200 },
  { src: `${GALLERY}/TLT-15.jpg`,                             alt: "Stories shared at the table",                                       caption: "Stories shared at the table",           ratio: 1467 / 2200 },
  { src: `${GALLERY}/DSC_0571.JPG`,                           alt: "A course from the menu",                                            caption: "A course from the menu",                ratio: 1467 / 2200 },
  { src: `${GALLERY}/DSC_0650.JPG`,                           alt: "The table during dinner",                                           caption: "The table during dinner",               ratio: 1467 / 2200 },
  { src: `${GALLERY}/DSC_0667.JPG`,                           alt: "A closing moment from the evening",                                 caption: "A closing moment",                      ratio: 1467 / 2200 },
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

/* ── Moments: one horizontal rail at every breakpoint.
      Frames sit on a shared bottom baseline at a fixed rail height, with every
      other one stepped slightly shorter — a contact-sheet skyline rather than a
      flat strip. Each frame reveals itself as it is scrolled into view, so the
      gallery unfolds as you travel along it. Pointer drag pans on desktop;
      touch uses native momentum scrolling. ── */
function MomentsRail() {
  const reduce = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  /* Centre-most frame wins the caption; progress drives the rule beneath the rail. */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      setProgress(max > 8 ? Math.min(1, Math.max(0, scroller.scrollLeft / max)) : 1);

      const mid = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      scroller.querySelectorAll<HTMLElement>("[data-slide]").forEach(el => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = Number(el.dataset.slide);
        }
      });
      setActive(best);
    };

    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Drag-to-pan. Touch is left alone — native scrolling already feels better. */
  const drag = useRef({ down: false, startX: 0, startScroll: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const s = scrollerRef.current;
    if (!s) return;
    drag.current = { down: true, startX: e.clientX, startScroll: s.scrollLeft };
    setDragging(true);
    s.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = scrollerRef.current;
    if (!s || !drag.current.down) return;
    s.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = scrollerRef.current;
    if (!s || !drag.current.down) return;
    drag.current.down = false;
    setDragging(false);
    if (s.hasPointerCapture(e.pointerId)) s.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="tlt-rail-wrap">
      <div
        ref={scrollerRef}
        className={`tlt-rail${dragging ? " is-dragging" : ""}`}
        role="list"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {MOMENTS.map((m, i) => (
          <motion.div
            key={m.src}
            data-slide={i}
            role="listitem"
            className={`tlt-frame${i % 2 === 1 ? " tlt-frame--step" : ""}${active === i ? " is-active" : ""}`}
            style={{ aspectRatio: String(m.ratio) }}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.src} alt={m.alt} loading="lazy" draggable={false} />
            <span className="tlt-frame-num">{String(i + 1).padStart(2, "0")}</span>
          </motion.div>
        ))}
      </div>

      {/* Progress rule — how far along the evening you have travelled */}
      <div className="tlt-rail-rule" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className="tlt-rail-meta">
        <motion.span
          key={active}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="tlt-rail-cap"
        >
          {MOMENTS[active].caption}
        </motion.span>
        <span className="tlt-rail-count">
          {String(active + 1).padStart(2, "0")} / {String(MOMENTS.length).padStart(2, "0")}
        </span>
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
          /* About — alternating editorial rows: text one side, photograph the other */
          .tlt-about      { display: flex; flex-direction: column; gap: clamp(52px, 7vw, 112px); }
          .tlt-about-row  { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 5vw, 76px); align-items: center; }
          .tlt-about-media{ order: 2; position: relative; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; box-shadow: 0 18px 46px rgba(34,30,26,.17); }
          .tlt-about-copy { order: 1; }
          .tlt-about-row.is-flipped .tlt-about-media { order: 1; }
          .tlt-about-row.is-flipped .tlt-about-copy  { order: 2; }
          .tlt-about-media img { transition: transform 1.1s cubic-bezier(.2,.7,.3,1); }
          .tlt-about-row:hover .tlt-about-media img  { transform: scale(1.045); }
          .tlt-about-num  { display: block; font-family: var(--font-heading); font-style: italic; font-size: clamp(30px, 3.6vw, 46px); line-height: 1; color: rgba(144,26,28,.26); margin: 0 0 14px; }
          .tlt-about-h    { font-family: var(--font-heading); font-weight: 400; font-size: clamp(23px, 2.7vw, 36px); color: #1a1a1a; line-height: 1.22; margin: 0 0 18px; }
          .tlt-about-rule { width: 34px; height: 1px; background: #901A1C; margin: 0 0 18px; }
          .tlt-about-body { font-family: var(--font-body); font-size: clamp(13px, 1.2vw, 15px); color: rgba(0,0,0,.55); line-height: 1.9; margin: 0; max-width: 42ch; }

          /* Moments — horizontal rail, bottom-aligned, bleeding off the right edge */
          .tlt-rail-wrap  { position: relative; }
          .tlt-rail       { display: flex; align-items: flex-end; gap: clamp(12px, 1.6vw, 24px);
                            height: clamp(330px, 42vw, 560px);
                            overflow-x: auto; overflow-y: hidden;
                            scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch;
                            scrollbar-width: none; cursor: grab;
                            margin-right: calc(-1 * clamp(24px, 6vw, 100px));
                            /* bottom padding absorbs the frames' entrance travel, which
                               overflow-y: hidden would otherwise clip */
                            padding: 6px clamp(24px, 6vw, 100px) 22px 0; }
          .tlt-rail::-webkit-scrollbar { display: none; }
          .tlt-rail.is-dragging { cursor: grabbing; scroll-snap-type: none; }
          .tlt-frame      { position: relative; flex: 0 0 auto; height: 100%; scroll-snap-align: center;
                            overflow: hidden; background: #E4DCCF;
                            box-shadow: 0 10px 28px rgba(34,30,26,.13);
                            transition: box-shadow .55s cubic-bezier(.2,.7,.3,1), height .55s cubic-bezier(.2,.7,.3,1); }
          .tlt-frame--step{ height: 85%; }
          .tlt-frame.is-active { box-shadow: 0 22px 54px rgba(34,30,26,.26); }
          .tlt-frame img  { width: 100%; height: 100%; object-fit: cover; display: block;
                            transform: scale(1.05); transition: transform 1.2s cubic-bezier(.2,.7,.3,1);
                            -webkit-user-drag: none; user-select: none; }
          .tlt-frame.is-active img, .tlt-frame:hover img { transform: scale(1); }
          .tlt-frame-num  { position: absolute; top: 12px; left: 13px; font-family: var(--font-body);
                            font-size: 9px; letter-spacing: .18em; color: #fff; opacity: 0;
                            text-shadow: 0 1px 6px rgba(0,0,0,.55); transition: opacity .45s ease; }
          .tlt-frame.is-active .tlt-frame-num { opacity: .85; }
          .tlt-rail-rule  { position: relative; height: 1px; background: rgba(34,30,26,.14); margin-top: clamp(22px, 2.6vw, 34px); overflow: hidden; }
          .tlt-rail-rule span { position: absolute; inset: 0; background: #901A1C; transform-origin: left center; transition: transform .18s linear; }
          .tlt-rail-meta  { display: flex; align-items: baseline; justify-content: space-between; gap: 18px; padding-top: 16px; min-height: 22px; }
          .tlt-rail-cap   { font-family: var(--font-heading); font-style: italic; font-size: clamp(14px, 1.5vw, 17px); color: rgba(0,0,0,.6); line-height: 1.4; }
          .tlt-rail-count { font-family: var(--font-body); font-size: 11px; letter-spacing: .16em; color: #901A1C; white-space: nowrap; }

          .tlt-press-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(18px, 2.4vw, 32px); }
          .tlt-prev         { display: grid; grid-template-columns: 1fr 1fr; }

          @media (max-width: 900px) {
            .tlt-about-row  { grid-template-columns: 1fr; gap: 22px; }
            .tlt-about-media, .tlt-about-row.is-flipped .tlt-about-media { order: 1; }
            .tlt-about-copy,  .tlt-about-row.is-flipped .tlt-about-copy  { order: 2; }
          }
          @media (max-width: 768px) {
            .tlt-hero         { height: 68dvh !important; min-height: 440px !important; }
            .tlt-press-grid   { grid-template-columns: 1fr; }
            .tlt-prev         { grid-template-columns: 1fr; }
            .tlt-rail         { height: clamp(300px, 68vw, 420px); scroll-snap-type: x mandatory; }
            .tlt-frame--step  { height: 90%; }
          }
          @media (prefers-reduced-motion: reduce) {
            .tlt-about-media img, .tlt-frame img { transition: none !important; transform: none !important; }
            .tlt-frame, .tlt-rail-rule span { transition: none !important; }
          }
        `}</style>

        {/* ── 1. HERO ── */}
        <section className="tlt-hero" style={{ position: "relative", height: "100dvh", minHeight: "480px", overflow: "hidden" }}>
          <AutoplayVideo
            poster="/images/thelivingtable/banner_1.png"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          >
            <source src="/images/thelivingtable/Hero_video.mp4" type="video/mp4" />
            <track kind="captions" src="/empty.vtt" srcLang="en" label="No dialogue" />
          </AutoplayVideo>
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

            <motion.h1
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.0 }}
              style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(14px, 3.5vw, 21px)", color: "rgba(244,239,230,0.66)", letterSpacing: "0.02em", margin: "0 0 34px" }}
            >
              <span className="sr-only">The Living Table — </span>
              Where stories find their way onto the plate.
            </motion.h1>

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
                A new table is being set
              </span>
            </motion.div>
          </div> 
        </section>

        {/* ── 2. ABOUT — alternating editorial rows ── */}
        <section style={{ background: "#EDE6DA", padding: "clamp(64px, 9vw, 130px) clamp(24px, 6vw, 110px)" }}>
          <Fade style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto clamp(56px, 7vw, 96px)" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 22px" }}>
              About
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 4.2vw, 52px)", color: "#1a1a1a", lineHeight: 1.14, margin: "0 0 26px" }}>
              What The Living Table Is About
            </h2>
            <div style={{ width: "34px", height: "1px", background: "#901A1C", margin: "0 auto 26px" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.3vw, 15px)", color: "rgba(0,0,0,0.55)", lineHeight: 1.9, margin: 0 }}>
              Where gastronomy and history come together to explore the stories, traditions and ideas that shape our culinary heritage.
            </p>
          </Fade>

          <div className="tlt-about">
            {PILLARS.map((p, i) => (
              <Fade key={p.num} amount={0.15} y={36}>
                {/* Odd rows flip: photograph left, text right */}
                <article className={`tlt-about-row${i % 2 === 1 ? " is-flipped" : ""}`}>
                  <div className="tlt-about-media">
                    <Image
                      src={p.img}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 47vw"
                      style={{ objectFit: "cover", objectPosition: p.pos }}
                      loading="lazy"
                    />
                  </div>
                  <div className="tlt-about-copy">
                    <span className="tlt-about-num">{p.num}</span>
                    <h3 className="tlt-about-h">{p.title}</h3>
                    <div className="tlt-about-rule" />
                    <p className="tlt-about-body">{p.body}</p>
                  </div>
                </article>
              </Fade>
            ))}
          </div>
        </section>

        {/* ── 3. MOMENTS ── */}
        <section style={{ background: "#F4EFE6", padding: "clamp(64px, 9vw, 120px) clamp(24px, 6vw, 100px)" }}>
          <Fade style={{ marginBottom: "clamp(34px, 4.2vw, 54px)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 16px" }}>
                Moments
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3.4vw, 40px)", color: "#1a1a1a", lineHeight: 1.2, margin: 0 }}>
                From the first evening.
              </h2>
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", paddingBottom: "4px" }}>
              Drag or scroll →
            </span>
          </Fade>

          <MomentsRail />

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
          <div style={{ position: "relative", minHeight: "clamp(210px, 27vw, 340px)", overflow: "hidden" }}>
            <Image src="/images/thelivingtable/TLT-05.jpg" alt="The inaugural Living Table at Kathika Cultural Centre" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center" }} loading="lazy" />
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
                Our first table traced butter chicken from Peshawar to Delhi, with the Gujral family, Sadaf Husain and Salma Husain. An evening of food, memory and migration inside a restored haveli.
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
  const [botToken, setBotToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

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
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          turnstileToken: botToken ?? "",
          company: honeypot,
        }),
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

      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <Turnstile onVerify={setBotToken} theme="dark" />

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
