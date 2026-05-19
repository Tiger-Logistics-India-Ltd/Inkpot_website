"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/* ── shared mobile text animation ── */
const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

/* ─────────────────────────────────────────────────────────
   Panel 1 — Songs of the Stone
──────────────────────────────────────────────────────────*/
function PanelSOTS({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <section style={{ background: "#0D0B09" }}>
        <div style={{ padding: "20px 20px 0" }}>
          <motion.div
            initial={{ scale: 1.06 }} whileInView={{ scale: 1.0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ position: "relative", width: "100%", height: "210px", overflow: "hidden" }}
          >
            <Image src="/images/Songs of the stone/songsofthestone.png" alt="Songs of the Stone"
              fill priority sizes="calc(100vw - 40px)" style={{ objectFit: "cover", objectPosition: "center 20%" }} />
          </motion.div>
        </div>
        <motion.div {...fadeUp} style={{ padding: "28px 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "16px", height: "1px", background: "var(--primary-red)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
              Music &amp; Heritage · Ongoing
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "36px", lineHeight: 1.08, color: "#ffffff", marginBottom: "14px" }}>
            Songs of<br />the Stone
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.78, color: "rgba(255,255,255,0.72)", marginBottom: "8px" }}>
            After-hours cultural evenings at Delhi&rsquo;s heritage monuments. Space becomes stage. Stone becomes story.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "24px" }}>
            <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
              <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(255,255,255,0.45)" />
            </svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>Heritage Monuments, Delhi</span>
          </div>
          <a href="https://www.songsofthestone.com/" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", textDecoration: "none", fontWeight: 700 }}>
            Explore Experience
            <svg width="12" height="8" viewBox="0 0 16 10" fill="none">
              <path d="M1 5h14M9 1l5 4-5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </section>
    );
  }

  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", background: "#0D0B09", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "58%", overflow: "hidden" }}>
        <motion.div
          initial={{ scale: 1.12 }} whileInView={{ scale: 1.0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Image src="/images/Songs of the stone/songsofthestone.png" alt="Songs of the Stone — heritage performance"
            fill priority sizes="58vw" style={{ objectFit: "cover", objectPosition: "center 20%" }} />
        </motion.div>
      </div>
      <div style={{ position: "absolute", left: "7%", top: "50%", transform: "translateY(-50%)", zIndex: 2, maxWidth: "400px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
          <div style={{ width: "20px", height: "1px", background: "var(--primary-red)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)" }}>
            Music &amp; Heritage · Ongoing
          </span>
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(40px, 5.5vw, 82px)", lineHeight: 1.03, color: "#ffffff", marginBottom: "24px" }}>
          Songs of<br />the Stone
        </h2>
        <div style={{ width: "28px", height: "1px", background: "var(--primary-red)", marginBottom: "24px" }} />
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.85, color: "rgba(255,255,255,0.85)", marginBottom: "14px" }}>
          After-hours cultural evenings at Delhi&rsquo;s heritage monuments. Space becomes stage. Stone becomes story.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "38px" }}>
          <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
            <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(255,255,255,0.75)" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.78)", letterSpacing: "0.08em" }}>Heritage Monuments, Delhi</span>
        </div>
        <a href="https://www.songsofthestone.com/" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", textDecoration: "none", transition: "color 0.25s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
        >
          Explore Experience
          <svg width="14" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 5h14M9 1l5 4-5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel 2 — Antarnaad
