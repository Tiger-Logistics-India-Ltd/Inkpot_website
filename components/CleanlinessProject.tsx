"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function CleanlinessProject() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="relative py-28 md:py-36 overflow-hidden"
      style={{
        background: "#0D0D0D",
        backgroundImage:
          "radial-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Image */}
          <div className="relative h-[400px] lg:h-[560px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80"
              alt="Community volunteering at heritage site"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Text */}
          <div>
            <p
              className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Community Initiative
            </p>
            <h2
              className="text-3xl md:text-5xl text-[#F5F0E8] leading-tight mb-6"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              Give Your Hands
              <br />
              to History.
            </h2>
            <p
              className="text-[#F5F0E8]/70 text-sm md:text-base leading-relaxed mb-8 max-w-lg"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Developed in association with the Delhi Government and the
              Archaeological Survey of India, this monthly initiative brings
              volunteers to a heritage site every last Sunday. You don&rsquo;t
              just clean — you listen to the stories of the space you&rsquo;re
              tending to.
            </p>

            {/* Highlight Box */}
            <div className="border border-[rgba(201,168,76,0.4)] bg-[#111111] p-6 mb-8 max-w-md">
              <p
                className="text-[#C9A84C] text-sm font-medium"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                First Drive: 26th April 2026
              </p>
              <p
                className="text-[#F5F0E8]/60 text-sm mt-1"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Mehrauli Archaeological Park, New Delhi
              </p>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#C9A84C] text-sm tracking-wide hover:gap-3 transition-all duration-300"
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
