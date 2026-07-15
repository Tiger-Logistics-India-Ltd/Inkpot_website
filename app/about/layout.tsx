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
    images: [
      {
        url: "/images/preview_real.jpg",
        width: 1200,
        height: 630,
        alt: "Inkpot India — Re-Inking Our Cultural Heritage",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — Inkpot India",
    description:
      "Inkpot India curates intimate, thoughtfully crafted cultural experiences rooted in cultural stewardship, artistic integrity, community, and radical accessibility.",
    images: ["/images/preview_real.jpg"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
