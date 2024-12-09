import {
  BuildFutureSection,
  BuildUiSection,
  GetYourWeb3NameSection,
  HeroSection,
  ServicesSection,
  TheVisionSection,
} from "@/components/organisms";

export const NameKitPage = () => {
  return (
    <div>
      <HeroSection />
      <TheVisionSection />
      <BuildUiSection />
      <ServicesSection />
      <BuildFutureSection />
      <GetYourWeb3NameSection
        title="Ready to get started?"
        description="Our team is standing by to answer your questions and find the right solution for you"
        buttonText="Schedule a call"
      />
    </div>
  );
};
