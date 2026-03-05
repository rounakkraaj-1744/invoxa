"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { BentoGrid } from "@/components/BentoGrid";
import { APIShowcase } from "@/components/APIShowcase";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <BentoGrid />
      <APIShowcase />
      <Pricing />
      <Footer />
    </main>
  );
}
