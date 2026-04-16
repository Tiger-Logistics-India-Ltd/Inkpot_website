import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MissionStrip from "@/components/MissionStrip";
import Programmes from "@/components/Programmes";
import FeaturedEvent from "@/components/FeaturedEvent";
import ConclaveStrip from "@/components/ConclaveStrip";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <MissionStrip />
      <Programmes />
      <FeaturedEvent />
      <ConclaveStrip />
      <Footer />
    </main>
  );
}
