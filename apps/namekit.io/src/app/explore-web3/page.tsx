import { type NextPage, type Metadata } from "next";
import Image from "next/image";
import { SkiffLogoText } from "@/components/atoms/icons/explore-web3-lp/skiff-logo-text";
import { NamestoneLogo } from "@/components/atoms/icons/explore-web3-lp/namestone-logo";
import BitcoinLogo from "@/components/atoms/icons/explore-web3-lp/bitcoin-logo";
import { EthLogo } from "@/components/atoms/icons/explore-web3-lp/eth-logo";
import DogecoinLogo from "@/components/atoms/icons/explore-web3-lp/dogecoin-logo";
import { SolanaLogo } from "@/components/atoms/icons/explore-web3-lp/solana-logo";
import { DogecoinText } from "@/components/atoms/icons/explore-web3-lp/dogecoin-text";
import { PayLogo } from "@/components/atoms/icons/explore-web3-lp/pay-logo";
import { MirrorIcon } from "@/components/atoms/icons/explore-web3-lp/mirror-icon";
import { HeroicSection } from "@/components/molecules/heroic-section";
import { SocialMessagingSection } from "@/components/molecules/social-messaging-section";
import { ExploreWeb3ProductSection } from "@/components/organisms/explore-web3-product-section";
import { MetaverseSection } from "@/components/molecules/metaverse-section";
import { BuySellSection } from "@/components/molecules/buy-sell-section";
import { IdentitySection } from "@/components/molecules/identity-section";
import { Web3WebsiteSection } from "@/components/molecules/web3-website-section";
import { PortableIdentitySection } from "@/components/molecules/portable-identity-section";

const title = "Explore Web3 - Explore the Exciting World of Web3";
const description =
  "Explore many of the fun and useful ways to make use of your web3 identity powered by ENS.";

export const metadata: Metadata = {
  title: "Explore Web3 - Explore the Exciting World of Web3",
  description:
    "Explore many of the fun and useful ways to make use of your web3 identity powered by ENS.",
  keywords: ["ens", "web3", "eth", "dweb", "dapp", "namekit"],
  openGraph: {
    title,
    description,
    images: [
      {
        url: "/images/explore-web3/og-image.png",
        alt: "Explore Web3 - Explore the Exciting World of Web3",
      },
    ],
  },
  twitter: {
    title,
    description,
    images: ["/images/explore-web3/og-image-twitter.png"],
  },
};

const ExploreWeb3: NextPage = () => {
  return (
    // <div id={SCROLL_TOP_ID}>
    <div>
      <HeroicSection />
      <SocialMessagingSection id="target-section" />
      <ExploreWeb3ProductSection
        key={4}
        title="Publish a web3 blog"
        description="Publish stories directly to the decentralized web, making the blogs
          live forever and be free of censorship."
        gradient="linear-gradient(#007AFF, #2D91FF)"
        icon={<MirrorIcon className="" />}
        image={
          <Image
            className="h-auto"
            width={710}
            height={480}
            alt="mirror"
            src={"/images/explore-web3/Illustration-mirror.png"}
          />
        }
        buttonUrl="https://mirror.xyz/"
      />
      <MetaverseSection />
      <ExploreWeb3ProductSection
        key={3}
        title="Privacy-first end-to-end encrypted email."
        description="End-to-end encrypted email, calendar, documents, and files that give you the power to communicate freely."
        gradient="linear-gradient(96deg, #EF5A3C 0%, #FB795F 100%)"
        patternStyle="opacity-[.03]"
        icon={<SkiffLogoText />}
        image={
          <Image
            className="h-auto"
            width={710}
            height={480}
            alt="mirror"
            src={"/images/explore-web3/Illustration-skiff.png"}
          />
        }
        buttonUrl="https://skiff.com/"
      />
      <Web3WebsiteSection />
      <ExploreWeb3ProductSection
        title="Get a secure Web3 mobile number"
        description="The world's first Web3 Mobile Number securely bridging your ENS name and mobile number to 5.5 billion existing mobile subscribers!"
        descriptionStyle="text-gray-400"
        gradient="linear-gradient(95deg, #000 0%, #0A0A0A 100%)"
        buttonGradient="linear-gradient(95deg, #6A45D4 0%, #CF259B 100%)"
        icon={
          <Image
            width={145}
            height={40}
            alt="Enum Logo"
            src={"/images/explore-web3/3num-logo.svg"}
          />
        }
        image={
          <Image
            className="h-auto"
            width={710}
            height={480}
            alt="mirror"
            src={"/images/explore-web3/Illustration-w3num.png"}
          />
        }
        imageStyle="items-end"
        patternStyle="opacity-100"
        buttonUrl="https://www.3num.co/"
      />
      <BuySellSection />
      <ExploreWeb3ProductSection
        key={2}
        title="Build your community with subnames"
        description="Reward your community, generate revenue, and enhance your brand with ENS subdomains."
        gradient="linear-gradient(96deg, #FDF3EA 0%, #FDF3EA 100%)"
        patternStyle="opacity-[.029]"
        buttonGradient="linear-gradient(95deg, #FF8B37 0%, #FF462A 100%)"
        icon={<NamestoneLogo />}
        image={
          <Image
            className="h-auto"
            width={710}
            height={480}
            alt="mirror"
            src={"/images/explore-web3/Illustration-namestone.png"}
          />
        }
        titleStyle="text-black"
        descriptionStyle="text-gray-500"
        buttonUrl="https://namestone.xyz/"
      />
      <IdentitySection />
      <ExploreWeb3ProductSection
        title="Unlock the future of finance with a self-custodial Visa debit card"
        description="Personalize your card with your ENS name. Spend crypto like you spend cash, anywhere Visa is accepted."
        gradient="linear-gradient(95deg, #FFE 0%, #FAFAF9 100%)"
        buttonGradient="linear-gradient(95deg, #D0DE69 0%, #D0DE69 100%)"
        patternStyle="opacity-[.029]"
        titleStyle="text-black"
        descriptionStyle="text-gray-500"
        buttonStyle="text-black bg-[#D0DE69]"
        icon={<PayLogo className="" />}
        image={
          <Image
            className="h-auto"
            width={710}
            height={480}
            alt="mirror"
            src={"/images/explore-web3/Illustration-pay.png"}
          />
        }
        buttonUrl="https://gnosispay.com/"
      />
      <PortableIdentitySection />
      <ExploreWeb3ProductSection
        title="Receive payments in 100+ cryptocurrencies"
        description="Make sending and receiving crypto simple. Replace long, complicated wallet addresses with a single easy-to-read name."
        afterDescription="Just tell others to send to yourname.eth. It's as easy as that!"
        gradient="linear-gradient(95deg, #FFF 0%, #FFF 100%)"
        titleStyle="text-black"
        descriptionStyle="text-gray-500"
        showButton={false}
        showPattern={false}
        icon={
          <div className="flex gap-[24px] items-center ">
            <EthLogo />
            <BitcoinLogo />
            <SolanaLogo />
            <div className="inline-flex gap-[7px] items-center flex-shrink min-w-0">
              <DogecoinLogo className="flex-shrink" />
              <DogecoinText className="flex-shrink" />
            </div>
          </div>
        }
        image={
          <Image
            className="h-auto"
            width={710}
            height={480}
            alt="mirror"
            src={"/images/explore-web3/Illustration-cripto.png"}
          />
        }
      />
    </div>
  );
};

export default ExploreWeb3;
