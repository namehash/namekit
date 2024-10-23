import { type Metadata } from "next";
import Image from "next/image";
import cc from "classcat";
import { Metadata as NamehashMetadata } from "@namehash/internal";

import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { FigmaIcon } from "@/components/1 - atoms/icons/figma-icon";
import { GithubIcon } from "@/components/1 - atoms/icons/github-icon";
import { ProductComponent } from "@/components/2 - molecules/product-component";
import { Button, Link } from "@namehash/namekit-react";

const title = "ENS Referral Program Proposal";
const description =
  "Join the discussion about an ENS Referral Program and help ENS grow.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["ens", "web3", "eth", "referral program"],
  openGraph: {
    ...NamehashMetadata.defaultMetdata.openGraph,
    title,
    description,
    url: "/ens-referral-program",
    siteName: "NameHash Labs",
  },
  twitter: {
    ...NamehashMetadata.defaultMetdata.twitter,
    title,
    description,
  },
};

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="mt-20 w-full">
        <div className="w-full px-5 lg:px-[112px] bg-gray-50 flex items-center justify-center">
          <section className="w-full max-w-[1216px]">
            <ProductComponent
              title="ENS Referral Program"
              subtitle="The power of a protocol lies not only in its technology, but in the strength of its community. Passionate about ENS? Become an ENS Referrer, help grow ENS, and start earning."
              illustration={
                <Image
                  quality={100}
                  width={1056}
                  height={820}
                  className="w-full h-auto max-w-[600px]"
                  src="/images/ens-incentive.png"
                  alt="hero"
                />
              }
              greenLabelText="Proposal pending"
              buttonUrl="https://docs.google.com/document/d/1srqcho7PFyMBUDQTxxlH_eZqrt5x_EEB-PF2LfpYvIg/edit?usp=sharing"
            />
          </section>
        </div>

        <section className="px-5 lg:px-[112px] py-20 w-full flex flex-col relative items-center justify-center overflow-hidden">
          <div className="grid lg:grid-cols-3 grid-cols-1 items-start lg:divide-y-0 divide-y lg:divide-x justify-center max-w-[1216px]">
            {items.map((item, index) => {
              return (
                <div
                  className={cc([
                    "w-full h-full flex lg:px-10 lg:py-0 py-10",
                    index % 3 === 0 && "lg:pl-0 pt-0",
                    index % 3 === 2 && "lg:pr-0 pb-0",
                  ])}
                  key={item.title}
                >
                  <Item
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    text={item.text}
                    buttonUrl={item.buttonUrl}
                    buttonText={item.buttonText}
                    greenLabelText={item.greenLabelText}
                    isInverted={index % 3 === 2}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export interface ItemProps {
  icon: React.ReactElement;
  title: string;
  text: string;
  isInverted?: boolean;
  buttonUrl?: string;
  buttonText?: string;
  greenLabelText?: string;
}

const Item = ({
  icon,
  title,
  text,
  buttonUrl,
  buttonText,
  greenLabelText,
}: ItemProps) => {
  return (
    <div
      className={cc([
        "flex flex-col gap-6 items-start justify-start w-full h-full border-gray-200",
      ])}
    >
      <div className="w-[52px] flex items-center justify-center h-[52px] border border-gray-200 rounded-full">
        {icon}
      </div>
      <div className="flex flex-col items-start justify-center gap-4">
        <div className="flex flex-wrap gap-3 items-center justify-start lg:justify-start">
          <h3 className="text-3xl leading-9 font-bold text-start">{title}</h3>

          {greenLabelText && (
            <span
              className="px-3 py-0.5 bg-green-100 border border-green-100 rounded-full"
              style={{ whiteSpace: "nowrap" }}
            >
              <p className="text-sm leading-5 font-medium text-green-800 font-variant-normal">
                {greenLabelText}
              </p>
            </span>
          )}
        </div>
        <p className="text-lg leading-7 font-light text-gray-500">{text}</p>
      </div>
      {!!buttonUrl && (
        <Button variant="secondary" size="medium" asChild>
          <Link href={buttonUrl}>
            {buttonText}
            <Link.ExternalIcon />
          </Link>
        </Button>
      )}
    </div>
  );
};

const items: ItemProps[] = [
  {
    icon: <DocumentTextIcon className="h-6 w-6 text-gray-400 m-auto" />,
    title: "Abstract Proposal Document",
    text: "Review the design rationale for important decisions in how a proposed ENS Referral Program might function.",
    buttonText: "Review the temp check",
    buttonUrl:
      "https://docs.google.com/document/d/1srqcho7PFyMBUDQTxxlH_eZqrt5x_EEB-PF2LfpYvIg/edit?usp=sharing",
  },
  {
    icon: <FigmaIcon className="h-6 w-6 text-gray-400 m-auto" />,
    title: "Interactive Design Prototype",
    text: "Navigate the proposed UI for an ENS Referral Program portal website. Designs include how to become a referrer, reviewing detailed referrer metrics, withdrawing rewards, and overall program administration.",
    greenLabelText: "Coming soon",
  },
  {
    icon: <GithubIcon className="h-6 w-6 text-gray-400 m-auto" />,
    title: "R&D Prototype",
    text: "R&D Prototype for .eth referrals implemented using ZK and Axiom.",
    buttonText: "View on GitHub",
    buttonUrl: "https://github.com/namehash/ens-referrals",
  },
];
