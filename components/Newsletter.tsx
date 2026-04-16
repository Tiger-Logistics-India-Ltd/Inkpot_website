"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Newsletter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");

  return (
    <section
      id="join"
      className="py-28 md:py-36 px-6"
      style={{ background: "linear-gradient(135deg, #5a2218 0%, #8B3A2A 50%, #6b2c1f 100%)" }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2
          className="text-3xl md:text-5xl italic text-[#F5F0E8] leading-tight mb-5"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          Stay Close to
          <br />
          the Culture.
        </h2>
        <p
          className="text-[#F5F0E8]/70 text-sm md:text-base mb-10 max-w-md mx-auto"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Invitations, stories, and dispatches from India&rsquo;s cultural heart
          — delivered to your inbox.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-[rgba(10,10,10,0.3)] border border-[#F5F0E8]/20 text-[#F5F0E8] px-5 py-3.5 text-sm placeholder:text-[#F5F0E8]/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          />
          <button
            type="submit"
            className="bg-[#C9A84C] text-[#0A0A0A] px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-[#d4b55e] transition-colors duration-300 shrink-0"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Subscribe
          </button>
        </form>

        <p
          className="text-[#F5F0E8]/30 text-xs"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          We respect your privacy. No spam.
        </p>
      </motion.div>
    </section>
  );
}
