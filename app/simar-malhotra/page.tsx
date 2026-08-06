import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/*
 * Deliberately a SERVER component (no "use client").
 *
 * The whole point of this page is to be read by Google and by AI systems, so
 * every word ships inside the initial HTML with no JavaScript required to see
 * it. That also lets `metadata` live here instead of in a sibling layout.tsx,
 * which is the workaround the client pages elsewhere in this app need.
 *
 * ── FACTS ─────────────────────────────────────────────────────────────────
 * Everything below is drawn from what the site already states publicly
 * (app/about/page.tsx) or from the published press listed in
 * components/MediaCoverage.tsx. Nothing here is invented. See the TODO block
 * further down for the details only Inkpot can supply — especially `sameAs`,
 * which is the single strongest signal for entity recognition.
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
  // ⚠️ TEMPORARY — the Biography section is Lorem ipsum placeholder right now.
  // Letting Google index Latin filler on a real person's profile would poison
  // the exact entity signal this page exists to build. DELETE this `robots`
  // block (and re-add the URL to public/sitemap.xml) the moment real copy lands.
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

/* Published coverage of Inkpot India's work — mirrors components/MediaCoverage.tsx */
const PRESS = [
  {
    pub: "The Wire",
    headline:
      "Songs of the Stone: A Saga of Sound, Space and Story Brings the Qutub Minar into a New Cultural Conversation",
    href: "https://m.thewire.in/article/ptiprnews/songs-of-the-stone-a-saga-of-sound-space-and-story-brings-the-qutub-minar-into-a-new-cultural-conversation/amp",
  },
  {
    pub: "Condé Nast Traveller",
    headline: "How Delhi's heritage sites are serving modern culture",
    href: "https://www.cntraveller.in/story/how-delhis-heritage-sites-are-serving-modern-culture/",
  },
  {
    pub: "Homegrown",
    headline: "Songs of the Stone returns to Qutub Minar with Grammy winner Rakesh Chaurasia",
    href: "https://homegrown.co.in/homegrown-explore/songs-of-the-stone-returns-to-qutub-minar-with-grammy-winner-rakesh-chaurasia",
  },
  {
    pub: "The Times of India",
    headline: "Tracing the journey of North Indian cuisine through conversation and cuisine",
    href: "https://timesofindia.indiatimes.com/entertainment/events/delhi/tracing-the-journey-of-north-indian-cuisine-through-conversation-and-cuisine/articleshow/132182313.cms",
  },
  {
    pub: "The Times of India",
    headline: "Cleanliness drive at Mehrauli Archaeological Park brings Delhiites together",
    href: "https://timesofindia.indiatimes.com/entertainment/events/delhi/cleanliness-drive-at-mehrauli-archaeological-park-brings-delhiites-together/articleshow/130625613.cms",
  },
  {
    pub: "Slurrp",
    headline:
      "The Living Table in Old Delhi: a dinner that celebrated the journey of North Indian cuisine",
    href: "https://www.slurrp.com/article/the-living-table-in-old-delhi-a-dinner-that-celebrated-the-journey-of-north-indian-cuisine-1782979627889",
  },
];

const WORK = [
  {
    name: "Songs of the Stone",
    href: "https://songsofthestone.com",
    external: true,
    text: "After-hours concerts staged inside Delhi's heritage monuments, where the architecture itself becomes the acoustic. Editions have been held at the Qutub Minar, including one featuring the Grammy-winning flautist Rakesh Chaurasia.",
  },
  {
    name: "The Living Table",
    href: "/the-living-table",
    external: false,
    text: "A dining series that treats a shared table as a cultural form. The inaugural edition, held in Old Delhi, traced the history of North Indian cuisine through a sit-down dinner with food historians and chefs.",
  },
  {
    name: "The Heritage Cleanliness Project",
    href: "/events/heritage-cleanliness",
    external: false,
    text: "A monthly volunteer initiative — #NoLitterLegacy — that gathers people at Delhi's heritage sites to clean and care for them, pairing the work with storytelling and conversation.",
  },
];

