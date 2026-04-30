"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutBelief() {
  return (
    <section id="about" className="relative w-full overflow-hidden" style={{ background: "var(--primary-white)", minHeight: "580px" }}>
      {/* Banner SVG */}
      <div className="absolute inset-0">
        <Image src="/images/Homepage/banner.svg" alt="Inkpot India banner" fill className="object-cover object-center" sizes="100vw" priority />
      </div>

      {/* Left fade — strong enough so brown text reads on linen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(245,245,240,0.98) 0%, rgba(245,245,240,0.92) 42%, rgba(245,245,240,0.30) 72%, rgba(245,245,240,0) 100%)" }}
      />

      <div
        className="relative z-10 flex flex-col justify-center mx-auto px-8 lg:px-20"
        style={{ maxWidth: "1280px", minHeight: "580px", paddingTop: "100px", paddingBottom: "100px" }}
      >
        {/* Headline — simple fade-up, reliable across all scroll states */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(52px, 7vw, 92px)",
            lineHeight: 1.05,
            color: "var(--primary-brown)",
            maxWidth: "680px",
          }}
        >
          Re-Inking Our<br />Cultural Heritage
        </motion.h2>

        {/* Mustard draw-in line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          style={{ height: "2px", background: "linear-gradient(to right, var(--primary-mustard), rgba(211,163,81,0))", maxWidth: "380px", marginTop: "28px", transformOrigin: "left" }}
        />
      </div>
    </section>
  );
}
