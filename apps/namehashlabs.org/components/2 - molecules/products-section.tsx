import React from "react";
import {
  ChartBarSquareIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Balancer } from "react-wrap-balancer";
import cc from "classcat";
import { Button } from "@namehash/namekit-react";
import NextLink from "next/link";

import { SectionText, SectionTitle } from "../1 - atoms";

import making_the_unknown_img from "/public/images/making_the_unknown.png";
import ens_admin_img from "/public/images/ens-admin-illustration.png";
import ens_awards_img from "/public/images/ensawards-illustration.svg";
import namegraph_img from "/public/images/namegraph-illustration.png";
import ens_v2_referral_programs_img from "/public/images/ens-v2-referral-programs.svg";
import nameai_img from "/public/images/nameai-illustration.png";
import { ENSNodeProductPanel } from "./ENSNodeProductPanel";
interface ProductProps {
  label: {
    icon: React.ReactElement;
    title: string;
  };
  title: string;
  subtitle: string;
  illustration: React.ReactElement;
  gradient?: React.ReactElement;
  isInverted?: boolean;
  buttonLabel?: string;
  buttonUrl?: string;
  greenLabelText?: string;
  sectionId?: string;
}

const Product = ({
  sectionId,
  label,
  title,
  subtitle,
  illustration,
  gradient,
  isInverted,
  buttonLabel,
  buttonUrl,
  greenLabelText,
}: ProductProps) => {
  const isInternalLink = (url: string) => {
    if (!url) return false;
    return url.startsWith("/") || url.startsWith("#") || !url.includes("://");
  };

  return (
    <section
      className={cc([
        "lg:px-[120px] px-5 w-full flex items-center justify-center",
      ])}
      id={sectionId}
    >
      <div
        className={cc([
          "w-full flex flex-col-reverse lg:flex-row items-center lg:gap-10 max-w-[1216px] bg-gray-50 rounded-[20px] p-[32px]",
          {
            "lg:flex-row-reverse": isInverted,
          },
        ])}
      >
        <div
          className={cc([
            "lg:w-1/2 w-full flex items-start justify-center",
            {
              "lg:ml-10": !isInverted,
            },
          ])}
        >
          <div className="flex-col inline-flex gap-5 lg:max-w-[568px]">
            {/* Badge lg screen */}
            <div className="justify-center lg:justify-start hidden lg:flex">
              <div className="gap-2 bg-black inline-flex items-center bg-opacity-5 px-4 py-2 rounded-[20px] ">
                {label.icon}
                <p className="text-sm leading-5 font-medium">{label.title}</p>
              </div>
            </div>

            <div
              id={sectionId}
              className="flex flex-wrap gap-3 items-center justify-center lg:justify-start"
            >
              <h2
                className="text-2xl leading-8 lg:text-4xl lg:leading-10 font-bold lg:text-start text-center"
                style={{ whiteSpace: "nowrap" }}
              >
                {title}
              </h2>

              {greenLabelText && (
                <div className="">
                  <div
                    className="px-3 bg-green-100 border border-green-100 rounded-full"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <p className="text-sm leading-[22px] font-medium text-green-800 font-variant-normal">
                      {greenLabelText}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <SectionText className="lg:text-start text-center w-full">
              <Balancer>{subtitle}</Balancer>
            </SectionText>
            {buttonUrl && buttonLabel && (
              <div className="flex lg:justify-start justify-center">
                <Button asChild>
                  <NextLink target={isInternalLink(buttonUrl) ? "_self" : "_blank"} href={buttonUrl}>{buttonLabel}</NextLink>
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="lg:w-1/2 w-full lg:mt-0 mt-5">
          <div className="flex flex-col gap-4">
            {/* Mobile badge */}
            <div className="flex justify-center lg:hidden">
              <div className="gap-2 bg-black inline-flex items-center bg-opacity-5 px-4 py-2 rounded-[20px]">
                {label.icon}
                <p className="text-sm leading-5 font-medium">{label.title}</p>
              </div>
            </div>

            {/* Image container */}
            <div className="relative flex items-center justify-center">
              {gradient}
              {illustration}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ProductsSection = () => {
  return (
    <div
      id="productsSection"
      className="lg:py-20 py-10 flex flex-col gap-10 w-full"
    >
      <SectionTitle>Our ENS Infrastructure</SectionTitle>
      <ENSNodeProductPanel />

      {products.map((product, index) => (
        <Product
          key={product.title}
          label={product.label}
          title={product.title}
          subtitle={product.subtitle}
          gradient={product.gradient}
          isInverted={index % 2 === 1}
          sectionId={product.sectionId}
          buttonUrl={product.buttonUrl}
          buttonLabel={product.buttonLabel}
          illustration={product.illustration}
          greenLabelText={product.greenLabelText}
        />
      ))}
    </div>
  );
};

const products: ProductProps[] = [
  {
    title: "ENSRainbow",
    subtitle:
      "All ENS apps depending on indexed ENS name data need infrastructure to reduce the occurrence of ENS users being exposed to ugly and confusing technical implementation details of ENS smart contracts.",
    label: {
      title: "ENS User Experience Infrastructure",
      icon: <StarIcon className="h-5 w-5 text-gray-500" />,
    },
    buttonLabel: "Learn more",
    buttonUrl: "https://ensrainbow.io",
    sectionId: "ens-rainbow",
    illustration: (
      <div className="w-full h-auto z-10">
        <Image
          quality={100}
          width={568}
          height={360}
          className="w-full h-auto"
          src={making_the_unknown_img}
          alt="hero"
        />
      </div>
    ),
  },
  {
    title: "ENSAdmin",
    subtitle:
      "ENS Developers need “power tools” to explore the ENS Protocol and trace operations like never before. Interactively learn and debug how ENS Registries, Registrars, Resolvers, Gateways, and Clients interact.",
    label: {
      title: "ENS Developer Power Tools",
      icon: <WrenchScrewdriverIcon className="h-5 w-5 text-gray-500" />,
    },
    buttonLabel: "Learn more",
    buttonUrl: "https://admin.ensnode.io/status",
    sectionId: "ens-admin",
    illustration: (
      <div className="w-full h-auto z-10">
        <Image
          quality={100}
          width={568}
          height={360}
          className="w-full h-auto"
          src={ens_admin_img}
          alt="hero"
        />
      </div>
    ),
  },
  {
    title: "ENS Referral Program",
    subtitle:
      "ENS needs growth and revenues. Referral programs incentivize platforms with large existing audiences to integrate and promote .eth registrations and renewals.  Passionate about ENS? Become an ENS Referrer, help grow ENS, and start earning.",
    label: {
      title: "ENS Growth Incentive Program",
      icon: <ChartBarSquareIcon className="h-5 w-5 text-gray-500" />,
    },
    buttonLabel: "Learn more",
    buttonUrl: "https://ensawards.org/ens-referral-awards",
    sectionId: "ens-v2-referral-programs",
    illustration: (
      <div className="w-full h-auto z-10">
        <Image
          quality={100}
          width={568}
          height={360}
          className="w-full h-auto"
          src={ens_v2_referral_programs_img}
          alt="hero"
        />
      </div>
    ),
  },
  {
    title: "ENSAwards",
    subtitle:
        "Earn awards for following ENS best practices!",
    label: {
      title: "ENS Awards Program",
      icon: <TrophyIcon className="h-5 w-5 text-gray-500" />,
    },
    buttonLabel: "Learn more",
    buttonUrl: "https://ensawards.org/",
    sectionId: "ensawards",
    illustration: (
      <div className="max-w-[400px] w-full h-auto z-10">
        <Image
          quality={100}
          width={568}
          height={360}
          className="w-full h-auto"
          src={ens_awards_img}
          alt="hero"
        />
      </div>
    ),
  },
  {
    title: "NameGraph",
    subtitle:
      "ENS Registrar apps need infrastructure to help their users discover “collectable” ENS names, such that more names are registered. Navigate more than 21 million “collectable” names spanning more than 400,000 name collections.",
    label: {
      title: "ENS Name Collection Infrastructure",
      icon: <GlobeAltIcon className="h-5 w-5 text-gray-500" />,
    },
    buttonLabel: "Learn more",
    buttonUrl: "https://namegraph.dev/",
    sectionId: "namegraph",
    illustration: (
      <div className="w-full h-auto z-10">
        <Image
          quality={100}
          width={568}
          height={360}
          className="w-full h-auto"
          src={namegraph_img}
          alt="hero"
        />
      </div>
    ),
  },

  {
    title: "NameAI",
    subtitle:
      "ENS Marketplace apps need infrastructure to automatically sort the most attractive names up to the top of the list. Enables multi-dimensional name scoring. Improves name discovery and liquidity to ultimately boost ENS DAO revenues.",
    label: {
      title: "ENS Name Discovery Infrastructure",
      icon: <SparklesIcon className="h-5 w-5 text-gray-500" />,
    },
    buttonLabel: "Learn more",
    buttonUrl: "https://nameai.io/",
    sectionId: "nameai",
    illustration: (
      <div className="w-full h-auto z-10">
        <Image
          quality={100}
          width={568}
          height={360}
          className="w-full h-auto"
          src={nameai_img}
          alt="hero"
        />
      </div>
    ),
  },
  {
    title: "NameGuard",
    subtitle:
      "A number of ENS user flows can suffer from “sharp edges” with unexpected or harmful consequences. NameGuard’s powerful name inspection capabilities provide a safer environment for operations on ENS names and encourages the optimal use of ENS.",
    label: {
      title: "ENS Name Security Infrastructure",
      icon: <ShieldCheckIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        className="w-full h-auto"
        src="/images/nameguard-protect.png"
        alt="hero"
      />
    ),
    buttonLabel: "Learn more",
    buttonUrl: "https://nameguard.io/",
    sectionId: "nameguard",
  },
  {
    title: "NameKit",
    subtitle:
      "ENSv2 enables a completely new infrastructure for ENS name registrars to be built. NameKit is being rearchitected for ENSv2 to support the rapid deployment of new subname registrars that deliver fun and engaging ENS user journeys.",
    label: {
      title: "ENSv2 Registrar Infrastructure",
      icon: <RocketLaunchIcon className="h-5 w-5 text-gray-500" />,
    },
    buttonLabel: "Learn more",
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        className="w-full h-auto"
        src="/images/namekit-improved.png"
        alt="hero"
      />
    ),
    buttonUrl: "https://namekit.io/",
    sectionId: "namekit",
  },
];
