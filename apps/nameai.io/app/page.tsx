import { Button, Heading, Link, Text } from "@namehash/namekit-react";
import { HeroStartCommand } from "@/components/HeroStartCommand";
import { GithubIcon } from "@/components/github-icon";
import VideoAsciiAnimation from "@/components/VideoAsciiAnimation";
import Balancer from "react-wrap-balancer";
import { EnsVisionLogo } from "@/components/EnsVisionLogo";
import NextLink from "next/link";

export default function Page() {
  return (
    <>
      <div className="w-full">
        <div className="w-screen h-[calc(100vh-65px)] pt-1 bg-white overflow-hidden relative">
          <div
            className="w-screen h-[calc(100vh-65px)] absolute top-0 left-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 10%, transparent 100%)",
            }}
          />

          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-3xl mx-auto sm:px-6 z-10">
            <div className="space-y-5 py-5 text-center bg-[radial-gradient(circle,white_80%,blue-500_90%,transparent_100%)]">
              <div className="space-y-2">
                <Heading as="h1" className="text-black !text-6xl">
                  <Balancer>Enable magical ENS user experiences</Balancer>
                </Heading>
                <Text className="text-gray-400">What will you build?</Text>
              </div>
              <div className="flex justify-center">
                <HeroStartCommand />
              </div>
              <div className="flex justify-center gap-2">
                <Button asChild>
                  <Link target="_blank" href="https://api.nameai.io/docs">
                    API docs
                  </Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link
                    target="_blank"
                    href="https://github.com/namehash/namekit/tree/main/packages/nameai-sdk"
                  >
                    <GithubIcon className="w-5 h-5" />
                    Github
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Integration Example Panel */}
          <div className="w-full px-5 sm:px-0 absolute z-10 left-1/2 -translate-x-1/2 bottom-[10%] sm:bottom-[20%] max-w-3xl mx-auto translate-y-1/2 mt-12">
            <NextLink
              href="https://docs.vision.io/profile-features/vision-score-beta"
              target="_blank"
              className="w-full z-50 bg-black rounded-lg px-8 py-4 flex items-center justify-around group"
            >
              <div className="flex w-1/3 text-center text-white text-sm rounded-full items-center justify-center">
                Example ENS <br /> ecosystem integration
              </div>
              <div className="flex w-1/3 justify-center transition-colors duration-300 group-hover:bg-gray-800 p-4 cursor-pointer rounded-lg items-center gap-2">
                <EnsVisionLogo />
              </div>
              <div className="flex w-1/3 text-center text-white text-sm rounded-full items-center justify-center">
                Powering <br /> VisionScore
              </div>
            </NextLink>
          </div>

          <VideoAsciiAnimation />
        </div>
      </div>
    </>
  );
}
