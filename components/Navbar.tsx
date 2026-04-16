"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "Our Story", href: "#story" },
  { label: "Our IPs", href: "#programmes" },
  { label: "Events", href: "#events" },
  { label: "Join Us", href: "#join" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-black/8 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-20">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <Image
            src="/images/Inkpot/Inkpot_600x400%20px.svg"
            alt="Inkpot India"
            width={100}
            height={67}
            className="h-10 w-auto"
            priority
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] text-sm tracking-wide transition-colors duration-300"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            className="ml-4 bg-[#1A1A1A] text-white px-5 py-2 text-sm tracking-wide rounded-full hover:bg-[#333] transition-all duration-300"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Get Involved
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-[1.5px] bg-[#1A1A1A] transition-transform duration-300 ${
              mobileOpen ? "rotate-45 translate-y-[4.5px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] bg-[#1A1A1A] transition-opacity duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] bg-[#1A1A1A] transition-transform duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/98 backdrop-blur-lg border-t border-black/8 px-6 py-8 flex flex-col gap-6"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] text-lg tracking-wide transition-colors"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            onClick={() => setMobileOpen(false)}
            className="bg-[#1A1A1A] text-white px-5 py-3 text-center text-sm tracking-wide rounded-full hover:bg-[#333] transition-all duration-300 mt-2"
          >
            Get Involved
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
