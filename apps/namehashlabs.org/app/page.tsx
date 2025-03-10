import {
  HeroSection,
  OurPrinciplesSection,
  ProductsSection,
  TeamSection,
} from "@/components/2 - molecules";
import { FinancialSupportSection } from "@/components/2 - molecules/financial-support-section";
import { OurSuportersSection } from "@/components/2 - molecules/our-supporters-section";
import { TestimonialsSection } from "@/components/2 - molecules/testimonials-section";

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
