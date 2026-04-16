"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

const programmes = [
  {
    title: "Songs of the Stone",
    desc: "After-hours musical evenings at Delhi's heritage monuments.",
    image: "/images/Songs%20of%20the%20stone/SOTS-71.jpg",
  },
  {
    title: "Heritage Cleanliness Drive",
    desc: "Monthly community drives — shram daan meets storytelling.",
    image: "/images/heritage%20cleaning/heroposter.png",
  },
  {
    title: "Inkpot India Conclave",
    desc: "Writers, artists, and thinkers reasserting Indian culture.",
    image: "/images/Inkpot%20India%20Conclave/saurav/224A3689.JPG",
  },
  {
    title: "Echoes of Expression",
    desc: "Four rooms, four vibes — an art gallery across heritage sites.",
    image: "/images/Songs%20of%20the%20stone/SOTS-71.jpg",
  },
];

export default function Programmes() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth * 0.55;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section id="programmes" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header row */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111111]"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Our IPs
          </h2>
          <div className="flex items-center gap-3">
            <span
              className="hidden sm:inline-flex bg-[#111111] text-white px-5 py-2.5 text-xs tracking-[0.15em] uppercase font-medium rounded-full"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              View Programs
            </span>
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-[#111111]/15 flex items-center justify-center hover:border-[#111111]/40 transition-colors disabled:opacity-25"
              aria-label="Scroll left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-[#111111]/15 flex items-center justify-center hover:border-[#111111]/40 transition-colors disabled:opacity-25"
              aria-label="Scroll right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Carousel — full bleed */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto pl-6 lg:pl-[max(1.5rem,calc((100vw-1280px)/2+40px))] pr-6 pb-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {programmes.map((prog, i) => (
          <motion.div
            key={prog.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative flex-shrink-0 w-[75vw] sm:w-[55vw] md:w-[42vw] lg:w-[32vw] snap-start cursor-pointer overflow-hidden rounded-2xl"
            style={{ aspectRatio: "4/5" }}
          >
            <Image
              src={prog.image}
              alt={prog.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 75vw, (max-width: 768px) 55vw, (max-width: 1024px) 42vw, 32vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-[rgba(0,0,0,0.1)] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
              <h3
                className="text-white text-xl md:text-2xl font-semibold mb-1 leading-snug"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {prog.title}
              </h3>
              <p
                className="text-white/60 text-sm mb-4 leading-snug line-clamp-2"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {prog.desc}
              </p>
              <span
                className="inline-flex bg-white text-[#111111] px-4 py-2 text-xs font-medium tracking-wide rounded-full"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Learn More
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
