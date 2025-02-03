import { Heading, Text } from "@namehash/namekit-react";
import AsciiVideo from "../components/video-animation/video-animation";

export default function Page() {
  return (
    <>
      <div className="bg-black py-12 md:py-32 lg:py-48 relative">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-3 text-center">
            <Heading as="h1" className="text-white !text-6xl">
              Enable new ENS user experiences
            </Heading>
            <Text className="text-gray-400">What will you build?</Text>
          </div>
        </div>
        <AsciiVideo />
      </div>
    </>
  );
}
