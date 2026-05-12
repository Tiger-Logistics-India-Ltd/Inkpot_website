# Rough Sheet — Layout Archive

## About Section — Original Layout (saved before Shropshire-style redesign)

**File:** `components/AboutBelief.tsx`  
**Background:** `#FAF8F4` (linen)  
**Layout:** 2-column grid — text left (0.9fr), image collage right (1.1fr)

### Text column
- Label: "ABOUT INKPOT INDIA" — 10px, 0.22em tracking, uppercase
- Heading: "Re-Inking Our Cultural Heritage" — EB Garamond italic, clamp(20px, 2.6vw, 36px), `--primary-red`
- Body: 12.5px Montserrat, lh 1.7
- Link: "Know More About Us →" — underlined with `#901A1C`
- Left margin: 10% indent

### Image collage (right column)
- 4-column sub-grid: `1.4fr 0.8fr 0.7fr 0.7fr`, gap 6px, height 240px
- Col 1: `big_square.png` — full height
- Col 2: 2-row stack — `Top (slightly taller).png` + `Bottom.png`
- Col 3: `TALL IMAGE 1.png` — full height
- Col 4: `TALL IMAGE 2.png` — full height

### Mobile
- Stack: text → 2-col grid (big_square | TALL 1 + TALL 2)
- Heading: 28px, no italic on mobile

---

## Notes
- Uses Tailwind `hidden lg:grid` / `lg:hidden` (may need JS fallback due to Tailwind v4)
- All images from `/images/Homepage/about/`

---

## FeaturedEvent Section — Dark Split Layout (saved before 3-card grid redesign)

**File:** `components/FeaturedEvent.tsx`  
**Background:** `#0A0A0A` (near-black)  
**Layout:** 50/50 CSS grid, text left, image right, fills full viewport width (no max-width wrapper)

### Text column
- Tag: "Upcoming · Community Initiative" — Montserrat, 10px, 0.28em tracking, `#C9A84C`
- Heading: "The Heritage Cleanliness Project" — EB Garamond italic, clamp(36px, 4vw, 58px), `#F5F0E8`
- Body: 15px, lh 1.75, `rgba(245,240,232,0.65)`, max-width 420px
- Location badge: bordered span, `📍 Mehrauli Archaeological Park`
- CTAs: Red "Volunteer Now →" button + ghost "All Events →" link
- Padding: `80px 64px 80px 80px`

### Image column
- Image: `/images/heritage cleaning/NolitterLegacy.png` — `fill`, `objectFit: cover`
- No overlay/gradient, no fade — sharp image edge

### Animation
- `useInView` ref + Framer Motion `opacity 0→1, y 40→0` on enter

```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function FeaturedEvent() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="events" style={{ width: "100%", background: "#0A0A0A" }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "600px",
        }}
      >
        {/* Text — left */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px 80px 80px", gap: "0px" }}>
          <p style={{ fontFamily: "var(--font-subheading)", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "20px" }}>
            Upcoming · Community Initiative
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px, 4vw, 58px)", lineHeight: 1.1, color: "#F5F0E8", marginBottom: "24px" }}>
            The Heritage<br />Cleanliness Project
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.75, color: "rgba(245,240,232,0.65)", maxWidth: "420px", marginBottom: "32px" }}>
            Every last Sunday, we gather at a heritage site — not just to clean, but to listen. To the stories that stone remembers.
          </p>
          <div style={{ marginBottom: "36px" }}>
            <span style={{ fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(245,240,232,0.22)", padding: "10px 16px", fontSize: "13px", color: "rgba(245,240,232,0.60)" }}>
              📍 Mehrauli Archaeological Park
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a href="/events/heritage-cleanliness" style={{ fontFamily: "var(--font-subheading)", display: "inline-flex", alignItems: "center", gap: "8px", background: "#901A1C", color: "#ffffff", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none" }}>
              Volunteer Now →
            </a>
            <a href="/events" style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(245,240,232,0.40)", textDecoration: "none" }}>
              All Events →
            </a>
          </div>
        </div>

        {/* Image — fills right half */}
        <div style={{ position: "relative" }}>
          <Image src="/images/heritage cleaning/NolitterLegacy.png" alt="Heritage Cleanliness Project" fill style={{ objectFit: "cover", objectPosition: "center" }} sizes="50vw" />
        </div>
      </motion.div>
    </section>
  );
}
```
