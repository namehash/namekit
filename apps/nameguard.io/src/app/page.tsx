import {
  ChecksSection,
  DevelopersSection,
  ExploreTheEcosystemSection,
  Hero,
  NewExitSection,
  // RoadMap,
  ComingSoonSections,
  ReadySections,
} from "@/components/organisms";
import { MobileSectionDivider } from "@/components/atoms";

export default function Home() {
  return (
    <>
      <Hero />
      <ReadySections />
      <ComingSoonSections />
      <ChecksSection />
      <MobileSectionDivider />
      <DevelopersSection />
      <MobileSectionDivider />
      <ExploreTheEcosystemSection />
      {/* <RoadMap /> */}
      <NewExitSection />
    </>
  );
}
