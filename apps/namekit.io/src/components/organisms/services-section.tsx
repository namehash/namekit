import Balancer from "react-wrap-balancer";
import React from "react";
import cc from "classcat";
import {
  ArrowPathIcon,
  ChartBarSquareIcon,
  LightBulbIcon,
  MegaphoneIcon,
  PaintBrushIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  ChartBarIcon,
  ClockIcon,
  HeartIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { ExternalLinkIcon } from "../atoms/icons/external-link-icon";
import { EnsVisionIcon } from "../atoms/icons/ensvision-icon";
import OpenSeaIcon from "../atoms/icons/opensea-icon";
import { X2y2Icon } from "../atoms/icons/x2y2-icon";
import { LooksRareIcon } from "../atoms/icons/looksrare-icon";
import LensProtocolLogo from "../atoms/icons/lens-protocol-logo";
import FarcasterLogo from "../atoms/icons/farcaster-logo";
import EfpLogo from "../atoms/icons/efp-logo";
import XmtpLogo from "../atoms/icons/xmtp-logo";
import WalletConnectLogo from "../atoms/icons/wallet-connect-logo";
import PushLogo from "../atoms/icons/push-logo";
import StabilityAiLogo from "../atoms/icons/stability-ai-logo";
import UnrugableLogo from "../atoms/icons/unruggable-logo";
import NamespaceLogo from "../atoms/icons/namespace-logo";
import RaribleIcon from "../atoms/icons/rarible-icon";
import CoinbaseNftIcon from "../atoms/icons/coinbase-nft-icon";
import NamestoneLogo from "../atoms/icons/namestone-logo";
import { Button, Heading, Link, Text } from "@namehash/namekit-react";

interface ServiceProps {
  label: {
    icon: React.ReactElement;
    title: string;
  };
  title: string;
  subtitle: React.ReactNode;
  postSubtitle?: React.ReactElement;
  illustration: React.ReactElement;
  gradient?: React.ReactElement;
  isInverted?: boolean;
  buttonUrl?: string;
  itemsCenter?: boolean;
  additionalContent?: React.ReactElement;
}

export const Service = ({
  label,
  title,
  subtitle,
  postSubtitle,
  illustration,
  gradient,
  isInverted,
  buttonUrl,
  additionalContent,
  itemsCenter = true,
}: ServiceProps) => {
  return (
    <section
      className={cc([
        "lg:py-20 py-10 lg:px-[120px] px-5 w-full flex items-center justify-center",
      ])}
    >
      <div
        className={cc([
          "w-full flex flex-col lg:flex-row max-w-[1216px]",
          {
            "lg:flex-row-reverse": isInverted,
          },
          {
            "items-center": itemsCenter,
          },
        ])}
      >
        <div className="lg:w-1/2 w-full flex items-start justify-center font-sans">
          <div className="flex-col inline-flex gap-5 lg:max-w-[560px]">
            <div className="justify-center lg:justify-start flex">
              <div className="gap-2 bg-black inline-flex items-center bg-opacity-5 px-4 py-2 rounded-[20px]">
                {label.icon}
                <Text>{label.title}</Text>
              </div>
            </div>

            <Heading className="text-2xl g:text-4xl lg:text-start text-center">
              {title}
            </Heading>

            <Text className="text-lg text-gray-500 lg:text-start text-center pr-2">
              <Balancer>{subtitle}</Balancer>
            </Text>
            {postSubtitle && (
              <div className="w-full flex justify-center">{postSubtitle}</div>
            )}
            {buttonUrl && (
              <div className="w-full flex justify-center lg:justify-start">
                <Button className="" asChild>
                  <Link href={buttonUrl} target="_blank">
                    Learn more <ExternalLinkIcon className="ml-3" />
                  </Link>
                </Button>
              </div>
            )}
            {additionalContent && <>{additionalContent}</>}
          </div>
        </div>
        <div className="lg:w-1/2 w-full lg:mt-0 mt-5 relative flex items-center justify-center">
          {gradient}
          {illustration}
        </div>
      </div>
    </section>
  );
};

export const ServicesSection = () => {
  return (
    <>
      {services.map((service, index) => (
        <Service
          key={service.title}
          label={service.label}
          title={service.title}
          subtitle={service.subtitle}
          illustration={service.illustration}
          gradient={service.gradient}
          isInverted={index % 2 === 1}
          buttonUrl={service.buttonUrl}
          postSubtitle={service.postSubtitle}
          itemsCenter={service.itemsCenter}
          additionalContent={service.additionalContent}
        />
      ))}
    </>
  );
};

const EarnFutureComponent = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 w-full xl:max-w-[656px]">
        <div className="rounded-[12px] w-full border border-gray-200 py-4 px-5 flex flex-col mb-4 bg-white z-20">
          <div className="mb-3">
            <div className="p-2.5 rounded-full border border-gray-200 inline-flex justify-center items-center">
              <ShoppingCartIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <Heading as="h5">
            Craft your own unique premium pricing strategies
          </Heading>

          <Text className="text-sm text-gray-500">
            Offer unique value propositions for your community and be rewarded
            by setting price premiums above base name rates.
          </Text>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3 w-full xl:max-w-[656px]">
        <div className="rounded-[12px] w-full border border-gray-200 py-4 px-5 flex flex-col bg-white z-20">
          <div className="mb-3">
            <div className="p-2.5 rounded-full border border-gray-200 inline-flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle cx="10" cy="10" r="10" fill="#AFAFAF" />
                <path
                  d="M5.07325 6.03758C5.21136 5.77614 5.41176 5.55283 5.6582 5.38943L9.76098 2.5L5.558 9.51253C5.558 9.51253 5.1897 8.88617 5.04617 8.57026C4.86743 8.17266 4.77806 7.73965 4.78348 7.3012C4.78619 6.86274 4.88639 6.43246 5.07325 6.03758ZM3.38068 10.8769C3.42672 11.5468 3.61358 12.2004 3.93043 12.7914C4.24727 13.3824 4.68599 13.8998 5.21678 14.3056L9.75557 17.4973C9.75557 17.4973 6.91747 13.3687 4.5235 9.26198C4.28248 8.82898 4.11729 8.3524 4.04146 7.8622C4.00896 7.63889 4.00896 7.41285 4.04146 7.18954C3.97917 7.30665 3.85731 7.5463 3.85731 7.5463C3.61358 8.04739 3.44838 8.58115 3.36714 9.13126C3.31839 9.71133 3.32381 10.2968 3.38068 10.8769ZM14.9497 11.4325C14.8035 11.1166 14.4406 10.4902 14.4406 10.4902L10.243 17.5L14.3458 14.6106C14.5895 14.4472 14.7899 14.2239 14.9308 13.9624C15.1176 13.5675 15.2178 13.1373 15.2232 12.6988C15.2287 12.2631 15.1366 11.8273 14.9606 11.4297L14.9497 11.4325ZM16.6152 9.12309C16.5692 8.45316 16.3796 7.79956 16.0655 7.20861C15.7513 6.61765 15.3099 6.10022 14.7791 5.69444L10.2484 2.5C10.2484 2.5 13.0865 6.62854 15.4805 10.7353C15.7215 11.1683 15.884 11.6449 15.9598 12.1351C15.9923 12.3584 15.9923 12.5844 15.9598 12.8077C16.0221 12.6906 16.144 12.451 16.144 12.451C16.3877 11.9499 16.5529 11.4161 16.6342 10.866C16.6829 10.2832 16.6775 9.70044 16.6206 9.11765L16.6152 9.12309Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          <Heading className="mb-1" as="h5">
            Revenue sharing
          </Heading>

          <Text className="leading-6 text-sm text-gray-500">
            NameKit will automatically integrate with potential future ENS
            Referrer Programs.
          </Text>
        </div>
        <div className="rounded-[12px] w-full border border-gray-200 py-4 px-5 flex flex-col bg-white z-20">
          <div className="mb-3">
            <div className="p-2.5 rounded-full border border-gray-200 inline-flex justify-center items-center">
              <HeartIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <Heading className="mb-1" as="h5">
            Sell AI-generated avatars
          </Heading>

          <Text className="leading-6 text-sm text-gray-500">
            Customize the price of generating a tailored avatar for your users.
          </Text>
        </div>
        <div className="rounded-[12px] w-full border border-gray-200 py-4 px-5 flex flex-col bg-white z-20">
          <div className="mb-3">
            <div className="p-2.5 rounded-full border border-gray-200 inline-flex justify-center items-center">
              <ClockIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <Heading className="mb-1" as="h5">
            Automate name renewals{" "}
          </Heading>
          <Text className="leading-6 text-sm text-gray-500">
            Define customized price premiums for auto-renewal services.
          </Text>
        </div>
        <div className="rounded-[12px] w-full border border-gray-200 py-4 px-5 flex flex-col bg-white z-20">
          <div className="mb-3">
            <div className="p-2.5 rounded-full border border-gray-200 inline-flex justify-center items-center">
              <ChartBarIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <Heading className="mb-1" as="h5">
            Custom revenue sharing rates{" "}
          </Heading>
          <Text className="leading-6 text-sm text-gray-500">
            Monetize secondary market listings – earn $$ when a name sells
            through your app.
          </Text>
        </div>
      </div>
      <div
        style={{
          opacity: 0.1,
          background: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.00) 56.25%, #FFFFFF 100%), linear-gradient(180deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)`,
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        className="z-10"
      />
    </div>
  );
};

