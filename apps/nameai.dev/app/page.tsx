import { Heading, Text } from "@namehash/namekit-react";
import AsciiVideo from "../components/video-animation/video-animation";

export default function Page() {
  return (
    <>
      <div className="">
        <div className="w-screen h-[calc(100vh-65px)] pt-1 bg-white overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-3xl mx-auto px-6 z-50">
            <div className="space-y-3 text-center">
              <Heading as="h1" className="text-black !text-6xl">
                Enable new ENS user experiences
              </Heading>
              <Text className="text-gray-400">What will you build?</Text>
            </div>
          </div>
          <AsciiVideo />
        </div>
      </div>
    </>
  );
}
