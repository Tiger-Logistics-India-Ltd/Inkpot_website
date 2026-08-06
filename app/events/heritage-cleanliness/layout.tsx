import type { Metadata } from "next";

const title = "The Heritage Cleanliness Project — Inkpot India";
const description =
  "A #NoLitterLegacy. The Heritage Cleanliness Project brings volunteers together every month at Delhi's heritage sites to clean, walk, and care for what we share. Next drive: Sunday 30 August 2026, 4 PM, Sultan Garhi Archaeological Park.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://www.inkpotindia.com/events/heritage-cleanliness",
  },
  openGraph: {
    title,
    description,
    url: "https://www.inkpotindia.com/events/heritage-cleanliness",
    siteName: "Inkpot India",
    images: [
      {
        url: "/images/preview_real.jpg",
        width: 1200,
        height: 630,
        alt: "The Heritage Cleanliness Project — Inkpot India",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/preview_real.jpg"],
  },
};

export default function HeritageCleanlinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
