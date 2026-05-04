'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutBelief from "@/components/AboutBelief";
import FeaturedEvent from "@/components/FeaturedEvent";
import OurExperiences from "@/components/OurExperiences";
import MediaCoverage from "@/components/MediaCoverage";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-[#FAF8F4]">
        <Hero />
        <AboutBelief />
        <FeaturedEvent />
        <OurExperiences />
        <MediaCoverage />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
