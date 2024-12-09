import { DecentralandTitleIcon } from "@/components/atoms/icons/explore-web3-lp/decentraland-title-icon";
import { PhilandLogo } from "@/components/atoms/icons/explore-web3-lp/philand-logo";
import { ExploreWeb3CardsSection } from "@/components/organisms/explore-web3-cards-section";
import Image from "next/image";

export const MetaverseSection = () => {
  return (
    <ExploreWeb3CardsSection
      title="Join a Community of Creators and Explorers"
      subtitle="Virtual social worlds are home to a vibrant community hosting daily events, ranging from parties, art exhibitions, fashion shows, music festivals."
      label={{
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5 6.25L15.625 5.15625M17.5 6.25V8.125M17.5 6.25L15.625 7.34375M2.5 6.25L4.375 5.15625M2.5 6.25L4.375 7.34375M2.5 6.25V8.125M10 10.625L11.875 9.53125M10 10.625L8.125 9.53125M10 10.625V12.5M10 18.125L11.875 17.0312M10 18.125V16.25M10 18.125L8.125 17.0312M8.125 2.96875L10 1.875L11.875 2.96875M17.5 11.875V13.75L15.625 14.8438M4.375 14.8438L2.5 13.75V11.875"
              stroke="#808080"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Metaverse",
      }}
      cardSmall={false}
      apps={[
        {
          title: <DecentralandTitleIcon />,
          description:
            "Become the owner of your own personal space in the metaverse, perfect for hosting events, showcasing your work, and more.",
          illustration: (
            <Image
              width={518}
              height={140}
              alt="decentraland"
              src={"/images/explore-web3/Illustration-decentraland.png"}
            />
          ),
          gradient: "#FFF3F5",
          url: "https://decentraland.org/",
        },
        {
          title: <PhilandLogo />,
          description:
            "Build your own web3 cities as you complete new and exciting Quests. Any owner of a .eth ENS name gets rewarded with free land upon registration.",
          illustration: (
            <Image
              width={518}
              height={140}
              alt="philand"
              src={"/images/explore-web3/Illustration-philand.png"}
            />
          ),
          gradient: "#F4F4FF",
          url: "https://philand.xyz/",
        },
      ]}
    />
  );
};
