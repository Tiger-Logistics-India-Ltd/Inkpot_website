"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────
   Scroll-driven overlay — slides up from 100% to 0%
   as the user scrolls through [range[0], range[1]] progress
──────────────────────────────────────────────────────────*/
function OverlayPanel({
  progress,
  range,
  zIndex,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  zIndex: number;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, range, ["100%", "0%"]);
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        zIndex,
        overflow: "hidden",
        y,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel 1 — Songs of the Stone
   Dark · cinematic · image bleeds right
──────────────────────────────────────────────────────────*/
function PanelSOTS() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#0D0B09", overflow: "hidden" }}>

      {/* Full-bleed image right 58% */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "58%", zIndex: 0 }}>
        <Image
          src="/images/Songs of the stone/songsofthestone.png"
          alt="Songs of the Stone — heritage performance"
          fill
          priority
          sizes="58vw"
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
        />
      </div>

      {/* Text — vertically centred on left */}
      <div style={{
        position: "absolute", left: "7%", top: "50%", transform: "translateY(-50%)",
        zIndex: 2, maxWidth: "400px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
          <div style={{ width: "20px", height: "1px", background: "var(--primary-red)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)" }}>
            Music &amp; Heritage · Ongoing
          </span>
        </div>

        <h2 style={{
          fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400,
          fontSize: "clamp(40px, 5.5vw, 82px)", lineHeight: 1.03, color: "#ffffff", marginBottom: "24px",
        }}>
          Songs of<br />the Stone
        </h2>

        <div style={{ width: "28px", height: "1px", background: "var(--primary-red)", marginBottom: "24px" }} />

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.85,
          color: "rgba(255,255,255,0.44)", marginBottom: "14px",
        }}>
          After-hours cultural evenings at Delhi&rsquo;s heritage monuments. Space becomes stage. Stone becomes story.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "38px" }}>
          <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
            <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(255,255,255,0.25)" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>
            Heritage Monuments, Delhi
          </span>
        </div>

        <a
          href="https://www.songsofthestone.com/"
          target="_blank" rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.55)", textDecoration: "none",
            transition: "color 0.25s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
        >
          Explore Experience
          <svg width="14" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 5h14M9 1l5 4-5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel 2 — Antarnaad
   Warm ivory · intimate · image left
──────────────────────────────────────────────────────────*/
function PanelAntarnaad() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#F4EFE6", overflow: "hidden" }}>

      {/* Image left 54% */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "54%", zIndex: 0 }}>
        <Image
          src="/images/experiences/224A3705.JPG"
          alt="Antarnaad — summer programme"
          fill
          sizes="54vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Coming soon badge */}
      <div style={{
        position: "absolute", top: "28px", left: "28px", zIndex: 10,
        background: "rgba(144,26,28,0.9)", padding: "5px 14px",
        fontFamily: "var(--font-body)", fontSize: "8px",
        letterSpacing: "0.22em", textTransform: "uppercase", color: "#ffffff",
      }}>
        Coming Soon
      </div>

      {/* Text — right */}
      <div style={{
        position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)",
        zIndex: 2, maxWidth: "370px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
          <div style={{ width: "20px", height: "1px", background: "var(--primary-red)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#000000" }}>
            Summer Programme
          </span>
        </div>

        <h2 style={{
          fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400,
          fontSize: "clamp(42px, 5vw, 76px)", lineHeight: 1.03, color: "#000000", marginBottom: "24px",
        }}>
          Antarnaad
        </h2>

        <div style={{ width: "28px", height: "1px", background: "var(--primary-red)", marginBottom: "24px" }} />

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.85,
          color: "#000000", marginBottom: "14px",
        }}>
          A summer immersion into Indian music, storytelling, and the performing arts — for the next generation of cultural thinkers.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "38px" }}>
          <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
            <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#000000" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "#000000", letterSpacing: "0.08em" }}>
            New Delhi
          </span>
        </div>

        <span style={{
          fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#000000", cursor: "default",
        }}>
          Notify Me When Live
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel 3 — Heritage Cleanliness Project
   Deep red · activist · image right
