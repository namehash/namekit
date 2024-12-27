import type { Metadata } from "next";
import "./../styles/globals.css";
import "@namehash/ens-webfont";

import Head from "next/head";
import { Header } from "@/components/organisms/header";
import { NamekitFooter } from "@/components/organisms/namekit-footer";
import { Inter } from "next/font/google";

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
        <script src="https://app.cal.com/embed.js" async></script>
      </Head>
      <body className={`${inter.variable} ens-webfont`}>
        <Header />
        {children}
        <NamekitFooter />
      </body>
    </html>
  );
}
