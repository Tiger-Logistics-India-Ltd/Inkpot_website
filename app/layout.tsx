import type { Metadata } from "next";
import { EB_Garamond, Montserrat, Belleza } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://www.inkpotindia.com"),
  title: "Inkpot India — Culture, Reimagined",
  description:
    "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
  keywords: [
    "Inkpot India",
    "Indian culture",
    "heritage experiences Delhi",
    "Songs of the Stone",
    "The Living Table",
    "Inkpot India Conclave",
    "Heritage Cleanliness Project",
    "cultural events India",
    "Indian performing arts",
    "Delhi heritage monuments",
  ],
  alternates: {
    canonical: "https://www.inkpotindia.com",
  },
  verification: {
    google: "LQH8vAq0nSU5algX4s87wYYv9DFQPbkT_C81lM7EmYE",
  },
  openGraph: {
    title: "Inkpot India — Culture, Reimagined",
    description:
      "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
    url: "https://www.inkpotindia.com",
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

const SITE = "https://www.inkpotindia.com";

// Site-wide structured data. Rendered as a native <script> per the Next.js
// JSON-LD guide — it is data, not executable code, so next/script is not used.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Inkpot India",
      url: `${SITE}/`,
      email: "info@inkpotindia.com",
      description:
        "Bringing India's music, literature, architecture, and performance back into the light — through intimate, thoughtfully crafted cultural experiences.",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/images/Inkpot/Inkpot%20Final%20logo-01.png`,
      },
      sameAs: [
        "https://www.instagram.com/inkpotindia_/",
        "https://www.linkedin.com/company/inkpotindia/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: "Inkpot India",
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${montserrat.variable} ${belleza.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-B2CM1HZXB0" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-B2CM1HZXB0');
        `}</Script>
      </body>
    </html>
  );
}
