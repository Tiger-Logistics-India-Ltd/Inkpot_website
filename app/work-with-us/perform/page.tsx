'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const artistTypes = [
  { discipline: "Classical Music", desc: "Hindustani, Carnatic, instrumental — voices that make stone resonate." },
  { discipline: "Dance", desc: "Kathak, Bharatanatyam, contemporary — bodies that speak the language of heritage." },
  { discipline: "Poetry & Literature", desc: "Spoken word, mushaira, readings — language that gives monuments a voice." },
  { discipline: "Theatre & Performance", desc: "Immersive, site-specific, intimate — theatre that rewrites space." },
  { discipline: "Visual Arts", desc: "Installations, live art, projection — seeing heritage in a new light." },
  { discipline: "Folk & Traditional Arts", desc: "Regional, roots-deep, living traditions — the original guardians of culture." },
];

const testimonials = [
  {
    quote: "From the moment I entered, it's been magical. A miraculous program full of art and joy.",
    name: "Elena Barman",
    title: "President, Indian Association of Russian Compatriots",
  },
  {
    quote: "Mr. Niazi's sitar dazzled all of us. I can't wait for more of this to happen in India.",
    name: "Suvir Saran",
    title: "Master Chef",
  },
  {
    quote: "I was actually being a part of history — the first sitar concert at the Qutub Minar.",
    name: "Ashmita Tewari",
    title: "Attendee, Songs of the Stone",
  },
];

const galleryImages = [
  { src: "/images/Songs of the stone/SOTS-71.jpg", alt: "Performance at heritage site" },
  { src: "/images/experiences/224A3705.JPG", alt: "Cultural event" },
  { src: "/images/experiences/479A7421.JPG", alt: "Artist at Inkpot" },
  { src: "/images/Songs of the stone/SOTS-165.jpg", alt: "Songs of the Stone performance" },
];

