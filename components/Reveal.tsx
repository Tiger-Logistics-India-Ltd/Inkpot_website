"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  amount?: number;
}

export default function Reveal({
  children,
  delay = 0,
  y = 56,
  duration = 0.8,
  className,
  style,
  amount = 0.12,
}: RevealProps) {
  return (
    <motion.div
      initial={{ y, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 20,
        delay,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
