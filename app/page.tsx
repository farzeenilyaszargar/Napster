import FAQ from "@/components/faq";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import LowHero from "@/components/lowHero";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <LowHero />
      <Footer />
    </div>
  );
}
