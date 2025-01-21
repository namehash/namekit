// import { GithubIcon, IconLabel } from "../../01-atoms";
import { CommandLineIcon, PaintBrushIcon } from "@heroicons/react/24/solid";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import { Balancer } from "react-wrap-balancer";
import IconLabel from "../atoms/icon-label";
import { GithubIcon } from "../atoms";
import { Heading, Text } from "@namehash/namekit-react";

interface ItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Item = ({ icon, title, description }: ItemProps) => {
  return (
    <div className="flex flex-col items-start p-4 text-center py-4">
      <div className="p-2 border border-gray-300 rounded-full">{icon}</div>
      <Heading className="font-semibold" as="h5">
        {title}
      </Heading>

      <Text className="text-gray-500 leading-6 text-start text-sm mt-2">
        {description}
      </Text>
    </div>
  );
};

export const BuildFutureSection = () => {
  const items = [
    {
      icon: <GithubIcon className="w-5 h-5 text-gray-400" />,
      title: "Open Source Libraries",
      description:
        "Our public resources will establish a new bedrock of developer infrastructure to help catalyze the global growth and adoption of ENS.",
    },
    {
      icon: <CommandLineIcon className="w-5 h-5 text-gray-400" />,
      title: "Open APIs and SDKs",
      description:
        "Get ready for a full suite of powerful new developer tools and resources. Every element is meticulously crafted and designed to fuel the growth of ENS.",
    },
    {
      icon: <PaintBrushIcon className="w-5 h-5 text-gray-400" />,
      title: "Open UI Kits",
      description:
        "Designed to streamline your application’s use of ENS, our UI components, patterns, and elements will delight users and save you critical time when building.",
    },
  ];

  return (
    <section className="justify-center lg:py-20 py-10 px-5 lg:px-28 w-full flex flex-col items-center border-t border-gray-200">
      <div className="flex flex-col justify-center items-center gap-5 lg:mb-[88px] mb-5 max-w-[1216px]">
        <IconLabel
          title="In Progress"
          icon={<RocketLaunchIcon className="w-5 h-5 text-gray-500" />}
        />

        <Heading>What we&apos;re building</Heading>

        <Text className="text-gray-500 text-center text-lg">
          <Balancer>
            NameKit is currently in its alpha phase. Stay tuned for the beta
            where we will begin open sourcing everything! We&apos;ll soon be
            sharing all of NameKit with the global developer community.
          </Balancer>
        </Text>
      </div>
      <div className="grid lg:grid-cols-3 grid-cols-1 justify-items-center max-w-[1216px]">
        {items.map((item, index) => (
          <Item key={index} {...item} />
        ))}
      </div>
    </section>
  );
};
