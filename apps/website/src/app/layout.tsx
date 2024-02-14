import "./globals.css";
import "@namehash/ens-webfont";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Favicon from "../../public/favicon/favicon_package_v0-2/favicon.ico";
import AppleTouchIcon from "../../public/favicon/favicon_package_v0-2/apple-touch-icon.png";
import { NameGuardWrapper } from "./components/NameGuardWrapper";

import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nameguard.io"),
  title: "NameGuard - Protect your community with NameGuard for ENS",
  description:
    "Guard your users from heartbreak and encourage best practice usage of ENS.",
  keywords: ["nameguard", "normalization", "ens", "web3", "eth"],
  icons: [
    { rel: "icon", url: Favicon.src },
    { rel: "apple-touch-icon", url: AppleTouchIcon.src },
  ],
  openGraph: {
    type: "website",
    title: "NameGuard - Protect your community with NameGuard for ENS",
    description:
      "Guard your users from heartbreak and encourage best practice usage of ENS.",
    url: "https://nameguard.io",
    images: {
      url: "https://nameguard.io/openGraph/og-image.png",
      alt: "NameGuard - Protect your community with NameGuard for ENS",
    },
  },
  twitter: {
    card: "summary_large_image",
    site: "@NamehashLabs",
    creator: "@NamehashLabs",
    description:
      "Guard your users from heartbreak and encourage best practice usage of ENS.",
    images: {
      url: "https://nameguard.io/openGraph/og-image-twitter.png",
      alt: "NameGuard - Protect your community with NameGuard for ENS",
    },
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
