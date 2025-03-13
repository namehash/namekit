import {
  HeroSection,
  OurPrinciplesSection,
  ProductsSection,
  TeamSection,
} from "@/components/2 - molecules";
import { FinancialSupportSection } from "@/components/2 - molecules/financial-support-section";
import { TestimonialsSection } from "@/components/2 - molecules/testimonials-section";
import { OurSuportersSection } from "@/components/3 - organisms/our-supporters/OurSuportersSection";

export default function Page() {
  return (
    <main className="w-full flex flex-col items-center justify-between">
      <HeroSection />
      <ProductsSection />
      <OurSuportersSection />
      <TestimonialsSection />
      <OurPrinciplesSection />
      <TeamSection />
      <FinancialSupportSection />
    </main>
  );
}
