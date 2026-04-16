"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
  { value: "4", label: "Unique Cultural IPs", isNumber: true },
  { value: "2019", label: "Year of Our First Conclave", isNumber: true },
  { value: "UNESCO", label: "Heritage Partnerships", isNumber: false },
  { value: "∞", label: "Stories Yet Untold", isNumber: false },
];

function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toString());
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (inView) {
      const target = parseInt(value);
      const controls = animate(count, target, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [inView, value, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function StatBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#111111]/8"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center py-10 px-6"
            >
              <span
                className="text-[#111111] text-5xl md:text-6xl mb-3"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {stat.isNumber ? (
                  <AnimatedNumber value={stat.value} inView={inView} />
                ) : (
                  stat.value
                )}
              </span>
              <span
                className="text-[#111111]/40 text-xs tracking-wide leading-snug max-w-[100px]"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
