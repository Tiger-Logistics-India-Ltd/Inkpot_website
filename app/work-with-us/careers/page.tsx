'use client';

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const positions = [
  { role: "Programme Associate", type: "Full-Time", location: "New Delhi", dept: "Events" },
  { role: "Content & Editorial Lead", type: "Full-Time", location: "Remote / Delhi", dept: "Content" },
  { role: "Design Intern", type: "Internship — 3 months", location: "New Delhi", dept: "Design" },
  { role: "Cultural Research Fellow", type: "6-month Fellowship", location: "New Delhi", dept: "Research" },
  { role: "Events Coordinator", type: "Contract", location: "New Delhi", dept: "Events" },
  { role: "Social Media Strategist", type: "Internship — 3 months", location: "Remote", dept: "Communications" },
];

const values = [
  { title: "We move slowly, on purpose.", desc: "We take the time to do things right — in events, in writing, and in how we work with each other." },
  { title: "Culture is the work.", desc: "We don't treat cultural programming as ancillary. It is the core of everything we build." },
  { title: "Everyone contributes to the vision.", desc: "Titles are flat. Ideas matter more than hierarchy. Good thinking is valued wherever it comes from." },
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
    borderBottom: `1px solid ${focused ? "var(--primary-red)" : "rgba(0,0,0,0.15)"}`,
    padding: "12px 0",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "#1a1a1a",
    outline: "none",
    transition: "border-color 0.2s",
    resize: "none",
    appearance: "none" as React.CSSProperties["appearance"],
  };

  return (
    <div style={{ marginBottom: "36px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "8px" }}>
        {label}
      </label>
      {as === "textarea" ? (
        <textarea rows={4} placeholder={placeholder} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      ) : as === "select" ? (
        <select style={{ ...base, cursor: "pointer" }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <option value="">{placeholder}</option>
          {options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      )}
    </div>
  );
}

export default function CareersPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <main style={{ background: "#ffffff" }}>

        {/* ── HEADER ── */}
        <section style={{ background: "#0D0D0D", padding: "180px 64px 100px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "end" }}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "24px" }}
              >
                Inkpot India · Careers
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.5 }}
                style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 1.0, color: "#ffffff" }}
              >
                Join the<br />Mission.
              </motion.h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.88, color: "rgba(255,255,255,0.45)", marginBottom: "24px" }}>
                We are a small, deeply committed team working at the intersection of culture, programming, and storytelling. If you believe India&rsquo;s artistic legacy deserves more — so do we.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.88, color: "rgba(255,255,255,0.45)" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. We are always looking for people who care more about impact than title.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section style={{ background: "#ffffff", padding: "100px 0", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "64px" }}>
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: "easeOut" }}
              >
                <div style={{ width: "28px", height: "2px", background: "var(--primary-red)", marginBottom: "24px" }} />
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "20px", color: "#1a1a1a", marginBottom: "14px", lineHeight: 1.25 }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.82, color: "rgba(0,0,0,0.52)" }}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── OPEN POSITIONS ── */}
        <section style={{ background: "#ffffff", padding: "100px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "52px" }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Open Positions</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 48px)", lineHeight: 1.1, color: "#1a1a1a" }}>
                  Current Openings.
                </h2>
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(0,0,0,0.3)" }}>
                {positions.length} positions open
              </span>
            </motion.div>

            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              {positions.map((pos, i) => (
                <motion.div
                  key={pos.role}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
                  style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "40px", alignItems: "center", padding: "28px 0", borderBottom: "1px solid rgba(0,0,0,0.08)", cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "20px", color: "#1a1a1a", lineHeight: 1.2 }}>
                    {pos.role}
                  </h3>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", color: "rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>
                    {pos.dept}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.12em", color: "var(--primary-red)", whiteSpace: "nowrap" }}>
                    {pos.type}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
                      {pos.location}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" style={{ color: "rgba(0,0,0,0.2)", flexShrink: 0 }}>
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── APPLICATION FORM ── */}
        <section style={{ background: "var(--bg-linen)", padding: "112px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "96px", alignItems: "start" }}>

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
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.15, color: "#1a1a1a", marginBottom: "24px" }}>
                Don&rsquo;t see your role? Apply anyway.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.9, color: "rgba(0,0,0,0.55)", marginBottom: "20px" }}>
                We welcome speculative applications from people who believe deeply in the power of culture — whether you&rsquo;re a recent graduate or an experienced professional.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.9, color: "rgba(0,0,0,0.55)" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. If you have something to say, we will read it.
              </p>
            </motion.div>

            <motion.form
              onSubmit={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
              style={{ background: "#ffffff", padding: "48px 52px" }}
            >
              <FormField label="Full Name" placeholder="Your full name" />
              <FormField label="Email Address" type="email" placeholder="your@email.com" />
              <FormField label="Phone Number" type="tel" placeholder="+91 00000 00000" />
              <FormField
                label="Area of Interest"
                as="select"
                placeholder="Select area of interest"
                options={["Programme & Events", "Content & Editorial", "Design & Creative", "Cultural Research", "Operations", "Communications & Social Media", "Other / Open"]}
              />
              <FormField label="A Note About You" as="textarea" placeholder="What draws you to Inkpot India, and what would you bring to the team?" />

              {/* Resume upload */}
              <div style={{ marginBottom: "36px" }}>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", display: "block", marginBottom: "12px" }}>
                  Resume / CV
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: "1px dashed rgba(0,0,0,0.16)", padding: "32px 24px", cursor: "pointer", textAlign: "center", transition: "border-color 0.2s, background 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary-red)"; e.currentTarget.style.background = "rgba(144,26,28,0.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.16)"; e.currentTarget.style.background = "transparent"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" style={{ color: "rgba(0,0,0,0.22)", display: "block", margin: "0 auto 10px" }}>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: fileName ? "#1a1a1a" : "rgba(0,0,0,0.35)", letterSpacing: "0.04em" }}>
                    {fileName ?? "Click to upload PDF or DOC"}
                  </span>
                  {!fileName && (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.2)", display: "block", marginTop: "5px" }}>
                      Max 5MB
                    </span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFileName(f.name);
                  }}
                />
              </div>

              <button
                type="submit"
                style={{ background: "var(--primary-red)", color: "#ffffff", padding: "16px 44px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "background 0.25s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#7a1517")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
              >
                Submit Application
              </button>
            </motion.form>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
