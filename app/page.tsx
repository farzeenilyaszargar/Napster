import FAQ from "@/components/faq";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import LowerHero from "@/components/lowerHero";
import Navbar from "@/components/navbar";
import Testimonials from "@/components/testimonials";
import Trust from "@/components/trust";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Navbar /> 
      <Hero />
      <Trust />
      <Features />
      {/* <Testimonials /> */}
      <FAQ />
      <LowerHero />
      <Footer />
    </div>
  );
}
