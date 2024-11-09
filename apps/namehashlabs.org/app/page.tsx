import {
  HeroSection,
  OurPrinciplesSection,
  ProductsSection,
  TeamSection,
} from "@/components/2 - molecules";
import { FinancialSupportSection } from "@/components/2 - molecules/financial-support-section";
import { IntroducingNamekit } from "@/components/2 - molecules/introducing-namekit";
import { OurSuportersSection } from "@/components/2 - molecules/our-supporters-section";
import { TestimonialsSection } from "@/components/2 - molecules/testimonials-section";
import { TheVisionSection } from "@/components/2 - molecules/the-vision-section";

export default function Page() {
  return (
    <main className="w-full flex flex-col items-center justify-between">
      <HeroSection />
      <TheVisionSection />
      <IntroducingNamekit />
      <ProductsSection />
      <OurSuportersSection />
      <TestimonialsSection />
      <OurPrinciplesSection />
      <TeamSection />
      <FinancialSupportSection />
    </main>
  );
}
