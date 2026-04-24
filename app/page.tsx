import type { Metadata } from "next";
import FAQ from "@/components/faq";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import LowHero from "@/components/lowHero";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Nap CLI | AI CLI Tool for Coding and Automation",
  description:
    "Nap CLI is an AI CLI tool for developers to plan, execute, debug, and automate coding workflows directly from the terminal.",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center ">
      {/* seo play */}
      <h1 className="sr-only">Nap CLI is an AI CLI tool for coding automation in the terminal</h1>
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <LowHero />
      <Footer />
    </div>
  );
}
