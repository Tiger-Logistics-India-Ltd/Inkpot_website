'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";

const beliefs = [
  {
    num: "01",
    title: "Cultural Stewardship",
    body: "India's artistic and architectural heritage is not a relic — it is a living, breathing inheritance that demands active care, celebration, and reinterpretation for every generation that follows.",
  },
  {
    num: "02",
    title: "Artistic Integrity",
    body: "Every experience we curate is anchored in authenticity. We work closely with artists, scholars, and custodians to ensure that what we present is as honest as it is beautiful.",
  },
  {
    num: "03",
    title: "Community First",
    body: "Culture is not a spectacle to be consumed in isolation. It is woven from shared presence, shared memory, and shared responsibility. We build communities around it, not audiences.",
  },
  {
    num: "04",
    title: "Radical Accessibility",
    body: "Great art and culture should not be locked behind institutional walls. Our work seeks to open those doors — to a new generation of thinkers, makers, and witnesses.",
  },
];

const stats = [
  { value: "50+", label: "Cultural Events" },
  { value: "10K+", label: "Lives Touched" },
  { value: "8+", label: "Heritage Sites" },
  { value: "4", label: "Cities" },
];


export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#ffffff" }}>

        {/* ── HERO ── */}
        <section style={{ position: "relative", height: "100vh", minHeight: "700px", overflow: "hidden" }}>
          <Image
            src="/images/About/about_hero.jpg"
            alt="Indian heritage monument"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.48) 48%, rgba(0,0,0,0.84) 100%)",
          }} />

          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "0 24px",
            zIndex: 10, pointerEvents: "none",
          }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "24px" }}
            >
              About Inkpot India
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6 }}
              style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(44px, 6.5vw, 92px)", lineHeight: 1.05, color: "#ffffff", maxWidth: "960px" }}
            >
              Re-Inking Our<br />Cultural Heritage
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.3)", margin: "32px auto 0" }}
            />
          </div>

          {/* Location credit — bottom right */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            style={{
              position: "absolute", bottom: "48px", right: "48px", zIndex: 10,
              fontFamily: "var(--font-body)", fontSize: "10px",
              letterSpacing: "0.14em", color: "rgba(255,255,255,0.88)", fontWeight: 700,
            }}
          >
            — Panna Meena ka Kund, Jaipur
          </motion.p>

          {/* Scroll indicator — bottom centre */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
            >
              <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.2)" }} />
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ color: "rgba(255,255,255,0.3)" }}>
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ── ORIGIN STORY ── */}
        <section id="our-story" style={{ background: "#ffffff", padding: "128px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "100px", alignItems: "center" }}>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
                <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--primary-red)" }}>Our Story</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(30px, 3.5vw, 50px)", lineHeight: 1.15, color: "#1a1a1a", marginBottom: "32px" }}>
                Born from a belief that India's greatest stories deserve a better stage.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.92, color: "rgba(0,0,0,0.6)", marginBottom: "22px" }}>
                Inkpot began as an attempt to bridge the distance between contemporary audiences and India&rsquo;s layered cultural landscape. What started with small gatherings and storytelling-led experiences gradually evolved into a wider platform for immersive cultural programming rooted in heritage, memory and place.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.92, color: "rgba(0,0,0,0.6)" }}>
                Over time, our work has expanded across concerts, exhibitions, workshops, heritage experiences and public initiatives that bring together artists, scholars, institutions and communities. At the heart of it all is a desire to make culture feel accessible, participatory and emotionally resonant — especially for younger generations seeking new ways to engage with tradition.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
              style={{ position: "relative", height: "580px", overflow: "hidden" }}
            >
              <Image
                src="/images/Homepage/about/extra.jpg"
                alt="Inkpot India — the story"
                fill
                sizes="50vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </motion.div>
          </div>
        </section>

        {/* ── MISSION STATEMENT ── */}
        <section style={{ background: "#ffffff", padding: "80px 64px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
              <div style={{ width: "28px", height: "1px", background: "var(--primary-red)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--primary-red)" }}>Our Mission</span>
              <div style={{ width: "28px", height: "1px", background: "var(--primary-red)" }} />
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.9, color: "#1a1a1a", margin: 0 }}>
              <span style={{ color: "var(--primary-red)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.15em" }}>&ldquo;</span>To bring India&rsquo;s music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.<span style={{ color: "var(--primary-red)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.15em" }}>&rdquo;</span>
            </p>
          </motion.div>
        </section>

        {/* ── BELIEFS & VALUES ── */}
        <section id="beliefs" style={{ background: "#ffffff", padding: "128px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ marginBottom: "72px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--primary-red)" }}>Beliefs & Values</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 50px)", lineHeight: 1.1, color: "#1a1a1a", maxWidth: "480px" }}>
                What We Stand For.
              </h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "rgba(0,0,0,0.07)" }}>
              {beliefs.map((b, i) => (
                <motion.div
                  key={b.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: i * 0.08, ease: "easeOut" }}
                  style={{ background: "#ffffff", padding: "60px 56px" }}
                >
                  <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "64px", color: "rgba(144,26,28,0.07)", fontWeight: 400, display: "block", lineHeight: 1, marginBottom: "28px" }}>
                    {b.num}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "22px", color: "#1a1a1a", marginBottom: "16px", lineHeight: 1.2 }}>
                    {b.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.88, color: "rgba(0,0,0,0.55)" }}>
                    {b.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOUNDER ── */}
        <section id="leadership" style={{ background: "#F7F4EF", padding: "128px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "100px", alignItems: "center" }}>

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              style={{ position: "relative", height: "600px", overflow: "hidden" }}
            >
              <Image
                src="/images/Homepage/about/About_founder_image.svg"
                alt="Simar Malhotra — Founder, Inkpot India"
                fill
                sizes="50vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
                <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--primary-red)" }}>About the Founder</span>
              </div>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.92, color: "rgba(0,0,0,0.65)", marginBottom: "22px" }}>
                Art has always been essential. From cave paintings, resistance poetry to the music of the freedom movement, creative expression has shaped our identity and resilience.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.92, color: "rgba(0,0,0,0.65)", marginBottom: "22px" }}>
                Today, reconnecting with that instinct is not nostalgia. It is power.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.92, color: "rgba(0,0,0,0.65)", marginBottom: "48px" }}>
                Inkpot produces experiences that are at once scholarly and sensorial, rooted yet experimental. Through new experiences like Songs of the Stone, we aim to build a cultural ecosystem where India&rsquo;s traditions are remembered not as archives, but reimagined as living art.
              </p>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "28px" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "22px", color: "#1a1a1a", marginBottom: "8px" }}>
                  Simar Malhotra
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.08em", color: "rgba(0,0,0,0.5)", lineHeight: 1.7 }}>
                  Author &amp; Founder, Inkpot India<br />
                  Alumnus – Stanford University &amp; Columbia University
                </p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ── IMPACT NUMBERS ── */}
        {/* <section style={{ background: "var(--primary-red)", padding: "88px 64px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px" }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: "easeOut" }}
                style={{ textAlign: "center" }}
              >
                <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "clamp(52px, 5vw, 80px)", color: "#ffffff", display: "block", lineHeight: 1 }}>
                  {s.value}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", display: "block", marginTop: "14px" }}>
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section> */}

        {/* ── NEWSLETTER ── */}
        <Newsletter />

      </main>
      <Footer />
    </>
  );
}
