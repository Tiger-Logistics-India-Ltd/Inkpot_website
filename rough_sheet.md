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
