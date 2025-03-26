import { Button, Heading, Link, Text } from "@namehash/namekit-react";
import { HeroStartCommand } from "@/components/HeroStartCommand";
import { GithubIcon } from "@/components/github-icon";
import VideoAsciiAnimation from "@/components/VideoAsciiAnimation";
import Balancer from "react-wrap-balancer";
import NextLink from "next/link";
import { BoltIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <>
      <div className="w-full">
        <div className="w-screen h-[calc(100vh-65px)] pt-1 bg-white overflow-hidden relative">
          {/* Integration Example Panel */}
          <div className="w-full px-5 sm:px-0 absolute z-20 left-1/2 -translate-x-1/2 top-10 sm:bottom-[20%] max-w-[1216px] mx-auto">
            <div className="w-full bg-black flex-col sm:flex-row gap-4 rounded-lg px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-gray-700">
                  <BoltIcon className="w-5 h-5 text-white" />
                </div>

                <div className="flex flex-col">
                  <span className="text-white text-base">
                    Example ENS ecosystem integration
                  </span>
                  <span className="text-gray-400 text-sm">
                    Powering VisionScore
                  </span>
                </div>
              </div>
              <Button variant="secondary" asChild>
                <NextLink
                  target="_blank"
                  href="https://docs.vision.io/profile-features/vision-score-beta"
                >
                  About VisionScore
                </NextLink>
              </Button>
            </div>
          </div>
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

          <VideoAsciiAnimation />
        </div>
      </div>
    </>
  );
}
