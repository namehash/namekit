import "./globals.css";
import "@namehash/ens-webfont";
import "@namehash/namekit-react/styles.css";
import "@namehash/nameguard-react/styles.css";
import "@namehash/namekit-react/styles.css";

import type { Metadata } from "next";
import { Metadata as NamehashMetadata } from "@namehash/seo";
import { Inter } from "next/font/google";
import Favicon from "../../public/favicon/favicon_package_v0-2/favicon.ico";
import AppleTouchIcon from "../../public/favicon/favicon_package_v0-2/apple-touch-icon.png";
import { NameGuardWrapper } from "@/components/molecules/NameGuardWrapper";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer, Header } from "@/components/organisms";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const title = "Protect your community with NameGuard for ENS";
const description =
  "Guard your users from heartbreak and encourage best practice usage of ENS.";

export const metadata: Metadata = {
  ...NamehashMetadata.defaultMetdata,
  metadataBase: new URL("https://nameguard.io"),
  title: {
    template: "NameGuard - %s",
    default: title,
  },
  description,
  icons: [
    { rel: "icon", url: Favicon.src },
    { rel: "apple-touch-icon", url: AppleTouchIcon.src },
  ],
  openGraph: {
    ...NamehashMetadata.defaultMetdata.openGraph,
    title,
    description,
    siteName: "NameGuard",
    url: new URL("https://nameguard.io"),
  },
  twitter: {
    ...NamehashMetadata.defaultMetdata.twitter,
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
        <Footer />
        <Analytics />
        <SpeedInsights />
        <NameGuardWrapper />
      </body>
    </html>
  );
}
