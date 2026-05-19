import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

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
    google: "googlef45a4b1359c090fb",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Montserrat:wght@300;400;500;600&family=Belleza&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
