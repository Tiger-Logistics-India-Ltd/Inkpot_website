'use client';

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pressItems = [
  {
    pub: "Condé Nast Traveller",
    pubShort: "CN TRAVELLER",
    headline: "How Delhi's heritage sites are serving modern culture",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    date: "May 2025",
    href: "https://www.cntraveller.in/story/how-delhis-heritage-sites-are-serving-modern-culture/",
    featured: true,
  },
  {
    pub: "The Wire",
    pubShort: "THE WIRE",
    headline: "A Saga of Sound, Space and Story Brings the Qutub Minar into a New Cultural Conversation",
    excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.",
    date: "April 2025",
    href: "https://m.thewire.in/article/ptiprnews/songs-of-the-stone-a-saga-of-sound-space-and-story-brings-the-qutub-minar-into-a-new-cultural-conversation/amp",
    featured: false,
  },
  {
    pub: "Times of India",
    pubShort: "TIMES OF INDIA",
    headline: "Cleanliness drive at Mehrauli Archaeological Park brings Delhiites together",
    excerpt: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
    date: "March 2025",
    href: "https://timesofindia.indiatimes.com/entertainment/events/delhi/cleanliness-drive-at-mehrauli-archaeological-park-brings-delhiites-together/articleshow/130625613.cms",
    featured: false,
  },
  {
    pub: "Hindustan Times",
    pubShort: "HINDUSTAN TIMES",
    headline: "Inside Inkpot India's mission to reclaim India's cultural soul",
    excerpt: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "February 2025",
    href: "#",
    featured: false,
  },
  {
    pub: "The Hindu",
    pubShort: "THE HINDU",
    headline: "Music under the stars: How Inkpot India is rewriting the rules of cultural programming",
    excerpt: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos.",
    date: "January 2025",
    href: "#",
    featured: false,
  },
];

const nonFeatured = pressItems.filter((p) => !p.featured);

export default function NewsroomPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#ffffff" }}>

        {/* ── PAGE HEADER ── */}
        <section style={{ background: "#0D0D0D", padding: "180px 64px 100px", textAlign: "center" }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "20px" }}
          >
            Press & Media
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5 }}
            style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 1.05, color: "#ffffff" }}
          >
            Inkpot in the Press.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.8, color: "rgba(255,255,255,0.42)", maxWidth: "520px", margin: "20px auto 0" }}
          >
            Coverage, conversations, and commentary from India&rsquo;s leading publications.
          </motion.p>
        </section>

        {/* ── FEATURED ARTICLE ── */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "96px 64px 0" }}>
          {pressItems.filter((p) => p.featured).map((item) => (
            <motion.a
              key={item.pub}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center", background: "var(--bg-linen)", padding: "64px", textDecoration: "none", transition: "background 0.25s", marginBottom: "72px" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#EEEDE8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-linen)")}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Featured</span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", marginBottom: "16px" }}>
                  {item.pub} · {item.date}
                </p>
                <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(26px, 2.8vw, 40px)", lineHeight: 1.2, color: "#1a1a1a", marginBottom: "20px" }}>
                  {item.headline}
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.85, color: "rgba(0,0,0,0.55)", marginBottom: "32px" }}>
                  {item.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--primary-red)" }}>
                  Read Full Article
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
              <div style={{ position: "relative", height: "360px", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "clamp(40px, 5vw, 72px)", color: "rgba(0,0,0,0.07)", fontWeight: 400 }}>
                    {item.pubShort}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </section>

        {/* ── PRESS GRID ── */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px 112px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "48px" }}>
            <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>All Coverage</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2px", background: "rgba(0,0,0,0.06)" }}>
            {nonFeatured.map((item, i) => (
              <motion.a
                key={item.pub + i}
                href={item.href}
                target={item.href !== "#" ? "_blank" : undefined}
                rel={item.href !== "#" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: (i % 2) * 0.08, ease: "easeOut" }}
                style={{ background: "#ffffff", padding: "48px 48px", textDecoration: "none", transition: "background 0.2s", display: "block" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF8F4")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--primary-red)" }}>
                    {item.pubShort}
                  </p>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.3)", letterSpacing: "0.06em" }}>
                    {item.date}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(18px, 1.8vw, 24px)", color: "#1a1a1a", lineHeight: 1.35, marginBottom: "16px" }}>
                  {item.headline}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.8, color: "rgba(0,0,0,0.5)", marginBottom: "24px" }}>
                  {item.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--primary-red)" }}>
                  Read Article
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* ── MEDIA KIT CTA ── */}
        <section style={{ background: "#0D0D0D", padding: "100px 64px", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{ maxWidth: "680px", margin: "0 auto" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "36px" }}>
              <div style={{ width: "32px", height: "1px", background: "var(--primary-red)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Media</span>
              <div style={{ width: "32px", height: "1px", background: "var(--primary-red)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15, color: "#ffffff", marginBottom: "20px" }}>
              Covering Inkpot India?
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.8, color: "rgba(255,255,255,0.45)", marginBottom: "40px" }}>
              Download our media kit for logos, photography, brand guidelines, and press contact information.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="#"
                style={{ background: "var(--primary-red)", color: "#ffffff", padding: "16px 40px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.25s", display: "inline-block" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#7a1517")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
              >
                Download Media Kit
              </a>
              <a
                href="/contact"
                style={{ border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.7)", padding: "16px 40px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.25s", display: "inline-block" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              >
                Press Enquiries
              </a>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </>
  );
}
