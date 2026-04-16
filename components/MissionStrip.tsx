"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function MissionStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="story"
      className="py-20 md:py-28 px-6"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-xl mx-auto text-center"
      >
        <div className="w-10 h-px bg-[#111111]/20 mx-auto mb-10" />
        <blockquote
          className="text-xl md:text-2xl lg:text-3xl leading-[1.45] italic text-[#111111] mb-8"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          &ldquo;To bring our music, literature, architecture, and performance
          back into the light — not as relics, but as living forces of beauty
          and imagination.&rdquo;
        </blockquote>
        <p
          className="text-[#111111]/35 text-xs tracking-[0.35em] uppercase"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          — Inkpot India
        </p>
        <div className="w-10 h-px bg-[#111111]/20 mx-auto mt-10" />
      </motion.div>
    </section>
  );
}
