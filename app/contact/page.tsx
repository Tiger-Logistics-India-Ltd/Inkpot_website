'use client';

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  as = "input",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  as?: "input" | "textarea";
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
  };

  return (
    <div style={{ marginBottom: "36px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", display: "block", marginBottom: "8px" }}>
        {label}
      </label>
      {as === "textarea" ? (
        <textarea name={name} rows={5} placeholder={placeholder} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      )}
    </div>
  );
}

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/inkpotindia_/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/inkpotindia/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us at info@inkpotindia.com");
    } finally {
      setLoading(false);
    }
  };

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
            Reach Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5 }}
            style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 1.05, color: "#ffffff" }}
          >
            Let&rsquo;s Connect
          </motion.h1>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "112px 64px 128px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "100px", alignItems: "start" }}>

          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
              <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)" }}>Contact</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.15, color: "#1a1a1a", marginBottom: "32px" }}>
              We&rsquo;d love to hear from you.
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.9, color: "rgba(0,0,0,0.55)", marginBottom: "56px" }}>
              Whether you have a question, a collaboration idea, or just want to say hello — our inbox is always open.
            </p>

            {/* Contact details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {[
                {
                  label: "Email",
                  value: "info@inkpotindia.com",
                  href: "mailto:info@inkpotindia.com",
                },
                {
                  label: "Location",
                  value: "New Delhi, India",
                  href: undefined,
                },
              ].map((item) => (
                <div key={item.label}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", display: "block", marginBottom: "6px" }}>
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#1a1a1a", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-red)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a1a")}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#1a1a1a" }}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}

              {/* Social */}
              <div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", display: "block", marginBottom: "14px" }}>
                  Follow Along
                </span>
                <div style={{ display: "flex", gap: "12px" }}>
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      style={{ width: "40px", height: "40px", border: "1px solid rgba(144,26,28,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-red)", transition: "all 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary-red)"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "var(--primary-red)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--primary-red)"; e.currentTarget.style.borderColor = "rgba(144,26,28,0.3)"; }}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ width: "48px", height: "48px", border: "1px solid rgba(144,26,28,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-red)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "26px", color: "#1a1a1a", marginBottom: "12px" }}>
                  Message Received
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(0,0,0,0.5)", lineHeight: 1.8 }}>
                  Thank you for reaching out. We&rsquo;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
                  <Field label="First Name" name="first_name" placeholder="First name" />
                  <Field label="Last Name" name="last_name" placeholder="Last name" />
                </div>
                <Field label="Email Address" name="reply_to" type="email" placeholder="your@email.com" />
                <Field label="Comment" name="subject" placeholder="Write your comment here..." />
                <Field label="Message" name="message" as="textarea" placeholder="Your message…" />

                {error && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--primary-red)", marginBottom: "20px" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ background: loading ? "rgba(144,26,28,0.5)" : "var(--primary-red)", color: "#ffffff", padding: "16px 44px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", border: "none", cursor: loading ? "default" : "pointer", transition: "background 0.25s" }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#7a1517"; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--primary-red)"; }}
                >
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </section>

        {/* ── DIVIDER STRIP ── */}
        <div style={{ background: "var(--bg-linen)", borderTop: "1px solid rgba(0,0,0,0.07)", padding: "64px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px, 2.2vw, 30px)", color: "rgba(0,0,0,0.35)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.5 }}>
            &ldquo;Culture lives in the space between people. Come find us there.&rdquo;
          </p>
        </div>

      </main>
      <Footer />
    </>
  );
}
