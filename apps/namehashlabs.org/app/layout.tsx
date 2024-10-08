import "./globals.css";
import "@namehash/namekit-react/styles.css";
import "@namehash/ens-webfont";

import type { Metadata } from "next";
import { Metadata as NamehashMetadata } from "@namehash/seo";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { HeadlineBanner } from "@/components/1 - atoms";
import { Header } from "@/components/2 - molecules/header";
import { Footer } from "@/components/2 - molecules";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "NameHash Labs - Helping ENS Grow";
const description =
  "NameHash Labs builds open source public goods that drive the global adoption of ENS.";
const keywords = ["ens", "web3", "eth", "nameguard", "namekit", "namehash"];

const baseUrl = "https://namehashlabs.org";

export const metadata: Metadata = {
  ...NamehashMetadata.defaultMetdata,
  metadataBase: new URL(baseUrl),
  title: {
    template: "NameHash Labs - %s",
    default: title,
  },
  description,
  keywords,
  openGraph: {
    ...NamehashMetadata.defaultMetdata.openGraph,
    title,
    description,
    siteName: "NameHash Labs",
  },
  twitter: {
    ...NamehashMetadata.defaultMetdata.twitter,
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <div className="w-full">
          <HeadlineBanner />
          <div className="w-full flex flex-col relative items-center justify-center">
            <div className="absolute top-0 left-0 w-full z-40">
              <Header />
            </div>

            {children}
          </div>

          <Footer />
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
