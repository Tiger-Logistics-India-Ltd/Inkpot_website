"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Turnstile, { HoneypotField } from "@/components/Turnstile";

const OXBLOOD = "#8B1E20";

/* The viewer slides one panel at a time. Each panel groups two or three
 * photographs, alternating a portrait-led trio with a portrait pair so the
 * rhythm changes as you move across.
 *
 * Layout "a" = one tall portrait beside two stacked landscapes; "b" = two
 * portraits.
 *
 * Sources: portraits are 1080x1440 WebP; landscapes are 1920x1080 WebP encoded
 * from 4K PNGs (107MB -> 2.8MB) kept out of the repo in /_source-images. Both
 * comfortably exceed 2x their largest slot, so nothing is ever upscaled. */
const PANEL_SOURCE: { layout: "a" | "b"; shots: string[] }[] = [
  { layout: "a", shots: ["p-48.webp", "l-08.webp", "l-09.webp"] },
  { layout: "b", shots: ["p-45.webp", "p-46.webp"] },
  { layout: "a", shots: ["p-47.webp", "l-10.webp", "l-11.webp"] },
  { layout: "b", shots: ["p-49.webp", "p-50.webp"] },
  { layout: "a", shots: ["p-51.webp", "l-12.webp", "l-13.webp"] },
];

const PANELS = PANEL_SOURCE.map((p) => ({
  ...p,
  shots: p.shots.map((f) => `/images/heritage cleaning/gallery/${f}`),
}));

const SHOT_ALT = "Volunteers at a Heritage Cleanliness Project drive in Delhi";

/* Files live in public/images/heritage cleaning/Logos/
   Inkpot's own logo is deliberately not here — this row is collaborators. */
/* `scale` compensates for baked-in transparent padding, which varies wildly
 * between these files — DDA's artwork fills its whole canvas while Mai3tra's
 * occupies 27% of its height. Without it, `object-fit: contain` renders the
 * padded ones visibly smaller. Values are derived from each file's measured
 * ink bounding box, then eased back so the wide wordmarks don't sprawl. */
const PARTNERS = [
  { file: "DDA_logo.png", name: "Delhi Development Authority", scale: 1 },
  { file: "Kaash Magic Foundation.png", name: "Kaash Magic Foundation", scale: 1 },
  { file: "Umeed Logo.png", name: "Umeed", scale: 1.5 },
  { file: "Ila Green.png", name: "Ila Green", scale: 1.45 },
  { file: "Delhi Drum Circle.png", name: "Delhi Drum Circle", scale: 1.1 },
  { file: "Becoz_art_logo.png", name: "Becoz Music", scale: 1.6 },
  { file: "Mai3tra logo.png", name: "Mai3tra", scale: 1.5 },
  { file: "Shot in the Dark.png", name: "Shot in the Dark", scale: 1.45 },
];

/* ── Partner logos — a single scrollable line with edge buttons.
      The arrows hide themselves at each end (and entirely when everything
      already fits), so they only appear when there is somewhere to go. ── */
function PartnerRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const sync = () => {
      const max = el.scrollWidth - el.clientWidth;
      setScrollable(max > 4);
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= max - 2);
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const nudge = (dir: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(260, el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <div className={`hcp-prail-wrap${scrollable ? " is-scrollable" : ""}`}>
      <button
        type="button" className="hcp-prail-btn hcp-prail-prev"
        onClick={() => nudge(-1)} disabled={atStart} aria-label="Previous partners"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>

      <div ref={railRef} className="hcp-prail" role="list">
        {PARTNERS.map((p) => (
          <div
            key={p.file}
            className="hcp-prail-item"
            role="listitem"
            style={{ "--logo-scale": p.scale } as React.CSSProperties}
          >
            <Image
              src={`/images/heritage cleaning/Logos/${p.file}`}
              alt={p.name}
              fill
              sizes="190px"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </div>
        ))}
      </div>

      <button
        type="button" className="hcp-prail-btn hcp-prail-next"
        onClick={() => nudge(1)} disabled={atEnd} aria-label="Next partners"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  );
}

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

  /* Gallery viewer */
  const [slide, setSlide] = useState(0);
  const touchX = useRef<number | null>(null);
  const goSlide = (d: number) =>
    setSlide((s) => (s + d + PANELS.length) % PANELS.length);

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
              {/* The proverb carries the section now — left dark so it does not
                  compete with the oxblood eyebrow above. */}
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: isMobile ? "27px" : "clamp(27px, 3vw, 41px)", lineHeight: 1.2, color: "#1a1a1a", margin: 0 }}>
                Jab koi cheez sabki hoti hai, uski vajah se woh kabhi-kabhi kisi ki nahi hoti.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "14px" : "15.5px", lineHeight: 1.9, color: "rgba(0,0,0,0.6)", margin: "0 0 22px" }}>
                Ever spotted a plastic bottle lying against a centuries-old wall and wished you could do something about it? This is that chance. The Heritage Cleanliness Project is a coming together of institutions, authorities, communities and everyday people rethinking how we treat the places we&rsquo;ve inherited.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "15px" : "17px", lineHeight: 1.7, color: OXBLOOD, margin: 0, fontWeight: 500 }}>
                Our heritage doesn&rsquo;t belong to one person. Neither does the responsibility to protect it.
              </p>
            </motion.div>
            </div>
          </div>
        </section>

        {/* ── REGISTER FORM ── */}
        <section id="register" style={{ background: "var(--bg-linen, #F4EFE6)", scrollMarginTop: "92px" }}>
          {/* Sultan Garhi drawing runs as the section's banner, bleeding off the
              right edge the way the hero illustration does. It is line art on white,
              so `multiply` drops the white ground into the linen and leaves only the
              linework. A left-weighted scrim keeps the copy and form legible over it. */}
          <style>{`
            .hcp-reg       { position:relative; }
            /* Pinned to the artwork's own 16:9 and sized off the width, not the
               section. Filling the box would scale a 16:9 drawing up to cover a
               very tall section, which zooms it enormously and crops it. */
            .hcp-reg-art   { position:absolute; right:0; top:50%; translate:0 -50%;
                             width:min(56%, 760px); aspect-ratio:16 / 9; height:auto;
                             pointer-events:none; mix-blend-mode:multiply; opacity:.85; }
            .hcp-reg-scrim { position:absolute; inset:0; pointer-events:none;
                             background:linear-gradient(90deg,
                               rgba(244,239,230,0.97) 0%, rgba(244,239,230,0.92) 26%,
                               rgba(244,239,230,0.52) 46%, rgba(244,239,230,0) 66%); }
            .hcp-reg-copy  { position:relative; z-index:2; max-width:620px;
                             padding:clamp(64px,7vw,112px) clamp(24px,5vw,72px)
                                     clamp(64px,8vw,120px) clamp(24px,5vw,64px); }
            @media (max-width:900px) {
              /* art drops to a band at the foot so it never sits under the fields */
              .hcp-reg-art   { top:auto; bottom:0; translate:none;
                               width:100%; height:auto; opacity:.8; }
              .hcp-reg-scrim { background:linear-gradient(180deg,
                               rgba(244,239,230,0.96) 0%, rgba(244,239,230,0.86) 46%,
                               rgba(244,239,230,0.35) 78%, rgba(244,239,230,0) 100%); }
              .hcp-reg-copy  { max-width:none; padding:44px 24px 72px; }
            }
          `}</style>
          <div className="hcp-reg">

            <div className="hcp-reg-art">
              <Image
                src="/images/heritage%20cleaning/sultan-garhi-hero.webp"
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 900px) 100vw, 760px"
                quality={90}
                loading="lazy"
                style={{ objectFit: "contain", objectPosition: "center" }}
              />
            </div>
            <div className="hcp-reg-scrim" />

            {/* Copy + form */}
            <motion.div
              className="hcp-reg-copy"
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "22px", height: "1px", background: OXBLOOD }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: OXBLOOD }}>Next Drive · #NoLitterLegacy</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: isMobile ? "29px" : "clamp(30px, 3.2vw, 44px)", lineHeight: 1.1, color: "#1a1a1a", margin: "0 0 18px" }}>
                Register for The Heritage Cleanliness Project
              </h2>
              
              <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "14px" : "15.5px", lineHeight: 1.8, color: "rgba(0,0,0,0.6)", margin: "0 0 14px" }}>
                Join us on Sunday, 30th August at 4:00 PM for Heritage, Culture &amp; Cleanliness: an evening of community action, heritage storytelling and conversations with people who share a love for heritage.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "14px" : "15.5px", lineHeight: 1.8, color: "rgba(0,0,0,0.6)", margin: "0 0 12px" }}>
                Whether you&rsquo;ve joined us before or this is your first time, we&rsquo;d love to have you with us. Bring a friend, wear comfortable clothes, and spend the evening connecting with a wonderful community while giving back to the spaces that bring us together.
              </p>
              {/* Montserrat is this site's --font-body */}
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: isMobile ? "15px" : "18px", letterSpacing: "0.06em", color: OXBLOOD, margin: "18px 0 26px" }}>
                #NoLitterLegacy
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "34px" }}>
                {[
                  { icon: "📍", text: "Sultan Garhi Tomb, Vasant Kunj" },
                  { icon: "🗓️", text: "Sunday, 30 August 2026" },
                  { icon: "🕖", text: "4:00 PM onwards" },
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
                    We&rsquo;ll be in touch with the details for the 30th August drive. See you at the site.
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

        {/* ── GALLERY ── */}
        <section style={{ background: "#FBF9F5", padding: isMobile ? "64px 20px" : "116px 64px" }}>
          {/*
            Single-window viewer. The set mixes 3:4 portraits with 1.65 landscapes,
            so the sharp image sits `contain` inside a fixed frame and a blurred,
            scaled copy of the same photo fills the space beside it. Nothing is
            cropped and nothing is letterboxed against dead space — which also
            keeps the 397px-wide landscapes off any large sharp surface.
          */}
          <style>{`
            .hcp-stage { position:relative; overflow:hidden; }
            .hcp-track { display:flex; will-change:transform;
                         transition:transform .72s cubic-bezier(.22,1,.36,1); }
            .hcp-panel { flex:0 0 100%; display:grid; gap:14px; height:520px; }
            .hcp-panel-a { grid-template-columns:1.32fr 1fr; grid-template-rows:1fr 1fr; }
            .hcp-panel-a > :first-child { grid-row:span 2; }
            .hcp-panel-b { grid-template-columns:1fr 1fr; grid-template-rows:1fr; }
            .hcp-cell { position:relative; overflow:hidden; margin:0; background:#EFEAE1; }
            .hcp-cell::after { content:""; position:absolute; inset:0; pointer-events:none;
                               box-shadow:inset 0 0 0 1px rgba(0,0,0,0.06); }
            .hcp-nav { position:absolute; top:50%; transform:translateY(-50%);
                       width:46px; height:46px; border-radius:50%; border:none; cursor:pointer;
                       background:rgba(255,255,255,0.86); color:#1a1a1a;
                       display:flex; align-items:center; justify-content:center;
                       transition:background .22s, transform .22s; z-index:3;
                       box-shadow:0 3px 16px rgba(0,0,0,0.20); }
            .hcp-nav:hover { background:#ffffff; transform:translateY(-50%) scale(1.07); }
            .hcp-nav:focus-visible { outline:2px solid #8B1E20; outline-offset:3px; }
            .hcp-prev { left:18px; } .hcp-next { right:18px; }
            .hcp-count { position:absolute; right:18px; bottom:16px; z-index:3;
                         font-family:var(--font-body); font-size:11px; letter-spacing:0.18em;
                         color:#fff; background:rgba(20,16,13,0.55); padding:7px 13px;
                         font-variant-numeric:tabular-nums; }
            .hcp-dots { display:flex; justify-content:center; gap:7px; margin-top:22px; flex-wrap:wrap; }
            .hcp-dot { width:22px; height:2px; border:none; padding:0; cursor:pointer;
                       background:rgba(0,0,0,0.16); transition:background .25s; }
            .hcp-dot[aria-current="true"] { background:#8B1E20; }
            .hcp-dot:focus-visible { outline:2px solid #8B1E20; outline-offset:3px; }
            @media (max-width:900px) {
              .hcp-panel { height:400px; gap:10px; }
              .hcp-panel-a { grid-template-columns:1.2fr 1fr; }
            }
            @media (max-width:640px) {
              .hcp-panel { height:330px; gap:8px; }
              .hcp-nav { width:38px; height:38px; }
              .hcp-prev { left:10px; } .hcp-next { right:10px; }
              .hcp-dot { width:14px; }
            }
            @media (prefers-reduced-motion:reduce) {
              .hcp-nav { transition:none; }
              .hcp-track { transition:none; }
            }
          `}</style>
          <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ textAlign: "center", maxWidth: "620px", margin: `0 auto ${isMobile ? "40px" : "68px"}` }}
            >
              <h2 style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: OXBLOOD, margin: "0 0 18px", fontWeight: 400 }}>
                From the drives
              </h2>
              <div style={{ width: "40px", height: "1px", background: "rgba(139,30,32,0.4)", margin: "0 auto 20px" }} />
              <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "13px" : "14.5px", lineHeight: 1.85, color: "rgba(0,0,0,0.55)", margin: 0 }}>
                Students, families, first-timers and regulars — gathered at Delhi&rsquo;s monuments
                with gloves, bags and a few hours to give.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div
                className="hcp-stage"
                role="region"
                aria-roledescription="carousel"
                aria-label="Photographs from past drives"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") { e.preventDefault(); goSlide(-1); }
                  if (e.key === "ArrowRight") { e.preventDefault(); goSlide(1); }
                }}
                onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  if (touchX.current === null) return;
                  const dx = e.changedTouches[0].clientX - touchX.current;
                  if (Math.abs(dx) > 45) goSlide(dx < 0 ? 1 : -1);
                  touchX.current = null;
                }}
              >
                <div className="hcp-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
                  {PANELS.map((panel, pi) => (
                    <div
                      key={pi}
                      className={`hcp-panel hcp-panel-${panel.layout}`}
                      aria-hidden={pi !== slide}
                    >
                      {panel.shots.map((src, si) => (
                        <figure className="hcp-cell" key={src}>
                          <Image
                            src={src}
                            alt={`${SHOT_ALT} — panel ${pi + 1}, photograph ${si + 1}`}
                            fill
                            sizes={
                              panel.layout === "a" && si === 0
                                ? "(max-width: 640px) 55vw, 620px"
                                : "(max-width: 640px) 45vw, 420px"
                            }
                            style={{ objectFit: "cover", objectPosition: "center" }}
                          />
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>

                <button type="button" className="hcp-nav hcp-prev" onClick={() => goSlide(-1)} aria-label="Previous photographs">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button type="button" className="hcp-nav hcp-next" onClick={() => goSlide(1)} aria-label="Next photographs">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>

                <div className="hcp-count" aria-live="polite">
                  {String(slide + 1).padStart(2, "0")} / {String(PANELS.length).padStart(2, "0")}
                </div>
              </div>

              <div className="hcp-dots">
                {PANELS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="hcp-dot"
                    aria-current={i === slide}
                    aria-label={`Go to group ${i + 1}`}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PARTNERS ── */}
        <section style={{ background: "var(--bg-linen, #F4EFE6)", padding: isMobile ? "48px 24px" : "80px 64px" }}>
          <div style={{ maxWidth: "1180px", margin: "0 auto", textAlign: "center" }}>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(0,0,0,0.42)", margin: "0 0 34px" }}
            >
              In collaboration with
            </motion.p>
            <style>{`
              .hcp-prail-wrap  { position:relative; }
              .hcp-prail       { display:flex; align-items:center; gap:clamp(26px,3.6vw,58px);
                                 overflow-x:auto; scroll-behavior:smooth; scrollbar-width:none;
                                 scroll-snap-type:x proximity;
                                 padding:6px clamp(38px,5vw,60px); }
              .hcp-prail::-webkit-scrollbar { display:none; }
              /* Box grows by --logo-scale so padded logos read at a comparable
                 optical size; growing the box (not transform) keeps the flex
                 row's spacing honest instead of letting neighbours overlap. */
              .hcp-prail-item  { position:relative; flex:0 0 auto; scroll-snap-align:center;
                                 width:calc(clamp(118px,15vw,190px) * var(--logo-scale,1));
                                 height:calc(clamp(72px,9vw,112px) * var(--logo-scale,1)); }
              /* Edge fades + arrows only exist when there is actually overflow */
              .hcp-prail-wrap.is-scrollable::before,
              .hcp-prail-wrap.is-scrollable::after {
                                 content:""; position:absolute; top:0; bottom:0; width:clamp(30px,4vw,54px);
                                 pointer-events:none; z-index:2; }
              .hcp-prail-wrap.is-scrollable::before { left:0;
                                 background:linear-gradient(90deg, var(--bg-linen,#F4EFE6) 25%, rgba(244,239,230,0)); }
              .hcp-prail-wrap.is-scrollable::after  { right:0;
                                 background:linear-gradient(270deg, var(--bg-linen,#F4EFE6) 25%, rgba(244,239,230,0)); }
              .hcp-prail-btn   { position:absolute; top:50%; transform:translateY(-50%);
                                 width:42px; height:42px; border-radius:50%; border:none; cursor:pointer;
                                 background:#ffffff; color:#1a1a1a; z-index:3;
                                 display:flex; align-items:center; justify-content:center;
                                 box-shadow:0 3px 16px rgba(0,0,0,0.18);
                                 transition:opacity .25s, transform .22s, background .22s; }
              .hcp-prail-btn:hover:not(:disabled) { transform:translateY(-50%) scale(1.08); }
              .hcp-prail-btn:focus-visible { outline:2px solid #8B1E20; outline-offset:3px; }
              .hcp-prail-btn:disabled { opacity:0; pointer-events:none; }
              .hcp-prail-prev  { left:0; }
              .hcp-prail-next  { right:0; }
              @media (max-width:640px) {
                .hcp-prail-btn { width:34px; height:34px; }
                .hcp-prail     { padding:6px 34px; }
              }
              @media (prefers-reduced-motion:reduce) {
                .hcp-prail     { scroll-behavior:auto; }
                .hcp-prail-btn { transition:none; }
              }
            `}</style>
            <PartnerRail />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
