"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";

const testimonials = [
  {
    quote: "Inkpot India creates spaces where heritage feels alive and urgent — not archived.",
    name: "GAZAL",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80",
  },
  {
    quote: "Every event feels like stepping into a living, breathing story. The curation is impeccable.",
    name: "SHALU",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
  },
  {
    quote: "They've managed to make India's cultural wealth feel contemporary and vital — not nostalgic.",
    name: "ERIC",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
  },
  {
    quote: "A rare institution that honours tradition while boldly reimagining its future.",
    name: "TUHINA",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&q=80",
  },
  {
    quote: "What Inkpot does is profound: they make you feel like an insider to something sacred and beautiful.",
    name: "IRADO",
    image: "https://images.unsplash.com/photo-1519060825752-c4832f2685e3?w=1920&q=80",
  },
  {
    quote: "An experience that lingers — in memory, in conversation, in longing to return.",
    name: "SIKKAWALA",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80",
  },
  {
    quote: "For the first time, I felt Indian heritage wasn't being preserved — it was being celebrated.",
    name: "SUHAVINI",
    image: "https://images.unsplash.com/photo-1526711657229-e7e080ed7aa1?w=1920&q=80",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activePanelRef = useRef(0);
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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
        testimonials.length - 1,
        Math.floor(progress * testimonials.length)
      );

      if (targetPanel !== activePanelRef.current) {
        const prev = activePanelRef.current;
        const dir = targetPanel > prev ? 1 : -1;

        const prevPanel = panelRefs.current[prev];
        const nextPanel = panelRefs.current[targetPanel];
        const prevLayer = layerRefs.current[prev];
        const nextLayer = layerRefs.current[targetPanel];

        if (prevPanel) gsap.to(prevPanel, { y: dir > 0 ? "-100%" : "100%", duration: 0.85, ease: "power3.inOut" });
        if (nextPanel) gsap.fromTo(nextPanel, { y: dir > 0 ? "100%" : "-100%" }, { y: "0%", duration: 0.85, ease: "power3.inOut" });

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
      ref={sectionRef}
      style={{ height: `${testimonials.length * 100}vh` }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Panels */}
        {testimonials.map((t, i) => (
          <TestimonialPanel
            key={t.name}
            item={t}
            isActive={activePanel === i}
            panelRef={(el) => { panelRefs.current[i] = el; }}
            layerRef={(el) => { layerRefs.current[i] = el; }}
          />
        ))}

        {/* Section label */}
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, padding: "28px 0", textAlign: "center", pointerEvents: "none" }}
        >
          <div className="flex items-center justify-center gap-3">
            <div style={{ width: "32px", height: "1px", background: "var(--primary-mustard)" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary-mustard)" }}>
              Voices
            </p>
            <div style={{ width: "32px", height: "1px", background: "var(--primary-mustard)" }} />
          </div>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(18px, 1.8vw, 24px)", color: "var(--primary-white)", marginTop: "6px", opacity: 0.85 }}>
            What People Say.
          </p>
        </div>

        {/* Progress bar */}
        <div
          style={{ position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
        >
          <div style={{ width: "220px", height: "2px", background: "rgba(211,163,81,0.22)", position: "relative" }}>
            <motion.div
              style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "var(--primary-mustard)" }}
              animate={{ width: `${((activePanel + 1) / testimonials.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(211,163,81,0.55)" }}>
            {String(activePanel + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </p>
        </div>

      </div>
    </section>
  );
}

function TestimonialPanel({
  item, isActive, panelRef, layerRef,
}: {
  item: typeof testimonials[0];
  isActive: boolean;
  panelRef: (el: HTMLDivElement | null) => void;
  layerRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={panelRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Parallax background */}
      <div ref={layerRef} style={{ position: "absolute", inset: "-20% 0", willChange: "transform" }}>
        <Image
          src={item.image}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Dark atmospheric overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.76)" }} />

      {/* Quote content — centered */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full"
        style={{ padding: "80px 10%", textAlign: "center" }}
      >
        {/* Opening quote mark */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 0.45 : 0 }}
          transition={{ duration: 0.5, delay: isActive ? 0.5 : 0 }}
          style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(80px, 10vw, 120px)", color: "var(--primary-mustard)", lineHeight: 0.8, marginBottom: "16px", display: "block" }}
        >
          &ldquo;
        </motion.span>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
          transition={{ duration: 0.65, delay: isActive ? 0.65 : 0, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px, 2.8vw, 36px)", color: "var(--primary-white)", lineHeight: 1.55, maxWidth: "820px" }}
        >
          {item.quote}
        </motion.blockquote>

        {/* Gold divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: isActive ? 0.95 : 0, ease: "easeOut" }}
          style={{ height: "1px", background: "var(--primary-mustard)", width: "56px", margin: "28px auto 20px", transformOrigin: "center" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: isActive ? 1.05 : 0 }}
          style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--primary-mustard)" }}
        >
          {item.name}
        </motion.p>
      </div>
    </div>
  );
}
