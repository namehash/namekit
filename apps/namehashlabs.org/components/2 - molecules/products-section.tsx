import React from "react";
import {
  ChartBarSquareIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Balancer } from "react-wrap-balancer";
import cc from "classcat";
import { Button, Link } from "@namehash/namekit-react";
import NextLink from "next/link";

import { SectionText, SectionTitle } from "../1 - atoms";

import making_the_unknown_img from "/public/images/making_the_unknown.svg";

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
          "w-full flex flex-col items-center lg:flex-row max-w-[1216px] bg-gray-50 rounded-[20px] p-[32px]",
          {
            "lg:flex-row-reverse": isInverted,
          },
        ])}
      >
        <div className="lg:w-1/2 w-full flex items-start justify-center ">
          <div className="flex-col inline-flex gap-5 lg:max-w-[568px]">
            <div className="justify-center lg:justify-start flex">
              <div className="gap-2 bg-black inline-flex items-center bg-opacity-5 px-4 py-2 rounded-[20px]">
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
                  {isInternalLink(buttonUrl) ? (
                    <NextLink href={buttonUrl}>{buttonLabel}</NextLink>
                  ) : (
                    <Link href={buttonUrl}>
                      {buttonLabel}
                      <Link.ExternalIcon />
                    </Link>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="lg:w-1/2 w-full  lg:mt-0 mt-5 relative flex items-center justify-center">
          {gradient}
          {illustration}
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
      <SectionTitle>Our Products</SectionTitle>
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
    title: "ENSNode",
    subtitle:
      "Unlock new opportunities for ENS support in your web3 app with ENSNode, your gateway to a seamless fusion of richest onchain and offchain data from across the ENS ecosystem.",
    label: {
      title: "ENS Developer Tooling",
      icon: <ChartBarSquareIcon className="h-5 w-5 text-gray-500" />,
    },
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        className="w-full h-auto"
        src="/images/ensnode-developer.png"
        alt="hero"
      />
    ),
    buttonLabel: "Learn more",
    buttonUrl: "https://ensnode.io",
    sectionId: "ens-node",
  },
  {
    title: "ENSRainbow",
    subtitle:
      "Making the unknown, known. Heal millions of unknown ENS names with this ENSNode sidecar service.",
    label: {
      title: "ENS Developer Tooling",
      icon: <ChartBarSquareIcon className="h-5 w-5 text-gray-500" />,
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
    gradient: (
      <div
        className="absolute inset-0 rounded-lg opacity-30 z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.00) 0%, #FFF 100%), linear-gradient(90deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)",
        }}
      />
    ),
  },
  {
    title: "NameGuard",
    subtitle:
      "Provide a safer environment for ENS names in your Web3 app, eliminate hidden risks for your users, and encourage optimal use of ENS.",
    label: {
      title: "Protect the ENS community",
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
    buttonLabel: "Try it now",
    buttonUrl: "https://www.nameguard.io/",
    sectionId: "nameguard",
  },
  {
    title: "NameKit",
    subtitle:
      "A fast, easy and highly customizable way for developers to add engaging ENS user journeys to their application.",
    label: {
      title: "Improved economics for building on ENS",
      icon: <ChartBarSquareIcon className="h-5 w-5 text-gray-500" />,
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
    buttonUrl: "https://www.namekit.io/",
    sectionId: "namekit",
  },
  {
    title: "ENS Referral Program",
    subtitle:
      "The power of a protocol lies not only in its technology, but in the strength of its community. Passionate about ENS? Become an ENS Referrer, help grow ENS, and start earning.",
    label: {
      title: "Incentive program to help ENS grow",
      icon: <ChartBarSquareIcon className="h-5 w-5 text-gray-500" />,
    },
    buttonLabel: "Learn more",
    illustration: (
      <Image
        quality={100}
        width={568}
        height={360}
        className="w-full h-auto"
        src="/images/ens-incentive.png"
        alt="hero"
      />
    ),
    greenLabelText: "Proposal pending",
    buttonUrl: "/ens-referral-program",
    sectionId: "ens-referral-program",
  },
];
