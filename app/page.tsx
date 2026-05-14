'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutBelief from "@/components/AboutBelief";
import FeaturedEvent from "@/components/FeaturedEvent";
import OurExperiences from "@/components/OurExperiences";
import OurExperiencesV2 from "@/components/OurExperiencesV2";
import MediaCoverage from "@/components/MediaCoverage";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-white">
        <Hero />
        <SectionWrapper><AboutBelief /></SectionWrapper>
        <SectionWrapper><FeaturedEvent /></SectionWrapper>
        <OurExperiences />
        
        <SectionWrapper><MediaCoverage /></SectionWrapper>
        <SectionWrapper><Testimonials /></SectionWrapper>
        <div style={{ height: "56px" }} />
        <SectionWrapper><Newsletter /></SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
