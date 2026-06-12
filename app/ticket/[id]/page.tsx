"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

interface TicketData {
  id: string;
  ticket_number: number;
  buyer_name: string;
  buyer_email: string;
  created_at: string;
}

export default function TicketPage() {
  const params     = useParams();
  const id         = Array.isArray(params.id) ? params.id[0] : params.id;
  const [ticket, setTicket]   = useState<TicketData | null>(null);
  const [qr, setQr]           = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tickets/${id}`)
      .then(r => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then(data => {
        setTicket(data);
        return import("qrcode").then(QRCode =>
          QRCode.toDataURL(`INKPOT-TLT-${id}`, {
            width: 220,
            margin: 2,
            color: { dark: "#111111", light: "#F4EFE6" },
          })
        );
      })
      .then(setQr)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />
      <main style={{ background: "#F4EFE6", minHeight: "100vh", padding: "clamp(100px, 14vw, 160px) 24px clamp(80px, 10vw, 120px)" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>

          {loading && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(0,0,0,0.35)", letterSpacing: "0.08em" }}>
              Loading ticket…
            </p>
          )}

          {notFound && !loading && (
            <>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#901A1C", marginBottom: "16px" }}>
                Not Found
              </p>
              <h1 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", color: "#1a1a1a", marginBottom: "16px" }}>
                Ticket not found.
              </h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(0,0,0,0.45)", lineHeight: 1.8 }}>
                If you believe this is an error, please contact{" "}
                <a href="mailto:info@inkpotindia.com" style={{ color: "#901A1C", textDecoration: "none" }}>
                  info@inkpotindia.com
                </a>
              </p>
            </>
          )}

          {ticket && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#901A1C", marginBottom: "24px" }}>
                The Living Table · 28th June, 2026
              </p>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "rgba(0,0,0,0.55)", marginBottom: "44px", lineHeight: 1.7 }}>
                {ticket.buyer_name}
                <br />
                <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.38)" }}>{ticket.buyer_email}</span>
              </p>

              {qr && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{
                    display: "inline-block", background: "#ffffff",
                    padding: "28px", marginBottom: "32px",
                    boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
                  }}
                >
                  <img src={qr} alt="Ticket QR Code" width={220} height={220} style={{ display: "block" }} />
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginTop: "16px" }}>
                    Present at entry · Do not share
                  </p>
                </motion.div>
              )}

              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.38)", lineHeight: 1.85 }}>
                Venue details will be shared 48 hours before the event.
                <br />
                Reach us at{" "}
                <a href="mailto:info@inkpotindia.com" style={{ color: "#901A1C", textDecoration: "none" }}>
                  info@inkpotindia.com
                </a>
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
