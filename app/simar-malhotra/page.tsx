import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/*
 * Deliberately a SERVER component (no "use client").
 *
 * The page exists to be read by Google and by AI systems, so every word ships
 * in the initial HTML with no JavaScript required. That also lets `metadata`
 * live here instead of in a sibling layout.tsx, which is the workaround the
 * client pages elsewhere in this app need.
 *
 * All biographical copy below is supplied by Inkpot India. Nothing is invented.
 */

const SITE = "https://www.inkpotindia.com";
const PAGE_URL = `${SITE}/simar-malhotra`;
const PORTRAIT = `${SITE}/images/Simar%20Malhotra%2C%20Founder%20of%20Inkpot%20India.jpeg`;

// No apostrophe by design: React escapes ' to &#x27; in meta attributes, and
// that entity has surfaced literally in Google snippets before.
const DESCRIPTION =
  "Simar Malhotra is an author and cultural entrepreneur who founded Inkpot India in 2019, transforming monuments, traditions and stories into living cultural experiences. Author of There is a Tide and Tides Don't Cross.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Simar Malhotra — Author & Founder of Inkpot India",
  description: DESCRIPTION,
  keywords: [
    "Simar Malhotra",
    "Inkpot India",
    "Founder of Inkpot India",
    "There is a Tide",
    "Tides Don't Cross",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Simar Malhotra — Author & Founder of Inkpot India",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Inkpot India",
    type: "profile",
    locale: "en_IN",
    images: [{ url: PORTRAIT, width: 1067, height: 1600, alt: "Simar Malhotra, Founder of Inkpot India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simar Malhotra — Author & Founder of Inkpot India",
    description: DESCRIPTION,
    images: [PORTRAIT],
  },
};

/*
 * `sameAs` is how Google resolves "Simar Malhotra" to one specific person
 * rather than a name string — the strongest single lever for entity
 * recognition. Worth adding when available: Instagram, X, and a Goodreads or
 * Amazon author page (the last would also strengthen the Book entities below,
 * along with publication years).
 */
const SAME_AS: string[] = [
  "https://www.linkedin.com/in/simar-malhotra-b77a53124/",
];

const BOOKS = ["There is a Tide", "Tides Don't Cross"];

const person = {
  "@type": "Person",
  "@id": `${PAGE_URL}#person`,
  name: "Simar Malhotra",
  url: PAGE_URL,
  image: PORTRAIT,
  gender: "Female",
  jobTitle: ["Founder", "Author", "Cultural entrepreneur"],
  description: DESCRIPTION,
  knowsAbout: [
    "Indian cultural heritage",
    "Heritage conservation",
    "Indian classical music",
    "Cultural programming",
    "Literature",
    "Storytelling",
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
    // Each book as its own entity, authored by the person above — this is what
    // lets "author of There is a Tide" resolve back to this profile.
    ...BOOKS.map((name) => ({
      "@type": "Book",
      "@id": `${PAGE_URL}#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      author: { "@id": `${PAGE_URL}#person` },
    })),
    // Restates the organisation with the founder edge and founding year, so
    // the person and the company resolve to each other from either direction.
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Inkpot India",
      url: `${SITE}/`,
      foundingDate: "2019",
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
        /* Portrait is full-bleed: flush to the left edge of the viewport and to
           the top and bottom of the band. The only top offset is the height of
           the fixed navbar (96px desktop / 64px mobile), which the image would
           otherwise sit underneath. */
        .sm-hero { background:#F4EFE6; padding-top:96px; }
        .sm-hero-grid { display:grid; grid-template-columns:clamp(300px,30vw,430px) 1fr;
                        align-items:stretch; min-height:620px; }
        .sm-portrait { position:relative; overflow:hidden; }
        .sm-hero-text { align-self:center; padding:72px 48px 72px 60px; max-width:780px; }
        .sm-eyebrow { font-family:var(--font-body); font-size:10px; letter-spacing:0.3em;
                      text-transform:uppercase; color:var(--red); margin-bottom:18px; }
        .sm-h1 { font-family:var(--font-heading); font-weight:400; font-size:clamp(30px,3.4vw,44px);
                 line-height:1.1; color:var(--ink); margin:0 0 10px; }
        .sm-role { font-family:var(--font-body); font-size:14px; letter-spacing:0.06em;
                   color:var(--muted); margin:0 0 28px; }
        .sm-lead { font-family:var(--font-body); font-size:16px; line-height:1.85;
                   color:rgba(0,0,0,0.75); margin:0; max-width:60ch; }
        .sm-body { padding:76px 0 96px; }
        .sm-sec { margin-bottom:56px; scroll-margin-top:88px; }
        .sm-sec:last-child { margin-bottom:0; }
        .sm-h2 { font-family:var(--font-heading); font-style:italic; font-weight:400;
                 font-size:clamp(24px,2.6vw,32px); color:var(--ink); margin:0 0 8px; }
        .sm-rule { width:36px; height:1px; background:var(--red); margin-bottom:26px; }
        .sm-p { font-family:var(--font-body); font-size:15.5px; line-height:1.9;
                color:var(--muted); margin:0 0 20px; max-width:72ch; }
        .sm-p:last-child { margin-bottom:0; }
        .sm-p em { font-style:italic; color:var(--ink); }
        .sm-social { display:inline-flex; align-items:center; gap:9px; margin-top:26px;
                     font-family:var(--font-body); font-size:11px; letter-spacing:0.16em;
                     text-transform:uppercase; color:var(--red); text-decoration:none;
                     border-bottom:1px solid rgba(144,26,28,0.3); padding-bottom:5px;
                     transition:border-color 0.2s; }
        .sm-social:hover { border-bottom-color:var(--red); }
        .sm-social:focus-visible { outline:2px solid var(--red); outline-offset:4px; }
        @media (max-width:860px) {
          .sm-hero { padding-top:64px; }
          .sm-hero-grid { grid-template-columns:1fr; min-height:0; }
          .sm-portrait { height:min(82vw,440px); }
          .sm-hero-text { padding:36px 24px 52px; }
          .sm-body { padding:52px 0 72px; }
        }
      `}</style>

      <main className="sm-wrap">
        <section className="sm-hero">
          <div className="sm-hero-grid">
            <div className="sm-portrait">
              <Image
                src="/images/Simar%20Malhotra%2C%20Founder%20of%20Inkpot%20India.jpeg"
                alt="Simar Malhotra, Founder of Inkpot India"
                fill
                priority
                sizes="(max-width: 860px) 100vw, 430px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            <div className="sm-hero-text">
              <p className="sm-eyebrow">Author &amp; Founder</p>
              <h1 className="sm-h1">Simar Malhotra</h1>
              <p className="sm-role">Founder, Inkpot India</p>
              <p className="sm-lead">
                Simar Malhotra founded Inkpot India in 2019 with the vision of reimagining how people
                experience India&rsquo;s rich artistic and cultural heritage. With the belief that
                history should be witnessed beyond textbooks and museum walls, transforming monuments,
                traditions, and stories into living experiences that inspire curiosity and connection.
              </p>
            </div>
          </div>
        </section>

        <div className="sm-inner sm-body">
          <section className="sm-sec">
            <p className="sm-p">
              After establishing Inkpot India, Simar pursued advanced studies at Stanford University
              and Columbia University, where she further explored the intersections of culture,
              leadership, and public engagement. These experiences strengthened her conviction that
              heritage is not simply something to preserve, but something to actively experience and
              celebrate.
            </p>
            <p className="sm-p">
              With her vision, Inkpot India has grown into a cultural platform that brings together
              art, music, architecture, literature, and storytelling through thoughtfully curated
              experiences. By collaborating with artists, institutions, and partners, the organization
              continues to create immersive cultural initiatives that bridge India&rsquo;s past with
              its present.
            </p>
          </section>

          <section className="sm-sec" aria-labelledby="about-simar">
            <h2 className="sm-h2" id="about-simar">About Simar Malhotra</h2>
            <div className="sm-rule" />
            <p className="sm-p">
              Simar Malhotra is an author, cultural entrepreneur, and advocate for India&rsquo;s art
              and heritage. She began writing as a teenager and is the author of two books,{" "}
              <em>There is a Tide</em> and <em>Tides Don&rsquo;t Cross</em>. She frequently speaks at
              cultural institutions and forums, where she shares her perspectives on heritage,
              storytelling, and the role of culture in shaping contemporary society.
            </p>
            {/* A real anchor as well as the schema `sameAs` — a crawlable link
                corroborates the entity more strongly than structured data alone. */}
            <a
              className="sm-social"
              href="https://www.linkedin.com/in/simar-malhotra-b77a53124/"
              target="_blank"
              rel="me noopener noreferrer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 21h4V9H3v12zM10 21h4v-6.4c0-1.7.32-3.35 2.43-3.35 2.08 0 2.1 1.95 2.1 3.46V21h4v-7.1c0-3.5-.75-6.2-4.84-6.2-1.97 0-3.29 1.08-3.83 2.1h-.05V9H10v12z" />
              </svg>
              Simar Malhotra on LinkedIn
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
