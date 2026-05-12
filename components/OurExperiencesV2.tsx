"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

interface Exp {
  num: string;
  tag: string;
  title: string;
  body: string;
  image: string;
  imageLeft: boolean;
  cta: { label: string; href: string } | null;
}

const experiences: Exp[] = [
  {
    num: "01",
    tag: "Music & Heritage",
    title: "Songs of the Stone",
    body: "After-hours cultural evenings at Delhi's heritage monuments. Space becomes stage. Arches become resonance. Stone becomes story.",
    image: "/images/experiences/SOTS-76.jpg",
    imageLeft: true,
    cta: { label: "Visit Website", href: "https://www.songsofthestone.com/" },
  },
  {
    num: "02",
    tag: "Summer Programme",
    title: "Antarnaad",
    body: "A summer immersion into Indian music, storytelling, and the performing arts — for the next generation of cultural thinkers.",
    image: "/images/experiences/224A3705.JPG",
    imageLeft: false,
    cta: null,
  },
  {
    num: "03",
    tag: "Thought Leadership",
    title: "Inkpot India Conclave",
    body: "Writers, artists, thinkers — convening to re-ink, rebrand, and reassert Indian culture on the world stage.",
    image: "/images/experiences/479A7421.JPG",
    imageLeft: true,
    cta: { label: "Visit Website", href: "https://www.inkpotindiaconclave.com/" },
  },
  {
    num: "04",
    tag: "Community Initiative",
    title: "The Heritage Cleanliness Project",
    body: "A monthly clean-up woven with heritage storytelling. Those who tend to a place, belong to it.",
    image: "/images/heritage cleaning/NolitterLegacy.png",
    imageLeft: false,
    cta: { label: "Volunteer Now", href: "/events/heritage-cleanliness" },
  },
];

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function OurExperiencesV2() {
  return (
    <section style={{ background: "#F7F5F1" }}>

      {/* ── Section header ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "108px 80px 72px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
            <div style={{ width: "28px", height: "1px", background: "var(--primary-red)" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--primary-red)", margin: 0 }}>
              Explore · Discover · Belong
            </p>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(38px, 4.5vw, 60px)", color: "#111111", lineHeight: 1.06, margin: 0 }}>
            What We Create.
          </h2>
        </motion.div>
      </div>

      {/* ── Experience spreads ── */}
      {experiences.map((exp, i) => (
        <ExperienceSpread key={exp.num} exp={exp} index={i} />
      ))}

      <div style={{ height: "100px" }} />
    </section>
  );
}

function ExperienceSpread({ exp, index }: { exp: Exp; index: number }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  const inView   = useInView(textRef, { once: true, amount: 0.22 });

  /* Scroll-linked parallax — image shifts at ~16% of page scroll speed */
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  /* ── Image column ── */
  const imageCol = (
    <div style={{ position: "relative", minHeight: "82vh", overflow: "hidden" }}>
      <motion.div
        style={{
          position: "absolute",
          top: "-16%", bottom: "-16%", left: 0, right: 0,
          y: imgY,
          willChange: "transform",
        }}
      >
        <Image
          src={exp.image}
          alt={exp.title}
          fill
          sizes="(max-width: 1400px) 58vw, 820px"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </motion.div>

      {/* Subtle vignette on content side */}
      <div style={{
        position: "absolute", inset: 0,
        background: exp.imageLeft
          ? "linear-gradient(to right, transparent 75%, rgba(247,245,241,0.4) 100%)"
          : "linear-gradient(to left,  transparent 75%, rgba(247,245,241,0.4) 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );

  /* ── Text column ── */
  const textCol = (
    <div
      ref={textRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: exp.imageLeft ? "80px 80px 80px 72px" : "80px 72px 80px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Giant faded number — decorative */}
      <span style={{
        position: "absolute",
        fontFamily: "var(--font-heading)",
        fontSize: "clamp(120px, 14vw, 200px)",
        fontWeight: 400,
        color: "rgba(0,0,0,0.035)",
        lineHeight: 1,
        bottom: "-16px",
        right: exp.imageLeft ? "32px" : "auto",
        left: exp.imageLeft ? "auto" : "32px",
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {exp.num}
      </span>

      {/* Tag */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
        style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--primary-red)", margin: "0 0 20px" }}
      >
        {exp.tag}
      </motion.p>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, delay: 0.13, ease: EASE }}
        style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.2vw, 52px)", lineHeight: 1.08, color: "#111111", margin: "0 0 26px" }}
      >
        {exp.title}
      </motion.h3>

      {/* Thin rule */}
      <motion.div
        initial={{ opacity: 0, width: "0px" }}
        animate={inView ? { opacity: 1, width: "44px" } : {}}
        transition={{ duration: 0.55, delay: 0.22, ease: EASE }}
        style={{ height: "1px", background: "rgba(0,0,0,0.18)", marginBottom: "26px" }}
      />

      {/* Body */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
        style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.82, color: "rgba(0,0,0,0.52)", maxWidth: "360px", margin: "0 0 38px" }}
      >
        {exp.body}
      </motion.p>

      {/* CTA */}
      {exp.cta && (
        <motion.a
          href={exp.cta.href}
          target={exp.cta.href.startsWith("http") ? "_blank" : undefined}
          rel={exp.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.4, ease: EASE }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#111111",
            textDecoration: "none",
            width: "fit-content",
            paddingBottom: "3px",
            borderBottom: "1px solid rgba(0,0,0,0.22)",
            transition: "color 0.22s, border-color 0.22s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary-red)"; e.currentTarget.style.borderBottomColor = "var(--primary-red)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#111111"; e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.22)"; }}
        >
          {exp.cta.label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.a>
      )}
    </div>
  );

  return (
    <>
      {/* Hairline separator between spreads */}
      {index > 0 && (
        <div style={{ width: "100%", height: "1px", background: "rgba(0,0,0,0.07)" }} />
      )}

      <div
        ref={panelRef}
        style={{ display: "grid", gridTemplateColumns: "58fr 42fr" }}
      >
        {exp.imageLeft ? (
          <>{imageCol}{textCol}</>
        ) : (
          <>{textCol}{imageCol}</>
        )}
      </div>
    </>
  );
}
