"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const vp = { once: false, amount: 0.25 };
const spring = (delay = 0) => ({ type: "spring" as const, stiffness: 65, damping: 20, delay });

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section id="join" style={{ background: "#0A0A0A", padding: "120px 0" }}>
      <div className="mx-auto px-6 text-center" style={{ maxWidth: "640px" }}>

        <motion.p
          initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0)}
          style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--primary-mustard)" }}
        >
          Stay Informed
        </motion.p>

        <motion.h2
          initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0.1)}
          style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px, 4.5vw, 56px)", color: "var(--primary-white)", lineHeight: 1.2, marginTop: "16px" }}
        >
          Stay Close to<br />the Culture.
        </motion.h2>

        <motion.p
          initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0.2)}
          style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--primary-cream)", lineHeight: 1.75, maxWidth: "480px", margin: "20px auto 0", opacity: 0.8 }}
        >
          Invitations, stories, and dispatches from India&rsquo;s cultural heart — delivered to your inbox.
        </motion.p>

        <motion.form
          onSubmit={(e) => e.preventDefault()}
          initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0.3)}
          className="flex" style={{ marginTop: "40px", justifyContent: "center" }}
        >
          <input
            type="email" placeholder="Your email address"
            value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: "360px", maxWidth: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(211,163,81,0.30)", borderRight: "none", color: "var(--primary-white)", padding: "16px 24px", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(211,163,81,0.7)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(211,163,81,0.30)"; }}
            className="placeholder:text-[rgba(226,203,163,0.35)]"
          />
          <button
            type="submit"
            style={{ background: "var(--primary-red)", color: "var(--primary-white)", padding: "16px 32px", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#7a1517")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
          >
            Subscribe
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={vp} transition={spring(0.4)}
          style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(226,203,163,0.40)", marginTop: "16px" }}
        >
          We respect your privacy. No spam, ever.
        </motion.p>
      </div>
    </section>
  );
}
