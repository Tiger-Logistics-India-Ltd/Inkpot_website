import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Living Table — Inkpot India | A Curated Dining Experience",
  // No apostrophe by design: React escapes ' to &#x27; in the meta attribute,
  // and that entity has shown up literally in Google's snippet. Rewording to
  // avoid the possessive removes the problem at source rather than masking it.
  description:
    "The Living Table is a curated dining experience from Inkpot India, where food, stories and cultural memory meet. Register your interest for the next edition.",
  keywords: [
    "The Living Table",
    "Inkpot India dinner",
    "cultural dinner Delhi",
    "curated dining experience Delhi",
    "food and stories event",
    "Inkpot India event",
    "next edition The Living Table",
  ],
  alternates: {
    canonical: "https://www.inkpotindia.com/the-living-table",
  },
  openGraph: {
    title: "The Living Table — A Curated Dining Experience by Inkpot India",
    description:
      "Where stories find their way onto the plate. Register your interest for the next edition of The Living Table.",
    url: "https://www.inkpotindia.com/the-living-table",
    siteName: "Inkpot India",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Living Table — A Curated Dining Experience by Inkpot India",
    description: "Where stories find their way onto the plate. Register your interest for the next edition.",
  },
};

export default function LivingTableLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preload the hero LCP logo so the browser finds it immediately.
          (No Razorpay preconnects here — the evergreen page has no checkout;
           the archived /inaugural-edition keeps them.) */}
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
