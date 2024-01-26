import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Favicon from "../../public/favicon/favicon_package_v0-2/favicon.ico";
import AppleTouchIcon from "../../public/favicon/favicon_package_v0-2/apple-touch-icon.png";
import og_img from "../../public/openGraph/og-image.png";
import og_image_twitter from "../../public/openGraph/og-image-twitter.png";
import { NameGuardWrapper } from "./components/NameGuardWrapper";

import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import React from "react";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
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
      url: og_img.src,
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
      url: og_image_twitter.src,
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
        <NameGuardWrapper />
      </body>
    </html>
  );
}
