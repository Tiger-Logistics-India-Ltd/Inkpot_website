"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";

const experiences = [
  {
    num: "01", title: "Songs of the Stone", tag: "MUSIC & HERITAGE",
    image: "/images/Songs of the stone/Desktop.png",
    overlay: "linear-gradient(to right, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)",
    body: "After-hours cultural evenings at Delhi's heritage monuments. Space becomes stage. Arches become resonance. Stone becomes story.",
    href: "https://www.songsofthestone.com/",
    align: "left" as const,
  },
  {
    num: "02", title: "Antarnaad", tag: "SUMMER PROGRAMME",
    image: "/images/experiences/224A3705.JPG",
    overlay: "linear-gradient(to left, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)",
    body: "A summer immersion into Indian music, storytelling, and the performing arts — for the next generation.",
    href: "#",
    align: "right" as const,
  },
  {
    num: "03", title: "Inkpot India Conclave", tag: "THOUGHT LEADERSHIP",
    image: "/images/experiences/479A7421.JPG",
    overlay: "linear-gradient(to right, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)",
    body: "Writers, artists, thinkers — convening to re-ink, rebrand, and reassert Indian culture on the world stage.",
    href: "https://www.inkpotindiaconclave.com/",
    align: "left" as const,
  },
  {
    num: "04", title: "The Heritage Cleanliness Project", tag: "COMMUNITY INITIATIVE",
    image: "/images/heritage cleaning/NolitterLegacy.png",
    overlay: "linear-gradient(to left, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)",
    body: "A monthly clean-up woven with heritage storytelling. Those who tend to a place, belong to it.",
    href: "/events/heritage-cleanliness",
    align: "right" as const,
  },
];

const N = experiences.length;
const PANEL_H = "100vh";
const DUR = 1.05;

export default function OurExperiences() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const panelRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const activePanelRef = useRef(0);
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Initial positions — panel 0 visible, rest below */
    panelRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { y: i === 0 ? "0%" : "100%" });
    });
    layerRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { y: i === 0 ? "0%" : "15%" });
    });

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh   = window.innerHeight;
      const totalScrollable = rect.height - vh;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      if (scrolled < 0 || scrolled > totalScrollable) return;

      const progress    = scrolled / totalScrollable;
      const targetPanel = Math.round(progress * (N - 1));

      if (targetPanel === activePanelRef.current) return;

      const prev = activePanelRef.current;
      const dir  = targetPanel > prev ? 1 : -1;

      /* Kill every active tween before starting new ones */
      [...panelRefs.current, ...layerRefs.current].forEach(
        (el) => el && gsap.killTweensOf(el)
      );

      /* Park every panel that is neither the departing nor arriving one.
         This prevents mid-animation panels from being left in wrong positions
         when the user scrolls fast enough to skip a slide. */
      panelRefs.current.forEach((el, i) => {
        if (!el || i === prev || i === targetPanel) return;
        gsap.set(el, { y: i < targetPanel ? "-100%" : "100%" });
      });
      layerRefs.current.forEach((el, i) => {
        if (!el || i === prev || i === targetPanel) return;
        gsap.set(el, { y: i < targetPanel ? "-15%" : "15%" });
      });

      /* Snap the arriving panel to its correct off-screen start position.
         Required when skipping mid-animation (GSAP may have moved it). */
      const nextPanel = panelRefs.current[targetPanel];
      const nextLayer = layerRefs.current[targetPanel];
      const prevPanel = panelRefs.current[prev];
      const prevLayer = layerRefs.current[prev];

      if (nextPanel) gsap.set(nextPanel, { y: dir > 0 ? "100%" : "-100%" });
      if (nextLayer) gsap.set(nextLayer, { y: dir > 0 ? "15%" : "-15%" });

      /* Animate both panels simultaneously */
      const tl = gsap.timeline();
      if (prevPanel) tl.to(prevPanel, { y: dir > 0 ? "-100%" : "100%", duration: DUR, ease: "expo.inOut" }, 0);
      if (nextPanel) tl.to(nextPanel, { y: "0%",                         duration: DUR, ease: "expo.inOut" }, 0);
      if (prevLayer) tl.to(prevLayer, { y: dir > 0 ? "-15%" : "15%",    duration: DUR, ease: "expo.inOut" }, 0);
      if (nextLayer) tl.to(nextLayer, { y: "0%",                         duration: DUR, ease: "expo.inOut" }, 0);

      activePanelRef.current = targetPanel;
      setActivePanel(targetPanel);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="experiences"
      ref={sectionRef}
      style={{ background: "#000000", height: `${N * 100}vh` }}
    >
      <div style={{ position: "sticky", top: 0, height: PANEL_H, overflow: "hidden" }}>

        {experiences.map((exp, i) => (
          <ExperiencePanel
            key={exp.num}
            exp={exp}
            isActive={activePanel === i}
            panelRef={(el) => { panelRefs.current[i] = el; }}
            layerRef={(el) => { layerRefs.current[i] = el; }}
          />
        ))}

        {/* ── Vertical "Our Experiences" label strip — solid white ── */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "56px", zIndex: 20,
          pointerEvents: "none",
          background: "#ffffff",
          borderRight: "1px solid rgba(144,26,28,0.18)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "var(--primary-red)",
            writingMode: "vertical-rl", transform: "rotate(180deg)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
          }}>
            <span style={{ display: "inline-block", width: "1px", height: "36px", background: "var(--primary-red)" }} />
            Our Experiences
            <span style={{ display: "inline-block", width: "1px", height: "36px", background: "var(--primary-red)" }} />
          </span>
        </div>

        {/* ── Progress bar ── */}
        <div style={{
          position: "absolute", bottom: "40px", left: "50%",
          transform: "translateX(-50%)", zIndex: 20,
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
        }}>
          <div style={{ width: "220px", height: "2px", background: "rgba(144,26,28,0.22)", position: "relative" }}>
            <motion.div
              style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "var(--primary-red)" }}
              animate={{ width: `${((activePanel + 1) / N) * 100}%` }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)" }}>
            {String(activePanel + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </p>
        </div>

      </div>
    </section>
  );
}

