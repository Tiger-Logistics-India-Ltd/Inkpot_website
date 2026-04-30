"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const programmes = [
  {
    num: "01",
    title: "Songs of the Stone",
    desc: "After-hours evenings at Delhi's heritage monuments.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  },
  {
    num: "02",
    title: "Heritage Cleanliness Project",
    desc: "Monthly community drives where shram daan meets storytelling.",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
  },
  {
    num: "03",
    title: "Echoes of Expression",
    desc: "Four rooms, four vibes — an art gallery across heritage sites.",
    image:
      "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&q=80",
  },
  {
    num: "04",
    title: "Inkpot India Conclave",
    desc: "Writers, artists, and thinkers convening to reassert Indian culture.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
];

export default function Programmes() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="programmes" className="py-28 md:py-36 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p
            className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Our Programmes
          </p>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl text-[#F5F0E8] leading-tight"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Four Invitations
            <br />
            to Rediscover India.
          </h2>
        </motion.div>

        {/* Cards — horizontal scroll on mobile, 2x2 on desktop */}
        <div className="flex md:grid md:grid-cols-2 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
          {programmes.map((prog, i) => (
            <ProgrammeCard key={prog.num} prog={prog} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgrammeCard({
  prog,
  index,
}: {
  prog: (typeof programmes)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex-shrink-0 w-[80vw] md:w-auto snap-center cursor-pointer overflow-hidden border border-transparent hover:border-[rgba(201,168,76,0.4)] transition-all duration-500"
      style={{ aspectRatio: "3/4" }}
    >
      {/* Image */}
      <Image
        src={prog.image}
        alt={prog.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 80vw, 50vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[rgba(10,10,10,0.3)] to-transparent group-hover:from-[rgba(10,10,10,0.95)] transition-all duration-500" />

      {/* Number */}
      <span
        className="absolute top-5 left-5 text-[#C9A84C] text-3xl md:text-4xl italic z-10"
        style={{ fontFamily: "EB Garamond, serif" }}
      >
        {prog.num}
      </span>

      {/* Bottom Text */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <h3
          className="text-[#F5F0E8] text-xl md:text-2xl font-bold mb-1"
          style={{ fontFamily: "EB Garamond, serif" }}
        >
          {prog.title}
        </h3>
        <p
          className="text-[#F5F0E8]/60 text-sm"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          {prog.desc}
        </p>
      </div>

      {/* Hover Arrow */}
      <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#C9A84C]"
        >
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}
