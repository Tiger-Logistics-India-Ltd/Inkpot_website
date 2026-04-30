"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#FAF8F4" }}>
      {/* Left Brand Panel */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-14 overflow-hidden"
        style={{ background: "#1A1208" }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Decorative vertical rule */}
        <div
          className="absolute right-0 top-0 bottom-0 w-px"
          style={{ background: "rgba(201,168,76,0.15)" }}
        />

        {/* Top: Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3 relative z-10"
        >
          <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="65" r="28" fill="#C9A84C" />
            <ellipse cx="50" cy="35" rx="6" ry="30" fill="#C9A84C" />
            <circle cx="50" cy="8" r="4" fill="#C9A84C" />
          </svg>
          <div className="flex flex-col leading-none">
            <span
              className="text-white tracking-[0.22em] text-sm font-bold"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              INKPOT
            </span>
            <span
              className="tracking-[0.22em] text-[0.55rem] font-light"
              style={{ fontFamily: "EB Garamond, serif", color: "#C9A84C" }}
            >
              INDIA
            </span>
          </div>
        </motion.div>

        {/* Centre: Quote block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* Ornamental line */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.3)" }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="6" y="0" width="2" height="14" fill="#C9A84C" opacity="0.5" />
              <rect x="0" y="6" width="14" height="2" fill="#C9A84C" opacity="0.5" />
            </svg>
            <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.3)" }} />
          </div>

          <blockquote
            className="text-white/80 text-[1.75rem] leading-snug font-light italic mb-6"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            "Culture is the widening of the mind and of the spirit."
          </blockquote>
          <p
            className="text-sm tracking-[0.15em] uppercase"
            style={{ color: "#C9A84C", fontFamily: "DM Sans, sans-serif" }}
          >
            — Jawaharlal Nehru
          </p>

          <div className="mt-10">
            <p
              className="text-white/40 text-sm leading-relaxed"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Bringing India's music, literature, architecture, and performance
              back into the light — through intimate, thoughtfully crafted
              cultural experiences.
            </p>
          </div>
        </motion.div>

        {/* Bottom: tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative z-10 text-xs tracking-[0.18em] uppercase"
          style={{ color: "rgba(201,168,76,0.4)", fontFamily: "DM Sans, sans-serif" }}
        >
          Culture, Reimagined
        </motion.p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="65" r="28" fill="#C9A84C" />
              <ellipse cx="50" cy="35" rx="6" ry="30" fill="#C9A84C" />
              <circle cx="50" cy="8" r="4" fill="#C9A84C" />
            </svg>
            <div className="flex flex-col leading-none">
              <span
                className="text-[#1A1208] tracking-[0.2em] text-sm font-bold"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                INKPOT
              </span>
              <span
                className="tracking-[0.2em] text-[0.55rem] font-light"
                style={{ fontFamily: "EB Garamond, serif", color: "#C9A84C" }}
              >
                INDIA
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-[2rem] font-semibold leading-tight mb-1.5"
              style={{ fontFamily: "EB Garamond, serif", color: "#1A1208" }}
            >
              Welcome back
            </h1>
            <p
              className="text-sm"
              style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(26,18,8,0.5)" }}
            >
              Sign in to continue your cultural journey
            </p>
          </div>

          {/* Gold divider */}
          <div
            className="h-px mb-8"
            style={{ background: "rgba(201,168,76,0.25)" }}
          />

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs tracking-[0.12em] uppercase"
                style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(26,18,8,0.55)" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 text-sm border outline-none transition-all duration-200"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: "#1A1208",
                  background: "#FFFFFF",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: 0,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#C9A84C";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs tracking-[0.12em] uppercase"
                  style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(26,18,8,0.55)" }}
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs transition-colors duration-200 hover:opacity-100"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    color: "#C9A84C",
                    opacity: 0.8,
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 text-sm border outline-none transition-all duration-200"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    color: "#1A1208",
                    background: "#FFFFFF",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 0,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#C9A84C";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity duration-200"
                  style={{ color: "rgba(26,18,8,0.35)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.985 }}
              className="w-full py-3.5 text-sm tracking-[0.12em] uppercase text-white transition-colors duration-300 mt-1"
              style={{
                fontFamily: "DM Sans, sans-serif",
                background: "#8B3A2A",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#a0441e")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#8B3A2A")}
            >
              Sign In
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px" style={{ background: "rgba(26,18,8,0.08)" }} />
            <span
              className="text-xs"
              style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(26,18,8,0.35)" }}
            >
              or continue with
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(26,18,8,0.08)" }} />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                name: "Google",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ),
              },
              {
                name: "Apple",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                ),
              },
            ].map(({ name, icon }) => (
              <button
                key={name}
                type="button"
                className="flex items-center justify-center gap-2.5 py-2.5 text-sm border transition-all duration-200"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: "#1A1208",
                  border: "1px solid rgba(26,18,8,0.12)",
                  background: "#FFFFFF",
                  borderRadius: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
                  e.currentTarget.style.background = "#FDFCF8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(26,18,8,0.12)";
                  e.currentTarget.style.background = "#FFFFFF";
                }}
              >
                {icon}
                <span className="text-xs tracking-wide">{name}</span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <p
            className="text-center text-sm mt-8"
            style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(26,18,8,0.45)" }}
          >
            Don't have an account?{" "}
            <a
              href="#"
              className="transition-colors duration-200"
              style={{ color: "#C9A84C" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#b8943e")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#C9A84C")}
            >
              Create one
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
