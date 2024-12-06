import { Inter } from "next/font/google";
import "./globals.css";
import { Github } from "lucide-react";
import Link from "next/link";
import { NameHashLabsLogo } from "@/components/NamehashLabsLogo";
import { ServiceProviderBadge } from "@/components/serviceProviderBadge";
import { EmailIcon } from "../components/EmailIcon";
import { GithubIcon } from "@/components/GithubIcon";
import { TwitterIcon } from "@/components/TwitterIcon";
import { FarcasterIcon } from "@/components/FarcasterIcon";
import { TelegramIcon } from "@/components/TelegramIcon";
import { Button } from "@/components/ui/button";

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
    href: "/contact",
  },
  {
    name: "Careers",
    href: "/careers",
  },
  {
    name: "Partners",
    href: "/partners",
  },
  {
    name: "Brand assets",
    href: "/brand-assets",
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
                <div className="flex flex-row justify-between items-center gap-1 cursor-pointer flex-shrink-0 pr-2">
                  <a
                    href="/"
                    className="text-black not-italic font-bold text-[22.683px] leading-[22.683px] tracking-[-0.907px] sm:text-[27.816px] sm:leading-[27.816px] sm:tracking-[-1.113px]"
                  >
                    NameGuard
                  </a>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between md:gap-5 h-[40px]">
                <div className="hidden items-center justify-center lg:flex gap-2">
                  <div className="hidden items-center justify-center xl:flex gap-2">
                    <Button variant="ghost" asChild>
                      <Link href="https://api.nameguard.io/docs">Docs</Link>
                    </Button>

                    <Button variant="ghost" asChild>
                      <Link href="https://github.com/namehash/namekit">
                        <GithubIcon className="hidden md:block fill-current" />{" "}
                        GitHub
                      </Link>
                    </Button>
                  </div>

                  <Button variant="ghost" asChild>
                    <a href="/contact">Contact</a>
                  </Button>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
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
                  © NameHash Labs. All Rights Reserved
                </p>

                <div className="flex gap-3">
                  <Link
                    href="https://x.com/NamehashLabs"
                    target="_blank"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200" />
                  </Link>

                  <Link
                    href="https://github.com/namehash"
                    target="_blank"
                    aria-label="Github"
                  >
                    <GithubIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200" />
                  </Link>

                  <Link
                    href="https://warpcast.com/namehash"
                    target="_blank"
                    aria-label="Farcaster"
                  >
                    <FarcasterIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200" />
                  </Link>

                  <Link
                    href="https://t.me/namehash"
                    target="_blank"
                    aria-label="Telegram"
                  >
                    <TelegramIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200" />
                  </Link>

                  <Link href="mailto:hello@namehashlabs.org" aria-label="Email">
                    <EmailIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200" />
                  </Link>
                </div>

                <div className="flex space-x-1 not-italic font-normal text-gray-500 text-sm xSmall:font-light">
                  <span>
                    Made with
                    <span className="text-[#EF4444] mx-1">{"❤️"}</span>
                    by
                  </span>
                  <a className="!text-black" href="/">
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
