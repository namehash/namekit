import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./fonts.css";

import Head from "next/head";
import { Header } from "@/components/organisms/header";
import { NamekitFooter } from "@/components/organisms/namekit-footer";
import { Inter } from "next/font/google";

const unifont = localFont({
  src: "./fonts/unifont.otf",
  variable: "--font-unifont",
});

const adobeBlank = localFont({
  src: "./fonts/AdobeBlank.ttf",
  variable: "--font-adobe-blank",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NameKit - Engaging ENS user journeys made easy",
  description:
    "Easily integrate rich ENS user journeys into your wallet or web3 app. Customize NameKit to match your brand and UI.",
  keywords: "ens, web3, eth, namekit, SDK, API, UI",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: "#ffffff",
  other: {
    "msapplication-TileColor": "#da532c",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>
      <body
        className={`${inter.variable} ${unifont.variable} ${adobeBlank.variable} antialiased`}
      >
        <Header />
        {children}
        <NamekitFooter />
      </body>
    </html>
  );
}
