import type { Metadata } from "next";

const title = "The Heritage Cleanliness Project — Inkpot India";
const description =
  "A #NoLitterLegacy. The Heritage Cleanliness Project brings volunteers together every month at Mehrauli Archaeological Park to clean, walk, and care for Delhi's shared heritage. Join a drive.";

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
