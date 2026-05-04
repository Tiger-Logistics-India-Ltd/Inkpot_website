"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function FeaturedEvent() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section style={{ background: "var(--primary-red)", paddingTop: "64px", paddingBottom: "64px" }}>
      <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: "1200px" }}>

        {/* Section heading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={ref}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          What&apos;s On
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.07 }}
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(28px, 3vw, 42px)",
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "40px",
            lineHeight: 1.1,
          }}
        >
          Upcoming Events
        </motion.h2>

        {/* White card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.15 }}
          style={{
            background: "#ffffff",
            borderRadius: "0px",
            padding: "40px",
          }}
        >
          {/* Desktop grid */}
          <div
            className="hidden lg:grid"
            style={{ gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}
          >
            {/* LEFT: Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)" }}>
                Upcoming · Community Initiative
              </p>

              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(24px, 2.4vw, 34px)",
                  lineHeight: 1.15,
                  color: "#000000",
                }}
              >
                The Heritage<br />Cleanliness Project
              </h3>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.75, color: "rgba(0,0,0,0.58)" }}>
                Every last Sunday, we gather at a heritage site — not just to clean, but to listen. To the stories that stone remembers.
              </p>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>📍</span> Mehrauli Archaeological Park
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "24px", paddingTop: "4px" }}>
                <a
                  href="/events/heritage-cleanliness"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "#000000",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    borderBottom: "1px solid #D3A351",
                    paddingBottom: "2px",
                  }}
                >
                  Volunteer Now →
                </a>

                <a
                  href="/events"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "rgba(0,0,0,0.4)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  All Events →
                </a>
              </div>
            </div>

            {/* RIGHT: Image with slight downward offset */}
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "320px",
                  borderRadius: "0px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/heritage cleaning/NolitterLegacy.png"
                  alt="Heritage Cleanliness Project"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 50vw, 560px"
                />
              </div>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="flex flex-col gap-6 lg:hidden">
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)" }}>
                Upcoming · Community Initiative
              </p>
              <h3 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "26px", lineHeight: 1.2, color: "#000000" }}>
                The Heritage Cleanliness Project
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.75, color: "rgba(0,0,0,0.58)" }}>
                Every last Sunday, we gather at a heritage site — not just to clean, but to listen. To the stories that stone remembers.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0, 0, 0, 0.45)" }}>
                📍 Mehrauli Archaeological Park
              </p>
              <a
                href="/events/heritage-cleanliness"
                style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#000000", display: "inline-flex", alignItems: "center", gap: "6px", borderBottom: "1px solid #D3A351", paddingBottom: "2px", width: "fit-content" }}
              >
                Volunteer Now →
              </a>
            </div>

            <div style={{ position: "relative", width: "100%", height: "240px", borderRadius: "0px", overflow: "hidden" }}>
              <Image
                src="/images/heritage cleaning/NolitterLegacy.png "
                alt="Heritage Cleanliness Project"
                fill
                className="object-cover"
                sizes="90vw"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
