"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGsapParallax } from "@/hooks/useGsapParallax";

export default function Hero() {
  const { wrapperRef, layerRef } = useGsapParallax(0.4);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: isMobile ? "60vh" : "100vh", minHeight: isMobile ? "420px" : "700px" }}>

      {/* Parallax video layer */}
      <div className="parallax-wrapper" ref={wrapperRef}>
        <div className="parallax-layer" ref={layerRef}>
          <video
            ref={videoRef}
            src="/images/Homepage/hero_banner_3.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      </div>

      {/* Black gradient overlay */}
      <div
        className="parallax-overlay"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.42) 45%, rgba(0,0,0,0.85) 100%)" }}
      />

      {/* ── Centered headline ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
          marginBottom: "20px",
        }}>
          Inkpot India
        </p>
        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(36px, 5.5vw, 76px)",
          lineHeight: 1.1,
          color: "#ffffff",
          maxWidth: "800px",
        }}>
          Culture is how we<br />find each other
        </h1>
        <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.3)", margin: "28px auto 0" }} />
      </motion.div>

      {/* ── CTA — center ── */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? "56px" : "64px",
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          padding: "0 48px",
        }}
      >
        <motion.a
          href="#experiences"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
          className="text-white"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "var(--primary-red)",
            padding: "14px 36px",
            textDecoration: "none",
            transition: "background 0.25s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#7a1517")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
        >
          Explore Experiences
        </motion.a>
      </div>

      {/* ── Location credit — bottom right, below CTA ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: isMobile ? "20px" : "22px",
          right: isMobile ? "20px" : "48px",
          zIndex: 10,
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.88)",
          fontWeight: 700,
        }}
      >
        — Agra Fort
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ bottom: "12px" }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.25)" }} />
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ color: "rgba(255,255,255,0.35)" }}>
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>

    </section>
  );
}
