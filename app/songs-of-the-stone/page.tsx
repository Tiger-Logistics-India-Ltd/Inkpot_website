"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RED = "#901A1C";
const GOLD = "#C9A84C";
const CREAM = "#F4EFE6";
const INK = "#0D0B09";

function Fade({ children, delay = 0, y = 24 }: { children: ReactNode; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface Chapter {
  num: string;
  label: string;
  title: string;
  subtitle: string;
  date: string;
  venue: string;
  image: string;
  paragraphs: string[];
}

const CHAPTERS: Chapter[] = [
  {
    num: "01",
    label: "The First Chapter",
    title: "The Mehtab Ali Niazi Experience",
    subtitle: "A Classical Rhapsody",
    date: "13 December 2025",
    venue: "Qutub Minar, New Delhi",
    image: "/images/Songs of the stone/ch1-poster.png",
    paragraphs: [
      "An evening of extraordinary resonance unfolded at the Qutub Minar, as Mehtab Ali Niazi and his ensemble brought together the classical and the contemporary in a performance that will long be remembered.",
      "His semi-classical fusion — weaving raga with elements of jazz and modern soundscapes — wove an experience both timeless and alive, set against the breathtaking backdrop of a UNESCO World Heritage Site at dusk.",
    ],
  },
  {
    num: "02",
    label: "The Second Chapter",
    title: "Live The Legacy",
    subtitle: "Rakesh Chaurasia & Friends — The Legend Ensemble",
    date: "8 March 2026",
    venue: "Qutub Minar, New Delhi",
    image: "/images/Songs of the stone/ch2-stage-dusk.png",
    paragraphs: [
      "Songs of the Stone by Inkpot India and HSBC 'Live The Legacy' presented an immersive musical experience at the Qutub Minar. The evening featured two-time Grammy Award–winning flautist Rakesh Chaurasia, accompanied by Gino Banks, Satyajit Talwalkar, Sheldon D'Silva, Sanjoy Das and Sangeet Haldipur — a collective of some of India's finest contemporary classical musicians.",
      "As dusk yielded to night, the monument's illuminated silhouette became both stage and muse, while the serenity of the bansuri and the ensemble's virtuosity created a confluence of sound, history and architectural splendour.",
    ],
  },
  {
    num: "03",
    label: "The Third Chapter",
    title: "Amrita Kaur — From Dusk to Dawn",
    subtitle: "Live The Legacy, with HSBC",
    date: "11 October 2026",
    venue: "Purana Qila, New Delhi",
    image: "/images/Songs of the stone/new_hero_poster_chapter_3.jpg",
    paragraphs: [
      "Internationally acclaimed music sensation Amrita Kaur came to Delhi for Chapter Three of Songs of the Stone by Inkpot India — a rare, sensory and contemplative musical experience set within one of the city's most evocative heritage spaces.",
      "Unfolding across two extraordinary moments at sunset and sunrise, the experience brought together two distinct concerts, each with its own setlist, mood and rhythm, inviting audiences to immerse themselves in music, stillness and the changing moods of the sky.",
    ],
  },
];

const GALLERY = [
  { src: "/images/Songs of the stone/gallery/ch1-sitar-qutub.jpg", alt: "Mehtab Ali Niazi performing beneath the Qutub Minar, Chapter One" },
  { src: "/images/Songs of the stone/ch3-dusk.png", alt: "The Purana Qila stage at dusk, Chapter Three" },
  { src: "/images/Songs of the stone/gallery/ch2-drummer.png", alt: "The Legend Ensemble in performance, Chapter Two" },
  { src: "/images/Songs of the stone/gallery/ch3-portrait-1.png", alt: "Amrita Kaur in performance, Chapter Three" },
  { src: "/images/Songs of the stone/gallery/ch3-landscape-1.png", alt: "Chapter Three, Purana Qila" },
  { src: "/images/Songs of the stone/gallery/ch3-portrait-2.png", alt: "A word before the song, Chapter Three" },
  { src: "/images/Songs of the stone/ch3-dawn.png", alt: "The Purana Qila stage at dawn, Chapter Three" },
  { src: "/images/Songs of the stone/gallery/ch3-landscape-2.png", alt: "An evening unfolds, Chapter Three" },
];

const PRESS = [
  { publication: "Condé Nast Traveller", title: "How Delhi's heritage sites are serving modern culture", image: "/images/Songs of the stone/press/conde-nast.png", url: "https://www.cntraveller.in/story/how-delhis-heritage-sites-are-serving-modern-culture/" },
  { publication: "PTI", title: "Flautist Rakesh Chaurasia to perform at 2nd 'Songs of the Stone' at Qutub Minar", image: "/images/Songs of the stone/press/pti.png", url: "https://www.ptinews.com/story/national/flautist-rakesh-chaurasia-to-perform-at-2nd-songs-of-the-stone-at-qutub-minar/3431546" },
  { publication: "The Wire", title: "A Saga of Sound, Space and Story Brings the Qutub Minar into a New Cultural Conversation", image: "/images/Songs of the stone/press/the-wire.png", url: "https://thewire.in/ptiprnews/songs-of-the-stone-a-saga-of-sound-space-and-story-brings-the-qutub-minar-into-a-new-cultural-conversation" },
];

const PARTNERS = [
  { name: "Max Estates", src: "/images/Songs of the stone/partners/max.svg" },
  { name: "HSBC", src: "/images/Songs of the stone/partners/hsbc.png" },
  { name: "Delhi Tourism", src: "/images/Songs of the stone/partners/delhi-tourism.svg" },
  { name: "Archaeological Survey of India", src: "/images/Songs of the stone/partners/arc.svg" },
  { name: "Stanford", src: "/images/Songs of the stone/partners/stanford.svg" },
  { name: "Jaipur Rugs", src: "/images/Songs of the stone/partners/jaipur-rugs.svg" },
  { name: "Aava", src: "/images/Songs of the stone/partners/aava.svg" },
  { name: "Aanyna", src: "/images/Songs of the stone/partners/aanyna.svg" },
  { name: "Hyder", src: "/images/Songs of the stone/partners/hyder.svg" },
  { name: "Alegro", src: "/images/Songs of the stone/partners/alegro.svg" },
  { name: "Olaf", src: "/images/Songs of the stone/partners/olaf.svg" },
  { name: "Berger", src: "/images/Songs of the stone/partners/berger.png" },
  { name: "Vedica", src: "/images/Songs of the stone/partners/vedica.png" },
  { name: "Cohoma", src: "/images/Songs of the stone/partners/cohoma.png" },
  { name: "Iraado", src: "/images/Songs of the stone/partners/iraado.png" },
  { name: "Kian Falcon", src: "/images/Songs of the stone/partners/kian-falcon.png" },
  { name: "Dialogues by Nirmals", src: "/images/Songs of the stone/partners/dialogues-by-nirmals.png" },
  { name: "Handicraft Haveli Jaipur", src: "/images/Songs of the stone/partners/handicraft-haveli.png" },
  { name: "Maioya", src: "/images/Songs of the stone/partners/maioya.png" },
];

function AboutBlock({ eyebrow, children, image, alt, reverse, delay = 0 }: {
  eyebrow: string; children: ReactNode; image: string; alt: string; reverse?: boolean; delay?: number;
}) {
  return (
    <div className="sots-about-grid" style={{ flexDirection: reverse ? "row-reverse" : "row" }}>
      <Fade delay={delay}>
        <div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: RED, margin: "0 0 18px" }}>{eyebrow}</p>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "14.5px", color: "rgba(0,0,0,0.68)", lineHeight: 1.95 }}>{children}</div>
        </div>
      </Fade>
      <Fade delay={delay + 0.1}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", overflow: "hidden", background: "#111" }}>
          <Image src={image} alt={alt} fill sizes="(max-width: 860px) 100vw, 46vw" unoptimized={image.endsWith(".svg")} style={{ objectFit: "cover" }} />
        </div>
      </Fade>
    </div>
  );
}

