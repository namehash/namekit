// import { Layout } from "./layout";
// import { SEO } from "../01-atoms/seo";
// import { GetYourWeb3NameSection } from "../02-molecules";
// import { BuildUiSection, HeroSection } from "../03-organisms";
// import { ServicesSection } from "../03-organisms/namekit-landing-page/services-section";
// import { BuildFutureSection } from "../03-organisms/namekit-landing-page/building-future-section";
// import { SCROLL_TOP_ID } from "../../lib/client/constants";
// import { TheVisionSection } from "../03-organisms/namekit-landing-page/the-vision-section";
// import { getCalApi } from "@calcom/embed-react";
// import { useEffect } from "react";

import { BuildUiSection } from "../organisms/build-ui-section";
import { BuildFutureSection } from "../organisms/building-future-section";
import { GetYourWeb3NameSection } from "../organisms/get-your-web3-name-section";
import { HeroSection } from "../organisms/hero-section";
import { ServicesSection } from "../organisms/services-section";
import { TheVisionSection } from "../organisms/the-vision-section";

export const NameKitPage = () => {
  // useEffect(() => {
  //   (async function () {
  //     const cal = await getCalApi();
  //     cal("ui", {
  //       cssVarsPerTheme: {
  //         light: {
  //           "--brand-color": "#000000",
  //         },
  //         dark: {
  //           "--brand-color": "#000000",
  //         },
  //       },
  //       hideEventTypeDetails: false,
  //       layout: "month_view",
  //     });
  //   })();
  // }, []);

  return (
    <div>
      {/* <Layout> */}
      <HeroSection />
      <TheVisionSection />
      <BuildUiSection />
      <ServicesSection />
      <BuildFutureSection />
      {/* <RoadMap /> */}
      <GetYourWeb3NameSection
        title="Ready to get started?"
        description="Our team is standing by to answer your questions and find the right solution for you"
        buttonText="Schedule a call"
      />
      {/* </Layout> */}
    </div>
  );
};
