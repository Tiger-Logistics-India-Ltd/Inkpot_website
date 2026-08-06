import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/*
 * Deliberately a SERVER component (no "use client").
 *
 * The page exists to be read by Google and by AI systems, so everything ships
 * in the initial HTML with no JavaScript required. That also lets `metadata`
 * live here instead of in a sibling layout.tsx, which is the workaround the
 * client pages elsewhere in this app need.
 *
 * The visible page is currently the introduction only — the biography and the
 * sections beneath it were removed at the client's request pending real copy.
 * The structured data below is the substantive payload in the meantime.
 */

const SITE = "https://www.inkpotindia.com";
const PAGE_URL = `${SITE}/simar-malhotra`;
const PORTRAIT = `${SITE}/images/Simar%20Malhotra%2C%20Founder%20of%20Inkpot%20India.jpeg`;

const LEAD =
  "Simar Malhotra is an Indian author and the founder of Inkpot India, a cultural platform that produces concerts, heritage experiences, dining experiences, storytelling and community-led initiatives rooted in India's cultural legacy.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Simar Malhotra — Author & Founder of Inkpot India",
  description: LEAD,
  keywords: ["Simar Malhotra", "Inkpot India", "Founder of Inkpot India"],
  // ⚠️ TEMPORARY — the page carries no biography copy yet, so it is thin.
  // Letting Google index it in this state works against the entity signal the
  // page exists to build. DELETE this `robots` block (and re-add the URL to
  // public/sitemap.xml) once the real biography is in.
  robots: { index: false, follow: true },
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Simar Malhotra — Author & Founder of Inkpot India",
    description: LEAD,
    url: PAGE_URL,
    siteName: "Inkpot India",
    type: "profile",
    locale: "en_IN",
    images: [{ url: PORTRAIT, width: 1067, height: 1600, alt: "Simar Malhotra, Founder of Inkpot India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simar Malhotra — Author & Founder of Inkpot India",
    description: LEAD,
    images: [PORTRAIT],
  },
};

/*
 * ── TODO: facts only Inkpot can supply ───────────────────────────────────
 *   1. `sameAs` below — LinkedIn, Instagram, X, Wikipedia, Amazon author page.
 *      THE most important missing piece: it is how Google resolves
 *      "Simar Malhotra" to one specific person rather than a name string.
 *   2. Published book titles + years (she is credited as an author).
 *   3. The year Inkpot India was founded -> `foundingDate`.
 *   4. The biography copy for the body of the page.
 * Until supplied, they are intentionally absent rather than guessed.
 */
const SAME_AS: string[] = [
  // e.g. "https://www.linkedin.com/in/…", "https://www.instagram.com/…"
];

const person = {
  "@type": "Person",
  "@id": `${PAGE_URL}#person`,
  name: "Simar Malhotra",
  url: PAGE_URL,
  image: PORTRAIT,
  jobTitle: ["Founder", "Author"],
  description: LEAD,
  knowsAbout: [
    "Indian cultural heritage",
    "Heritage conservation",
    "Indian classical music",
    "Cultural programming",
    "Literature",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Stanford University",
      sameAs: "https://en.wikipedia.org/wiki/Stanford_University",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Columbia University",
      sameAs: "https://en.wikipedia.org/wiki/Columbia_University",
    },
  ],
  worksFor: { "@id": `${SITE}/#organization` },
  ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${PAGE_URL}#profilepage`,
      url: PAGE_URL,
      name: "Simar Malhotra — Author & Founder of Inkpot India",
      inLanguage: "en-IN",
      mainEntity: { "@id": `${PAGE_URL}#person` },
      isPartOf: { "@id": `${SITE}/#website` },
    },
    person,
    // Restates the organisation with the founder edge, so the person and the
    // company resolve to each other from either direction.
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Inkpot India",
      url: `${SITE}/`,
      founder: { "@id": `${PAGE_URL}#person` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inkpot India", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE}/about` },
        { "@type": "ListItem", position: 3, name: "Simar Malhotra", item: PAGE_URL },
      ],
    },
  ],
};

export default function SimarMalhotraPage() {
  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <style>{`
        .sm-wrap { --ink:#1a1a1a; --muted:rgba(0,0,0,0.62); --red:#901A1C; background:#fff; }
        .sm-inner { max-width:1080px; margin:0 auto; padding:0 24px; }
        .sm-hero { background:#F4EFE6; padding:120px 0 110px; }
        .sm-hero-grid { display:grid; grid-template-columns:300px 1fr; gap:56px; align-items:start; }
        .sm-portrait { position:relative; width:100%; aspect-ratio:1067/1600; overflow:hidden;
                       box-shadow:0 18px 52px rgba(0,0,0,0.18); }
        .sm-eyebrow { font-family:var(--font-body); font-size:10px; letter-spacing:0.3em;
                      text-transform:uppercase; color:var(--red); margin-bottom:18px; }
        .sm-h1 { font-family:var(--font-heading); font-weight:400; font-size:clamp(30px,3.4vw,44px);
                 line-height:1.1; color:var(--ink); margin:0 0 10px; }
        .sm-role { font-family:var(--font-body); font-size:14px; letter-spacing:0.06em;
                   color:var(--muted); margin:0 0 28px; }
        .sm-lead { font-family:var(--font-body); font-size:16px; line-height:1.85;
                   color:rgba(0,0,0,0.75); margin:0; max-width:60ch; }
        @media (max-width:860px) {
          .sm-hero { padding:96px 0 72px; }
          .sm-hero-grid { grid-template-columns:1fr; gap:32px; }
          .sm-portrait { max-width:260px; }
        }
      `}</style>

      <main className="sm-wrap">
        <section className="sm-hero">
          <div className="sm-inner sm-hero-grid">
            <div className="sm-portrait">
              <Image
                src="/images/Simar%20Malhotra%2C%20Founder%20of%20Inkpot%20India.jpeg"
                alt="Simar Malhotra, Founder of Inkpot India"
                fill
                priority
                sizes="(max-width: 860px) 260px, 300px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            <div>
              <p className="sm-eyebrow">Author &amp; Founder</p>
              <h1 className="sm-h1">Simar Malhotra</h1>
              <p className="sm-role">Founder, Inkpot India</p>
              <p className="sm-lead">{LEAD}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
