import { GithubIcon, TwitterIcon, FarcasterIcon } from "../atoms";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export const NamekitFooter = () => {
  return (
    <footer className="px-6 border-t border-gray-200 pt-5 pb-4 md:pb-[18px] md:pt-6">
      <div className="flex flex-col space-y-7 md:space-y-0 items-center md:items-center md:flex-row max-w-[1216px] mx-auto justify-between">
        <div className="w-full md:w-auto inline-flex items-center justify-center">
          <p className="text-xs text-gray-500">
            &copy; NameHash Labs. All Rights Reserved
          </p>
        </div>
        <nav className="flex items-center space-x-3">
          <a
            href="https://twitter.com/NamehashLabs"
            aria-label="Twitter link"
            className="text-sm text-gray-400 transition hover:text-gray-900 md:text-gray-500"
          >
            <TwitterIcon className="w-4" />
          </a>
          <a
            href="https://warpcast.com/namehash"
            aria-label="Farcaster link"
            className="text-sm text-gray-400 transition hover:text-gray-700 md:text-gray-500"
          >
            <FarcasterIcon />
          </a>
          <a
            href="https://github.com/namehash/namekit"
            aria-label="Github link"
            className="text-sm text-gray-400 transition hover:text-gray-700 md:text-gray-500"
          >
            <GithubIcon className="w-5" />
          </a>
          <a href="mailto:hello@namehashlabs.org" aria-label="Email link">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 transition hover:text-gray-700 md:text-gray-500" />
          </a>
        </nav>
        <div className="inline text-xs text-gray-500">
          <p className="inline">Made with {"❤️"} by </p>
          <a
            href="https://namehashlabs.org"
            className="animated-black-underline inline"
          >
            NameHash Labs
          </a>
        </div>
      </div>
    </footer>
  );
};
