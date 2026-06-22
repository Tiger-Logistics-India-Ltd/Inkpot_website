import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Living Table — Inkpot India | Dinner Event 28th June 2026",
  description:
    "A one-night curated dining experience at Kathika Cultural Centre, Old Delhi. Food, stories, and the people who make them. 28th June 2026 · ₹6,500 per seat.",
  keywords: [
    "The Living Table",
    "Inkpot India dinner",
    "cultural dinner Delhi",
    "curated dining experience Delhi",
    "Old Delhi food event",
    "Kathika Cultural Centre",
    "intimate dinner event 2026",
    "Inkpot India event",
  ],
  alternates: {
    canonical: "https://www.inkpotindia.com/the-living-table",
  },
  openGraph: {
    title: "The Living Table — A Curated Sit-Down Dinner with Inkpot India",
    description:
      "A curated dining experience at Kathika Cultural Centre, Old Delhi. 28th June 2026 · Very Limited Seats · ₹6,500 per person.",
    url: "https://www.inkpotindia.com/the-living-table",
    siteName: "Inkpot India",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Living Table — A Curated Sit-Down Dinner with Inkpot India",
    description: "28th June 2026 · Old Delhi · Very Limited Seats · ₹6,500 per person.",
  },
};

export default function LivingTableLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preconnect to Razorpay origins — est. 860ms LCP savings */}
      <link rel="preconnect" href="https://api.razorpay.com" />
      <link rel="preconnect" href="https://cdn.razorpay.com" />
      <link rel="preconnect" href="https://checkout-static-next.razorpay.com" />
      {/* Preload the hero LCP image so the browser finds it immediately */}
      <link
        rel="preload"
        as="image"
        href="/images/thelivingtable/logo_the_right_one_1.svg"
        fetchPriority="high"
      />
      {children}
    </>
  );
}
