'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const paths = [
  {
    label: "For Artists",
    title: "Perform",
    description: "Bring your art to India's most iconic heritage stages.",
    image: "/images/experiences/SOTS-76.jpg",
    href: "/work-with-us/perform",
  },
  {
    label: "For Organisations",
    title: "Partner",
    description: "Shape cultural experiences that carry real meaning.",
    image: "/images/Inkpot India Conclave/saurav/224A3689.JPG",
    href: "/work-with-us/partner",
  },
  {
    label: "Jobs & Internships",
    title: "Careers",
    description: "Join a team that believes culture changes everything.",
    image: "/images/Homepage/about/Monuments.jpeg",
    href: "/work-with-us/careers",
  },
];

function Panel({ item, index }: { item: typeof paths[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={item.href}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2 + index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        flex: 1,
        overflow: "hidden",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="33vw"
        style={{
          objectFit: "cover",
          objectPosition: "center",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.85s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      />

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: hovered
          ? "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.92) 100%)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.58) 55%, rgba(0,0,0,0.88) 100%)",
        transition: "background 0.5s ease",
      }} />

      {/* Vertical dividers */}
      {index < 2 && (
        <div style={{ position: "absolute", top: 0, right: 0, width: "1px", height: "100%", background: "rgba(255,255,255,0.1)", zIndex: 5 }} />
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, padding: "48px" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", display: "block", marginBottom: "16px" }}>
          {item.label}
        </span>
        <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px, 3.5vw, 60px)", color: "#ffffff", lineHeight: 1, marginBottom: "16px", transition: "letter-spacing 0.4s" }}>
          {item.title}
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", marginBottom: "32px", maxWidth: "280px", transition: "color 0.3s" }}>
          {item.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: hovered ? "#ffffff" : "rgba(255,255,255,0.45)", transition: "color 0.3s" }}>
          Explore
          <motion.span animate={{ x: hovered ? 6 : 0 }} transition={{ duration: 0.25 }}>
            →
          </motion.span>
        </div>
      </div>
    </motion.a>
  );
}

export default function WorkWithUsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── HEADER ── */}
        <section style={{ background: "#0D0D0D", padding: "160px 64px 72px", textAlign: "center" }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "20px" }}
          >
            Get Involved
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5 }}
            style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 1.05, color: "#ffffff" }}
          >
            Work With<br />Inkpot India.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.8, color: "rgba(255,255,255,0.38)", maxWidth: "480px", margin: "20px auto 0" }}
          >
            Choose your path.
          </motion.p>
        </section>

        {/* ── THREE PANELS ── */}
        <div style={{ display: "flex", height: "80vh", minHeight: "560px" }}>
          {paths.map((item, i) => (
            <Panel key={item.title} item={item} index={i} />
          ))}
        </div>

      </main>
      <Footer />
    </>
  );
}
