'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const offerings = [
  {
    num: "01",
    title: "Event Co-Production",
    desc: "Co-create signature cultural events at India's most iconic heritage sites. Your institution lends presence; we provide the cultural architecture.",
  },
  {
    num: "02",
    title: "CSR & Social Impact",
    desc: "Align your social responsibility mandate with India's living heritage. Meaningful, measurable, and documented impact at the community level.",
  },
  {
    num: "03",
    title: "Media & Content Collaboration",
    desc: "Produce documentary content, editorial features, and digital storytelling around cultural programming with genuine depth.",
  },
  {
    num: "04",
    title: "Institutional Memberships",
    desc: "Gain priority access to all Inkpot India programming, exclusive event invitations, and positioning as a long-term cultural patron.",
  },
  {
    num: "05",
    title: "Educational Initiatives",
    desc: "Commission lectures, workshops, and residencies connecting your people to India's artistic and intellectual traditions.",
  },
  {
    num: "06",
    title: "Custom Programming",
    desc: "We design bespoke cultural experiences to your objectives — from intimate private events to large-scale public programmes.",
  },
];

const process = [
  { step: "01", title: "Initial Conversation", desc: "We begin with a call to understand your objectives, timelines, and the kind of impact you want to create." },
  { step: "02", title: "Proposal", desc: "Our team prepares a tailored collaboration proposal with clear deliverables, visibility, and outcomes." },
  { step: "03", title: "Agreement & Onboarding", desc: "We formalise the partnership and bring you into the planning process with full transparency." },
  { step: "04", title: "Execution & Documentation", desc: "We execute with rigour and document the impact — for your records, your stakeholders, and your legacy." },
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

export default function PartnerPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#ffffff" }}>

        {/* ── HERO ── */}
        <section style={{ background: "#ffffff", paddingTop: "160px", paddingBottom: "0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "end", paddingBottom: "80px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "24px" }}
                >
                  Inkpot India · For Organisations
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, delay: 0.5 }}
                  style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(44px, 5.5vw, 80px)", lineHeight: 1.0, color: "#1a1a1a" }}
                >
                  Shape Culture<br />With Purpose.
                </motion.h1>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.8 }}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.88, color: "rgba(0,0,0,0.55)", marginBottom: "24px" }}>
                  Inkpot India works with institutions, companies, and foundations that want their presence in culture to mean something beyond visibility.
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.88, color: "rgba(0,0,0,0.55)" }}>
                  We don&rsquo;t offer placements — we offer participation. In events, experiences, and a cultural mission that outlasts any single season.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Hero image strip */}
          <div style={{ position: "relative", height: "480px", marginTop: "0", overflow: "hidden" }}>
            <Image
              src="/images/Inkpot India Conclave/saurav/224A3689.JPG"
              alt="Inkpot India Conclave"
              fill
              priority
              style={{ objectFit: "cover", objectPosition: "center 35%" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)" }} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{ position: "absolute", bottom: "40px", right: "64px" }}
            >
              <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                Inkpot India Conclave
              </span>
            </motion.div>
          </div>
        </section>

        {/* ── WHY PARTNER ── */}
        <section style={{ background: "#ffffff", padding: "112px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 64px" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ marginBottom: "72px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>What We Offer</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 50px)", lineHeight: 1.1, color: "#1a1a1a" }}>
                  Ways to Collaborate.
                </h2>
              </div>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: "rgba(0,0,0,0.07)" }}>
              {offerings.map((o, i) => (
                <motion.div
                  key={o.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: "easeOut" }}
                  style={{ background: "#ffffff", padding: "44px 40px", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                >
                  <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "40px", color: "rgba(144,26,28,0.08)", display: "block", lineHeight: 1, marginBottom: "20px" }}>
                    {o.num}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "19px", color: "#1a1a1a", marginBottom: "12px", lineHeight: 1.2 }}>
                    {o.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.82, color: "rgba(0,0,0,0.52)" }}>
                    {o.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DARK STATEMENT ── */}
        <section style={{ background: "#0D0D0D", padding: "100px 64px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}
          >
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3vw, 44px)", lineHeight: 1.3, color: "#ffffff" }}>
              &ldquo;The organisations we work with don&rsquo;t sponsor culture — they become part of it.&rdquo;
            </p>
          </motion.div>
        </section>

        {/* ── OUR PROCESS ── */}
        <section style={{ background: "#ffffff", padding: "112px 0" }}>
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
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>How It Works</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 50px)", lineHeight: 1.1, color: "#1a1a1a" }}>
                Our Process.
              </h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px" }}>
              {process.map((p, i) => (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                >
                  <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "56px", color: "rgba(144,26,28,0.08)", display: "block", lineHeight: 1, marginBottom: "24px" }}>
                    {p.step}
                  </span>
                  <div style={{ width: "24px", height: "2px", background: "var(--primary-red)", marginBottom: "20px" }} />
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "18px", color: "#1a1a1a", marginBottom: "12px", lineHeight: 1.2 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.82, color: "rgba(0,0,0,0.5)" }}>
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INQUIRY FORM ── */}
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
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Get In Touch</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(30px, 3.2vw, 46px)", lineHeight: 1.1, color: "#1a1a1a", marginBottom: "24px" }}>
                Begin the Conversation.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.9, color: "rgba(0,0,0,0.55)", marginBottom: "20px" }}>
                Share your objectives and we&rsquo;ll respond within 5 working days with a proposal tailored to your goals.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.9, color: "rgba(0,0,0,0.55)" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. All partnerships begin with a simple conversation — we&rsquo;d like to hear yours.
              </p>

              <div style={{ marginTop: "48px", padding: "28px 32px", borderLeft: "2px solid var(--primary-red)", background: "rgba(144,26,28,0.04)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "8px" }}>
                  Direct Contact
                </p>
                <a
                  href="mailto:partnerships@inkpotindia.com"
                  style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#1a1a1a", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-red)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a1a")}
                >
                  partnerships@inkpotindia.com
                </a>
              </div>
            </motion.div>

            <motion.form
              onSubmit={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
              style={{ background: "#ffffff", padding: "48px 52px" }}
            >
              <FormField label="Organisation Name" placeholder="Your organisation name" />
              <FormField label="Contact Person" placeholder="Full name" />
              <FormField label="Designation" placeholder="Your role or title" />
              <FormField label="Email Address" type="email" placeholder="your@organisation.com" />
              <FormField label="Phone Number" type="tel" placeholder="+91 00000 00000" />
              <FormField
                label="Collaboration Type"
                as="select"
                placeholder="Select type"
                options={["Event Co-Production", "CSR & Social Impact", "Media Collaboration", "Institutional Membership", "Educational Initiative", "Custom / Other"]}
              />
              <FormField
                label="Approximate Budget"
                as="select"
                placeholder="Select budget range"
                options={["Under ₹5 Lakhs", "₹5L – ₹25L", "₹25L – ₹1 Crore", "₹1 Crore+", "Open to Discussion"]}
              />
              <FormField label="Your Objectives" as="textarea" placeholder="What does a successful partnership look like for your organisation?" />

              <button
                type="submit"
                style={{ background: "var(--primary-red)", color: "#ffffff", padding: "16px 44px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "background 0.25s", marginTop: "8px" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#7a1517")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
              >
                Send Inquiry
              </button>
            </motion.form>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