──────────────────────────────────────────────────────────*/
function PanelHCP() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#8B1E20", overflow: "hidden" }}>

      {/* Subtle radial highlight */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 72% 50%, rgba(255,255,255,0.05) 0%, transparent 58%)",
        zIndex: 0, pointerEvents: "none",
      }} />

      {/* Image right 50% */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", zIndex: 1 }}>
        <Image
          src="/images/heritage cleaning/NolitterLegacy.png"
          alt="Heritage Cleanliness Project"
          fill
          sizes="50vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Active badge */}
      {/* <div style={{
        position: "absolute", top: "28px", right: "28px", zIndex: 10,
        background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.22)",
        padding: "5px 14px", display: "flex", alignItems: "center", gap: "6px",
        fontFamily: "var(--font-body)", fontSize: "8px",
        letterSpacing: "0.22em", textTransform: "uppercase", color: "#ffffff",
      }}>
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ade80" }} />
        Active
      </div> */}

      {/* Text — left */}
      <div style={{
        position: "absolute", left: "7%", top: "50%", transform: "translateY(-50%)",
        zIndex: 3, maxWidth: "420px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
          <div style={{ width: "20px", height: "1px", background: "rgba(255,255,255,0.42)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>
            Community Initiative
          </span>
        </div>

        <h2 style={{
          fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400,
          fontSize: "clamp(36px, 4.8vw, 72px)", lineHeight: 1.03, color: "#ffffff", marginBottom: "24px",
        }}>
          The Heritage<br />Cleanliness<br />Project
        </h2>

        <div style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.35)", marginBottom: "24px" }} />

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.85,
          color: "rgba(255,255,255,0.5)", marginBottom: "14px",
        }}>
          Every last Sunday, we gather at a heritage site — not just to clean, but to listen. To the stories that stone remembers.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "38px" }}>
          <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
            <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(255,255,255,0.3)" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.08em" }}>
            Mehrauli Archaeological Park, Delhi
          </span>
        </div>

        <a
          href="/events/heritage-cleanliness"
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "#ffffff", color: "#8B1E20",
            fontFamily: "var(--font-body)", fontSize: "10px",
            letterSpacing: "0.2em", textTransform: "uppercase",
            padding: "14px 32px", textDecoration: "none", fontWeight: 600,
            transition: "background 0.25s, color 0.25s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#0D0B09"; e.currentTarget.style.color = "#ffffff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#8B1E20"; }}
        >
          Volunteer Now
          <svg width="12" height="8" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel 4 — Inkpot India Conclave
   Deep black · image left · text right
──────────────────────────────────────────────────────────*/
function PanelConclave() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#d6c2ff", overflow: "hidden" }}>

      {/* Image left 50% */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", zIndex: 0 }}>
        <Image
          src="/images/experiences/image (2).jpeg"
          alt="Inkpot India Conclave"
          fill
          sizes="50vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
      </div>

      {/* Annual badge */}
      {/* <div style={{
        position: "absolute", top: "28px", left: "28px", zIndex: 10,
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.18)",
        padding: "5px 14px", display: "flex", alignItems: "center", gap: "6px",
        fontFamily: "var(--font-body)", fontSize: "8px",
        letterSpacing: "0.22em", textTransform: "uppercase", color: "#ffffff",
      }}>
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--primary-red)" }} />
        Annual
      </div> */}

      {/* Text — right */}
      <div style={{
        position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)",
        zIndex: 2, maxWidth: "400px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
          <div style={{ width: "20px", height: "1px", background: "var(--primary-red)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#000000" }}>
            Thought Leadership · Annual
          </span>
        </div>

        <h2 style={{
          fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400,
          fontSize: "clamp(40px, 5.5vw, 80px)", lineHeight: 1.03, color: "#000000", marginBottom: "24px",
        }}>
          Inkpot India<br />Conclave
        </h2>

        <div style={{ width: "28px", height: "1px", background: "var(--primary-red)", marginBottom: "24px" }} />

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.85,
          color: "#000000", marginBottom: "14px",
        }}>
          Writers, artists, thinkers — convening to re-ink, reassert and reimagine Indian culture on the world stage.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "38px" }}>
          <svg width="8" height="11" viewBox="0 0 9 12" fill="none">
            <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#000000" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "#000000", letterSpacing: "0.08em" }}>
            New Delhi
          </span>
        </div>

        <a
          href="https://www.inkpotindiaconclave.com/"
          target="_blank" rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#901a1c", textDecoration: "none",
            transition: "color 0.25s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
        >
          Visit Conclave
          <svg width="14" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 5h14M9 1l5 4-5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Root export
──────────────────────────────────────────────────────────*/
export default function OurExperiences() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div id="experiences">

      {/* ── Clean banner heading ── */}
      <section style={{
        background: "#ffffff",
        padding: "72px 72px 64px",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div style={{ width: "20px", height: "1px", background: "var(--primary-red)" }} />
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "9px",
              letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--primary-red)",
            }}>
              What We Do
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(36px, 4.8vw, 70px)", color: "#0D0B09", lineHeight: 1.05,
          }}>
            Our Experiences
          </h2>
        </div>
      </section>

      {/* ── Scroll-driven cinematic panel stack ──
          500vh container → 400vh of scroll distance
          Ranges place each transition at ~1 viewport of scroll:
            Panel 2 covers panel 1 at [0.10 → 0.34]
            Panel 3 covers panel 2 at [0.44 → 0.68]
            Panel 4 covers panel 3 at [0.78 → 1.00]
      ── */}
      <div ref={containerRef} style={{ height: "500vh", position: "relative" }}>
        <div style={{
          position: "sticky", top: 0,
          height: "100vh", overflow: "hidden",
        }}>
          {/* Base layer — SOTS always visible behind */}
          <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden" }}>
            <PanelSOTS />
          </div>

          {/* Layer 2 — Antarnaad slides over SOTS */}
          <OverlayPanel progress={scrollYProgress} range={[0.10, 0.34]} zIndex={2}>
            <PanelAntarnaad />
          </OverlayPanel>

          {/* Layer 3 — HCP slides over Antarnaad */}
          <OverlayPanel progress={scrollYProgress} range={[0.44, 0.68]} zIndex={3}>
            <PanelHCP />
          </OverlayPanel>

          {/* Layer 4 — Conclave slides over HCP */}
          <OverlayPanel progress={scrollYProgress} range={[0.78, 1.00]} zIndex={4}>
            <PanelConclave />
          </OverlayPanel>
        </div>
      </div>

    </div>
  );
}
