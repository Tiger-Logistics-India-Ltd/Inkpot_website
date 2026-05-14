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

const team = [
  {
    name: "Founder's Name",
    title: "Founder & Artistic Director",
    image: "/images/Homepage/about/About_founder_image.svg",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A visionary behind Inkpot India's cultural mission and the creative direction of every experience.",
  },
  {
    name: "Co-Founder's Name",
    title: "Co-Founder & Programme Director",
    image: "/images/Homepage/about/extra.jpg",
    bio: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa.",
  },
  {
    name: "Creative Director",
    title: "Head of Design & Curation",
    image: "/images/Homepage/about/Monuments.jpeg",
    bio: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#ffffff" }}>

        {/* ── HERO ── */}
        <section style={{ position: "relative", height: "100vh", minHeight: "700px", overflow: "hidden" }}>
          <Image
            src="/images/Homepage/about/Monuments.jpeg"
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
              Re-Inking Our<br />Cultural Heritage.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.3)", margin: "32px auto 0" }}
            />
          </div>

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
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Our Story</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(30px, 3.5vw, 50px)", lineHeight: 1.15, color: "#1a1a1a", marginBottom: "32px" }}>
                Born from a belief that India's greatest stories deserve a better stage.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.92, color: "rgba(0,0,0,0.6)", marginBottom: "22px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.92, color: "rgba(0,0,0,0.6)" }}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
        <section style={{ background: "#0D0D0D", padding: "148px 64px", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ maxWidth: "940px", margin: "0 auto" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "48px" }}>
              <div style={{ width: "32px", height: "1px", background: "var(--primary-red)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Our Mission</span>
              <div style={{ width: "32px", height: "1px", background: "var(--primary-red)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px, 3.8vw, 54px)", lineHeight: 1.28, color: "#ffffff" }}>
              &ldquo;To bring India&rsquo;s music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.&rdquo;
            </h2>
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
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Beliefs & Values</span>
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

        {/* ── IMPACT NUMBERS ── */}
        <section style={{ background: "var(--primary-red)", padding: "88px 64px" }}>
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
        </section>

        {/* ── LEADERSHIP ── */}
        <section id="leadership" style={{ background: "#ffffff", padding: "128px 0" }}>
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
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>The People</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 50px)", lineHeight: 1.1, color: "#1a1a1a" }}>
                Leadership.
              </h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
              {team.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: "easeOut" }}
                >
                  <div style={{ position: "relative", height: "440px", overflow: "hidden", marginBottom: "24px" }}>
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 1280px) 33vw, 400px"
                      style={{ objectFit: "cover", objectPosition: "top center", transition: "transform 0.65s ease" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                    />
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "8px" }}>
                    {m.title}
                  </p>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "22px", color: "#1a1a1a", marginBottom: "12px", lineHeight: 1.2 }}>
                    {m.name}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.82, color: "rgba(0,0,0,0.5)" }}>
                    {m.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <Newsletter />

      </main>
      <Footer />
    </>
  );
}
