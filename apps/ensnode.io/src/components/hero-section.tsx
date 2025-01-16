import { Button, Link } from "@namehash/namekit-react";
import { ExternalLinkIcon, GithubIcon } from "./icons";

export const HeroSection = () => {
  return (
    <section className="animate-fadeIn justify-center h-screen relative w-full lg:px-10 px-5 flex flex-col items-center overflow-hidden ens-webfont">
      <h1 className="text-4xl leading-10 font-bold lg:font-extrabold text-center lg:text-5xl flex items-center justify-center gap-2">
        ENSNode
        <span className="text-sm px-2 py-0.5 -translate-y-1 -translate-x-1 bg-black text-white rounded-full">
          alpha
        </span>
      </h1>
      <p className=" text-gray-500 mb-10 mt-2 text-lg leading-7 font-normal text-center">
        More info coming soon
      </p>
      <div className="flex items-center justify-center gap-4 mb-10">
        <Button asChild>
          <Link target="_blank" href="https://alpha.ensnode.io">
            Try it now
            <ExternalLinkIcon className="w-4 h-4" />
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link target="_blank" href="https://github.com/namehash/ensnode">
            <GithubIcon className="w-5 h-5 text-black" />
            GitHub
          </Link>
        </Button>
      </div>
    </section>
  );
};
