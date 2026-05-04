"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const leftLinks = [
  { label: "Home", href: "/" },
  {
    label: "About", href: "#about",
    dropdown: [
      { label: "About Inkpot", href: "#about" },
      { label: "Leadership", href: "#leadership" },
      { label: "Beliefs & Values", href: "#beliefs" },
    ],
  },
  {
    label: "Our Experiences", href: "#experiences",
    dropdown: [
      { label: "Songs of the Stone", href: "#experiences" },
      { label: "Antarnaad (Summer IP)", href: "#experiences" },
      { label: "Inkpot India Conclave", href: "#experiences" },
      { label: "The Heritage Cleanliness Project", href: "#experiences" },
      { label: "Echoes of Expression", href: "#experiences" },
    ],
  },
];

const rightLinks = [
  {
    label: "Work With Us", href: "#work",
    dropdown: [
      { label: "Partner with Us", href: "#work" },
      { label: "Perform with Us", href: "#work" },
      { label: "Jobs / Careers", href: "#work" },
    ],
  },
  { label: "Newsroom", href: "#press" },
  { label: "Contact Us", href: "#contact" },
];

type NavLink = { label: string; href: string; dropdown?: { label: string; href: string }[] };

function NavItem({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <a
        href={link.href}
        className="flex items-center gap-1 transition-colors duration-200 whitespace-nowrap"
        style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-black)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-mustard)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-black)")}
      >
        {link.dropdown && (
          <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M1 1L3.5 4L6 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
        )}
        {link.label}
      </a>

      {link.dropdown && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.14 }}
              className="absolute top-full mt-3 min-w-[220px]"
              style={{ background: "var(--primary-white)", borderTop: "2px solid var(--primary-mustard)", boxShadow: "0 8px 32px rgba(72,45,24,0.12)", padding: "20px 0", left: "50%", transform: "translateX(-50%)" }}
            >
              {link.dropdown.map((item) => (
                <a key={item.label} href={item.href}
                  className="block px-5 py-2 transition-colors duration-150"
                  style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--primary-brown)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-mustard)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-brown)")}
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const allLinks = [...leftLinks, ...rightLinks];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid rgba(211,163,81,0.18)`,
      }}
    >
      {/* Desktop */}
      <div
        className="hidden lg:grid h-[96px] mx-auto px-8"
        style={{ maxWidth: "1280px", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "24px" }}
      >
        <div className="flex items-center gap-7 justify-end">
          {leftLinks.map((l) => <NavItem key={l.label} link={l} />)}
        </div>

        <a href="/" className="flex items-center justify-center">
          <Image
            src="/images/Inkpot/Inkpot Final logo-01.png"
            alt="Inkpot India"
            width={265} height={177}
            className="object-contain"
            style={{ height: "118px", width: "auto", filter: "contrast(1.15) saturate(1.1)" }}
            priority
          />
        </a>

        <div className="flex items-center gap-7 justify-start">
          {rightLinks.map((l) => <NavItem key={l.label} link={l} />)}
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between h-[64px] px-5">
        <a href="/">
          <Image src="/images/Inkpot/Inkpot_600x400 px.svg" alt="Inkpot India"
            width={143} height={95} className="object-contain"
            style={{ height: "67px", width: "auto", filter: "contrast(1.15) saturate(1.1)" }}
            priority
          />
        </a>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="flex flex-col gap-[5px] p-2" aria-label="Toggle menu">
          <span className="block w-6 h-px transition-transform duration-300 origin-center" style={{ background: "var(--primary-brown)", transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
          <span className="block w-6 h-px transition-opacity duration-300" style={{ background: "var(--primary-brown)", opacity: mobileOpen ? 0 : 1 }} />
          <span className="block w-6 h-px transition-transform duration-300 origin-center" style={{ background: "var(--primary-brown)", transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden"
            style={{ background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.08)" }}
          >
            <div className="px-6 py-5 flex flex-col">
              {allLinks.map((link) => (
                <div key={link.label}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                        className="w-full text-left py-3 flex items-center justify-between"
                        style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-brown)" }}
                      >
                        {link.label}
                        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ transform: mobileExpanded === link.label ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                          <path d="M1 1L4 4L7 1" stroke="var(--primary-mustard)" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4"
                            style={{ borderLeft: "2px solid rgba(211,163,81,0.35)" }}
                          >
                            {link.dropdown?.map((item) => (
                              <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                                className="block py-2"
                                style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--primary-olive)" }}
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
                      className="block py-3"
                      style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-brown)" }}
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
