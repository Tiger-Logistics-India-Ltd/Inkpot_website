"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function ConclaveStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80"
        alt="Conference hall"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[rgba(10,10,10,0.75)]" />

      {/* Content */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <p
          className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Inkpot India Conclave
        </p>
        <h2
          className="text-4xl md:text-6xl lg:text-7xl text-[#F5F0E8] mb-5 leading-tight"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Re-ink. Rebrand. Reassert.
        </h2>
        <p
          className="text-[#F5F0E8]/60 text-base md:text-lg max-w-md mb-10"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          India&rsquo;s art and literature on the world stage.
        </p>
        <a
          href="#"
          className="border border-[#F5F0E8]/40 text-[#F5F0E8] px-8 py-3.5 text-sm tracking-wide hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Discover the Conclave
        </a>
      </motion.div>
    </section>
  );
}
