import Animation from "@/components/hero-animation/animation";
import { Heading, Text } from "@namehash/namekit-react";

export default function Page() {
  return (
    <>
      <div className="bg-black py-12 md:py-32 lg:py-48 overflow-hidden relative h-[calc(100vh-300px)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-3 text-center py-20">
            <div className="absolute inset-0 top-0 left-0 ">
              <Animation />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
