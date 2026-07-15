import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Inkpot India",
  description:
    "Get in touch with Inkpot India for event inquiries, partnerships, or press. We'd love to hear from you.",
  alternates: {
    canonical: "https://www.inkpotindia.com/contact",
  },
  openGraph: {
    title: "Contact Us — Inkpot India",
    description:
      "Get in touch with Inkpot India for event inquiries, partnerships, or press. We'd love to hear from you.",
    url: "https://www.inkpotindia.com/contact",
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
    title: "Contact Us — Inkpot India",
    description:
      "Get in touch with Inkpot India for event inquiries, partnerships, or press. We'd love to hear from you.",
    images: ["/images/preview_real.jpg"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
