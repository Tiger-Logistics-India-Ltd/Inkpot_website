"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function FeaturedEvent() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="events" style={{ width: "100%", background: "#0A0A0A" }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "600px",
        }}
      >
        {/* Text — left */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 64px 80px 80px",
            gap: "0px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-subheading)",
              fontSize: "10px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#C9A84C",
              marginBottom: "20px",
            }}
          >
            Upcoming · Community Initiative
          </p>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(36px, 4vw, 58px)",
              lineHeight: 1.1,
              color: "#F5F0E8",
              marginBottom: "24px",
            }}
          >
            The Heritage
            <br />
            Cleanliness Project
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              lineHeight: 1.75,
              color: "rgba(245,240,232,0.65)",
              maxWidth: "420px",
              marginBottom: "32px",
            }}
          >
            Every last Sunday, we gather at a heritage site — not just to
            clean, but to listen. To the stories that stone remembers.
          </p>

          {/* Location badge */}
          <div style={{ marginBottom: "36px" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(245,240,232,0.22)",
                padding: "10px 16px",
                fontSize: "13px",
                color: "rgba(245,240,232,0.60)",
              }}
            >
              📍 Mehrauli Archaeological Park
            </span>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a
              href="/events/heritage-cleanliness"
              style={{
                fontFamily: "var(--font-subheading)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#901A1C",
                color: "#ffffff",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "14px 28px",
                textDecoration: "none",
              }}
            >
              Volunteer Now →
            </a>
            <a
              href="/events"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "rgba(245,240,232,0.40)",
                textDecoration: "none",
              }}
            >
              All Events →
            </a>
          </div>
        </div>

        {/* Image — fills right half, no fade */}
        <div style={{ position: "relative" }}>
          <Image
            src="/images/heritage cleaning/NolitterLegacy.png"
            alt="Heritage Cleanliness Project – No Litter Legacy"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="50vw"
          />
        </div>
      </motion.div>
    </section>
  );
}
