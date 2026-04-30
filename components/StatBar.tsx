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
    <section ref={ref} className="bg-[#0A0A0A] py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center py-8 px-4 ${
                i < stats.length - 1
                  ? "md:border-r md:border-[rgba(201,168,76,0.2)]"
                  : ""
              } ${
                i < 2
                  ? "border-b md:border-b-0 border-[rgba(201,168,76,0.2)]"
                  : ""
              }`}
            >
              <span
                className="text-[#C9A84C] text-5xl md:text-6xl lg:text-7xl mb-3"
                style={{ fontFamily: "EB Garamond, serif" }}
              >
                {stat.isNumber ? (
                  <AnimatedNumber value={stat.value} inView={inView} />
                ) : (
                  stat.value
                )}
              </span>
              <span
                className="text-[#F5F0E8]/50 text-xs md:text-sm tracking-wide"
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
