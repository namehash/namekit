import "./globals.css";
import "@namehash/namekit-react/styles.css";
import "@namehash/ens-webfont";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { HeadlineBanner } from "@/components/1 - atoms";
import { Header } from "@/components/2 - molecules/header";
import { Footer } from "@/components/2 - molecules";

import {
  baseUrl,
  siteName,
  defaultMetaTitle as title,
  defaultMetaDescription as description,
  defaultMetaKeywords as keywords,
  defaultMetaOpengraph,
  defaultMetaTwitter,
} from "./shared-metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: `${siteName} - %s`,
    default: title,
  },
  description,
  keywords,
  openGraph: {
    ...defaultMetaOpengraph,
    title: {
      template: `${siteName} - %s`,
      default: title,
    },
    description,
  },
  twitter: {
    ...defaultMetaTwitter,
    title: {
      template: `${siteName} - %s`,
      default: title,
    },
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
