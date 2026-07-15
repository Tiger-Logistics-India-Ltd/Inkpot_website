import type { Metadata } from "next";

const description = "The terms and conditions governing use of Inkpot India's website and events.";

export const metadata: Metadata = {
  title: "Terms & Conditions — Inkpot India",
  description,
  alternates: {
    canonical: "https://www.inkpotindia.com/terms",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Terms & Conditions — Inkpot India",
    description,
    url: "https://www.inkpotindia.com/terms",
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
    title: "Terms & Conditions — Inkpot India",
    description,
    images: ["/images/preview_real.jpg"],
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
