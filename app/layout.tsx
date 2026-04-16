import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inkpot India — Culture, Reimagined",
  description:
    "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
  openGraph: {
    title: "Inkpot India — Culture, Reimagined",
    description:
      "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
    images: [
      {
        url: "/images/Songs%20of%20the%20stone/SOTS-165.jpg",
        width: 1920,
        height: 1080,
      },
    ],
  },
  icons: {
    icon: "/images/Inkpot/Inkpot%20Final%20logo-01.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
