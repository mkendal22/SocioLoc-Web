import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Showcase } from "@/components/Showcase";
import { Business } from "@/components/Business";
import { Faq } from "@/components/Faq";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Features />
        <Showcase />
        <HowItWorks />
        <Business />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
