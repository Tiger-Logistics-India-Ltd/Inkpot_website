"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BROWN = "#4B2E1E";
const CREAM = "#F4EFE6";

export default function SOTSCoffeePage() {
  return (
    <>
      <Navbar />
      <main style={{ background: CREAM, minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "440px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: BROWN, margin: "0 0 16px" }}>
            Songs of the Stone
          </p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3.4vw, 32px)", color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.25 }}>
            Coffee pre-orders are closed.
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(0,0,0,0.5)", lineHeight: 1.9, margin: "0 0 28px" }}>
            Coffee pre-ordering for this event is no longer available. Please check back later for updates.
          </p>
          <a
            href="/"
            style={{ display: "inline-block", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: BROWN, borderBottom: `1px solid ${BROWN}55`, textDecoration: "none", paddingBottom: "3px" }}
          >
            ← Back to Inkpot India
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