export default function SongsOfTheStonePage() {
  return (
    <>
      <Navbar />
      <main style={{ background: CREAM, overflowX: "hidden" }}>
        <style>{`
          .sots-about-grid { display: flex; align-items: center; gap: clamp(32px, 5vw, 72px); margin-bottom: clamp(56px, 8vw, 96px); }
          .sots-chapter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 64px); align-items: center; }
          .sots-gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
          .sots-press-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .sots-partner-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: rgba(0,0,0,0.08); }
          @media (max-width: 860px) {
            .sots-about-grid, .sots-chapter-grid { grid-template-columns: 1fr; flex-direction: column !important; }
            .sots-gallery-grid { grid-template-columns: repeat(2, 1fr); }
            .sots-press-grid { grid-template-columns: 1fr; }
            .sots-partner-grid { grid-template-columns: repeat(3, 1fr); }
          }
        `}</style>

        {/* ── HERO ── */}
        <section style={{ position: "relative", height: "100dvh", minHeight: "560px", overflow: "hidden", display: "flex" }}>
          <Image
            src="/images/Songs of the stone/ch3-dusk.png"
            alt="Songs of the Stone — a live performance staged within Delhi's heritage monuments"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,6,0.35) 0%, rgba(10,8,6,0.55) 55%, rgba(10,8,6,0.92) 100%)" }} />

          <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(88px, 12vh, 112px) 24px clamp(48px, 8vh, 80px)" }}>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(9px, 2.2vw, 11px)", letterSpacing: "0.36em", textTransform: "uppercase", color: "rgba(244,239,230,0.75)", margin: "0 0 18px" }}
            >
              Inkpot India Presents
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
              style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(42px, 8vw, 92px)", color: CREAM, lineHeight: 1.03, margin: "0 0 18px" }}
            >
              Songs of the Stone
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.7 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(12px, 2vw, 15px)", letterSpacing: "0.1em", color: GOLD, textTransform: "uppercase", margin: "0 0 28px" }}
            >
              Art. Architecture. Performance.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.85 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.6vw, 15px)", color: "rgba(244,239,230,0.65)", maxWidth: "480px", lineHeight: 1.9 }}
            >
              After-hours cultural evenings at Delhi&rsquo;s heritage monuments — where space becomes stage, arches become resonance, and stone becomes story.
            </motion.p>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section style={{ padding: "clamp(64px, 9vw, 120px) clamp(24px, 6vw, 110px) 0", maxWidth: "1200px", margin: "0 auto" }}>
          <Fade>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: RED, textAlign: "center", margin: "0 0 16px" }}>About</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 4vw, 44px)", color: "#1a1a1a", textAlign: "center", margin: "0 0 clamp(56px, 7vw, 88px)", lineHeight: 1.2 }}>
              Where space becomes stage.
            </h2>
          </Fade>

          <AboutBlock eyebrow="Songs of the Stone" image="/images/Songs of the stone/SOTS-165.jpg" alt="A Songs of the Stone evening in performance">
            <p style={{ margin: "0 0 18px" }}>
              <strong>Songs of the Stone</strong> is Inkpot&rsquo;s series of after-hours cultural evenings at Delhi&rsquo;s heritage monuments. Here, space becomes stage, arches become resonance, and stone becomes story.
            </p>
            <p style={{ margin: "0 0 18px" }}>
              The debut edition unfolded at the Qutub Minar, a UNESCO World Heritage Site, transforming the monument into a living arena of music and memory. Presented in association with the Delhi Government and the Archaeological Survey of India, each evening celebrates the dialogue between heritage and contemporary expression.
            </p>
            <p style={{ margin: 0 }}>
              Each Songs of the Stone evening is intimate by design — an invitation to share in something rare and real: a moment of connection between music, history, and each other.
            </p>
          </AboutBlock>

          <AboutBlock eyebrow="Inkpot" image="/images/Songs of the stone/SOTS-71.jpg" alt="The stage and audience at a Songs of the Stone evening" reverse delay={0.05}>
            <p style={{ margin: "0 0 18px" }}>
              India stands at an inflection point in its relationship with its own cultural wealth. For too long, external narratives dictated what was valued, what was preserved, and what slipped into silence.
            </p>
            <p style={{ margin: "0 0 18px" }}>
              Inkpot exists to change that — to bring our music, literature, architecture, and performance back into the light, not as relics of the past, but as living forces of beauty and imagination. Our task is not only to preserve, but to reframe — to make our traditions aspirational and relevant in the contemporary global imagination.
            </p>
            <p style={{ margin: 0 }}>
              Through intimate, thoughtfully crafted experiences, each event is an invitation to pause, listen, and rediscover the pulse of Indian artistry in a new light.
            </p>
          </AboutBlock>

          <AboutBlock eyebrow="About the Founder" image="/images/Songs of the stone/about-founder.svg" alt="Simar Malhotra, Founder of Inkpot India" delay={0.1}>
            <p style={{ margin: "0 0 18px" }}>
              Art has always been essential. From cave paintings and resistance poetry to the music of the freedom movement, creative expression has shaped our identity and resilience.
            </p>
            <p style={{ margin: "0 0 18px" }}>
              Today, reconnecting with that instinct is not nostalgia. It is power. Inkpot produces experiences that are at once scholarly and sensorial, rooted yet experimental. Through new experiences like Songs of the Stone, we aim to build a cultural ecosystem where India&rsquo;s traditions are remembered not as archives, but reimagined as living art.
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontStyle: "italic", color: "#1a1a1a", fontSize: "16px" }}>
              Simar Malhotra<br />
              <span style={{ fontFamily: "var(--font-body)", fontStyle: "normal", fontSize: "12px", color: "rgba(0,0,0,0.5)" }}>
                Author &amp; Founder, Inkpot India — Alumnus, Stanford University &amp; Columbia University
              </span>
            </p>
          </AboutBlock>
        </section>

        {/* ── THREE CHAPTERS ── */}
        <section style={{ background: INK, padding: "clamp(64px, 9vw, 120px) clamp(24px, 6vw, 110px)" }}>
          <Fade>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: GOLD, textAlign: "center", margin: "0 0 16px" }}>Experiences</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 4vw, 44px)", color: CREAM, textAlign: "center", margin: "0 0 clamp(56px, 8vw, 100px)", lineHeight: 1.2 }}>
              Three Chapters
            </h2>
          </Fade>

          {CHAPTERS.map((ch, i) => (
            <div key={ch.num} style={{ maxWidth: "1180px", margin: i < CHAPTERS.length - 1 ? "0 auto clamp(64px, 9vw, 110px)" : "0 auto" }}>
              <div className="sots-chapter-grid" style={{ flexDirection: i % 2 === 1 ? "row-reverse" as const : "row" as const, display: "grid" }}>
                <Fade delay={0.05}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden", background: "#1a1410" }}>
                    <Image src={ch.image} alt={`${ch.title} — ${ch.subtitle}`} fill sizes="(max-width: 860px) 100vw, 46vw" style={{ objectFit: "cover" }} />
                  </div>
                </Fade>
                <Fade delay={0.12}>
                  <div>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "72px", fontWeight: 400, color: "rgba(244,239,230,0.1)", lineHeight: 1, margin: "0 0 4px" }}>{ch.num}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase", color: RED, margin: "0 0 14px" }}>{ch.label}</p>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3vw, 32px)", color: CREAM, margin: "0 0 8px", lineHeight: 1.2 }}>{ch.title}</h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: GOLD, letterSpacing: "0.02em", margin: "0 0 18px" }}>{ch.subtitle}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,239,230,0.45)", margin: "0 0 20px" }}>{ch.date} &middot; {ch.venue}</p>
                    {ch.paragraphs.map((p, pi) => (
                      <p key={pi} style={{ fontFamily: "var(--font-body)", fontSize: "13.5px", color: "rgba(244,239,230,0.65)", lineHeight: 1.9, margin: pi < ch.paragraphs.length - 1 ? "0 0 14px" : 0 }}>{p}</p>
                    ))}
                  </div>
                </Fade>
              </div>
            </div>
          ))}
        </section>

        {/* ── GALLERY ── */}
        <section style={{ padding: "clamp(56px, 8vw, 96px) clamp(24px, 6vw, 110px) 0", maxWidth: "1280px", margin: "0 auto" }}>
          <Fade>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: RED, textAlign: "center", margin: "0 0 16px" }}>Explore</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 4vw, 44px)", color: "#1a1a1a", textAlign: "center", margin: "0 0 clamp(40px, 6vw, 64px)", lineHeight: 1.2 }}>
              Gallery
            </h2>
          </Fade>
          <div className="sots-gallery-grid">
            {GALLERY.map((g, i) => (
              <Fade key={g.src} delay={(i % 4) * 0.05}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", overflow: "hidden", background: "#111" }}>
                  <Image src={g.src} alt={g.alt} fill sizes="(max-width: 860px) 50vw, 25vw" style={{ objectFit: "cover" }} loading="lazy" />
                </div>
              </Fade>
            ))}
          </div>
        </section>

        {/* ── PRESS ── */}
        <section style={{ padding: "clamp(64px, 9vw, 110px) clamp(24px, 6vw, 110px)", maxWidth: "1280px", margin: "0 auto" }}>
          <Fade>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: RED, textAlign: "center", margin: "0 0 16px" }}>In the News</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 4vw, 44px)", color: "#1a1a1a", textAlign: "center", margin: "0 0 clamp(40px, 6vw, 64px)", lineHeight: 1.2 }}>
              Press
            </h2>
          </Fade>
          <div className="sots-press-grid">
            {PRESS.map((p, i) => (
              <Fade key={p.url} delay={i * 0.08}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", overflow: "hidden" }}>
                    <Image src={p.image} alt={p.title} fill sizes="(max-width: 860px) 100vw, 33vw" style={{ objectFit: "cover" }} loading="lazy" />
                  </div>
                  <div style={{ padding: "20px 22px 24px" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "9.5px", letterSpacing: "0.18em", textTransform: "uppercase", color: RED, margin: "0 0 10px" }}>{p.publication}</p>
                    <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "15.5px", color: "#1a1a1a", lineHeight: 1.45, margin: 0 }}>{p.title}</p>
                  </div>
                </a>
              </Fade>
            ))}
          </div>
        </section>

        {/* ── PARTNERS ── */}
        <section style={{ background: "#ffffff", padding: "clamp(56px, 8vw, 96px) clamp(24px, 6vw, 110px)" }}>
          <Fade>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: RED, textAlign: "center", margin: "0 0 clamp(40px, 6vw, 56px)" }}>
              In Association With
            </p>
          </Fade>
          <div className="sots-partner-grid" style={{ maxWidth: "1180px", margin: "0 auto" }}>
            {PARTNERS.map((p) => (
              <div key={p.name} style={{ background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(20px, 3vw, 32px)", aspectRatio: "3 / 2" }}>
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image src={p.src} alt={p.name} fill sizes="200px" unoptimized={p.src.endsWith(".svg")} style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
