"use client";

import { useEffect, useState } from "react";
import { WritersBlockPills } from "@/components/utils/writers-block-pills";
import { writersBlockSuggestions } from "@/lib/writers-block-suggestions";
import { ChevronDown } from "lucide-react";
import Balancer from "react-wrap-balancer";

import {
  sampleWritersBlockSuggestions,
  WritersBlockSuggestion,
} from "@namehash/namegraph-sdk/utils";
import { HeroStartCommand } from "@/components/hero-start-command";
import { Button, IconButton } from "@namehash/namekit-react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { BoltIcon } from "@heroicons/react/24/solid";
const ThreeJSAnimation = dynamic(
  () =>
    import("../../components/hero-animation").then(
      (mod) => mod.ThreeJSAnimation,
    ),
  { ssr: false },
);

export const HomePage = () => {
  const [suggestions, setSuggestions] = useState<WritersBlockSuggestion[]>([]);

  const ideate = () => {
    const wbSuggestions = sampleWritersBlockSuggestions(
      5,
      writersBlockSuggestions,
    );
    setSuggestions(wbSuggestions);
  };

  useEffect(() => {
    ideate();
  }, []);

  return (
    <>
      <div className="w-[100vw] h-[100vh] bg-black overflow-hidden relative flex items-center justify-center">
        <ThreeJSAnimation />
      </div>

      <div className="absolute top-0 left-0 w-[100vw] h-[100vh] flex items-start md:items-cente justify-center lg:items-center lg:justify-start lg:pl-[5%] xl:pl-[16.5%]">
        <div className="relative w-full max-w-[500px] h-[200px] mt-5 md:mt-20 md:-translate-y-16 sm:md:-translate-y-24">
          <div
            className="animate-longFadeIn"
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "200px",
              left: 0,
              background:
                "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.9) 10%, rgba(0, 0, 0, 0.7) 25%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.4) 55%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0) 85%, rgba(0, 0, 0, 0) 100%)",
              borderRadius: "9999px",
            }}
          ></div>
          <h1 className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 mt-10 lg:mt-0 -translate-y-1/2 text-white animate-fadeInFadeOut x-50 text-center not-italic font-bold text-4xl leading-10 sm:text-5xl sm:leading-[52px] text-shadow-strong">
            <Balancer>From the infinite universe of names</Balancer>
          </h1>
          <h1 className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 mt-10 lg:mt-0 -translate-y-1/2 text-white animate-longFadeIn x-50 text-center not-italic font-bold text-4xl leading-10 sm:text-5xl sm:leading-[52px] text-shadow-strong">
            <Balancer>Discover and collect all the ENS names you love</Balancer>
          </h1>
        </div>
      </div>

      <div className="absolute py-20 flex flex-col items-center justify-between top-0 left-0 w-[100vw] h-[100vh] mt-[70px]">
        <div className="z-20 flex flex-col items-center justify-end w-full h-full">
          <IconButton
            variant="secondary"
            className="!px-20 !rounded-full"
            size="large"
            onClick={() => {
              const theVision = document.getElementById("namegraph-demo");
              if (theVision) {
                const viewportHeight = window.innerHeight;
                const elementHeight = theVision.getBoundingClientRect().height;
                const offset = (viewportHeight - elementHeight) / 2;
                window.scrollTo({
                  top: theVision.offsetTop - offset,
                  behavior: "smooth",
                });
              }
            }}
          >
            <ChevronDown />
          </IconButton>
        </div>
      </div>
      <div id="namegraph-demo" className="container mx-auto py-16 px-4">
        <div className="max-w-4xl flex flex-col mx-auto text-center">
          <div className="flex flex-col gap-2 w-full h-fit mb-4">
            <p className="text-center not-italic uppercase text-gray-500 text-xs tracking-[0.3px] font-medium">
              FULLY OPEN SOURCE
            </p>
            <h1 className="text-black text-center not-italic font-bold text-4xl leading-10 sm:text-5xl sm:leading-[52px]">
              NameGraph Developer Demo
            </h1>
          </div>
          <p className="text-center not-italic font-normal text-gray-500 text-lg leading-7 sm:text-base sm:leading-6 sm:font-light">
            <Balancer>
              Help your users discover ENS names they love with NameGraph.
            </Balancer>
          </p>
          <p className="text-center not-italic font-normal text-gray-500 text-lg leading-7 sm:text-base sm:leading-6 sm:font-light">
            <Balancer>
              NameGraph empowers ENS registrar apps to build new name discovery
              user experiences.
            </Balancer>
          </p>
          <div className="flex mx-auto mt-6">
            <HeroStartCommand />
          </div>
        </div>
        {/* Integration Example Panel */}
        <div className="w-full z-20 mx-auto mt-10 mb-2 px-4 sm:px-0">
          <div className="w-full bg-black max-w-5xl mx-auto flex-col sm:flex-row gap-6 sm:gap-4 rounded-lg p-6 sm:px-8 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="p-3 sm:p-4 rounded-full bg-gray-700 shrink-0">
                <BoltIcon className="w-5 h-5 text-white" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-white text-base font-semibold">
                  <Balancer>Example ENS ecosystem integration</Balancer>
                </span>
                <span className="text-gray-400 text-sm">
                  <Balancer>
                    powering related name suggestions at Vision{" "}
                  </Balancer>
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full items-center justify-center sm:w-auto text-center"
              asChild
            >
              <NextLink
                target="_blank"
                href="https://x.com/ensvision/status/1902711055802933619"
              >
                Learn more
              </NextLink>
            </Button>
          </div>
        </div>

        <div className="max-w-[1216px] mx-auto flex flex-col items-center justify-start bg-gray-50 rounded-xl p-10 mt-10 w-full">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-lg font-semibold">
              <Balancer>
                Help your users overcome &quot;writer&apos;s block&quot;
              </Balancer>
            </p>

            <p className="text-center not-italic font-normal text-gray-500 text-lg leading-7 sm:text-base sm:leading-6 sm:font-light">
              <Balancer>
                Picking a name can be hard. Inspire your users with example
                ideas.
              </Balancer>
            </p>
          </div>

          <div className="my-5">
            <Button onClick={ideate}>Ideate</Button>
          </div>

          <div className="border-t border-gray-200 my-5 w-full" />

          <div className="my-5">
            <WritersBlockPills suggestions={suggestions}></WritersBlockPills>
          </div>
        </div>
      </div>
    </>
  );
};
