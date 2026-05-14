"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote: "From the moment I entered, it's been magical. A miraculous program full of art and joy.",
    name: "Elena Barman",
    title: "President, Indian Association of Russian Compatriots",
  },
  {
    quote: "The Qutub Minar is looking so beautiful, everything is lit up. The performance was phenomenal.",
    name: "Sunhana Nanda",
    title: "Attendee, Songs of the Stone",
  },
  {
    quote: "Mr. Niazi's sitar dazzled all of us. I can't wait for more of this to happen in India.",
    name: "Suvir Saran",
    title: "Master Chef",
  },
  {
    quote: "I was actually being a part of history — the first sitar concert at the Qutub Minar.",
    name: "Ashmita Tewari",
    title: "Attendee, Songs of the Stone",
  },
  {
    quote: "Not of this scale or so well put together. Music that makes you experience your deeper emotions.",
    name: "Tuhani Raj",
    title: "Attendee, Songs of the Stone",
  },
  {
    quote: "A surreal evening. It speaks so highly of our cultural heritage which we should all be proud of.",
    name: "Sanjay Suchir",
    title: "Attendee, Songs of the Stone",
  },
  {
    quote: "Inkpot is a very positive development to showcase our culture — our country's biggest asset. This showcasing of literature, music, art, theatre and design is what privileges India at its best.",
    name: "Dr. Shashi Tharoor",
    title: "Author, Politician & Former International Civil Servant",
  },
  {
    quote: "Conferences like Inkpot are super important because they create platforms for all kinds of ideas. Without an idea you can't evolve as a human or as a society.",
    name: "Sanjoy K. Roy",
    title: "Festival Director, Jaipur Literature Festival",
  },
  {
    quote: "We need festivals like Inkpot so that people and thinkers come together — where there is discussion, it always ignites interest and opens new doors and windows.",
    name: "Shovana Narayan",
    title: "National Award Winning Kathak Dancer",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [current, paused]);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ background: "var(--primary-red)", borderTop: "1px solid rgba(255,255,255,0.20)", borderBottom: "1px solid rgba(255,255,255,0.20)" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 200px", alignItems: "center", maxWidth: "1280px", margin: "0 auto", padding: "0 48px", minHeight: "175px" }}>

        {/* Left: label */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderRight: "1px solid rgba(255,255,255,0.2)", paddingRight: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "24px", height: "1px", background: "rgba(255,255,255,0.7)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
              Voices
            </span>
          </div>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "18px", color: "#ffffff", fontWeight: 400, lineHeight: 1.2 }}>
            What People Say
          </p>
        </div>

        {/* Centre: quote */}
        <div style={{ padding: "32px 48px", overflow: "hidden", position: "relative" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, y: direction > 0 ? 16 : -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction > 0 ? -16 : 16 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(15px, 1.4vw, 19px)", color: "#ffffff", lineHeight: 1.6, fontWeight: 400, marginBottom: "12px" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.15em", marginRight: "4px" }}>&ldquo;</span>
                {testimonials[current].quote}
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.15em", marginLeft: "4px" }}>&rdquo;</span>
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "20px", height: "1px", background: "rgba(255,255,255,0.6)" }} />
                <span style={{ fontFamily: "var(--font-subheading)", fontSize: "11px", color: "#ffffff", letterSpacing: "0.06em" }}>
                  {testimonials[current].name}
                </span>
                {testimonials[current].title && (
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}>
                    · {testimonials[current].title}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: controls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "16px", borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: "40px" }}>
          {/* Dots */}
          <div style={{ display: "flex", gap: "6px" }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 1 : -1)}
                aria-label={`Slide ${i + 1}`}
                style={{ width: i === current ? "20px" : "6px", height: "2px", background: i === current ? "#ffffff" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", padding: 0, transition: "width 0.3s, background 0.3s" }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => go((current - 1 + testimonials.length) % testimonials.length, -1)}
              aria-label="Previous"
              style={{ width: "36px", height: "36px", border: "1px solid rgba(255,255,255,0.35)", background: "none", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={() => go((current + 1) % testimonials.length, 1)}
              aria-label="Next"
              style={{ width: "36px", height: "36px", border: "1px solid rgba(255,255,255,0.35)", background: "none", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          {/* Counter */}
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)" }}>
            {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>

      </div>
    </section>
  );
}
