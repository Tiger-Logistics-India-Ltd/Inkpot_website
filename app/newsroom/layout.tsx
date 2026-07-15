import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsroom — Inkpot India | Press & Media Coverage",
  description:
    "Press coverage and media mentions of Inkpot India's cultural experiences, from heritage dinners to performances across India's historic sites.",
  alternates: {
    canonical: "https://www.inkpotindia.com/newsroom",
  },
  openGraph: {
    title: "Newsroom — Inkpot India",
    description:
      "Press coverage and media mentions of Inkpot India's cultural experiences, from heritage dinners to performances across India's historic sites.",
    url: "https://www.inkpotindia.com/newsroom",
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
    title: "Newsroom — Inkpot India",
    description:
      "Press coverage and media mentions of Inkpot India's cultural experiences, from heritage dinners to performances across India's historic sites.",
    images: ["/images/preview_real.jpg"],
  },
};

export default function NewsroomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
