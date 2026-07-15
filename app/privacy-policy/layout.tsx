import type { Metadata } from "next";

const description = "How Inkpot India collects, uses, and protects your personal information.";

export const metadata: Metadata = {
  title: "Privacy Policy — Inkpot India",
  description,
  alternates: {
    canonical: "https://www.inkpotindia.com/privacy-policy",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy — Inkpot India",
    description,
    url: "https://www.inkpotindia.com/privacy-policy",
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
    title: "Privacy Policy — Inkpot India",
    description,
    images: ["/images/preview_real.jpg"],
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
