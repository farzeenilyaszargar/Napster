import FAQ from "@/components/faq";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import LowHero from "@/components/lowHero";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center ">
      {/* seo play */}
      <h1 className="sr-only">Nap Is An AI CLI Tool For Coders To Code Without Any Problems</h1> 
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <LowHero />
      <Footer />
    </div>
  );
}