const services: ServiceProps[] = [
  {
    title: "Earn recurring revenue with ENS",
    subtitle:
      "Our natively integrated ENS user journeys empower content creators, registrar front-ends, wallets, and all other Web3 apps to build and monetize ENS services for their communities.",
    label: {
      title: "Make your ENS integration worthwhile",
      icon: <RocketLaunchIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: <EarnFutureComponent />,
    itemsCenter: false,
  },

  {
    title: "Unified Primary & Secondary Markets",
    subtitle:
      "Millions of the most desirable names are already taken. But don’t worry. Hope isn’t lost. The name you love could still be yours for the right price. NameKit automatically aggregates data across web3 about names listed for sale. Offers to buy a name through NameKit automatically appear across all major marketplaces.",
    postSubtitle: (
      <div className="flex flex-col gap-4">
        <Text className="text-lg leading-6 text-gray-500">
          Automatic integrations with:
        </Text>
        <div className="flex flex-wrap gap-x-6 gap-y-4 items-center justify-center lg:justify-start">
          <EnsVisionIcon />
          <OpenSeaIcon />
          <RaribleIcon />
          <X2y2Icon />
          <LooksRareIcon />
          <CoinbaseNftIcon />
          <Text className="text-lg leading-6 text-gray-500">
            + more than 10 more
          </Text>
        </div>
      </div>
    ),
    label: {
      title: "Claim the name you really want",
      icon: <UserCircleIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        width={568}
        quality={100}
        height={360}
        src="/images/namekit/unified-find-image.png"
        alt="Unified primary and secondary ENS name markets"
        loading="lazy"
      />
    ),
  },
  {
    title: "NameGraph Integration",
    subtitle:
      "Want access to the world’s largest knowledge graph of names, enabling your users to explore over 500,000 collections and hundreds of millions of names? Seamlessly connect with external tools such as NameGraph or integrate your own preferred name suggestion tool.",
    label: {
      title: "Discover a name you love",
      icon: <LightBulbIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        src="/images/namekit/namegraph-integrations-image.png"
        alt="NameGraph integration"
        loading="lazy"
      />
    ),
    // additionalContent: <ExploreNameGraphForm />,
  },
  {
    title: "NameGuard integration",
    subtitle:
      "Protect your community with NameGuard for ENS. Guard your users from heartbreak and encourage best practice usage of ENS.",
    label: {
      title: "Name security",
      icon: <ShieldCheckIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        src="/images/namekit/nameguard-integrations-image.png"
        alt="NameGuard integration"
        loading="lazy"
      />
    ),
    buttonUrl: "https://www.nameguard.io/",
  },
  {
    title: "ENS names for your community",
    subtitle: (
      <>
        Expand your brand&apos;s reach and build community by issuing subnames.
        NameKit integrates with your preferred strategy for subname
        issuance—whether it&apos;s offchain, L2s, or L1. Name searches in
        NameKit default to &quot;.eth&quot; as the default root, but you can
        customize to &quot;.yourbrand.eth&quot; or &quot;.cb.id&quot;{" "}
        <Link
          size="large"
          variant="underline"
          target="_blank"
          href="https://profile.coinbase.com/"
        >
          as done by Coinbase
        </Link>
        .
      </>
    ),
    postSubtitle: (
      <div className="flex flex-col gap-4">
        <Text className="text-lg leading-6 text-gray-500 lg:text-start text-center">
          Composable integrations with:
        </Text>
        <div className="flex flex-wrap gap-x-6 gap-y-4 items-center justify-center lg:justify-start">
          <NamestoneLogo />
          <NamespaceLogo />
          <UnrugableLogo />
        </div>
      </div>
    ),
    label: {
      title: "Community & Brand",
      icon: <MegaphoneIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        src="/images/namekit/ens-community-image.png"
        alt="Issue ENS subnames"
        loading="lazy"
      />
    ),
  },
  {
    title: "Manage your ENS identity",
    subtitle:
      "Enable your community to build and customize every detail of their ENS profile without ever leaving your app.",
    label: {
      title: "Portable Web3 Profiles",
      icon: <UserCircleIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        src="/images/namekit/manage-identity-image.png"
        alt="ENS name profile management"
        loading="lazy"
      />
    ),
  },
  {
    title: "AI-Generated Avatars",
    subtitle:
      "Harness the power of the pixel. Immerse your users in an interactive, video game-inspired 'create your player' user journeys to shape their unique ENS identity.",
    postSubtitle: (
      <div className="flex flex-col gap-4">
        <Text className="text-lg leading-6 text-gray-500 lg:text-start text-center">
          Composable integrations with:
        </Text>
        <div className="flex flex-wrap gap-x-6 gap-y-4 items-center justify-center lg:justify-start">
          <StabilityAiLogo />
        </div>
      </div>
    ),
    label: {
      title: "Design your identity",
      icon: <PaintBrushIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        src="/images/namekit/ai-design-image.png"
        alt="AI generated avatars"
        loading="lazy"
      />
    ),
  },
  {
    title: "View rich profiles",
    subtitle:
      "It's more than just a name – it's your web3 identity. Provide your community the ability to craft their perfect profile, showcase shared connections, and discover other like-minded frens.",
    postSubtitle: (
      <div className="flex flex-col gap-4">
        <Text className="text-lg leading-6 text-gray-500 lg:text-start text-center">
          Composable integrations with:
        </Text>
        <div className="flex flex-wrap gap-x-6 gap-y-4 items-center justify-center lg:justify-start">
          <LensProtocolLogo />
          <FarcasterLogo />
          <Image
            quality={100}
            width={91}
            height={36}
            src="/images/namekit/poap-logo.svg"
            alt="POAP logo"
            loading="lazy"
          />
          <EfpLogo />
        </div>
      </div>
    ),
    label: {
      title: "Community",
      icon: <MegaphoneIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        src="/images/namekit/view-community-image.png"
        alt="Web3 Identity"
        loading="lazy"
      />
    ),
  },
  {
    title: "Engage with others",
    subtitle:
      "Provide your community with access to their interoperable web3 inbox directly inside of your application so they can bring their messages with them everywhere they go.",
    postSubtitle: (
      <div className="flex flex-col gap-4">
        <Text className="text-lg leading-6 text-gray-500 lg:text-start text-center">
          Composable integrations with:
        </Text>
        <div className="flex flex-wrap gap-x-6 gap-y-4 items-center justify-center lg:justify-start">
          <XmtpLogo />
          <Image
            src="/images/namekit/dm3-logo.png"
            alt="ENS Messaging"
            loading="lazy"
            width={105}
            height={28}
            quality={100}
          />
          <PushLogo />
          <WalletConnectLogo />
        </div>
      </div>
    ),
    label: {
      title: "Web3 Chat",
      icon: <MegaphoneIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        src="/images/namekit/engage-community-image.png"
        alt="hero"
      />
    ),
  },
  {
    title: "Never lose a name you love with ENS AutoRenew",
    subtitle:
      "In the hustle and bustle of life, ENS name renewals can slip through the cracks. Give your community peace of mind (and earn recurring revenue!) with ENS AutoRenew. What’s more, it also helps everyone save on gas fees, intelligently initiating renewal transactions at the most cost-effective moments.",
    label: {
      title: "Recurring Revenue",
      icon: <ArrowPathIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        loading="lazy"
        src="/images/namekit/never-for-image.png"
        alt="ENS Name AutoRenew"
      />
    ),
  },
  {
    title: "ENSNode",
    subtitle:
      "NameKit is planned to integrate with an ENSNode backend that you can host in your own infrastructure. ENSNode will power many of the special features in NameKit and accelerate your ENS integrations by removing a lot of the complexity you would otherwise encounter.",
    label: {
      title: "ENS Developer Tooling",
      icon: <ChartBarSquareIcon className="h-5 w-5 text-gray-500" />,
    },
    buttonUrl: "https://ensnode.io",
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        loading="lazy"
        src="/images/namekit/ens-node-illustration.png"
        alt="ENSNode Architecture Overview"
      />
    ),
  },
];
