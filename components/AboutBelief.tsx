"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  {
    label: "About Inkpot",
    href: "#about",
    image: "/images/Homepage/about/extra.jpg",
    offset: "48px",   // starts lower
  },
  {
    label: "Leadership",
    href: "#leadership",
    image: "/images/Homepage/about/About_founder_image.svg",
    offset: "0px",    // tallest, starts at top
  },
  {
    label: "Beliefs & Values",
    href: "#beliefs",
    image: "/images/Homepage/about/Monuments.jpeg",
    offset: "28px",   // mid offset
  },
];

export default function AboutBelief() {
  return (
    <section id="about" style={{ background: "#ffffff", padding: "80px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "80px", alignItems: "center" }}>

        {/* ── LEFT: Text ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", gap: "0px" }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "20px" }}>
            About Inkpot India
          </p>

          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.8vw, 54px)", lineHeight: 1.12, color: "#1a1a1a", marginBottom: "24px" }}>
            Re-Inking Our<br />Cultural Heritage.
          </h2>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.8, color: "rgba(0,0,0,0.6)", maxWidth: "380px", marginBottom: "40px" }}>
            Inkpot India is a community-driven platform that uncovers hidden stories, celebrates heritage, and captures the essence of India through words, walks and visuals.
          </p>

          <a
            href="/about"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a", color: "#ffffff", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", textDecoration: "none", width: "fit-content", transition: "background 0.25s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a1a")}
          >
            Explore Inkpot
          </a>
        </motion.div>

        {/* ── RIGHT: 3 staggered images ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
          style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
        >
          {categories.map((cat, i) => (
            <div key={cat.label} style={{ flex: 1, paddingTop: cat.offset }}>
              {/* Image */}
              <a
                href={cat.href}
                style={{ display: "block", position: "relative", width: "100%", height: "320px", overflow: "hidden", marginBottom: "14px" }}
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.5s ease" }}
                  sizes="(max-width: 1280px) 20vw, 240px"
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </a>

              {/* Label link */}
              <a
                href={cat.href}
                style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#1a1a1a", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-red)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a1a")}
              >
                {cat.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