──────────────────────────────────────────────────────────*/
function PanelAntarnaad({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <section style={{ background: "#F4EFE6" }}>
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ position: "relative", height: "210px", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10, background: "rgba(144,26,28,0.9)", padding: "4px 12px", fontFamily: "var(--font-body)", fontSize: "7px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#ffffff" }}>
              Coming Soon
            </div>
            <Image src="/images/Homepage/anatarnaad_landscpae_real.svg" alt="Antarnaad" fill unoptimized sizes="calc(100vw - 40px)" style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>
        </div>
        <motion.div {...fadeUp} style={{ padding: "28px 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "16px", height: "1px", background: "var(--primary-red)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)" }}>
              7 Art Forms · 4 Spaces · One Journey
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "36px", lineHeight: 1.08, color: "#1a1a1a", marginBottom: "14px" }}>
            Antarnaad
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.78, color: "rgba(0,0,0,0.5)", marginBottom: "8px" }}>
            Arrive fully into the moment, where the noise of elsewhere begins to dissolve. In this state, we do not rush to interpret or define; instead, we allow ourselves to linger, to feel, and to notice what unfolds naturally.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "24px" }}>
            <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
              <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(0,0,0,0.2)" />
            </svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "rgba(0,0,0,0.28)", letterSpacing: "0.08em" }}>New Delhi</span>
          </div>
          <a href="#join"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1a1a1a", textDecoration: "none", fontWeight: 700, borderBottom: "1px solid rgba(0,0,0,0.35)", paddingBottom: "2px" }}>
            Notify Me When Live
            <svg width="10" height="7" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </section>
    );
  }

  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", background: "#F4EFE6", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "54%", zIndex: 0 }}>
        <Image src="/images/Homepage/anatarnaad_landscpae_real.svg" alt="Antarnaad — summer programme"
          fill unoptimized sizes="54vw" style={{ objectFit: "cover", objectPosition: "center" }} />
      </div>
      <div style={{ position: "absolute", top: "28px", left: "28px", zIndex: 10, background: "rgba(144,26,28,0.9)", padding: "5px 14px", fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#ffffff" }}>
        Coming Soon
      </div>
      <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", zIndex: 2, maxWidth: "370px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
          <div style={{ width: "20px", height: "1px", background: "var(--primary-red)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)" }}>7 Art Forms · 4 Spaces · One Journey</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(42px, 5vw, 76px)", lineHeight: 1.03, color: "#1a1a1a", marginBottom: "24px" }}>
          Antarnaad
        </h2>
        <div style={{ width: "28px", height: "1px", background: "var(--primary-red)", marginBottom: "24px" }} />
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.85, color: "rgba(0,0,0,0.48)", marginBottom: "14px" }}>
          Arrive fully into the moment, where the noise of elsewhere begins to dissolve. In this state, we do not rush to interpret or define; instead, we allow ourselves to linger, to feel, and to notice what unfolds naturally.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "38px" }}>
          <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
            <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(0,0,0,0.2)" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.28)", letterSpacing: "0.08em" }}>New Delhi</span>
        </div>
        <a href="#join"
          style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1a1a1a", textDecoration: "none", fontWeight: 700, borderBottom: "1px solid rgba(0,0,0,0.4)", paddingBottom: "3px", transition: "color 0.25s, border-color 0.25s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary-red)"; e.currentTarget.style.borderBottomColor = "var(--primary-red)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#1a1a1a"; e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.4)"; }}
        >
          Notify Me When Live
          <svg width="12" height="8" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel 3 — Heritage Cleanliness Project
──────────────────────────────────────────────────────────*/
function PanelHCP({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <section style={{ background: "#8B1E20" }}>
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ position: "relative", height: "210px", overflow: "hidden" }}>
            <Image src="/images/heritage cleaning/NolitterLegacy.png" alt="Heritage Cleanliness Project"
              fill sizes="calc(100vw - 40px)" style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>
        </div>
        <motion.div {...fadeUp} style={{ padding: "28px 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "16px", height: "1px", background: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>
              Community Initiative
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "34px", lineHeight: 1.08, color: "#ffffff", marginBottom: "14px" }}>
            The Heritage<br />Cleanliness<br />Project
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.78, color: "rgba(255,255,255,0.55)", marginBottom: "8px" }}>
            Every last Sunday, we gather at a heritage site — not just to clean, but to listen. To the stories that stone remembers.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "24px" }}>
            <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
              <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(255,255,255,0.3)" />
            </svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>Mehrauli Archaeological Park, Delhi</span>
          </div>
          <a href="#join"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ffffff", color: "#8B1E20", fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "12px 24px", textDecoration: "none", fontWeight: 600 }}>
            Volunteer Now
            <svg width="10" height="7" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </section>
    );
  }

  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", background: "#8B1E20", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 72% 50%, rgba(255,255,255,0.05) 0%, transparent 58%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "56%", zIndex: 1 }}>
        <Image src="/images/heritage cleaning/NolitterLegacy.png" alt="Heritage Cleanliness Project"
          fill sizes="56vw" style={{ objectFit: "cover", objectPosition: "center" }} />
      </div>
      <div style={{ position: "absolute", left: "7%", top: "50%", transform: "translateY(-50%)", zIndex: 3, maxWidth: "420px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
          <div style={{ width: "20px", height: "1px", background: "rgba(255,255,255,0.42)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)" }}>Community Initiative</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px, 4.8vw, 72px)", lineHeight: 1.03, color: "#ffffff", marginBottom: "24px" }}>
          The Heritage<br />Cleanliness<br />Project
        </h2>
        <div style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.35)", marginBottom: "24px" }} />
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.85, color: "rgba(255,255,255,0.5)", marginBottom: "14px" }}>
          Every last Sunday, we gather at a heritage site — not just to clean, but to listen. To the stories that stone remembers.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "38px" }}>
          <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
            <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(255,255,255,0.3)" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.08em" }}>Mehrauli Archaeological Park, Delhi</span>
        </div>
        <a href="#join"
          style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#ffffff", color: "#8B1E20", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 32px", textDecoration: "none", fontWeight: 600, transition: "background 0.25s, color 0.25s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#0D0B09"; e.currentTarget.style.color = "#ffffff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#8B1E20"; }}
        >
          Volunteer Now
          <svg width="12" height="8" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel 4 — Inkpot India Conclave
