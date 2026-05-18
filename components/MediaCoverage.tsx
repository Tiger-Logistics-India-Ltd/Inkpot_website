"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const pressItems = [
  {
    pub: "Condé Nast Traveller",
    pubShort: "CN TRAVELLER",
    headline: "How Delhi's heritage sites are serving modern culture",
    href: "https://www.cntraveller.in/story/how-delhis-heritage-sites-are-serving-modern-culture/",
  },
  {
    pub: "The Wire",
    pubShort: "THE WIRE",
    headline: "A Saga of Sound, Space and Story Brings the Qutub Minar into a New Cultural Conversation",
    href: "https://m.thewire.in/article/ptiprnews/songs-of-the-stone-a-saga-of-sound-space-and-story-brings-the-qutub-minar-into-a-new-cultural-conversation/amp",
  },
  {
    pub: "Times of India",
    pubShort: "TIMES OF INDIA",
    headline: "Cleanliness drive at Mehrauli Archaeological Park brings Delhiites together",
    href: "https://timesofindia.indiatimes.com/entertainment/events/delhi/cleanliness-drive-at-mehrauli-archaeological-park-brings-delhiites-together/articleshow/130625613.cms",
  },
];

const vp = { once: false, amount: 0.2 };
const spring = (delay = 0) => ({ type: "spring" as const, stiffness: 65, damping: 20, delay });

export default function MediaCoverage() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => setActiveIdx((i) => (i + 1) % pressItems.length), 4500);
    return () => clearInterval(timer);
  }, [isMobile]);

  return (
    <section style={{ background: "#ffffff", padding: isMobile ? "56px 0 48px" : "100px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? "36px" : "64px" }}>
          <motion.div
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}
            initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={vp} transition={spring(0)}
          >
            <div style={{ width: "32px", height: "1px", background: "var(--primary-red)" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary-red)" }}>
              As Seen In
            </p>
            <div style={{ width: "32px", height: "1px", background: "var(--primary-red)" }} />
          </motion.div>
          <motion.h2
            initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={vp} transition={spring(0.1)}
            style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 44px)", color: "var(--primary-brown)" }}
          >
            Inkpot in the Press.
          </motion.h2>
        </div>

        {/* Press cards */}
        {isMobile ? (
          <div>
            <AnimatePresence mode="wait">
              <motion.a
                key={activeIdx}
                href={pressItems[activeIdx].href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0.2, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0.2, x: -60 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ display: "flex", flexDirection: "column", background: "var(--primary-white)", borderLeft: "3px solid var(--primary-red)", padding: "28px 24px", boxShadow: "0 2px 20px rgba(72,45,24,0.07)", textDecoration: "none" }}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "16px" }}>
                  {pressItems[activeIdx].pubShort}
                </p>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "20px", color: "var(--primary-brown)", lineHeight: 1.45, flex: 1, marginBottom: "20px" }}>
                  {pressItems[activeIdx].headline}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-red)" }}>
                  Read Article
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </motion.a>
            </AnimatePresence>

            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
              {pressItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  style={{ width: i === activeIdx ? "28px" : "8px", height: "8px", borderRadius: "4px", background: i === activeIdx ? "var(--primary-red)" : "rgba(0,0,0,0.15)", border: "none", cursor: "pointer", transition: "all 0.35s", padding: 0 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {pressItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                viewport={vp} transition={spring(i * 0.1)}
                style={{ display: "flex", flexDirection: "column", background: "var(--primary-white)", borderLeft: "3px solid var(--primary-red)", padding: "36px 32px", boxShadow: "0 2px 24px rgba(72,45,24,0.07)", textDecoration: "none", cursor: "pointer", transition: "box-shadow 0.25s, transform 0.25s" }}
                whileHover={{ y: -4, boxShadow: "0 8px 36px rgba(72,45,24,0.13)" }}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "20px" }}>
                  {item.pubShort}
                </p>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(17px, 1.6vw, 22px)", color: "var(--primary-brown)", lineHeight: 1.45, flex: 1, marginBottom: "28px" }}>
                  {item.headline}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-red)" }}>
                  Read Article
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
