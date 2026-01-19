"use client";

import {
  BuildFutureSection,
  BuildUiSection,
  GetYourWeb3NameSection,
  HeroSection,
  IntroducingNamekit,
  ServicesSection,
  TheVisionSection,
} from "@/components/organisms";
import { useEffect } from "react";

export const NameKitPage = () => {
  // Add debugging in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const buttons = document.querySelectorAll("button button");
      if (buttons.length > 0) {
        console.error("Found nested buttons:", buttons);
        console.error(
          "Parent elements:",
          Array.from(buttons).map((b) => b.parentElement),
        );
      }
    }
  }, []);

  return (
    <div>
      <HeroSection />
      <TheVisionSection />
      <IntroducingNamekit />
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
