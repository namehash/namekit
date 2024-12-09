import { ConsoleLogo } from "@/components/atoms/icons/explore-web3-lp/console-logo";
import { ConverseLogo } from "@/components/atoms/icons/explore-web3-lp/converse-logo";
import JamIcon from "@/components/atoms/icons/explore-web3-lp/jam-icon";
import { OrbIcon } from "@/components/atoms/icons/explore-web3-lp/orb-icon";
import { TribesIcon } from "@/components/atoms/icons/explore-web3-lp/tribes-icon";
import { WarpcastIcon } from "@/components/atoms/icons/explore-web3-lp/warpcast-icon";
import { ExploreWeb3CardsSection } from "@/components/organisms/explore-web3-cards-section";
import Image from "next/image";

export const SocialMessagingSection = ({ ...props }) => {
  return (
    <ExploreWeb3CardsSection
      title="Meet your new community"
      subtitle="The web2 era was controlled by closed, centralized companies. It's time for a social media and messaging renaissance. Join these exciting alternatives to traditional Web2 where you own 100% of your content and conversations. "
      {...props}
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
              d="M8.61703 13.1998C8.04294 13.1503 7.46192 13.125 6.875 13.125H6.25C4.17893 13.125 2.5 11.4461 2.5 9.375C2.5 7.30393 4.17893 5.625 6.25 5.625H6.875C7.46192 5.625 8.04294 5.59972 8.61703 5.55018M8.61703 13.1998C8.82774 14.0012 9.1031 14.7764 9.43719 15.5195C9.64341 15.9782 9.48685 16.5273 9.05134 16.7787L8.50441 17.0945C8.04492 17.3598 7.45466 17.1921 7.23201 16.7106C6.70983 15.5811 6.30451 14.3866 6.03155 13.1425M8.61703 13.1998C8.29598 11.9787 8.125 10.6968 8.125 9.375C8.125 8.05316 8.29598 6.77125 8.61703 5.55018M8.61703 13.1998C11.25 13.427 13.737 14.1643 15.9789 15.3124M8.61703 5.55018C11.25 5.323 13.737 4.58569 15.9789 3.43757M15.9789 3.43757C15.8808 3.12162 15.7751 2.80903 15.662 2.5M15.9789 3.43757C16.4247 4.87356 16.7131 6.37885 16.8238 7.93326M15.9789 15.3124C15.8808 15.6284 15.7751 15.941 15.662 16.25M15.9789 15.3124C16.4247 13.8764 16.7131 12.3711 16.8238 10.8167M16.8238 7.93326C17.237 8.2772 17.5 8.79539 17.5 9.375C17.5 9.95461 17.237 10.4728 16.8238 10.8167M16.8238 7.93326C16.8578 8.40942 16.875 8.8902 16.875 9.375C16.875 9.8598 16.8578 10.3406 16.8238 10.8167"
              stroke="#808080"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Social & Messaging",
      }}
      cardSmall={true}
      apps={[
        {
          title: (
            <div className="inline-flex items-center">
              <div className="rounded-[8px] px-2 py-[10.5px] bg-[#472A91]">
                <WarpcastIcon />
              </div>

              <h2 className="text-black text-xl font-bold leading-[32px] ml-2">
                WarpCast
              </h2>
            </div>
          ),
          description:
            "Warpcast is a client for Farcaster, a new type of decentralized social network.",
          illustration: (
            <Image
              width={400}
              height={140}
              alt="warpcast"
              src={"/images/explore-web3/illustration-warpcast.png"}
            />
          ),
          gradient: "#F5F1FF",
          url: "https://warpcast.com/",
        },
        {
          title: (
            <div className="inline-flex items-center">
              <ConverseLogo />
              <h2 className="text-black text-xl font-bold leading-[32px] ml-2">
                Converse
              </h2>
            </div>
          ),
          description:
            "The fastest and most reliable end-to-end encrypted XMTP client. Only you can access your messages.",
          illustration: (
            <Image
              width={400}
              height={140}
              alt="converse"
              src={"/images/explore-web3/Illustration-converse.png"}
            />
          ),
          gradient: "#FFF6F4",
          url: "https://getconverse.app/",
        },
        {
          title: <JamIcon />,
          description:
            "Browse a Live Feed of every cast. Keep up with all the Trending News.",
          illustration: (
            <Image
              width={400}
              height={140}
              alt="jam"
              src={"/images/explore-web3/Illustration-jam.png"}
            />
          ),
          gradient: "#FEE2FF",
          url: "https://jam.so/",
        },
        {
          title: (
            <div className="inline-flex items-center">
              <TribesIcon />
              <h2 className="text-black text-xl leading-[32px] ml-2">TRIBES</h2>
            </div>
          ),
          description:
            "Chat and transact, get involved in web3 communities, and view rich wallet profiles.",
          illustration: (
            <Image
              width={400}
              height={140}
              alt="tribes"
              src={"/images/explore-web3/Illustration-tribes.png"}
            />
          ),
          gradient: "#F3F3F3",
          url: "https://www.tribes.xyz/",
        },
        {
          title: <ConsoleLogo />,
          description:
            "Ditch Discord. Come to Console. Be Happy. Console is a community app built for Web3.",
          illustration: (
            <Image
              width={400}
              height={140}
              alt="console"
              src={"/images/explore-web3/Illustration-console.png"}
            />
          ),
          gradient: "#F1FDFF",
          url: "https://www.console.xyz/",
        },
        {
          title: <OrbIcon />,
          description:
            "A community-focused social app for people to connect, interact, and transact in their daily lives on web3.",
          illustration: (
            <Image
              width={400}
              height={140}
              alt="orb"
              src={"/images/explore-web3/Illustration-orb.png"}
            />
          ),
          gradient: "#F5F2FF",
          url: "https://www.orb.ac/",
        },
      ]}
    />
  );
};
