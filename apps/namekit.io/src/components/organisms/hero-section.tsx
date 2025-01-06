import Image from "next/image";
import Link from "next/link";
import { ColorfulBackground, GithubIcon } from "../atoms";

export const HeroSection = () => {
  return (
    <section className="justify-between relative w-full pt-[80px] lg:px-10 px-5 flex flex-col items-center overflow-hidden ens-webfont">
      <div className="flex-col flex items-center justify-center z-20 mb-20">
        <h1 className="animate-fadeIn text-4xl leading-10 font-bold lg:font-extrabold text-center lg:text-5xl lg:leading-[60px]">
          ENS onboarding made fun & easy
        </h1>
        <p className="animate-fadeIn text-gray-500 my-5 text-lg leading-7 font-normal text-center">
          Easily integrate rich ENS user journeys into your wallet, app, or game
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            target="_blank"
            href={"https://github.com/namehash/namekit"}
            className="flex items-center justify-center gap-3 hover:bg-gray-100 border-gray-300 shadow-sm animate-fadeIn transition-colors duration-200 rounded-[8px] font-medium text-base leading-6 text-black bg-white px-[25px] py-[13px] text-center"
          >
            <GithubIcon className="w-5 h-5" />
            GitHub
          </Link>
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
