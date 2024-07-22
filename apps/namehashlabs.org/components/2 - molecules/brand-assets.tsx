/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { ExternalLinkIcon, PreSectionText } from "../1 - atoms";
import { ColorfulBg } from "../1 - atoms/colorful-bg";
import { ColorfulDownloadIcon } from "../1 - atoms/icons/colorful-download-icon";

export const BrandAssets = () => {
  return (
    <section className="w-full py-20 px-5 lg:px-[112px] h-full flex justify-center">
      <ColorfulBg className="absolute top-0 left-0 w-full z-[-1]" />
      <div className="w-full max-w-[1216px]">
        <div className="flex flex-col lg:mt-[100px] lg:mb-[120px] mt-[60px] mb-[60px] gap-3 ">
          <PreSectionText className="text-start ">Logos & MORE</PreSectionText>
          <h1 className="font-bold lg:text-[52px] text-4xl leading-10">
            Brand assets
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-center justify-center border-t border-gray-200 py-20 ">
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-3xl leading-9 lg:text-4xl lg:leading-10 font-bold">
                Download assets
              </h3>
              <p className="text-lg leading-7 font-normal text-gray-500">
                Working together with Namehash Labs or crafting an article
                featuring us? Explore the official Namehash Labs assets
                available on our Github to incorporate into your marketing
                materials, website, or mobile application.
              </p>
            </div>
            <a
              target="_blank"
              href="https://github.com/namehash/brand-assets"
              className="flex gap-3 bg-black rounded-[8px] whitespace-nowrap text-white shadow-sm text-base leading-6 py-2 px-4 font-medium hover:bg-gray-800 transition-colors duration-200 flex-nowrap"
            >
              Download on Github <ExternalLinkIcon className="w-5 h-5" />
            </a>
          </div>
          <a
            target="_blank"
            href={
              "https://github.com/namehash/brand-assets/archive/refs/heads/main.zip"
            }
            className="max-w-[588px] lg:flex-shrink-0 relative group hover:cursor-pointer"
          >
            <Image
              width={588}
              height={500}
              src="/images/brand-assets.png"
              alt="Download NameHash Labs Brand Assets"
            />
            <div className="absolute flex items-center justify-center text-3xl left-1/2 bottom-[10%] shadow-lg w-[100px] h-[100px] bg-white rounded-full group-hover:scale-110 border-gray-200 border transition-all duration-200 ">
              <ColorfulDownloadIcon />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
