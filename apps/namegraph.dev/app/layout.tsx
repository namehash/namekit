import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { NameHashLabsLogo } from "@/components/footer/namehash-labs-logo";
import { ServiceProviderBadge } from "@/components/footer/service-provider-badge";
import { FarcasterIcon } from "@/components/footer/farcaster-icon";
import { TelegramIcon } from "@/components/footer/telegram-icon";
import { TwitterIcon } from "@/components/footer/twitter-icon";
import { GithubIcon } from "@/components/footer/github-icon";
import { EmailIcon } from "../components/footer/email-icon";
import { TldSelect } from "@/components/tld-select";
import { Providers } from "@/components/providers";
import { Button } from "@/components/ui/button";
import "@namehash/namekit-react/styles.css";
import "@namehash/nameguard-react/styles.css";
import "ethereum-identity-kit/css";
import NextLink from "next/link";
import { SearchFieldWithUrl } from "@/components/collections/search-field-with-url";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NameGraph",
  description: "Explore and discover names",
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
    href: "/ens-referral-program",
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
      <Providers>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            <header className="sticky bg-white top-0 w-full z-50 border-b border-gray-300 h-[56px] py-[9px] sm:h-[70px] sm:py-4 select-none max-w-[100vw] overflow-hidden">
              <div className="max-w-7xl mx-auto items-center justify-between flex flex-row px-6">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row justify-between items-center gap-1 cursor-pointer flex-shrink-0 pr-2">
                    <a
                      href="/"
                      className="text-black not-italic font-bold text-[22.683px] leading-[22.683px] tracking-[-0.907px] sm:text-[27.816px] sm:leading-[27.816px] sm:tracking-[-1.113px]"
                    >
                      NameGraph
                    </a>
                  </div>
                  <NextLink href="/">
                    <div className="relative -top-1.5 bg-black w-fit h-fit p-[2.8px] rounded-[2.8px] flex-shrink-0">
                      <p className="text-white not-italic font-semibold pb-[0.5px] text-[6.857px] leading-[7.619px] sm:text-[8.409px] sm:leading-[9.343px]">
                        beta
                      </p>
                    </div>
                  </NextLink>
                </div>
                <div className="w-full px-6">
                  <SearchFieldWithUrl />
                </div>
                <div className="flex flex-row items-center justify-between md:gap-5 h-[40px]">
                  <TldSelect />
                  <div className="hidden items-center justify-center lg:flex gap-2">
                    <div className="hidden items-center justify-center xl:flex gap-2">
                      <Button variant="ghost" asChild>
                        <Link href="http://api.namegraph.dev/docs">
                          API Docs
                        </Link>
                      </Button>

                      <Button variant="ghost" asChild>
                        <Link href="https://github.com/namehash/namegraph">
                          <GithubIcon className="hidden md:block fill-current" />{" "}
                          GitHub
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <Providers>
              <main className="flex-1">{children}</main>
            </Providers>
            <footer className="lg:px-[50px] px-5 flex items-center justify-center w-full border-t border-gray-200">
              <div className="pt-8 pb-5 flex flex-col gap-10 items-start justify-between w-full max-w-[1216px]">
                <div className="w-full gap-5 flex flex-col lg:flex-row lg:justify-between">
                  <div className="flex flex-col gap-5">
                    <NameHashLabsLogo />

                    <p className="text-sm font-light text-gray-500 max-w-[339px] leading-6">
                      Founded in 2022, Namehash Labs is a technology
                      organization dedicated to infrastructure-level solutions
                      that helps the Ethereum Name Service (ENS) Protocol grow.
                    </p>

                    <ServiceProviderBadge />
                  </div>

                  <div className="flex justify-start">
                    <div className="flex flex-col w-[228px] pr-5">
                      <span className="mb-2 text-sm font-semibold">
                        Products
                      </span>
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

                    <Link
                      href="mailto:hello@namehashlabs.org"
                      aria-label="Email"
                    >
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
      </Providers>
    </html>
  );
}
