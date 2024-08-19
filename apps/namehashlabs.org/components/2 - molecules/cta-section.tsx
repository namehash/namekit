import { Balancer } from "react-wrap-balancer";
import { CalButton } from "../1 - atoms";

export const CTASection = () => {
  return (
    <section className="py-[50px] px-5  w-full flex items-center justify-center">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 place-items-center">
        {ctas.map((item) => {
          return (
            <Cta
              key={item.title}
              title={item.title}
              description={item.description}
              buttonStyle={item.buttonStyle}
              buttonText={item.buttonText}
              background={item.background}
              buttonUrl={item.buttonUrl}
            />
          );
        })}
      </div>
    </section>
  );
};

interface CtaProps {
  title: string;
  description: string;
  buttonText: string;
  buttonStyle: string;
  background: string;
  buttonUrl?: string;
}

const ctas: CtaProps[] = [
  {
    title: "Let’s chat",
    description:
      "NameHash Labs collaborates with teams across web3, and we’re always looking forward to meeting new frens.",
    buttonText: "Schedule a call",
    buttonStyle:
      "text-white bg-black hover:bg-gray-900 transition-colors duration-200",
    background:
      "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.00) 0%, #FFF 100%), linear-gradient(180deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)",
  },
  {
    title: "Join our team",
    description:
      "Work on leading open-source technologies for the ENS Protocol, and make an impact on the future of identity.",
    buttonText: "Open positions",
    buttonStyle:
      "border border-gray-200 bg-white hover:bg-gray-100 transition-colors duration-200",
    background:
      "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.00) 0%, #FFF 100%), linear-gradient(180deg, #FFAF00 10.85%, #2ED3C6 40.85%, #4C3FA0 70%, #F112D9 100%)",
    buttonUrl: "mailto:hello@namehashlabs.org",
  },
];

const Cta = ({
  title,
  description,
  buttonStyle,
  buttonText,
  background,
  buttonUrl,
}: CtaProps) => {
  return (
    <div className="py-[60px] xl:w-[588px] bg-transparent inline-flex items-center justify-center border border-gray-200 rounded-[8px] relative overflow-hidden">
      <div className="flex flex-col items-center justify-between h-full max-w-[508px] z-20">
        <div className="w-full">
          <h3 className="text-3xl leading-9 font-bold text-center">{title} </h3>
          <div
            role="text"
            className="text-gray-500 text-lg leading-8 font-normal mt-4 mb-6 text-center max-w-[508px] px-6"
          >
            <Balancer>{description}</Balancer>
          </div>
        </div>
        {buttonUrl ? (
          <a
            className={`text-base leading-6 font-medium px-[25px] py-[13px] rounded-[8px] ${buttonStyle}`}
            href={buttonUrl}
          >
            {buttonText}
          </a>
        ) : (
          <CalButton>{buttonText}</CalButton>
        )}
      </div>
      <div
        style={{
          opacity: "0.4",
          background: background,
        }}
        className="absolute bottom-0 left-0 w-full h-full translate-y-1/2"
      />
    </div>
  );
};
