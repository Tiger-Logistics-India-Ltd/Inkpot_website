"use client";

import { motion } from "framer-motion";

const pressQuotes = [
  { quote: "Inkpot India creates spaces where heritage feels alive and urgent — not archived.", pub: "THE HINDU" },
  { quote: "A bold reimagining of what cultural programming can achieve in contemporary India.", pub: "INDIA TODAY" },
  { quote: "Where tradition meets imagination — essential for any lover of Indian culture.", pub: "SCROLL.IN" },
];

const vp = { once: false, amount: 0.2 };
const spring = (delay = 0) => ({ type: "spring" as const, stiffness: 65, damping: 20, delay });

export default function MediaCoverage() {
  return (
    <section style={{ background: "var(--bg-linen)", padding: "100px 0" }}>
      <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: "1280px" }}>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: "64px" }}>
          <motion.div className="flex items-center justify-center gap-3 mb-4"
            initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={vp} transition={spring(0)}
          >
            <div style={{ width: "32px", height: "1px", background: "var(--primary-mustard)" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary-mustard)" }}>
              As Seen In
            </p>
            <div style={{ width: "32px", height: "1px", background: "var(--primary-mustard)" }} />
          </motion.div>
          <motion.h2
            initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={vp} transition={spring(0.1)}
            style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 44px)", color: "var(--primary-brown)" }}
          >
            Inkpot in the Press.
          </motion.h2>
        </div>

        {/* Press cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "32px" }}>
          {pressQuotes.map((item, i) => (
            <motion.div key={i}
              initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              viewport={vp} transition={spring(i * 0.1)}
              style={{ background: "var(--primary-white)", borderLeft: "3px solid var(--primary-mustard)", padding: "36px", boxShadow: "0 2px 24px rgba(72,45,24,0.07)" }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "42px", color: "var(--primary-mustard)", lineHeight: 1, display: "block", marginBottom: "12px" }}>
                &ldquo;
              </span>
              <blockquote style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "20px", color: "var(--primary-brown)", lineHeight: 1.6 }}>
                {item.quote}
              </blockquote>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--primary-mustard)", marginTop: "20px" }}>
                — {item.pub}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
