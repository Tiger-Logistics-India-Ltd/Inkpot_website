"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function ConclaveStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative h-[440px] md:h-[540px] overflow-hidden rounded-3xl mx-4 lg:mx-10 my-6 md:my-10">
      {/* Background Image */}
      <Image
        src="/images/Inkpot%20India%20Conclave/saurav/224A3689.JPG"
        alt="Inkpot India Conclave"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]" />

      {/* Content */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <p
          className="text-white/60 text-xs tracking-[0.3em] uppercase mb-5"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Inkpot India Conclave
        </p>
        <h2
          className="text-3xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Re-ink. Rebrand. Reassert.
        </h2>
        <p
          className="text-white/60 text-base max-w-md mb-8"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          India&rsquo;s art and literature on the world stage.
        </p>
        <a
          href="#"
          className="bg-white text-[#1A1A1A] px-7 py-3 text-sm font-medium tracking-wide rounded-full hover:bg-white/90 transition-all duration-300"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Discover the Conclave
        </a>
      </motion.div>
    </section>
  );
}
