import { Metadata } from "next";
import {
  ChecksSection,
  DevelopersSection,
  ExploreTheEcosystemSection,
  Hero,
  NewExitSection,
  RoadMap,
  ComingSoonSections,
  ReadySections,
} from "@/components/organisms";
import "@namehash/namekit-react/styles.css";
import "@namehash/nameguard-react/styles.css";
import { MobileSectionDivider } from "@/components/atoms";

export const metadata: Metadata = {
  title: "NameGuard - Protect your community with NameGuard for ENS",
  keywords: ["nameguard", "normalization", "ens", "web3", "eth"],
};

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
      <RoadMap />
      <NewExitSection />
    </>
  );
}
