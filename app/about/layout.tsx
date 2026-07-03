import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Inkpot India | Our Story & Beliefs",
  description:
    "Inkpot India curates intimate, thoughtfully crafted cultural experiences rooted in cultural stewardship, artistic integrity, community, and radical accessibility.",
  alternates: {
    canonical: "https://www.inkpotindia.com/about",
  },
  openGraph: {
    title: "About Us — Inkpot India",
    description:
      "Inkpot India curates intimate, thoughtfully crafted cultural experiences rooted in cultural stewardship, artistic integrity, community, and radical accessibility.",
    url: "https://www.inkpotindia.com/about",
    siteName: "Inkpot India",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — Inkpot India",
    description:
      "Inkpot India curates intimate, thoughtfully crafted cultural experiences rooted in cultural stewardship, artistic integrity, community, and radical accessibility.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
