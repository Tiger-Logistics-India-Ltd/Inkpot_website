"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [email, setEmail] = useState("");

  return (
    <footer id="join" className="relative">
      {/* Curved top edge */}
      <div className="relative -mb-px">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120V60C0 60 320 0 720 0C1120 0 1440 60 1440 60V120H0Z"
            fill="#1A1A1A"
          />
        </svg>
      </div>

      {/* Footer body */}
      <div className="bg-[#1A1A1A] px-6 pb-10 pt-16 md:pt-24">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-white mb-3 leading-snug"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            India Is Our Home.
            <br />The World Is Our Stage.
          </h2>
          <p
            className="text-white/40 text-xs tracking-[0.2em] uppercase mb-10"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Inkpot India
          </p>

          {/* Email signup */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-16"
          >
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border border-white/30 text-white px-5 py-3 text-sm rounded-lg placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            />
            <button
              type="submit"
              className="bg-white text-[#1A1A1A] px-6 py-3 text-sm font-semibold tracking-wide uppercase rounded-lg hover:bg-white/90 transition-colors shrink-0"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Sign Up
            </button>
          </form>

          {/* Bottom line */}
          <p
            className="text-white/30 text-xs"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            © 2026 Inkpot India. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
