"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Turnstile, { HoneypotField } from "@/components/Turnstile";

const OXBLOOD = "#8B1E20";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  isMobile,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  isMobile: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: isMobile ? "26px" : "32px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", display: "block", marginBottom: "8px" }}>
        {label}{required && <span style={{ color: OXBLOOD }}> *</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display: "block", width: "100%", background: "transparent", border: "none",
          borderBottom: `1px solid ${focused ? OXBLOOD : "rgba(0,0,0,0.15)"}`,
          padding: "12px 0", fontFamily: "var(--font-body)", fontSize: "15px",
          color: "#1a1a1a", outline: "none", transition: "border-color 0.2s",
        }}
      />
    </div>
  );
}

export default function HeritageCleanlinessPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", affiliation: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [botToken, setBotToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/heritage-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken: botToken ?? "", company: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please email info@inkpotindia.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#ffffff" }}>

        {/* ── HERO ── */}
        <section style={{ position: "relative", height: isMobile ? "62vh" : "78vh", minHeight: isMobile ? "440px" : "560px", overflow: "hidden", background: "#FBF9F5" }}>
          {/* Warm paper base, settling into the linen of the section below */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, #FDFBF8 0%, #F8F5EF 58%, var(--bg-linen, #F5F5F0) 100%)" }} />
          {/* Faint warm wash, upper-left */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(85% 120% at 10% 6%, rgba(144,26,28,0.07) 0%, rgba(144,26,28,0) 58%)" }} />
          {/* Faint arch motifs — a monument gateway */}
          <div style={{ position: "absolute", right: isMobile ? "-14%" : "-4%", top: "54%", transform: "translateY(-50%)", width: isMobile ? "78%" : "44%", aspectRatio: "3 / 4", border: "1px solid rgba(144,26,28,0.13)", borderBottom: "none", borderRadius: "50% 50% 0 0 / 64% 64% 0 0", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: isMobile ? "0%" : "6%", top: "56%", transform: "translateY(-50%)", width: isMobile ? "54%" : "31%", aspectRatio: "3 / 4", border: "1px solid rgba(144,26,28,0.09)", borderBottom: "none", borderRadius: "50% 50% 0 0 / 64% 64% 0 0", pointerEvents: "none" }} />
          {/* Heritage monument illustration — multiply so the cream drops into the paper and only the linework and colour stay */}
          <div style={{ position: "absolute", right: 0, bottom: 0, width: isMobile ? "104%" : "68%", height: isMobile ? "46%" : "76%", pointerEvents: "none", opacity: isMobile ? 0.95 : 0.92, mixBlendMode: "multiply", maskImage: "linear-gradient(180deg, transparent 0%, #000 26%, #000 88%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 26%, #000 88%, transparent 100%)" }}>
            <Image
              src="/images/heritage cleaning/hero_poster.png"
              alt=""
              aria-hidden="true"
              fill
              loading="eager"
              quality={90}
              sizes="(max-width: 768px) 104vw, 68vw"
              style={{ objectFit: "contain", objectPosition: "bottom right" }}
            />
          </div>
          {/* Paper grain */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.5, mixBlendMode: "multiply", pointerEvents: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)' opacity='0.14'/%3E%3C/svg%3E\")" }} />
          {/* Bottom fade into the linen section below */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent ${isMobile ? "82%" : "68%"}, var(--bg-linen, #F5F5F0) 100%)` }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: isMobile ? "flex-start" : "flex-end", padding: isMobile ? "96px 24px 0" : "0 64px 72px", maxWidth: "1280px", margin: "0 auto", left: 0, right: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <div style={{ width: "24px", height: "1px", background: "var(--primary-red, #901A1C)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red, #901A1C)" }}>
                  Community Initiative · #NoLitterLegacy
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: isMobile ? "40px" : "clamp(48px, 6.5vw, 92px)", lineHeight: 1.03, color: "#141210", margin: "0 0 16px", maxWidth: "900px" }}>
                The Heritage<br /><span style={{ color: "var(--primary-red, #901A1C)" }}>Cleanliness Project</span>
              </h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "14px" : "17px", lineHeight: 1.7, color: "rgba(20,18,16,0.68)", maxWidth: "520px", margin: 0 }}>
                We walk alongside history — and clean alongside it. One Sunday a month, at Delhi&rsquo;s heritage sites.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section style={{ background: "var(--bg-linen, #F4EFE6)", padding: isMobile ? "56px 0 0" : "104px 0 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: isMobile ? "0 24px" : "0 64px" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.85fr 1.15fr", gap: isMobile ? "24px" : "80px", alignItems: "start" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "22px", height: "1px", background: OXBLOOD }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: OXBLOOD }}>Why it matters</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: isMobile ? "30px" : "clamp(30px, 3.4vw, 46px)", lineHeight: 1.12, color: "#1a1a1a", margin: 0 }}>
                If you&rsquo;ve ever felt that responsibility, you already belong here.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "14px" : "15.5px", lineHeight: 1.9, color: "rgba(0,0,0,0.6)", margin: "0 0 22px" }}>
                Ever spotted a plastic bottle lying against a centuries-old wall and wished you could do something about it? This is that chance. The Heritage Cleanliness Project is a coming together of institutions, authorities, communities and everyday people rethinking how we treat the places we&rsquo;ve inherited.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "15px" : "17px", lineHeight: 1.7, color: "#1a1a1a", margin: "0 0 14px", fontWeight: 500 }}>
                Our heritage doesn&rsquo;t belong to one person. Neither does the responsibility to protect it.
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: isMobile ? "17px" : "21px", lineHeight: 1.5, color: OXBLOOD, margin: 0 }}>
                Jab koi cheez sabki hoti hai, uski vajah se woh kabhi-kabhi kisi ki nahi hoti.
              </p>
            </motion.div>
            </div>
          </div>
        </section>

        {/* ── REGISTER FORM ── */}
        <section id="register" style={{ background: "var(--bg-linen, #F4EFE6)", padding: isMobile ? "56px 24px 64px" : "104px 64px 120px" }}>
          <div style={{ maxWidth: "1120px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.12fr 1fr", gap: isMobile ? "40px" : "60px", alignItems: "start" }}>

            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.85, ease: "easeOut" }}
              style={{ position: "relative", width: "100%", maxWidth: isMobile ? "340px" : "none", margin: isMobile ? "0 auto" : "0", aspectRatio: "1080 / 1350", overflow: "hidden", boxShadow: "0 14px 48px rgba(0,0,0,0.16)" }}
            >
              <Image
                src="/images/heritage cleaning/newposter.png"
                alt="The Heritage Cleanliness Project — Sunday 26 July drive"
                fill sizes="(max-width: 768px) 340px, 440px"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "22px", height: "1px", background: OXBLOOD }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: OXBLOOD }}>Next Drive · #NoLitterLegacy</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: isMobile ? "31px" : "clamp(32px, 3.6vw, 50px)", lineHeight: 1.08, color: "#1a1a1a", margin: "0 0 16px" }}>
                Coffee tastes better after you&rsquo;ve done something good.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "14px" : "15.5px", lineHeight: 1.8, color: "rgba(0,0,0,0.6)", margin: "0 0 12px" }}>
                On Sunday, 26th July, swap your usual café catch-up for something more meaningful. Join us as a changemaker for a morning of cleaning &amp; restoring a heritage site — alongside storytelling, meeting interesting people, great conversations, and cold coffee.
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: isMobile ? "17px" : "20px", color: OXBLOOD, margin: "0 0 24px", letterSpacing: "0.02em" }}>
                Show up. Pick up. Sip up.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "34px" }}>
                {[
                  { icon: "📍", text: "Mehrauli Archaeological Park" },
                  { icon: "🗓️", text: "Sunday, 26 July" },
                  { icon: "🕖", text: "7:00 AM onwards" },
                ].map((d) => (
                  <div key={d.text} style={{ display: "flex", alignItems: "center", gap: "7px", border: "1px solid rgba(139,30,32,0.3)", borderRadius: "999px", padding: "8px 15px", fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.02em", color: "rgba(0,0,0,0.7)" }}>
                    <span aria-hidden="true">{d.icon}</span>{d.text}
                  </div>
                ))}
              </div>

              {submitted ? (
                <div style={{ padding: isMobile ? "24px 0" : "24px 0 40px" }}>
                  <div style={{ width: "48px", height: "48px", border: `1px solid ${OXBLOOD}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={OXBLOOD} strokeWidth="1.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "26px", color: "#1a1a1a", marginBottom: "12px" }}>
                    You&rsquo;re in, changemaker
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(0,0,0,0.5)", lineHeight: 1.8 }}>
                    We&rsquo;ll be in touch with the details for the 26th July drive. See you at the site.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: OXBLOOD, fontWeight: 600, margin: "0 0 22px" }}>
                    Register as a Changemaker
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "0" : "0 40px" }}>
                    <Field label="Full Name" name="name" placeholder="Your name" value={form.name} onChange={set("name")} required isMobile={isMobile} />
                    <Field label="Phone Number" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} required isMobile={isMobile} />
                  </div>
                  <Field label="Email Address" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={set("email")} required isMobile={isMobile} />
                  <Field label="University / Place of Work (optional)" name="affiliation" placeholder="e.g. Delhi University, or where you work" value={form.affiliation} onChange={set("affiliation")} isMobile={isMobile} />

                  {error && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: OXBLOOD, marginBottom: "20px" }}>
                      {error}
                    </p>
                  )}

                  <HoneypotField value={honeypot} onChange={setHoneypot} />
                  <Turnstile onVerify={setBotToken} theme="light" />

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ background: loading ? "rgba(139,30,32,0.55)" : OXBLOOD, color: "#ffffff", padding: "16px 48px", fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: loading ? "default" : "pointer", transition: "background 0.25s", marginTop: "8px" }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#6d1719"; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = OXBLOOD; }}
                  >
                    {loading ? "Signing you up…" : "Count Me In"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
