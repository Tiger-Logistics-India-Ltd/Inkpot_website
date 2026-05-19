import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Inkpot India — Culture, Reimagined",
  description:
    "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
  keywords: ["Inkpot India"],
  icons: {
    icon: "/fav%20icon.svg",
    apple: "/fav%20icon.svg",
    shortcut: "/fav%20icon.svg",
  },
  openGraph: {
    title: "Inkpot India — Culture, Reimagined",
    description:
      "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
    images: [
      {
        url: "/images/preview_real.jpg",
        alt: "Inkpot India preview image",
        type: "image/jpeg",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkpot India — Culture, Reimagined",
    description:
      "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
    images: ["/images/preview_real.jpg"],
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
