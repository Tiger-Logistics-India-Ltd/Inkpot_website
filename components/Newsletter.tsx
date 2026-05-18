"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE  = "service_kc85ggl";
const EMAILJS_TEMPLATE = "template_0haei3c";
const EMAILJS_PUBLIC   = "hU7gdDpwzNyOeHzah";

const vp = { once: false, amount: 0.25 };
const spring = (delay = 0) => ({ type: "spring" as const, stiffness: 65, damping: 20, delay });

export default function Newsletter() {
  const [email, setEmail]     = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        { from_email: email },
        { publicKey: EMAILJS_PUBLIC }
      );
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="join" style={{ position: "relative", overflow: "hidden", padding: "120px 0" }}>
      <video
        src="/images/Homepage/Newsletter/hero_second.mp4"
        autoPlay loop muted playsInline
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1 }} />
      <div className="mx-auto px-6 text-center" style={{ maxWidth: "640px", position: "relative", zIndex: 2 }}>

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
          Stay Connected
        </motion.h2>

        <motion.p
          initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={vp} transition={spring(0.2)}
          style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--primary-cream)", lineHeight: 1.75, maxWidth: "480px", margin: "20px auto 0", opacity: 0.8 }}
        >
          Upcoming experiences, stories from the field, and dispatches from India&apos;s cultural heart — straight to your inbox.
        </motion.p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#a8e6a3", marginTop: "40px", letterSpacing: "0.04em" }}
            >
              You&apos;re on the list. Welcome to the community.
            </motion.p>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              viewport={vp} transition={spring(0.3)}
              className="flex" style={{ marginTop: "40px", justifyContent: "center" }}
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                required
                disabled={status === "loading"}
                style={{ width: "360px", maxWidth: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${status === "error" ? "rgba(220,80,80,0.7)" : "rgba(144,26,28,0.30)"}`, borderRight: "none", color: "var(--primary-white)", padding: "16px 24px", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", opacity: status === "loading" ? 0.6 : 1 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(144,26,28,0.7)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = status === "error" ? "rgba(220,80,80,0.7)" : "rgba(144,26,28,0.30)"; }}
                className="placeholder:text-[rgba(226,203,163,0.35)]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                style={{ background: "var(--primary-red)", color: "var(--primary-white)", padding: "16px 32px", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: status === "loading" ? "default" : "pointer", flexShrink: 0, transition: "background 0.2s", opacity: status === "loading" ? 0.7 : 1, minWidth: "120px" }}
                onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.background = "#7a1517"; }}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-red)")}
              >
                {status === "loading" ? "Sending…" : "Subscribe"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {status === "error" && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(220,80,80,0.85)", marginTop: "12px" }}>
            Something went wrong. Please try again.
          </p>
        )}

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={vp} transition={spring(0.4)}
          style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(226,203,163,0.38)", marginTop: "16px" }}
        >
          We respect your privacy. No spam, ever.
        </motion.p>
      </div>
    </section>
  );
}
