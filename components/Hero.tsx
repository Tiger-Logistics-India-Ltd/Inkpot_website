"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useGsapParallax } from "@/hooks/useGsapParallax";

export default function Hero() {
  const { wrapperRef, layerRef } = useGsapParallax(0.4);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100vh", minHeight: "700px" }}>
      {/* Parallax image layer */}
      <div className="parallax-wrapper" ref={wrapperRef}>
        <div className="parallax-layer" ref={layerRef}>
          <Image
            src="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&q=85"
            alt="Inkpot India"
            fill priority sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>

      {/* Warm brown overlay — sibling, stays still */}
      <div
        className="parallax-overlay"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.38) 50%, rgba(0,0,0,0.82) 100%)" }}
      />

      {/* Single CTA — bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
        className="relative z-10 h-full flex flex-col justify-end px-8 md:px-14 lg:px-20"
        style={{ paddingBottom: "80px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}
      >
        <a
          href="#experiences"
          className="text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", background: "var(--primary-red)", padding: "14px 32px", width: "fit-content" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#7a1517")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
        >
          Explore Experiences
        </a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div style={{ width: "1px", height: "40px", background: "rgba(211,163,81,0.6)" }} />
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ color: "var(--primary-mustard)" }}>
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
