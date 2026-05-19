"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

/* ── Data ── */
const experiences = [
  {
    label: "Songs of the Stone",
    href: "https://www.songsofthestone.com/",
    image: "/images/Songs of the stone/SOTS-71.jpg",
    links: [{ label: "Learn More", href: "https://www.songsofthestone.com/" }],
  },
  {
    label: "Antarnaad",
    href: "#experiences",
    image: "/images/Homepage/antarnaad_lanscape.png",
    links: [{ label: "Comming Soon", href: "#experiences" }],
  },
  {
    label: "Inkpot India Conclave",
    href: "https://www.inkpotindiaconclave.com/",
    image: "/images/Inkpot India Conclave/saurav/224A3689.JPG",
    links: [{ label: "Learn More", href: "https://www.inkpotindiaconclave.com/" }],
  },
  {
    label: "Heritage Cleanliness Project",
    href: "/events/heritage-cleanliness",
    image: "/images/heritage cleaning/NolitterLegacy.png",
    links: [{ label: "Volunteer Now", href: "/events/heritage-cleanliness" }],
  },
];

const aboutLinks = [
  { label: "About Inkpot", href: "/about" },
  { label: "Leadership", href: "/about#leadership" },
  { label: "Beliefs & Values", href: "/about#beliefs" },
];

const workLinks = [
  { label: "Perform with Us", href: "#" },
  { label: "Partner with Us", href: "#" },
  { label: "Jobs / Careers", href: "#" },
];

