import { CoinbaseWalletLogo } from "@/components/atoms/icons/explore-web3-lp/coinbase-wallet-logo";
import { ExploreWeb3CardsSection } from "@/components/organisms/explore-web3-cards-section";
import Image from "next/image";

export const PortableIdentitySection = () => {
  return (
    <ExploreWeb3CardsSection
      title="Log in across Web3"
      subtitle="Log in securely to the decentralized web in just a few clicks. Your ENS identity is portable across hundreds of web3 sites and apps."
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
              d="M14.9846 15.604C13.8434 14.0979 12.0353 13.125 10 13.125C7.96467 13.125 6.15658 14.0979 5.01539 15.604M14.9846 15.604C16.5279 14.2303 17.5 12.2287 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 12.2287 3.47208 14.2303 5.01539 15.604M14.9846 15.604C13.6596 16.7834 11.9135 17.5 10 17.5C8.08653 17.5 6.34042 16.7834 5.01539 15.604M12.5 8.125C12.5 9.50571 11.3807 10.625 10 10.625C8.61929 10.625 7.5 9.50571 7.5 8.125C7.5 6.74429 8.61929 5.625 10 5.625C11.3807 5.625 12.5 6.74429 12.5 8.125Z"
              stroke="#808080"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Portable Identity",
      }}
      apps={[
        {
          title: (
            <Image
              src={"/images/explore-web3/rainbow-logo.svg"}
              width={151}
              height={36}
              alt="RainbowKit logo"
            />
          ),
          description:
            "Rainbow is a fun, simple, and secure way to get started with crypto and explore the new world of Ethereum.",
          illustration: (
            <Image
              width={518}
              height={140}
              alt="rainbow2"
              src={"/images/explore-web3/Illustration-rainbow2.png"}
            />
          ),
          gradient: "#FBF8FF",
          url: "https://rainbow.me/",
        },
        {
          title: <CoinbaseWalletLogo />,
          description:
            "Your key to the world of crypto. Store and manage all of your crypto, NFTs, and multiple wallets in one place. Coinbase Wallet is a self-custody wallet.",
          illustration: (
            <Image
              width={518}
              height={140}
              alt="coinbase"
              src={"/images/explore-web3/Illustration-coinbasewallet.png"}
            />
          ),
          gradient: "#F4F6FF",
          url: "https://www.coinbase.com/wallet",
        },
      ]}
    />
  );
};
