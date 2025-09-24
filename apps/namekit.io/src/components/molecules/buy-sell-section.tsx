import { OpenseaLogo } from "@/components/atoms/icons/explore-web3-lp/opensea-logo";
import { ExploreWeb3CardsSection } from "@/components/organisms/explore-web3-cards-section";
import Image from "next/image";

export const BuySellSection = () => {
  return (
    <ExploreWeb3CardsSection
      title="Collect a fortune in names"
      subtitle="ENS names are NFTs that you can buy and sell at whatever price you like. Find hidden gems others overlooked and try to sell for big profits."
      label={{
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M6.25 11.875V13.75M8.75 10V13.75M11.25 8.125V13.75M13.75 6.25V13.75M5 16.875H15C16.0355 16.875 16.875 16.0355 16.875 15V5C16.875 3.96447 16.0355 3.125 15 3.125H5C3.96447 3.125 3.125 3.96447 3.125 5V15C3.125 16.0355 3.96447 16.875 5 16.875Z"
              stroke="#808080"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Buy & sell",
      }}
      apps={[
        {
          title: <OpenseaLogo />,
          description:
            "World's first and largest web3 marketplace for NFTs and crypto collectibles. Browse, create, buy, sell, and auction NFTs using OpenSea today.",
          illustration: (
            <Image
              width={518}
              height={140}
              alt="opensea"
              src={"/images/explore-web3/Illustration-opensea.png"}
            />
          ),
          gradient: "#F0F7FF",
          url: "https://opensea.io/",
        },
      ]}
    />
  );
};
