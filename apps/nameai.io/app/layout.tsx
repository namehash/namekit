import "./globals.css";
import "@namehash/namekit-react/styles.css";
import "@namehash/ens-webfont";

import { Inter } from "next/font/google";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@namehash/namekit-react";
import { Toaster } from "sonner";
import { Footer } from "@namehash/internal";

const inter = Inter({ subsets: ["latin"] });

import {
  baseUrl,
  siteName,
  defaultMetaTitle as title,
  defaultMetaKeywords as keywords,
  defaultMetaOpengraph,
  defaultMetaTwitter,
} from "./shared-metadata";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: `${siteName} - %s`,
    default: title,
  },
  description: "What will you build?",
  keywords,
  openGraph: {
    ...defaultMetaOpengraph,
    title: {
      template: `${siteName} - %s`,
      default: title,
    },
    description: "What will you build?",
    url: "/",
  },
  twitter: {
    ...defaultMetaTwitter,
    title: {
      template: `${siteName} - %s`,
      default: title,
    },
    description: "What will you build?",
  },
};

const demoLinks = [
  {
    text: "AI Tokenization",
    href: "/tokenization",
  },
  {
    text: "AI Sort",
    href: "/sort",
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
                  <Link
                    href="/"
                    className="text-black not-italic font-bold text-[22.683px] leading-[22.683px] tracking-[-0.907px] sm:text-[27.816px] sm:leading-[27.816px] sm:tracking-[-1.113px]"
                  >
                    NameAI
                  </Link>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between md:gap-5 h-[40px]">
                <div className="items-center justify-center flex gap-2">
                  {demoLinks.map((link) => (
                    <Button key={link.text} variant="ghost" asChild>
                      <Link href={link.href}>{link.text}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <Footer />
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
