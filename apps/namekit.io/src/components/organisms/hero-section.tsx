import Image from "next/image";
import NextLink from "next/link";
import { ColorfulBackground, GithubIcon } from "../atoms";
import { Button, Heading, Link, Text } from "@namehash/namekit-react";
import { ExternalLinkIcon } from "../atoms/icons/external-link-icon";
import { BoltIcon } from "@heroicons/react/24/outline";
import Balancer from "react-wrap-balancer";

export const HeroSection = () => {
  return (
    <section className="justify-between relative w-full pt-10 lg:px-10 px-5 flex flex-col items-center overflow-hidden ens-webfont">
      {/* Integration Example Panel */}
      <div className="w-full px-5 z-20 mx-auto mb-20">
        <div className="relative rainbow-border w-full bg-black max-w-[1216px] mx-auto flex-col gap-6 sm:gap-4 rounded-lg p-6 sm:p-8 sm:flex-row flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="p-3 sm:p-4 rounded-full bg-gray-700 shrink-0">
              <BoltIcon className="w-5 h-5 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-white text-base font-semibold">
                <Balancer>Major ENSv2 rearchitecture in progress</Balancer>
              </span>
              <span className="text-gray-400 text-sm">
                <Balancer>
                  NameKit will build for ENSv2 using{" "}
                  <Link
                    variant="underline"
                    href="https://ensnode.io"
                    size="small"
                    className="text-white"
                    target="_blank"
                  >
                    ENSNode
                  </Link>
                </Balancer>
              </span>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full sm:w-auto items-center justify-center"
            asChild
          >
            <NextLink target="_blank" href="https://ensnode.io">
              About ENSNode
            </NextLink>
          </Button>
        </div>
      </div>

      <div className="flex-col flex items-center justify-center z-20 mb-20">
        <Heading
          as="h1"
          className="animate-fadeIn text-4xl leading-10 font-bold lg:font-extrabold lg:text-5xl lg:leading-[60px] text-center"
        >
          ENS onboarding made fun & easy
        </Heading>
        <Text
          as="p"
          className="animate-fadeIn text-gray-500 my-5 text-lg text-center"
        >
          Easily integrate rich ENS user journeys into your wallet, app, or game
        </Text>
        <div className="flex items-center justify-center gap-4 animate-fadeIn">
          <Button variant="primary" size="large" asChild>
            <NextLink target="_blank" href="https://alpha.namekit.io">
              Try now
              <ExternalLinkIcon className="w-5 h-5" />
            </NextLink>
          </Button>
          <Button variant="secondary" size="large" asChild>
            <NextLink
              target="_blank"
              href={"https://github.com/namehash/namekit"}
            >
              <GithubIcon className="w-5 h-5" />
              GitHub
            </NextLink>
          </Button>
        </div>
      </div>

      <ColorfulBackground className="w-screen absolute bottom-0 left-0 invisible lg:visible" />
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.00) -0.17%, #FFFFFF 105.08%), linear-gradient(180deg, #FF9E00 0%, #F112D9 32.24%, #4C3FA0 70.71%, #2ED3C6 95.67%)",
          opacity: 0.2,
          zIndex: 1,
        }}
        className="w-full h-full absolute top-0 left-0 lg:invisible"
      />
      <Image
        priority
        width={1216}
        height={474}
        quality={100}
        alt="NameKit Overview"
        src="/images/namekit/hero.png"
        className="w-full max-w-[1216px] z-20 animate-fadeIn"
      />
    </section>
  );
};
