"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function CleanlinessProject() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Image */}
          <div className="relative h-[350px] lg:h-[480px] overflow-hidden rounded-2xl">
            <Image
              src="/images/heritage%20cleaning/heroposter.png"
              alt="Heritage Cleanliness Drive poster"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Text */}
          <div>
            <p
              className="text-[#1A1A1A]/50 text-xs tracking-[0.25em] uppercase mb-4"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Community Initiative
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#1A1A1A] leading-tight mb-5"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Give Your Hands
              <br />
              to History.
            </h2>
            <p
              className="text-[#1A1A1A]/60 text-sm md:text-base leading-relaxed mb-6 max-w-lg"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Developed in association with the Delhi Government and the
              Archaeological Survey of India, this monthly initiative brings
              volunteers to a heritage site every last Sunday. You don&rsquo;t
              just clean — you listen to the stories of the space you&rsquo;re
              tending to.
            </p>

            {/* Highlight Box */}
            <div className="border border-[#1A1A1A]/15 bg-white/50 rounded-xl p-5 mb-6 max-w-md">
              <p
                className="text-[#1A1A1A] text-sm font-medium"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                First Drive: 26th April 2026
              </p>
              <p
                className="text-[#1A1A1A]/50 text-sm mt-1"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Mehrauli Archaeological Park, New Delhi
              </p>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#1A1A1A] text-sm font-medium tracking-wide hover:gap-3 transition-all duration-300"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Volunteer Now
              <span>→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