function ExperiencePanel({
  exp, isActive, panelRef, layerRef,
}: {
  exp: typeof experiences[0];
  isActive: boolean;
  panelRef: (el: HTMLDivElement | null) => void;
  layerRef: (el: HTMLDivElement | null) => void;
}) {
  const isLeft = exp.align === "left";

  return (
    <div ref={panelRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Parallax background */}
      <div ref={layerRef} style={{ position: "absolute", inset: "-20% 0", willChange: "transform" }}>
        <Image
          src={exp.image}
          alt={exp.title}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: exp.overlay }} />

      {/* Number watermark */}
      <span style={{
        position: "absolute", fontFamily: "var(--font-heading)",
        fontSize: "clamp(80px, 10vw, 120px)", fontWeight: 400,
        color: "rgba(255,255,255,0.12)", lineHeight: 1,
        top: "24px", [isLeft ? "left" : "right"]: "24px",
        userSelect: "none", pointerEvents: "none",
      }}>
        {exp.num}
      </span>

      {/* Content */}
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          paddingLeft: isLeft ? "calc(56px + 10%)" : undefined,
          paddingRight: isLeft ? undefined : "10%",
          marginLeft: isLeft ? "0" : "auto",
          maxWidth: isLeft ? "none" : "520px",
          width: "100%",
          justifyContent: "center",
          alignItems: isLeft ? "flex-start" : "flex-end",
          textAlign: isLeft ? "left" : "right",
          transform: "translateY(40px)",
        }}
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.45, delay: isActive ? 0.45 : 0, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "12px" }}
        >
          {exp.tag}
        </motion.p>

        <motion.h3
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isActive ? 0 : 30, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: isActive ? 0.55 : 0, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.1, color: "#ffffff", marginBottom: "12px" }}
        >
          {exp.title}
        </motion.h3>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.45, delay: isActive ? 0.65 : 0, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "14px", color: "rgba(255,255,255,0.82)", lineHeight: 1.65, maxWidth: "400px", marginBottom: "22px" }}
        >
          {exp.body}
        </motion.p>

        <motion.a
          href={exp.href}
          target={exp.href.startsWith("http") ? "_blank" : undefined}
          rel={exp.href.startsWith("http") ? "noopener noreferrer" : undefined}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: isActive ? 0 : 16, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.4, delay: isActive ? 0.75 : 0, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.45)", color: "#ffffff", padding: "10px 24px", textDecoration: "none" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "transparent"; }}
        >
          Explore →
        </motion.a>
      </div>
    </div>
  );
}
