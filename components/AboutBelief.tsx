"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutBelief() {
  return (
    <section id="about" className="bg-[#FAF8F4] overflow-hidden" style={{ paddingTop: "56px", paddingBottom: "56px" }}>
      <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: "1280px" }}>

        {/* ── DESKTOP ── */}
        <div
          className="hidden lg:grid"
          style={{ gridTemplateColumns: "0.9fr 1.1fr", gap: "64px", alignItems: "start" }}
        >
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "360px", marginLeft: "10%" }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#000000" }}>
              ABOUT INKPOT INDIA
            </p>

            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px, 2.6vw, 36px)", lineHeight: 1.18,  color: "var(--primary-red)" }}>
              Re-Inking Our Cultural Heritage
            </h2>

            

            <p style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", lineHeight: 1.7, color: "#000000" }}>
              Inkpot India is a community-driven platform that uncovers hidden stories, celebrates heritage, and captures the essence of India through words, walks and visuals.
            </p>

            <a
              href="/about"
              style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#000000", display: "inline-flex", alignItems: "center", gap: "6px", borderBottom: "1px solid #D3A351", paddingBottom: "1px" }}
            >
              Know More About Us →
            </a>
          </motion.div>

          {/* IMAGE COLLAGE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
          >
            <div
              className="grid"
              style={{ gridTemplateColumns: "1.4fr 0.8fr 0.7fr 0.7fr", gap: "6px", height: "240px" }}
            >
              <div className="relative overflow-hidden">
                <Image src="/images/Homepage/about/big_square.png" alt="Inkpot India" fill className="object-cover" sizes="18vw" />
              </div>

              <div className="grid" style={{ gridTemplateRows: "1.2fr 1fr", gap: "6px" }}>
                <div className="relative overflow-hidden">
                  <Image src="/images/Homepage/about/Top (slightly taller).png" alt="Inkpot India" fill className="object-cover" sizes="10vw" />
                </div>
                <div className="relative overflow-hidden">
                  <Image src="/images/Homepage/about/Bottom.png" alt="Inkpot India" fill className="object-cover" sizes="10vw" />
                </div>
              </div>

              <div className="relative overflow-hidden">
                <Image src="/images/Homepage/about/TALL IMAGE 1.png" alt="Inkpot India" fill className="object-cover" sizes="9vw" />
              </div>

              <div className="relative overflow-hidden">
                <Image src="/images/Homepage/about/TALL IMAGE 2.png" alt="Inkpot India" fill className="object-cover" sizes="9vw" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── MOBILE ── */}
        <div className="flex flex-col gap-8 lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", gap: "14px", marginLeft: "10%" }}
          >
            <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#000000" }}>
              ABOUT INKPOT INDIA
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "28px", lineHeight: 1.18, color: "#000000" }}>
              Inkpot India
            </h2>
            <p style={{ fontFamily: "var(--font-subheading)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", color: "var(--primary-terracotta)" }}>
              Re-Inking Our Cultural Heritage
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", lineHeight: 1.7, color: "#000000" }}>
              Inkpot India is a community-driven platform that uncovers hidden stories, celebrates heritage, and captures the essence of India through words, walks and visuals.
            </p>
            <a href="/about" style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#000000", display: "inline-flex", alignItems: "center", gap: "6px", borderBottom: "1px solid #D3A351", paddingBottom: "1px" }}>
              Know More About Us →
            </a>
          </motion.div>

          <div className="grid grid-cols-2" style={{ gap: "6px" }}>
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <Image src="/images/Homepage/about/big_square.png" alt="Inkpot India" fill className="object-cover" sizes="46vw" />
            </div>
            <div className="flex flex-col" style={{ gap: "6px" }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                <Image src="/images/Homepage/about/TALL IMAGE 1.png" alt="Inkpot India" fill className="object-cover" sizes="46vw" />
              </div>
              <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                <Image src="/images/Homepage/about/TALL IMAGE 2.png" alt="Inkpot India" fill className="object-cover" sizes="46vw" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