function FormField({
  label,
  type = "text",
  placeholder,
  as = "input",
  options,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  options?: string[];
}) {
  const [focused, setFocused] = useState(false);

  const base: React.CSSProperties = {
    display: "block",
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${focused ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)"}`,
    padding: "12px 0",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "#ffffff",
    outline: "none",
    transition: "border-color 0.2s",
    resize: "none",
    appearance: "none" as React.CSSProperties["appearance"],
  };

  return (
    <div style={{ marginBottom: "36px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "8px" }}>
        {label}
      </label>
      {as === "textarea" ? (
        <textarea rows={4} placeholder={placeholder} style={{ ...base }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="placeholder-white/20" />
      ) : as === "select" ? (
        <select style={{ ...base, cursor: "pointer" }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <option value="" style={{ background: "#0D0D0D" }}>{placeholder}</option>
          {options?.map((o) => <option key={o} value={o} style={{ background: "#0D0D0D" }}>{o}</option>)}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      )}
    </div>
  );
}

export default function PerformPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#0D0D0D" }}>

        {/* ── HERO ── */}
        <section style={{ position: "relative", height: "100vh", minHeight: "700px", overflow: "hidden" }}>
          <Image
            src="/images/experiences/SOTS-76.jpg"
            alt="Performance at a heritage monument"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0.96) 100%)",
          }} />

          <div style={{
            position: "absolute", bottom: "80px", left: "64px", right: "64px",
            zIndex: 10,
          }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "20px" }}
            >
              Inkpot India · For Artists
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.6 }}
              style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(48px, 7vw, 108px)", lineHeight: 0.95, color: "#ffffff", maxWidth: "900px" }}
            >
              Your Stage<br />is a Monument.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.7, delay: 1.3, transformOrigin: "left" }}
              style={{ width: "48px", height: "1px", background: "var(--primary-red)", margin: "32px 0 0" }}
            />
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
            style={{ position: "absolute", bottom: "32px", right: "64px", zIndex: 10, display: "flex", alignItems: "center", gap: "12px" }}
          >
            <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Scroll</span>
            <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.2)" }} />
          </motion.div>
        </section>

        {/* ── MANIFESTO ── */}
        <section style={{ padding: "128px 64px", background: "#0D0D0D" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "96px", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>The Invitation</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 52px)", lineHeight: 1.12, color: "#ffffff" }}>
                What does it mean to perform at a place that remembers everything?
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.92, color: "rgba(255,255,255,0.55)", marginBottom: "24px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. When you perform at a heritage site, you are not performing in front of a monument — you are performing with it.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.92, color: "rgba(255,255,255,0.55)" }}>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. The stones hold centuries of sound. We invite artists who understand that.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section style={{ background: "#0D0D0D", padding: "0 0 120px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gridTemplateRows: "auto auto", gap: "4px" }}>
              {/* Large image top-left */}
              <div style={{ position: "relative", height: "480px", overflow: "hidden", gridRow: "1 / 3" }}>
                <Image
                  src="/images/Songs of the stone/SOTS-165.jpg"
                  alt="Songs of the Stone performance"
                  fill
                  sizes="45vw"
                  style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.65s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>
              {/* Top-right */}
              <div style={{ position: "relative", height: "234px", overflow: "hidden" }}>
                <Image
                  src="/images/experiences/224A3705.JPG"
                  alt="Cultural event"
                  fill
                  sizes="35vw"
                  style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.65s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>
              {/* Bottom-right */}
              <div style={{ position: "relative", height: "242px", overflow: "hidden" }}>
                <Image
                  src="/images/experiences/479A7421.JPG"
                  alt="Artist at Inkpot"
                  fill
                  sizes="35vw"
                  style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.65s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>
            </div>

            {/* Caption */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", textAlign: "right", marginTop: "16px" }}
            >
              Songs of the Stone, Qutub Minar, New Delhi
            </motion.p>
          </div>
        </section>

        {/* ── WHO WE WORK WITH ── */}
        <section style={{ background: "#111111", padding: "112px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              style={{ marginBottom: "72px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Disciplines</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 50px)", lineHeight: 1.1, color: "#ffffff", maxWidth: "480px" }}>
                Who We Work With.
              </h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: "rgba(255,255,255,0.06)" }}>
              {artistTypes.map((art, i) => (
                <motion.div
                  key={art.discipline}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: "easeOut" }}
                  style={{ background: "#111111", padding: "44px 40px", transition: "background 0.25s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#111111")}
                >
                  <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "40px", color: "rgba(144,26,28,0.2)", display: "block", lineHeight: 1, marginBottom: "20px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "20px", color: "#ffffff", marginBottom: "12px", lineHeight: 1.2 }}>
                    {art.discipline}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.8, color: "rgba(255,255,255,0.4)" }}>
                    {art.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ background: "#0D0D0D", padding: "112px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ marginBottom: "64px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Voices</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(30px, 3vw, 44px)", lineHeight: 1.1, color: "#ffffff" }}>
                What They Said.
              </h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: "easeOut" }}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px" }}
                >
                  <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "clamp(16px, 1.5vw, 20px)", color: "rgba(255,255,255,0.82)", lineHeight: 1.65, marginBottom: "24px" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "20px", height: "1px", background: "var(--primary-red)" }} />
                    <div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#ffffff", display: "block", letterSpacing: "0.06em" }}>{t.name}</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>{t.title}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FULL-BLEED IMAGE BREAK ── */}
        <div style={{ position: "relative", height: "50vh", minHeight: "320px", overflow: "hidden" }}>
          <Image
            src="/images/Songs of the stone/SOTS-71.jpg"
            alt="Performance atmosphere"
            fill
            style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "clamp(24px, 3.5vw, 52px)", color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: "700px", padding: "0 24px", lineHeight: 1.3 }}
            >
              &ldquo;The stones hold centuries of sound. We invite artists who understand that.&rdquo;
            </motion.p>
          </div>
        </div>

        {/* ── APPLICATION FORM ── */}
        <section style={{ background: "#0D0D0D", padding: "120px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "96px", alignItems: "start" }}>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Apply</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 52px)", lineHeight: 1.1, color: "#ffffff", marginBottom: "28px" }}>
                Express Your Interest.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.9, color: "rgba(255,255,255,0.45)", marginBottom: "20px" }}>
                We read every submission. Tell us about your practice — what drives you, what you&rsquo;ve created, and where you&rsquo;d like to take it next.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.9, color: "rgba(255,255,255,0.45)" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. We will reach out within two weeks if there&rsquo;s a meaningful fit.
              </p>
            </motion.div>

            <motion.form
              onSubmit={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
              style={{ paddingTop: "8px" }}
            >
              <FormField label="Full Name" placeholder="Your full name" />
              <FormField label="Art Form / Discipline" placeholder="e.g. Kathak, Hindustani Vocal, Spoken Word" />
              <FormField label="Portfolio / Social Links" placeholder="Website, Instagram, YouTube — any link" />
              <FormField label="Tell Us About Your Practice" as="textarea" placeholder="What do you create, and what draws you to performing at heritage spaces?" />
              <FormField label="Email Address" type="email" placeholder="your@email.com" />
              <FormField label="Phone Number" type="tel" placeholder="+91 00000 00000" />

              <button
                type="submit"
                style={{ background: "var(--primary-red)", color: "#ffffff", padding: "16px 48px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "background 0.25s", marginTop: "8px" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#7a1517")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
              >
                Submit Expression of Interest
              </button>
            </motion.form>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
