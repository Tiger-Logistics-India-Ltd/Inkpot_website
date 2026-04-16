"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[560px] w-full flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-[72vw] max-w-2xl md:w-[55vw] lg:w-[45vw]"
      >
        <Image
          src="/images/Inkpot/Inkpot_600x400%20px.svg"
          alt="Inkpot India"
          width={600}
          height={400}
          priority
          className="w-full h-auto"
        />
      </motion.div>
    </section>
  );
}
