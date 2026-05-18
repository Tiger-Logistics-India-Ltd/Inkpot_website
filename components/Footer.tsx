"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const cols = [
  {
    label: "NAVIGATE",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Our Experiences", href: "#experiences" },
      { label: "Newsroom", href: "/newsroom" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  },
  {
    label: "OUR EXPERIENCES",
    links: [
      { label: "Songs of the Stone", href: "https://www.songsofthestone.com/" },
      { label: "Antarnaad", href: "#experiences" },
      { label: "Inkpot India Conclave", href: "https://www.inkpotindiaconclave.com/" },
      { label: "Heritage Cleanliness Project", href: "/events/heritage-cleanliness" },
      { label: "Echoes of Expression", href: "#" },
    ],
  },
  {
    label: "GET INVOLVED",
    links: [
      { label: "Perform with Us", href: "/work-with-us/perform" },
      { label: "Partner with Us", href: "/work-with-us/partner" },
      { label: "Jobs & Internships", href: "/work-with-us/careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/inkpotindia_/",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/inkpotindia/posts/?feedView=all",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919205304666",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.523 5.837L.057 23.857l6.197-1.624A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.894 16.582c-.248.698-1.458 1.371-1.99 1.415-.532.044-1.032.206-3.482-.726-2.92-1.1-4.794-4.077-4.94-4.267-.145-.19-1.184-1.578-1.184-3.006 0-1.428.748-2.132 1.013-2.423.265-.292.578-.365.77-.365l.554.01c.178.009.416-.067.651.497.248.59.844 2.046.916 2.195.073.15.121.325.025.525-.097.2-.145.325-.29.5-.144.175-.304.39-.434.524-.145.145-.296.302-.127.592.169.29.75 1.236 1.609 2 1.103.98 2.033 1.283 2.323 1.427.29.145.458.12.628-.073.17-.194.726-.846.92-1.136.193-.29.386-.242.65-.145.263.097 1.671.789 1.957.934.286.145.477.218.547.34.07.12.07.698-.178 1.382z"/></svg>,
  },
];

const vp = { once: false, amount: 0.15 };
const spring = (delay = 0) => ({ type: "spring" as const, stiffness: 65, damping: 20, delay });

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <footer style={{ background: "var(--bg-linen)", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: isMobile ? "48px 20px 40px" : "80px 48px 72px" }}>

        {isMobile ? (
          /* ── Mobile layout ── */
          <div>
            {/* Brand row */}
            <motion.div
              initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              viewport={vp} transition={spring(0)}
              style={{ marginBottom: "36px" }}
            >
              <a href="/" style={{ display: "inline-block", marginBottom: "14px" }}>
                <Image
                  src="/images/Inkpot/Inkpot_600x400 px.svg"
                  alt="Inkpot India"
                  width={115} height={40} unoptimized
                  style={{ height: "72px", width: "auto", objectFit: "contain" }}
                />
              </a>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.05em", color: "rgba(0,0,0,0.4)", marginBottom: "16px" }}>
                Re-Inking Our Cultural Heritage
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ width: "34px", height: "34px", borderRadius: "50%", border: "1px solid rgba(144,26,28,0.4)", color: "var(--primary-mustard)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Link cols — 2 columns on mobile */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 16px" }}>
              {cols.map((col, ci) => (
                <motion.div
                  key={col.label}
                  initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                  viewport={vp} transition={spring(0.06 * (ci + 1))}
                >
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary-mustard)", marginBottom: "12px" }}>
                    {col.label}
                  </p>
                  <nav style={{ display: "flex", flexDirection: "column" }}>
                    {col.links.map((link) => (
                      <a key={link.label} href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#000000", lineHeight: "2.0", textDecoration: "none" }}
                        onTouchStart={(e) => (e.currentTarget.style.color = "var(--primary-mustard)")}
                        onTouchEnd={(e) => (e.currentTarget.style.color = "#000000")}
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Desktop layout ── */
          <div className="grid grid-cols-4" style={{ gap: "48px" }}>
            {/* Brand col */}
            <motion.div
              initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              viewport={vp} transition={spring(0)}
            >
              <a href="/" className="mb-5 w-fit block">
                <Image
                  src="/images/Inkpot/Inkpot_600x400 px.svg"
                  alt="Inkpot India"
                  width={115} height={40} unoptimized
                  style={{ height: "150px", width: "auto", objectFit: "contain" }}
                />
              </a>
              <div className="flex items-center" style={{ gap: "12px", marginTop: "28px" }}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target={s.href !== "#" ? "_blank" : undefined} rel="noopener noreferrer" aria-label={s.label}
                    className="flex items-center justify-center transition-all duration-300"
                    style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(144,26,28,0.4)", color: "var(--primary-mustard)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(144,26,28,0.12)"; e.currentTarget.style.borderColor = "var(--primary-mustard)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(144,26,28,0.4)"; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Link cols */}
            {cols.map((col, ci) => (
              <motion.div
                key={col.label}
                initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                viewport={vp} transition={spring(0.08 * (ci + 1))}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary-mustard)", marginBottom: "20px" }}>
                  {col.label}
                </p>
                <nav className="flex flex-col">
                  {col.links.map((link) => (
                    <a key={link.label} href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="transition-colors duration-200"
                      style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#000000", lineHeight: "2.2", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-mustard)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#000000")}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
