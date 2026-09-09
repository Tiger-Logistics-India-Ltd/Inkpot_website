import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Living Table — Lost Grains of India | Chapter Two, 26 September 2026",
  description:
    "Chapter Two of The Living Table by Inkpot India, in association with Dewar's Experiences. An evening on the forgotten grains, recipes and flavours of India, at Greenr Cafe, Greater Kailash 1, New Delhi, on Saturday 26 September 2026. Book your seat.",
  keywords: [
    "The Living Table",
    "Lost Grains of India",
    "Inkpot India dinner",
    "curated dining experience Delhi",
    "food and stories event Delhi",
    "Greenr Cafe Greater Kailash",
    "heritage grains India dinner",
  ],
  alternates: {
    canonical: "https://www.inkpotindia.com/the-living-table/lost-grains-of-india",
  },
  openGraph: {
    title: "The Living Table — Lost Grains of India",
    description:
      "Chapter Two, in association with Dewar's Experiences. An evening on India's forgotten grains and the recipes that carried them. Greenr Cafe, GK1 · 26 September 2026.",
    url: "https://www.inkpotindia.com/the-living-table/lost-grains-of-india",
    siteName: "Inkpot India",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Living Table — Lost Grains of India",
    description: "Chapter Two, in association with Dewar's Experiences · Greenr Cafe, GK1 · 26 September 2026.",
  },
};

export default function LostGrainsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preconnect to Razorpay origins — bookings are open on this page */}
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
