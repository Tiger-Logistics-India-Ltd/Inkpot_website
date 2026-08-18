import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Living Table — Archive: June 2026 | Kathika Cultural Centre, Old Delhi",
  description:
    "Archive of the first Living Table — a one-night curated dining experience at Kathika Cultural Centre, Old Delhi, on 28 June 2026. From Peshawar to Delhi, with the Gujral family, Sadaf Husain and Salma Husain. A record of the evening.",
  keywords: [
    "The Living Table archive",
    "Inkpot India dinner",
    "cultural dinner Delhi",
    "Old Delhi food event",
    "Kathika Cultural Centre",
    "Monish Gujral butter chicken",
    "Peshawar to Delhi dinner",
  ],
  alternates: {
    canonical: "https://www.inkpotindia.com/the-living-table/archive/june-2026",
  },
  openGraph: {
    title: "The Living Table — Archive: June 2026",
    description:
      "A record of the first Living Table: a curated sit-down dinner at Kathika Cultural Centre, Old Delhi, 28 June 2026.",
    url: "https://www.inkpotindia.com/the-living-table/archive/june-2026",
    siteName: "Inkpot India",
    locale: "en_IN",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Living Table — Archive: June 2026",
    description: "A record of the first Living Table · 28 June 2026 · Kathika Cultural Centre, Old Delhi.",
  },
};

export default function ArchiveJune2026Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preconnect to Razorpay origins — the archived booking block is preserved as a record */}
      <link rel="preconnect" href="https://api.razorpay.com" />
      <link rel="preconnect" href="https://cdn.razorpay.com" />
      <link rel="preconnect" href="https://checkout-static-next.razorpay.com" />
      {/* Preload the hero LCP logo so the browser finds it immediately */}
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
