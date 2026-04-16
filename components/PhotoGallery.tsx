"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const galleryImages = [
  { src: "/images/Songs%20of%20the%20stone/SOTS-175.jpg", alt: "Songs of the Stone — heritage performance" },
  { src: "/images/Inkpot%20India%20Conclave/saurav/479A7374.JPG", alt: "Inkpot India Conclave" },
  { src: "/images/Songs%20of%20the%20stone/SOTS-156.jpg", alt: "Songs of the Stone — monument evening" },
  { src: "/images/Inkpot%20India%20Conclave/saurav/IMG_3232.JPG", alt: "Conclave gathering" },
  { src: "/images/Songs%20of%20the%20stone/SOTS-336.jpg", alt: "Songs of the Stone — audience" },
  { src: "/images/Inkpot%20India%20Conclave/saurav/479A7419.JPG", alt: "Conclave speakers" },
  { src: "/images/Songs%20of%20the%20stone/SOTS-225.jpg", alt: "Songs of the Stone — artist" },
  { src: "/images/Inkpot%20India%20Conclave/saurav/IMG_3284.JPG", alt: "Conclave discussion" },
];

export default function PhotoGallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p
            className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Moments
          </p>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl text-[#F5F0E8] leading-tight"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            Glimpses of
            <br />
            What We Do.
          </h2>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative break-inside-avoid overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={i % 3 === 0 ? 800 : i % 3 === 1 ? 600 : 700}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
