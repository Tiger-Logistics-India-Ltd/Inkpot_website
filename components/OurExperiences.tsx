"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";

const experiences = [
  {
    num: "01", title: "Songs of the Stone", tag: "MUSIC & HERITAGE",
    image: "/images/experiences/SOTS-76.jpg",
    overlay: "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.22) 60%, transparent 100%)",
    body: "After-hours cultural evenings at Delhi's heritage monuments. Space becomes stage. Arches become resonance. Stone becomes story.",
    align: "left" as const,
  },
  {
    num: "02", title: "Antarnaad", tag: "SUMMER PROGRAMME",
    image: "/images/experiences/224A3705.JPG",
    overlay: "linear-gradient(to left, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.22) 60%, transparent 100%)",
    body: "A summer immersion into Indian music, storytelling, and the performing arts — for the next generation.",
    align: "right" as const,
  },
  {
    num: "03", title: "Inkpot India Conclave", tag: "THOUGHT LEADERSHIP",
    image: "/images/experiences/479A7421.JPG",
    overlay: "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.22) 60%, transparent 100%)",
    body: "Writers, artists, thinkers — convening to re-ink, rebrand, and reassert Indian culture on the world stage.",
    align: "left" as const,
  },
  {
    num: "04", title: "The Heritage Cleanliness Project", tag: "COMMUNITY INITIATIVE",
    image: "/images/experiences/NolitterLegacy.png",
    overlay: "linear-gradient(to left, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.22) 60%, transparent 100%)",
    body: "A monthly clean-up woven with heritage storytelling. Those who tend to a place, belong to it.",
    align: "right" as const,
  },
];

export default function OurExperiences() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activePanelRef = useRef(0);
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Set initial stack: panel 0 visible, rest offscreen below
    panelRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { y: i === 0 ? "0%" : "100%" });
    });
    layerRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { y: i === 0 ? "0%" : "15%" });
    });

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScrollable = rect.height - vh;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      if (scrolled < 0 || scrolled > totalScrollable) return;

      const progress = scrolled / totalScrollable;
      const targetPanel = Math.min(
        experiences.length - 1,
        Math.floor(progress * experiences.length)
      );

      if (targetPanel !== activePanelRef.current) {
        const prev = activePanelRef.current;
        const dir = targetPanel > prev ? 1 : -1;

        const prevPanel = panelRefs.current[prev];
        const nextPanel = panelRefs.current[targetPanel];
        const prevLayer = layerRefs.current[prev];
        const nextLayer = layerRefs.current[targetPanel];

        // Panel container slides
        if (prevPanel) gsap.to(prevPanel, { y: dir > 0 ? "-100%" : "100%", duration: 0.85, ease: "power3.inOut" });
        if (nextPanel) gsap.fromTo(nextPanel, { y: dir > 0 ? "100%" : "-100%" }, { y: "0%", duration: 0.85, ease: "power3.inOut" });

        // Background image moves at different (slower) rate — the parallax
        if (prevLayer) gsap.to(prevLayer, { y: dir > 0 ? "-15%" : "15%", duration: 0.85, ease: "power3.inOut" });
        if (nextLayer) gsap.fromTo(nextLayer, { y: dir > 0 ? "15%" : "-15%" }, { y: "0%", duration: 0.85, ease: "power3.inOut" });

        activePanelRef.current = targetPanel;
        setActivePanel(targetPanel);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="experiences"
      ref={sectionRef}
      style={{ background: "#000000", height: `${experiences.length * 100}vh` }}
    >
      {/* Sticky slider viewport */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Panels */}
        {experiences.map((exp, i) => (
          <ExperiencePanel
            key={exp.num}
            exp={exp}
            isActive={activePanel === i}
            panelRef={(el) => { panelRefs.current[i] = el; }}
            layerRef={(el) => { layerRefs.current[i] = el; }}
          />
        ))}

        {/* Section label — top center overlay */}
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, padding: "28px 0", textAlign: "center", pointerEvents: "none" }}
        >
          <div className="flex items-center justify-center gap-3">
            <div style={{ width: "32px", height: "1px", background: "var(--primary-mustard)" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary-mustard)" }}>
              Our Experiences
            </p>
            <div style={{ width: "32px", height: "1px", background: "var(--primary-mustard)" }} />
          </div>
          {/* <p style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(18px, 1.8vw, 24px)", color: "var(--primary-white)", marginTop: "6px", opacity: 0.85 }}>
            Four Invitations to Rediscover India.
          </p> */}
        </div>

        {/* Progress bar — bottom center */}
        <div
          style={{ position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
        >
          <div style={{ width: "220px", height: "2px", background: "rgba(211,163,81,0.22)", position: "relative" }}>
            <motion.div
              style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "var(--primary-mustard)" }}
              animate={{ width: `${((activePanel + 1) / experiences.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(211,163,81,0.55)" }}>
            {String(activePanel + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}
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
      {/* Parallax background — inset gives travel room for GSAP */}
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
      <span
        style={{
          position: "absolute", fontFamily: "var(--font-heading)",
          fontSize: "clamp(100px, 14vw, 160px)", fontWeight: 400,
          color: "rgba(211,163,81,0.15)", lineHeight: 1,
          top: "32px", [isLeft ? "left" : "right"]: "32px",
          userSelect: "none", pointerEvents: "none",
        }}
      >
        {exp.num}
      </span>

      {/* Content — staggered fade-up keyed to isActive */}
      <div
        className="relative z-10 flex h-full"
        style={{
          flexDirection: "column",
          paddingLeft: isLeft ? "10%" : undefined,
          paddingRight: isLeft ? undefined : "10%",
          marginLeft: isLeft ? "0" : "auto",
          maxWidth: "560px", width: "100%",
          justifyContent: "flex-end",
          paddingBottom: "80px",
          alignItems: isLeft ? "flex-start" : "flex-end",
          textAlign: isLeft ? "left" : "right",
        }}
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: isActive ? 0.65 : 0, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--primary-mustard)", marginBottom: "16px" }}
        >
          {exp.tag}
        </motion.p>

        <motion.h3
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isActive ? 0 : 30, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.55, delay: isActive ? 0.77 : 0, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 56px)", lineHeight: 1.1, color: "var(--primary-white)", marginBottom: "20px" }}
        >
          {exp.title}
        </motion.h3>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: isActive ? 0.89 : 0, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "16px", color: "var(--primary-cream)", lineHeight: 1.7, maxWidth: "420px", marginBottom: "32px" }}
        >
          {exp.body}
        </motion.p>

        <motion.a
          href="#"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: isActive ? 0 : 16, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.45, delay: isActive ? 1.01 : 0, ease: "easeOut" }}
          className="transition-all duration-300"
          style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(226,203,163,0.55)", color: "var(--primary-cream)", padding: "12px 28px" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary-mustard)"; e.currentTarget.style.color = "var(--primary-mustard)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(226,203,163,0.55)"; e.currentTarget.style.color = "var(--primary-cream)"; }}
        >
          Explore →
        </motion.a>
      </div>
    </div>
  );
}
