import { Link } from "@namehash/namekit-react";
import NextLink from "next/link";
import {
  EfpIcon,
  EmailIcon,
  FarcasterIcon,
  GithubIcon,
  NameHashLabsLogo,
  ServiceProviderBadge,
  TelegramIcon,
  TwitterIcon,
} from "./icons";
const footerProducts = [
  {
    name: "ENSNode",
    href: "https://ensnode.io",
  },
  {
    name: "ENSRainbow",
    href: "https://ensrainbow.io",
  },
  {
    name: "ENSAdmin",
    href: "https://admin.ensnode.io",
  },
  {
    name: "ENSv2 Referral Programs",
    href: "https://namehashlabs.org/ens-v2-referral-programs",
  },
  {
    name: "NameGraph",
    href: "https://namegraph.dev",
  },
  {
    name: "NameAI",
    href: "https://nameai.io/",
  },
  {
    name: "NameGuard",
    href: "https://nameguard.io",
  },
  {
    name: "NameKit",
    href: "https://namekit.io",
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

type FooterProps = {
  openResourcesInNewTab?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Footer = ({
  openResourcesInNewTab = true,
  ...props
}: FooterProps) => {
  return (
    <section
      className="lg:px-[50px] px-5 flex items-center justify-center w-full border-t border-gray-200"
      {...props}
    >
      <div className="pt-8 pb-5 flex flex-col gap-10 items-start justify-between w-full max-w-[1216px]">
        <div className="w-full gap-5 flex flex-col lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-5">
            <NameHashLabsLogo />

            <p className="text-sm font-light text-gray-500 max-w-[339px] leading-6">
              Founded in 2022, Namehash Labs is dedicated to developing open
              source infrastructure that helps the Ethereum Name Service (ENS)
              Protocol grow.
            </p>

            <ServiceProviderBadge />
          </div>

          <div className="flex justify-start">
            <div className="flex flex-col w-[228px] pr-5">
              <span className="mb-2 text-sm font-semibold">Infrastructure</span>
              <ul className="flex flex-col">
                {footerProducts.map((product) => {
                  return (
                    <li key={product.name} className="my-2">
                      <Link asChild variant="secondary" size="small">
                        <NextLink
                          target={
                            new URL(product.href).host === "namehashlabs.org" &&
                            !openResourcesInNewTab
                              ? "_self"
                              : "_blank"
                          }
                          href={product.href}
                        >
                          {product.name}
                        </NextLink>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-col w-[228px]">
              <span className="mb-2 text-sm font-semibold">Resources</span>
              <ul className="flex flex-col">
                {footerResources.map((resource) => {
                  return (
                    <li key={resource.name} className="my-2">
                      <Link
                        key={resource.name}
                        asChild
                        variant="secondary"
                        size="small"
                      >
                        <NextLink
                          href={resource.href}
                          target={openResourcesInNewTab ? "_blank" : "_self"}
                        >
                          {resource.name}
                        </NextLink>
                      </Link>
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

          <div className="flex items-center gap-3">
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
              href="https://efp.app/namehashlabs.eth"
              target="_blank"
              aria-label="EFP"
            >
              <EfpIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200 w-6 h-6" />
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
            <Link
              href="https://namehashlabs.org/"
              variant="underline"
              size="small"
              asChild
            >
              <NextLink
                target={!openResourcesInNewTab ? "_self" : "_blank"}
                className="!text-black"
                href="https://namehashlabs.org/"
              >
                NameHash Labs
              </NextLink>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
