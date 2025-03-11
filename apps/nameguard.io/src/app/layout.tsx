import "./globals.css";
import "@namehash/ens-webfont";
import "@namehash/nameguard-react/styles.css";
import "@namehash/namekit-react/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NameGuardWrapper } from "@/components/molecules/NameGuardWrapper";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/organisms";
import { Footer } from "@namehash/internal";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

import {
  baseUrl,
  siteName,
  defaultMetaTitle as title,
  defaultMetaDescription as description,
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
  description,
  keywords,
  openGraph: {
    ...defaultMetaOpengraph,
    title: {
      template: `${siteName} - %s`,
      default: title,
    },
    description,
    url: "/",
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
        <Header />
        {children}
        <Footer openResourcesInNewTab={true} />
        <Analytics />
        <SpeedInsights />
        <NameGuardWrapper />
      </body>
    </html>
  );
}
