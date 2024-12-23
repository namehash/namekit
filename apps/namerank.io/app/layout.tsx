import "./globals.css";
import "@namehash/ens-webfont";

import { Inter } from "next/font/google";
import Link from "next/link";
import { NameHashLabsLogo } from "@/components/namehash-labs-logo";
import { ServiceProviderBadge } from "@/components/service-provider-badge";
import { EmailIcon } from "../components/email-icon";
import { GithubIcon } from "@/components/github-icon";
import { TwitterIcon } from "@/components/twitter-icon";
import { FarcasterIcon } from "@/components/farcaster-icon";
import { TelegramIcon } from "@/components/telegram-icon";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NameRank Demo",
  description: "Tokenize and analyze names with NameRank demo",
};

const footerProducts = [
  {
    name: "NameKit",
    href: "https://namekit.io",
  },
  {
    name: "NameGuard",
    href: "https://nameguard.io",
  },
  {
    name: "ENS Referral Program",
    href: "https://namehashlabs.org/ens-referral-program",
  },
];

const footerResources = [
  {
    name: "Contact us",
    href: "https://namehashlabs.org/contact",
  },
  {
    name: "Careers",
    href: "https://namehashlabs.org/careers",
  },
  {
    name: "Partners",
    href: "https://namehashlabs.org/partners",
  },
  {
    name: "Brand assets",
    href: "https://namehashlabs.org/brand-assets",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <header className="sticky bg-white top-0 w-full z-20 border-b border-gray-300 h-[56px] py-[9px] sm:h-[70px] sm:py-4 select-none">
            <div className="max-w-7xl mx-auto items-center justify-between flex flex-row px-6">
              <div className="flex flex-row lg:gap-2 xl:gap-7 justify-between items-center">
                <div className="flex flex-row justify-between items-center gap-1 cursor-pointer flex-shri0 pr-2">
                  <a
                    href="/"
                    className="text-black not-italic font-bold text-[22.683px] leading-[22.683px] tracking-[-0.907px] sm:text-[27.816px] sm:leading-[27.816px] sm:tracking-[-1.113px]"
                  >
                    NameRank
                  </a>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between md:gap-5 h-[40px]">
                <div className="hidden items-center justify-center lg:flex gap-2">
                  <div className="hidden items-center justify-center xl:flex gap-2">
                    {/* <Button variant="ghost" asChild>
                      <Link href="http://100.24.45.225/docs">Docs</Link>
                    </Button> */}

                    {/* <Button variant="ghost" asChild>
                      <Link href="https://github.com/namehash/namekit">
                        <GithubIcon className="hidden md:block fill-current" />{" "}
                        GitHub
                      </Link>
                    </Button> */}
                  </div>

                  {/* <Button variant="ghost" asChild>
                    <a href="https://namehashlabs.org/contact" target="_blank">
                      Contact
                    </a>
                  </Button> */}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 py-12 md:py-20">{children}</main>
          <footer className="lg:px-[50px] px-5 flex items-center justify-center w-full border-t border-gray-200">
            <div className="pt-8 pb-5 flex flex-col gap-10 items-start justify-between w-full max-w-[1216px]">
              <div className="w-full gap-5 flex flex-col lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-5">
                  <NameHashLabsLogo />

                  <p className="text-sm font-light text-gray-500 max-w-[339px] leading-6">
                    Founded in 2022, Namehash Labs is a technology organization
                    dedicated to infrastructure-level solutions that helps the
                    Ethereum Name Service (ENS) Protocol grow.
                  </p>

                  <ServiceProviderBadge />
                </div>

                <div className="flex justify-start">
                  <div className="flex flex-col w-[228px] pr-5">
                    <span className="mb-2 text-sm font-semibold">Products</span>
                    <ul className="flex flex-col">
                      {footerProducts.map((product) => {
                        return (
                          <li key={product.name} className="my-2">
                            <a
                              className="transition cursor-pointer text-sm text-gray-500 hover:text-black"
                              target={
                                product.href.startsWith("/")
                                  ? "_self"
                                  : "_blank"
                              }
                              href={product.href}
                            >
                              {product.name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="flex flex-col w-[228px]">
                    <span className="mb-2 text-sm font-semibold">
                      Resources
                    </span>
                    <ul className="flex flex-col">
                      {footerResources.map((resource) => {
                        return (
                          <li key={resource.name} className="my-2">
                            <a
                              className="transition cursor-pointer text-sm text-gray-500 hover:text-black"
                              key={resource.name}
                              target={
                                resource.href.startsWith("/")
                                  ? "_self"
                                  : "_blank"
                              }
                              href={resource.href}
                            >
                              {resource.name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:border-t lg:border-gray-200 w-full flex flex-col lg:flex-row lg:justify-between gap-5 pt-5">
                <p className="text-gray-500 text-sm leading-5 font-normal">
                  &copy; NameHash Labs. All Rights Reserved
                </p>

                <div className="flex gap-3">
                  <Link
                    href="https://x.com/NamehashLabs"
                    target="_blank"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200 fill-current" />
                  </Link>

                  <Link
                    href="https://github.com/namehash"
                    target="_blank"
                    aria-label="Github"
                  >
                    <GithubIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200 fill-current" />
                  </Link>

                  <Link
                    href="https://warpcast.com/namehash"
                    target="_blank"
                    aria-label="Farcaster"
                  >
                    <FarcasterIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200 fill-current" />
                  </Link>

                  <Link
                    href="https://t.me/namehash"
                    target="_blank"
                    aria-label="Telegram"
                  >
                    <TelegramIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200 fill-current" />
                  </Link>

                  <Link href="mailto:hello@namehashlabs.org" aria-label="Email">
                    <EmailIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200 fill-current" />
                  </Link>
                </div>

                <div className="flex space-x-1 not-italic font-normal text-gray-500 text-sm xSmall:font-light">
                  <span>
                    Made with
                    <span className="text-[#EF4444] mx-1">{"❤️"}</span>
                    by
                  </span>
                  <a
                    className="cursor-pointer text-black underline decoration-current underline-offset-[4px] transition-all duration-200 hover:underline-offset-[2px]"
                    href="/"
                  >
                    NameHash Labs
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