/*
 * ── TODO: facts only Inkpot can supply ───────────────────────────────────
 * Add these and this page becomes considerably stronger as an entity source:
 *   1. `sameAs` below — LinkedIn, Instagram, X, Wikipedia, Amazon author page,
 *      Muck Rack. THE most important missing piece: it is how Google resolves
 *      "Simar Malhotra" to one specific person rather than a name string.
 *   2. Published book titles + years (the About page says "Author"), which
 *      would populate schema.org `author` / a Bibliography section.
 *   3. The year Inkpot India was founded -> `foundingDate`.
 *   4. Any prior roles, awards, or speaking engagements.
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
        .sm-hero { background:#F4EFE6; padding:120px 0 72px; }
        .sm-hero-grid { display:grid; grid-template-columns:300px 1fr; gap:56px; align-items:start; }
        .sm-portrait { position:relative; width:100%; aspect-ratio:1067/1600; overflow:hidden;
                       box-shadow:0 18px 52px rgba(0,0,0,0.18); }
        .sm-eyebrow { font-family:var(--font-body); font-size:10px; letter-spacing:0.3em;
                      text-transform:uppercase; color:var(--red); margin-bottom:18px; }
        .sm-h1 { font-family:var(--font-heading); font-weight:400; font-size:clamp(40px,5.4vw,68px);
                 line-height:1.05; color:var(--ink); margin:0 0 10px; }
        .sm-role { font-family:var(--font-body); font-size:14px; letter-spacing:0.06em;
                   color:var(--muted); margin:0 0 28px; }
        .sm-lead { font-family:var(--font-body); font-size:17px; line-height:1.85; color:rgba(0,0,0,0.75); margin:0; }
        .sm-body { padding:76px 0 96px; }
        .sm-sec { margin-bottom:60px; scroll-margin-top:88px; }
        .sm-h2 { font-family:var(--font-heading); font-style:italic; font-weight:400;
                 font-size:clamp(26px,3vw,36px); color:var(--ink); margin:0 0 8px; }
        .sm-rule { width:36px; height:1px; background:var(--red); margin-bottom:24px; }
        .sm-p { font-family:var(--font-body); font-size:15.5px; line-height:1.9; color:var(--muted); margin:0 0 18px; }
        .sm-p a { color:var(--red); text-decoration:none; border-bottom:1px solid rgba(144,26,28,0.28); }
        .sm-p a:hover { border-bottom-color:var(--red); }
        .sm-work { border-top:1px solid rgba(0,0,0,0.1); padding:24px 0; }
        .sm-work h3 { font-family:var(--font-heading); font-weight:400; font-size:22px; color:var(--ink); margin:0 0 8px; }
        .sm-work h3 a { color:var(--ink); text-decoration:none; }
        .sm-work h3 a:hover { color:var(--red); }
        .sm-quote { border-left:2px solid var(--red); padding:6px 0 6px 24px; margin:0 0 22px; }
        .sm-quote p { font-family:var(--font-heading); font-style:italic; font-weight:400;
                      font-size:20px; line-height:1.65; color:var(--ink); margin:0; }
        .sm-facts { list-style:none; padding:0; margin:0; border-top:1px solid rgba(0,0,0,0.1); }
        .sm-facts li { display:grid; grid-template-columns:190px 1fr; gap:20px; padding:14px 0;
                       border-bottom:1px solid rgba(0,0,0,0.08); font-family:var(--font-body);
                       font-size:14px; line-height:1.7; }
        .sm-facts span:first-child { color:rgba(0,0,0,0.45); letter-spacing:0.06em;
                                     text-transform:uppercase; font-size:10.5px; padding-top:3px; }
        .sm-facts span:last-child { color:var(--ink); }
        .sm-press { list-style:none; padding:0; margin:0; }
        .sm-press li { border-bottom:1px solid rgba(0,0,0,0.09); padding:16px 0; }
        .sm-press a { font-family:var(--font-body); font-size:15px; line-height:1.65;
                      color:var(--ink); text-decoration:none; display:block; }
        .sm-press a:hover { color:var(--red); }
        .sm-press em { display:block; font-style:normal; font-size:10px; letter-spacing:0.22em;
                       text-transform:uppercase; color:var(--red); margin-bottom:5px; }
        @media (max-width:860px) {
          .sm-hero { padding:96px 0 52px; }
          .sm-hero-grid { grid-template-columns:1fr; gap:32px; }
          .sm-portrait { max-width:260px; }
          .sm-body { padding:52px 0 72px; }
          .sm-facts li { grid-template-columns:1fr; gap:4px; }
        }
      `}</style>

      <main className="sm-wrap">
        {/* ── HERO ── */}
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

        <div className="sm-inner sm-body">
          {/* ── AT A GLANCE ── */}
          <section className="sm-sec" aria-labelledby="glance">
            <h2 className="sm-h2" id="glance">At a glance</h2>
            <div className="sm-rule" />
            <ul className="sm-facts">
              <li><span>Full name</span><span>Simar Malhotra</span></li>
              <li><span>Known for</span><span>Founding Inkpot India; Songs of the Stone; The Living Table</span></li>
              <li><span>Occupation</span><span>Author; founder and cultural producer</span></li>
              <li><span>Education</span><span>Stanford University; Columbia University</span></li>
              <li><span>Organisation</span><span><a href="/about" style={{ color: "#901A1C", textDecoration: "none" }}>Inkpot India</a></span></li>
              <li><span>Based in</span><span>Delhi, India</span></li>
            </ul>
          </section>

          {/* ── BIOGRAPHY ── */}
          <section className="sm-sec" aria-labelledby="biography">
            <h2 className="sm-h2" id="biography">Biography</h2>
            <div className="sm-rule" />
            {/* ⚠️ PLACEHOLDER COPY — replace with the real biography.
                While this filler is here the page is noindex (see `robots` in
                the metadata above) and is pulled from sitemap.xml. Restoring
                real copy means: swap these three paragraphs, delete the
                `robots` block, and re-add the URL to public/sitemap.xml. */}
            <p className="sm-p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="sm-p">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
            <p className="sm-p">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.
            </p>
          </section>

          {/* ── APPROACH ── */}
          <section className="sm-sec" aria-labelledby="philosophy">
            <h2 className="sm-h2" id="philosophy">Philosophy</h2>
            <div className="sm-rule" />
            <div className="sm-quote">
              <p>
                &ldquo;Art has always been essential. From cave paintings, resistance poetry to the
                music of the freedom movement, creative expression has shaped our identity and
                resilience. Today, reconnecting with that instinct is not nostalgia. It is power.&rdquo;
              </p>
            </div>
            <p className="sm-p">
              That conviction underpins Inkpot&rsquo;s stated aim: to build a cultural ecosystem in
              which India&rsquo;s traditions are &ldquo;remembered not as archives, but reimagined as
              living art.&rdquo; In practice this means placing heritage in settings where audiences
              encounter it directly — a monument used as a concert hall, a meal used as a history
              lesson, a clean-up used as an act of custodianship.
            </p>
          </section>

          {/* ── WORK ── */}
          <section className="sm-sec" aria-labelledby="programmes">
            <h2 className="sm-h2" id="programmes">Signature programmes</h2>
            <div className="sm-rule" />
            {WORK.map((w) => (
              <div className="sm-work" key={w.name}>
                <h3>
                  <a
                    href={w.href}
                    {...(w.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {w.name}
                  </a>
                </h3>
                <p className="sm-p" style={{ margin: 0 }}>{w.text}</p>
              </div>
            ))}
          </section>

          {/* ── PRESS ── */}
          <section className="sm-sec" aria-labelledby="press">
            <h2 className="sm-h2" id="press">Selected press</h2>
            <div className="sm-rule" />
            <p className="sm-p">Coverage of Inkpot India&rsquo;s programmes in national publications.</p>
            <ul className="sm-press">
              {PRESS.map((p) => (
                <li key={p.href}>
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    <em>{p.pub}</em>
                    {p.headline}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* ── CONTACT ── */}
          <section className="sm-sec" aria-labelledby="contact" style={{ marginBottom: 0 }}>
            <h2 className="sm-h2" id="contact">Contact</h2>
            <div className="sm-rule" />
            <p className="sm-p">
              Press and partnership enquiries for Simar Malhotra and Inkpot India can be directed to{" "}
              <a href="mailto:info@inkpotindia.com">info@inkpotindia.com</a>, or through the{" "}
              <a href="/contact">contact page</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
