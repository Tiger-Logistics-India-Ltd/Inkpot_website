"use client";

const BROWN = "#4B2E1E";
const CREAM = "#F4EFE6";

export default function SOTSCoffeeVendorPage() {
  return (
    <div style={{ minHeight: "100dvh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
      <div style={{ maxWidth: "380px" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: BROWN, margin: "0 0 14px" }}>
          Songs of the Stone
        </p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "24px", color: "#1a1a1a", margin: "0 0 12px" }}>
          Coffee vendor console is offline.
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(0,0,0,0.5)", lineHeight: 1.8 }}>
          The coffee pre-order stall isn&rsquo;t active for this event.
        </p>
      </div>
    </div>
  );
}