/* ── Simple dropdown ── */
function SimpleDropdown({ label, href, links }: { label: string; href: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <a
        href={href}
        target={href !== "#" && href !== "/" ? "_blank" : undefined}
        rel={href !== "#" && href !== "/" ? "noopener noreferrer" : undefined}
        style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-black)", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap", textDecoration: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-red)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-black)")}
      >
        <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M1 1L3.5 4L6 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
        {label}
      </a>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14 }}
            style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "12px", minWidth: "220px", background: "#ffffff", borderTop: "2px solid var(--primary-red)", boxShadow: "0 8px 32px rgba(72,45,24,0.12)", padding: "20px 0" }}
          >
            {links.map((item) => (
              <a key={item.label} href={item.href}
                target={item.href !== "#" && item.href !== "/" ? "_blank" : undefined}
                rel={item.href !== "#" && item.href !== "/" ? "noopener noreferrer" : undefined}
                style={{ display: "block", padding: "8px 20px", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--primary-brown)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-red)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-brown)")}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Mega menu ── */
function MegaMenu({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          style={{ position: "absolute", top: "96px", left: 0, right: 0, background: "#ffffff", borderTop: "2px solid var(--primary-red)", boxShadow: "0 12px 40px rgba(72,45,24,0.13)", padding: "36px 80px 40px", zIndex: 40 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", maxWidth: "1280px", margin: "0 auto" }}>
            {experiences.map((exp) => (
              <div key={exp.label}>
                <a href={exp.href}
                  target={exp.href !== "#" && exp.href !== "/" ? "_blank" : undefined}
                  rel={exp.href !== "#" && exp.href !== "/" ? "noopener noreferrer" : undefined}
                  style={{ display: "block", position: "relative", width: "100%", height: "150px", overflow: "hidden", marginBottom: "14px" }}>
                  <Image
                    src={exp.image}
                    alt={exp.label}
                    fill
                    style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.35s ease" }}
                    sizes="20vw"
                    onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                </a>
                {/* Name — no italic */}
                <a
                  href={exp.href}
                  target={exp.href !== "#" && exp.href !== "/" ? "_blank" : undefined}
                  rel={exp.href !== "#" && exp.href !== "/" ? "noopener noreferrer" : undefined}
                  style={{ fontFamily: "var(--font-heading)", fontStyle: "normal", fontWeight: 500, fontSize: "15px", color: "var(--primary-brown)", display: "block", marginBottom: "10px", lineHeight: 1.3, textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-red)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-brown)")}
                >
                  {exp.label}
                </a>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.10)", marginBottom: "12px" }} />
                {exp.links.map((lnk) => (
                  <a key={lnk.label} href={lnk.href}
                    target={lnk.href.startsWith("http") ? "_blank" : undefined}
                    rel={lnk.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--primary-brown)", marginBottom: "8px", textDecoration: "none" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary-red)"; (e.currentTarget.querySelector("span") as HTMLElement).style.transform = "translateX(3px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--primary-brown)"; (e.currentTarget.querySelector("span") as HTMLElement).style.transform = "translateX(0)"; }}
                  >
                    {lnk.label}
                    <span style={{ color: "var(--primary-red)", display: "inline-block", transition: "transform 0.2s" }}>→</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main Navbar ── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => { if (megaTimeout.current) clearTimeout(megaTimeout.current); setMegaOpen(true); };
  const closeMega = () => { megaTimeout.current = setTimeout(() => setMegaOpen(false), 80); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const allMobileLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about", dropdown: aboutLinks },
    { label: "Our Experiences", href: "#experiences", dropdown: experiences.map((e) => ({ label: e.label, href: e.href })) },
    { label: "Work With Us", href: "#", dropdown: workLinks },
    { label: "Newsroom", href: "/newsroom" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(144,26,28,0.18)", transition: "background 0.3s" }}>

      {/* ── Desktop ── */}
      {isDesktop && (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", height: "96px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "24px" }}>
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px", justifyContent: "flex-end" }}>
            <SimpleDropdown label="About" href="/about" links={aboutLinks} />
            <div onMouseEnter={openMega} onMouseLeave={closeMega}>
              <a href="#experiences" style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: megaOpen ? "var(--primary-red)" : "var(--primary-black)", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap", transition: "color 0.2s", textDecoration: "none" }}>
                <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ flexShrink: 0, transform: megaOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M1 1L3.5 4L6 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
                Our Experiences
              </a>
            </div>
          </div>

          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/images/Inkpot/Inkpot Final logo-01.png" alt="Inkpot India" width={265} height={177}
              style={{ height: "118px", width: "auto", objectFit: "contain", filter: "contrast(1.15) saturate(1.1)" }} priority />
          </a>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px", justifyContent: "flex-start" }}>
            <SimpleDropdown label="Work With Us" href="#" links={workLinks} />
            {[{ label: "Newsroom", href: "/newsroom" }, { label: "Contact Us", href: "/contact" }].map((l) => (
              <a key={l.label} href={l.href}
                target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-black)", whiteSpace: "nowrap", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-red)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-black)")}
              >{l.label}</a>
            ))}
          </div>
        </div>
      )}

      {/* Mega menu */}
      {isDesktop && (
        <div onMouseEnter={openMega} onMouseLeave={closeMega}>
          <MegaMenu open={megaOpen} />
        </div>
      )}

      {/* ── Mobile header ── */}
      {!isDesktop && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", padding: "0 24px" }}>
          <a href="/">
            <Image src="/images/Inkpot/Inkpot Final logo-01.png" alt="Inkpot India"
              width={265} height={177} style={{ height: "52px", width: "auto", objectFit: "contain", filter: "contrast(1.15) saturate(1.1)" }} priority />
          </a>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "8px", background: "none", border: "none", cursor: "pointer" }} aria-label="Toggle menu">
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#111111", transform: mobileOpen ? "translateY(7.5px) rotate(45deg)" : "none", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#111111", opacity: mobileOpen ? 0 : 1, transition: "opacity 0.25s" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#111111", transform: mobileOpen ? "translateY(-7.5px) rotate(-45deg)" : "none", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)" }} />
          </button>
        </div>
      )}

    </nav>

    {/* ── Mobile menu — rendered OUTSIDE nav to avoid stacking context issues ── */}
    {!isDesktop && (
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "fixed", top: "64px", left: 0, right: 0, bottom: 0,
              background: "#ffffff", zIndex: 9999, overflowY: "auto",
            }}
          >
            <div style={{ padding: "12px 28px 56px" }}>
              {allMobileLinks.map((link) => (
                <div key={link.label} style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                        style={{
                          width: "100%", textAlign: "left", padding: "20px 0",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          background: "none", border: "none", cursor: "pointer",
                          fontFamily: "var(--font-heading)", fontStyle: "italic",
                          fontSize: "22px", fontWeight: 400, color: "#111111",
                        }}
                      >
                        {link.label}
                        <svg width="12" height="7" viewBox="0 0 12 8" fill="none"
                          style={{ transform: mobileExpanded === link.label ? "rotate(180deg)" : "none", transition: "transform 0.25s", flexShrink: 0 }}>
                          <path d="M1 1L6 6L11 1" stroke="var(--primary-red)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            style={{ overflow: "hidden", paddingBottom: "16px" }}
                          >
                            {link.dropdown.map((item) => (
                              <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                                target={item.href !== "#" && item.href !== "/" ? "_blank" : undefined}
                                rel={item.href !== "#" && item.href !== "/" ? "noopener noreferrer" : undefined}
                                style={{
                                  display: "block", padding: "9px 0 9px 2px",
                                  fontFamily: "var(--font-body)", fontSize: "13px",
                                  letterSpacing: "0.06em", color: "rgba(0,0,0,0.45)",
                                  textDecoration: "none", transition: "color 0.2s",
                                }}
                                onTouchStart={(e) => (e.currentTarget.style.color = "var(--primary-red)")}
                                onTouchEnd={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.45)")}
                              >
                                {item.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a href={link.href} onClick={() => setMobileOpen(false)}
                      target={link.href !== "#" && link.href !== "/" ? "_blank" : undefined}
                      rel={link.href !== "#" && link.href !== "/" ? "noopener noreferrer" : undefined}
                      style={{
                        display: "block", padding: "20px 0",
                        fontFamily: "var(--font-heading)", fontStyle: "italic",
                        fontSize: "22px", fontWeight: 400, color: "#111111",
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}

              {/* Socials */}
              <div style={{ marginTop: "48px", display: "flex", gap: "24px" }}>
                {[
                  { label: "Instagram", href: "https://www.instagram.com/inkpotindia_/" },
                  { label: "LinkedIn", href: "https://www.linkedin.com/company/inkpotindia/posts/?feedView=all" },
                  { label: "WhatsApp", href: "https://wa.me/919205304666" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", textDecoration: "none" }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )}
  </>
  );
}
