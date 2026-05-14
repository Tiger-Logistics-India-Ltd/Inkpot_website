"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Panel {
  tag: string;
  title: string;
  body: string;
  href: string;
  image: string;
  bg: string;
  dark: boolean;    /* true = dark bg (white text), false = light bg (dark text) */
  imgRight: boolean;
}

const PANELS: Panel[] = [
  {
    tag: "Music & Heritage",
    title: "Songs of the Stone",
    body: "After-hours cultural evenings at Delhi's heritage monuments. Space becomes stage. Arches become resonance. Stone becomes story.",
    href: "https://www.songsofthestone.com/",
    image: "/images/Songs of the stone/Desktop.png",
    bg: "#0D0B09",
    dark: true,
    imgRight: true,
  },
  {
    tag: "Summer Programme",
    title: "Antarnaad",
    body: "A summer immersion into Indian music, storytelling, and the performing arts — for the next generation.",
    href: "#",
    image: "/images/experiences/224A3705.JPG",
    bg: "#F4EFE6",
    dark: false,
    imgRight: false,
  },
  {
    tag: "Thought Leadership",
    title: "Inkpot India Conclave",
    body: "Writers, artists, thinkers — convening to re-ink, rebrand, and reassert Indian culture on the world stage.",
    href: "https://www.inkpotindiaconclave.com/",
    image: "/images/experiences/479A7421.JPG",
    bg: "#131313",
    dark: true,
    imgRight: true,
  },
  {
    tag: "Community Initiative",
    title: "The Heritage Cleanliness Project",
    body: "A monthly clean-up woven with heritage storytelling. Those who tend to a place, belong to it.",
    href: "/events/heritage-cleanliness",
    image: "/images/heritage cleaning/NolitterLegacy.png",
    bg: "#EDE5D8",
    dark: false,
    imgRight: false,
  },
];

const N        = PANELS.length;
const NAVBAR_H = 90;
const STRIP_H  = 52;

export default function OurExperiences() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    /* Wait one frame so SmoothScroll's Lenis proxy is registered first.
       (Child useEffects fire before parent in React — Lenis is the parent.) */
    const id = setTimeout(() => {
      ScrollTrigger.refresh();

      const ctx = gsap.context(() => {

        /* ── Horizontal scroll: pin section, drive track left ── */
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1.4,
            start: `top ${NAVBAR_H}px`,
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
          },
        });

        /* ── Image parallax: images drift slightly slower than panels ──
           As the track moves left, images drift gently right relative to
           their containers — creating the impression of depth.          */
        imgRefs.current.forEach((el) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { xPercent: 7 },
            {
              xPercent: -7,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                scrub: 2.2,
                start: `top ${NAVBAR_H}px`,
                end: () => `+=${track.scrollWidth - window.innerWidth}`,
                invalidateOnRefresh: true,
              },
            }
          );
        });

      }, section);

      return () => ctx.revert();
    }, 60);

    return () => clearTimeout(id);
  }, []);

  const contentH = `calc(100vh - ${NAVBAR_H + STRIP_H}px)`;

  return (
    <section
      ref={sectionRef}
      id="experiences"
      style={{
        height: `calc(100vh - ${NAVBAR_H}px)`,
        overflow: "hidden",
      }}
    >

      {/* ── Sticky red banner ── */}
      <div style={{
        height: `${STRIP_H}px`,
        background: "var(--primary-red)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
      }}>
        <div style={{ width: "22px", height: "1px", background: "rgba(255,255,255,0.3)" }} />
        <span style={{
          fontFamily: "var(--font-body)",
          fontSize: "9.5px",
          fontWeight: 600,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: "#ffffff",
        }}>
          Our Experiences
        </span>
        <div style={{ width: "22px", height: "1px", background: "rgba(255,255,255,0.3)" }} />

        {/* Scroll hint — right side */}
        <span style={{
          position: "absolute",
          right: "44px",
          fontFamily: "var(--font-body)",
          fontSize: "9px",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.45)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          scroll
          <svg width="18" height="10" viewBox="0 0 20 10" fill="none">
            <path d="M1 5h18M13 1l5 4-5 4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* ── Horizontal track ── */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          height: contentH,
          width: `${N * 100}vw`,
          willChange: "transform",
        }}
      >
        {PANELS.map((panel, i) => {
          const tc  = panel.dark ? "#ffffff"              : "#111111";
          const sc  = panel.dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.48)";
          const rc  = panel.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";

          const imageBlock = (
            <div
              ref={(el) => { imgRefs.current[i] = el; }}
              style={{
                position: "relative",
                width: "46%",
                height: "78%",
                flexShrink: 0,
                overflow: "hidden",
                alignSelf: "center",
                /* Alternating margin — image is never edge-flush */
                marginLeft: panel.imgRight ? 0 : "5%",
                marginRight: panel.imgRight ? "5%" : 0,
              }}
            >
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                priority={i === 0}
                sizes="46vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              {/* Edge vignette on image */}
              <div style={{
                position: "absolute", inset: 0,
                background: panel.dark
                  ? "linear-gradient(to right, rgba(13,11,9,0.25) 0%, transparent 30%, transparent 70%, rgba(13,11,9,0.25) 100%)"
                  : "linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)",
                pointerEvents: "none",
              }} />
            </div>
          );

          const textBlock = (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: panel.imgRight
                ? "0 56px 0 80px"   /* text left */
                : "0 80px 0 56px",  /* text right */
            }}>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: "var(--primary-red)",
                margin: "0 0 18px",
              }}>
                {panel.tag}
              </p>

              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(28px, 3.2vw, 52px)",
                lineHeight: 1.08,
                color: tc,
                margin: "0 0 20px",
              }}>
                {panel.title}
              </h3>

              <div style={{
                width: "28px",
                height: "1px",
                background: "var(--primary-red)",
                marginBottom: "20px",
              }} />

              <p style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "13.5px",
                lineHeight: 1.84,
                color: sc,
                margin: "0 0 32px",
                maxWidth: "320px",
              }}>
                {panel.body}
              </p>

              <a
                href={panel.href}
                target={panel.href.startsWith("http") ? "_blank" : undefined}
                rel={panel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: tc,
                  textDecoration: "none",
                  borderBottom: `1px solid ${rc}`,
                  paddingBottom: "3px",
                  width: "fit-content",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "color 0.3s, border-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--primary-red)";
                  e.currentTarget.style.borderBottomColor = "var(--primary-red)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = tc;
                  e.currentTarget.style.borderBottomColor = rc;
                }}
              >
                Explore
                <svg width="12" height="8" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          );

          return (
            <div
              key={i}
              style={{
                width: "100vw",
                height: "100%",
                flexShrink: 0,
                background: panel.bg,
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
                /* Thin right border separates panels */
                borderRight: i < N - 1
                  ? `1px solid ${panel.dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`
                  : "none",
              }}
            >
              {panel.imgRight
                ? <>{textBlock}{imageBlock}</>
                : <>{imageBlock}{textBlock}</>
              }
            </div>
          );
        })}
      </div>

    </section>
  );
}