──────────────────────────────────────────────────────────*/
function PanelConclave({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <section style={{ background: "#EDEAF5" }}>
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ position: "relative", height: "210px", overflow: "hidden" }}>
            <Image src="/images/experiences/image%20(2).jpeg" alt="Inkpot India Conclave"
              fill sizes="calc(100vw - 40px)" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
          </div>
        </div>
        <motion.div {...fadeUp} style={{ padding: "28px 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "16px", height: "1px", background: "var(--primary-red)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)" }}>
              Thought Leadership · Annual
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "34px", lineHeight: 1.08, color: "#1a1a1a", marginBottom: "14px" }}>
            Inkpot India<br />Conclave
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.78, color: "rgba(0,0,0,0.5)", marginBottom: "8px" }}>
            Writers, artists, thinkers — convening to re-ink, reassert and reimagine Indian culture on the world stage.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "24px" }}>
            <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
              <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(0,0,0,0.2)" />
            </svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "rgba(0,0,0,0.28)", letterSpacing: "0.08em" }}>New Delhi</span>
          </div>
          <a href="https://www.inkpotindiaconclave.com/" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1a1a1a", textDecoration: "none" }}>
            Visit Conclave
            <svg width="12" height="8" viewBox="0 0 16 10" fill="none">
              <path d="M1 5h14M9 1l5 4-5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </section>
    );
  }

  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", background: "#EDEAF5", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "52%", zIndex: 0 }}>
        <Image src="/images/experiences/image%20(2).jpeg" alt="Inkpot India Conclave"
          fill sizes="52vw" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
      </div>
      <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", zIndex: 2, maxWidth: "400px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
          <div style={{ width: "20px", height: "1px", background: "var(--primary-red)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>
            Thought Leadership · Annual
          </span>
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(40px, 5.5vw, 80px)", lineHeight: 1.03, color: "#1a1a1a", marginBottom: "24px" }}>
          Inkpot India<br />Conclave
        </h2>
        <div style={{ width: "28px", height: "1px", background: "var(--primary-red)", marginBottom: "24px" }} />
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.85, color: "rgba(0,0,0,0.5)", marginBottom: "14px" }}>
          Writers, artists, thinkers — convening to re-ink, reassert and reimagine Indian culture on the world stage.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "38px" }}>
          <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
            <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(0,0,0,0.2)" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.28)", letterSpacing: "0.08em" }}>New Delhi</span>
        </div>
        <a href="https://www.inkpotindiaconclave.com/" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)", textDecoration: "none", transition: "color 0.25s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-red)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.55)")}
        >
          Visit Conclave
          <svg width="14" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 5h14M9 1l5 4-5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Root export
──────────────────────────────────────────────────────────*/
export default function OurExperiences() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div id="experiences">

      {/* ── Clean banner heading ── */}
      <section style={{ background: "#ffffff", padding: isMobile ? "48px 20px 40px" : "72px 72px 64px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "20px", height: "1px", background: "var(--primary-red)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--primary-red)" }}>
              What We Do
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: isMobile ? "38px" : "clamp(36px, 4.8vw, 70px)", color: "#0D0B09", lineHeight: 1.05 }}>
            Our Experiences
          </h2>
        </div>
      </section>

      {/* ── Four panels ── */}
      <PanelSOTS isMobile={isMobile} />
      <PanelAntarnaad isMobile={isMobile} />
      <PanelHCP isMobile={isMobile} />
      <PanelConclave isMobile={isMobile} />

    </div>
  );
}
