"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface EventItem {
  num: string;
  tag: string;
  title: string;
  chapter: string | null;
  body: string;
  image: string;
  status: "active" | "coming-soon";
  location: string;
  cta: { label: string; href: string } | null;
}

const events: EventItem[] = [
  {
    num: "01",
    tag: "Summer Programme",
    title: "Antarnaad",
    chapter: null,
    body: "A summer immersion into Indian music, storytelling, and the performing arts — designed for the next generation of cultural thinkers.",
    image: "/images/experiences/224A3705.JPG",
    status: "coming-soon",
    location: "New Delhi",
    cta: null,
  },
  {
    num: "02",
    tag: "Community Initiative",
    title: "The Heritage Cleanliness Project",
    chapter: null,
    body: "Every last Sunday, we gather at a heritage site — not just to clean, but to listen. To the stories that stone remembers.",
    image: "/images/heritage cleaning/image_2.png",
    status: "active",
    location: "Mehrauli Archaeological Park",
    cta: { label: "Volunteer Now", href: "/events/heritage-cleanliness" },
  },
  {
    num: "03",
    tag: "Music & Heritage",
    title: "Songs of the Stone",
    chapter: "Chapter 3",
    body: "After-hours cultural evenings at Delhi's heritage monuments. Space becomes stage. Arches become resonance. Stone becomes story.",
    image: "/images/Songs of the stone/songsofthestone.png",
    status: "coming-soon",
    location: "Delhi Heritage Monuments",
    cta: null,
  },
];

/* Easing used across all panel animations */
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function FeaturedEvent() {
  return (
    <section id="events" style={{ background: "#ffffff", padding: "100px 0 128px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "56px" }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "24px", height: "1px", background: "var(--primary-red)" }} />
              <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--primary-red)", margin: 0 }}>
                What&apos;s On
              </p>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(34px, 4vw, 52px)", color: "#111111", lineHeight: 1.08, margin: 0 }}>
              Upcoming Events
            </h2>
          </div>
          <a
            href="/events"
            style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.32)", textDecoration: "none", paddingBottom: "3px", borderBottom: "1px solid rgba(0,0,0,0.14)", transition: "color 0.22s, border-color 0.22s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary-red)"; e.currentTarget.style.borderBottomColor = "var(--primary-red)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,0,0,0.32)"; e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.14)"; }}
          >
            View All Events →
          </a>
        </motion.div>

        {/* ── Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.18fr 1fr", gap: "20px", alignItems: "end" }}>
          {events.map((ev, i) => (
            <EventCard key={ev.num} ev={ev} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

function EventCard({ ev, index }: { ev: EventItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isActive = ev.status === "active";

  const cardH  = 500;
  const panelD = 116;
  const panelE = 268;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.72, delay: index * 0.12, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        height: `${cardH}px`,
        overflow: "hidden",
        boxShadow: hovered ? "0 20px 64px rgba(0,0,0,0.15)" : "0 4px 28px rgba(0,0,0,0.09)",
        transition: "box-shadow 0.55s ease",
      }}
    >

      {/* ── Image with zoom ── */}
      <Image
        src={ev.image}
        alt={ev.title}
        fill
        sizes="(max-width: 1280px) 33vw, 420px"
        style={{
          objectFit: "cover",
          objectPosition: "center",
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: `transform 0.88s cubic-bezier(${EASE.join(",")})`,
          filter: isActive ? "none" : "saturate(0.82) brightness(0.88)",
          willChange: "transform",
        }}
      />

      {/* ── Coming-soon chip ── */}
      {!isActive && (
        <div style={{
          position: "absolute", top: "20px", right: "20px", zIndex: 15,
          background: "rgba(144,26,28,0.82)",
          backdropFilter: "blur(6px)",
          padding: "5px 13px",
          fontFamily: "var(--font-body)", fontSize: "8px",
          letterSpacing: "0.22em", textTransform: "uppercase", color: "#ffffff",
        }}>
          Coming Soon
        </div>
      )}

      {/* ── Expanding red panel ── */}
      <motion.div
        animate={{ height: hovered ? panelE : panelD }}
        transition={{ duration: 0.52, ease: EASE }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "#901A1C",
          overflow: "hidden",
          zIndex: 10,
        }}
      >

        {/* Always-visible: tag + title + location */}
        <div style={{ padding: "20px 24px 0" }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "8.5px",
            letterSpacing: "0.24em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.52)", margin: "0 0 8px",
          }}>
            {ev.tag}
          </p>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
            <div>
              <h3 style={{
                fontFamily: "var(--font-heading)", fontWeight: 400,
                fontSize: isActive ? "22px" : "20px",
                lineHeight: 1.18, color: "#ffffff", margin: 0,
              }}>
                {ev.title}
              </h3>
              {ev.chapter && (
                <span style={{
                  display: "block",
                  fontFamily: "var(--font-body)", fontSize: "9px",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)", marginTop: "4px",
                }}>
                  {ev.chapter}
                </span>
              )}
            </div>
            {!isActive && (
              <span style={{
                fontFamily: "var(--font-body)", fontSize: "7.5px",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(255,255,255,0.28)",
                padding: "3px 9px", whiteSpace: "nowrap",
                flexShrink: 0, marginTop: "3px",
              }}>
                Soon
              </span>
            )}
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: "5px",
            marginTop: "10px",
            fontFamily: "var(--font-body)", fontSize: "10px",
            color: "rgba(255,255,255,0.40)",
          }}>
            <svg width="8" height="11" viewBox="0 0 9 12" fill="currentColor">
              <path d="M4.5 0C2.567 0 1 1.567 1 3.5c0 2.625 3.5 7.5 3.5 7.5S8 6.125 8 3.5C8 1.567 6.433 0 4.5 0zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
            {ev.location}
          </div>
        </div>

        {/* Divider — fades in first */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2, delay: hovered ? 0.2 : 0 }}
          style={{ margin: "18px 24px 0", height: "1px", background: "rgba(255,255,255,0.14)" }}
        />

        {/* Body + CTA — reveals after divider */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3, delay: hovered ? 0.25 : 0 }}
          style={{ padding: "16px 24px 28px" }}
        >
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.75,
            color: "rgba(255,255,255,0.74)",
            marginBottom: "14px",
          }}>
            {ev.body}
          </p>

          {isActive && ev.cta ? (
            <a
              href={ev.cta.href}
              style={{
                display: "inline-flex", alignItems: "center", gap: "9px",
                background: "#ffffff", color: "#901A1C",
                fontFamily: "var(--font-body)", fontSize: "10px",
                letterSpacing: "0.2em", textTransform: "uppercase",
                padding: "12px 26px", textDecoration: "none",
                fontWeight: 600, transition: "background 0.25s, color 0.25s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#111111"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#901A1C"; }}
            >
              {ev.cta.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "10px",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}>
              Stay tuned for updates →
            </p>
          )}
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
