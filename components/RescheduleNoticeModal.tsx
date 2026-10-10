"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEEN_KEY = "sots-reschedule-notice-seen-v1";

export default function RescheduleNoticeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SEEN_KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          style={{ position: "fixed", inset: 0, background: "rgba(10,8,6,0.72)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "#FBF3E3", width: "100%", maxWidth: "480px", maxHeight: "88vh", overflowY: "auto", position: "relative", borderTop: "3px solid #901A1C", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={dismiss}
              aria-label="Close"
              style={{ position: "absolute", top: "14px", right: "18px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "rgba(0,0,0,0.35)", lineHeight: 1, zIndex: 1 }}
            >
              ×
            </button>

            <div style={{ padding: "clamp(28px, 5vw, 44px) clamp(24px, 5vw, 40px) clamp(32px, 5vw, 44px)", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#901A1C", margin: "0 0 6px" }}>
                Songs of the Stone &middot; Live The Legacy
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "clamp(19px, 3vw, 23px)", color: "#1a1a1a", margin: "0 0 4px", letterSpacing: "0.02em" }}>
                NOTICE OF RESCHEDULING
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14px", color: "#1a1a1a", margin: "0 0 22px" }}>
                10th October Evening Event
              </p>

              <div style={{ textAlign: "left" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "15px", color: "#1a1a1a", lineHeight: 1.85, margin: "0 0 16px" }}>
                  Following discussions with the concerned authorities and careful consideration of the prevailing circumstances surrounding the planned protest on 10th October, we have decided to reschedule the Evening Concert of <strong style={{ fontStyle: "normal" }}>Amrita Kaur</strong> at Purana Qila, New Delhi from <strong style={{ fontStyle: "normal" }}>10th October at 7 PM</strong> to <strong style={{ fontStyle: "normal" }}>11th October at 7 PM onwards</strong>, keeping in mind the ease of our attendees.
                </p>
                <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "15px", color: "#1a1a1a", lineHeight: 1.85, margin: "0 0 16px" }}>
                  The morning concert on 11th October at 7 AM will remain as scheduled.
                </p>
                <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "15px", color: "#1a1a1a", lineHeight: 1.85, margin: "0 0 16px" }}>
                  Guests who have purchased tickets for the evening concert via District may choose to attend the rescheduled concert on 11th October or opt for a full refund through District.
                </p>
                <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "15px", color: "#1a1a1a", lineHeight: 1.85, margin: 0 }}>
                  We are truly humbled by the overwhelming response to Amrita Kaur&rsquo;s performances and the trust and enthusiasm you have shown us. Looking forward to seeing you at the event.
                </p>
              </div>

              <button
                onClick={dismiss}
                style={{ marginTop: "28px", background: "#901A1C", color: "#ffffff", padding: "13px 40px", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", border: "none", cursor: "pointer" }}
              >
                Got It
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
