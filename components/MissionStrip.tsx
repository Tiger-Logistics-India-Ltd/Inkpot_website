"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function MissionStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="story"
      className="relative py-28 md:py-36 px-6"
      style={{ background: "#0D0D0D" }}
    >
      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.3)] to-transparent" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center"
      >
        <blockquote
          className="text-2xl md:text-4xl lg:text-[2.75rem] leading-snug italic text-[#F5F0E8] mb-8"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          &ldquo;To bring our music, literature, architecture, and performance
          back into the light — not as relics, but as living forces of beauty
          and imagination.&rdquo;
        </blockquote>
        <p
          className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          — Inkpot India
        </p>
      </motion.div>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.3)] to-transparent" />
    </section>
  );
}
