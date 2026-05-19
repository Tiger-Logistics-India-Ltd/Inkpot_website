import type { Metadata } from "next";
import { EB_Garamond, Montserrat, Belleza } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const belleza = Belleza({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inkpotindia.com"),
  title: "Inkpot India — Culture, Reimagined",
  description:
    "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
  keywords: [
    "Inkpot India",
    "Indian culture",
    "heritage experiences Delhi",
    "Songs of the Stone",
    "Antarnaad",
    "Inkpot India Conclave",
    "Heritage Cleanliness Project",
    "cultural events India",
    "Indian performing arts",
    "Delhi heritage monuments",
  ],
  alternates: {
    canonical: "https://inkpotindia.com",
  },
  verification: {
    google: "LQH8vAq0nSU5algX4s87wYYv9DFQPbkT_C81lM7EmYE",
  },
  icons: {
    icon: "/fav%20icon.svg",
    apple: "/fav%20icon.svg",
    shortcut: "/fav%20icon.svg",
  },
  openGraph: {
    title: "Inkpot India — Culture, Reimagined",
    description:
      "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
    url: "https://inkpotindia.com",
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
    title: "Inkpot India — Culture, Reimagined",
    description:
      "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
    images: ["/images/preview_real.jpg"],
    site: "@inkpotindia_",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${montserrat.variable} ${belleza.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
