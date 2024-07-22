import { Balancer } from "react-wrap-balancer";

export const ColoredText = () => {
  return (
    <section
      className="lg:px-[110px] px-5 py-[108px] border-b border-gray-200 w-full"
      id="ensOnboardingSection"
    >
      <div
        role="text"
        style={{
          background: "linear-gradient(180deg, #289FB9 0%, #8740A0 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
        className="text-transparent lg:text-4xl lg:leading-[52px] text-[24px] leading-[32px] font-semibold text-center max-w-[1280px] m-auto"
      >
        <Balancer>
          We bring ENS onboarding directly into wallets and dApps that{" "}
          <span className="whitespace-nowrap">millions of people</span> use
          every day.
        </Balancer>
      </div>
    </section>
  );
};
