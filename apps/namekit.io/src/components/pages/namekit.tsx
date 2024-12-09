"use client";

import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";
import {
  BuildFutureSection,
  BuildUiSection,
  GetYourWeb3NameSection,
  HeroSection,
  ServicesSection,
  TheVisionSection,
} from "@/components/organisms";

export const NameKitPage = () => {
  const calApiInitialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !calApiInitialized.current) {
      calApiInitialized.current = true;

      const initCal = async () => {
        try {
          const cal = await getCalApi();
          cal("ui", {
            cssVarsPerTheme: {
              light: {
                "--brand-color": "#000000",
              },
              dark: {
                "--brand-color": "#000000",
              },
            },
            hideEventTypeDetails: false,
            layout: "month_view",
          });
        } catch (error) {
          console.error("Failed to initialize Cal.com:", error);
        }
      };

      initCal();
    }
  }, []);

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
