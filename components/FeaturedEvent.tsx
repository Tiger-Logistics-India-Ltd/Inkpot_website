"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function FeaturedEvent() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="events" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Image */}
          <div className="relative h-[380px] lg:h-[520px] overflow-hidden rounded-2xl">
            <Image
              src="/images/Songs%20of%20the%20stone/SOTS-71.jpg"
              alt="Songs of the Stone — heritage monument performance"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Text */}
          <div>
            <p
              className="text-[#111111]/40 text-xs tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Upcoming · Cleanliness Drive
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#111111] leading-tight mb-5"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              An Evening at
              <br />
              Rajaon Ki Baoli.
            </h2>
            <p
              className="text-[#111111]/50 text-sm leading-relaxed max-w-sm mb-7"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Presented in association with the Delhi Government and the
              Archaeological Survey of India. Space becomes stage. Arches become
              resonance. Stone becomes story.
            </p>

            <div className="flex flex-wrap gap-6 mb-8 text-[#111111]/45 text-sm">
              <span className="flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Mehrauli, New Delhi
              </span>
              <span className="flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Coming Soon
              </span>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#111111] text-sm font-medium tracking-wide hover:gap-3 transition-all duration-300"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Learn More
              <span>&rarr;</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
