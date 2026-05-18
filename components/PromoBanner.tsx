"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useGsapParallax } from "@/hooks/useGsapParallax";

const vp = { once: true, amount: 0.2 };
const spring = (delay = 0) => ({ type: "spring" as const, stiffness: 65, damping: 20, delay });

export default function PromoBanner() {
  const { wrapperRef, layerRef } = useGsapParallax(0.25);

  return (
    <section className="w-full flex flex-col md:flex-row overflow-hidden" style={{ minHeight: "560px" }}>
      {/* LEFT — dark brown, 45% */}
      <div className="w-full md:w-[45%] flex flex-col justify-center" style={{ background: "#0A0A0A", padding: "72px" }}>
        <motion.p
          initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0)}
          style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--primary-mustard)" }}
        >
          Upcoming · Community Initiative
        </motion.p>

        <motion.h2
          initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0.1)}
          style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px, 3.5vw, 48px)", lineHeight: 1.1, color: "var(--primary-white)", marginTop: "16px" }}
        >
          The Heritage<br />Cleanliness Project
        </motion.h2>

        <motion.p
          initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0.2)}
          style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--primary-cream)", lineHeight: 1.75, marginTop: "20px", maxWidth: "360px" }}
        >
          Every last Sunday, we gather at a heritage site — not just to clean, but to listen. To the stories that stone remembers.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0.3)}
          style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(226,203,163,0.30)", padding: "10px 18px", marginTop: "28px", width: "fit-content" }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--primary-white)" }}>
            📍 Mehrauli Archaeological Park
          </p>
        </motion.div>

        <motion.a
          href="#contact"
          initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0.38)}
          className="inline-block transition-colors duration-300"
          style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", background: "var(--primary-red)", color: "var(--primary-white)", padding: "14px 28px", marginTop: "32px", width: "fit-content" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#7a1517")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
        >
          Volunteer Now →
        </motion.a>
      </div>

      {/* RIGHT — image, 55% */}
      <motion.div
        className="w-full md:w-[55%] relative overflow-hidden"
        style={{ minHeight: "400px" }}
        initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={vp} transition={spring(0.15)}
      >
        <div className="parallax-wrapper" ref={wrapperRef}>
          <div className="parallax-layer" ref={layerRef}>
            <Image src="/images/heritage cleaning/NolitterLegacy.png" alt="Heritage Cleanliness Project" fill sizes="(max-width: 768px) 100vw, 55vw" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
