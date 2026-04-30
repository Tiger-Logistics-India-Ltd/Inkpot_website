"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function FeaturedEvent() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="events" className="bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]"
        >
          {/* Image — top on mobile */}
          <div className="relative h-[350px] lg:h-auto lg:order-2 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80"
              alt="Qutub Minar at dusk"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent" />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 lg:py-24 lg:order-1">
            <p
              className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Upcoming · Songs of the Stone
            </p>
            <h2
              className="text-3xl md:text-5xl text-[#F5F0E8] leading-tight mb-6"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              An Evening at
              <br />
              Qutub Minar.
            </h2>
            <p
              className="text-[#F5F0E8]/70 text-sm md:text-base leading-relaxed max-w-lg mb-8"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Presented in association with the Delhi Government and the
              Archaeological Survey of India. Space becomes stage. Arches become
              resonance. Stone becomes story.
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 mb-8 text-[#F5F0E8]/50 text-sm">
              <span className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#C9A84C]"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Qutub Minar, New Delhi
              </span>
              <span className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#C9A84C]"
                >
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
              className="inline-flex items-center gap-2 text-[#C9A84C] text-sm tracking-wide hover:gap-3 transition-all duration-300"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Learn More
              <span>→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
