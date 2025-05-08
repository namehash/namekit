import type { Metadata } from "next";
import "./../styles/globals.css";
import "@namehash/namekit-react/styles.css";
import "@namehash/ens-webfont";

import { Header } from "@/components/organisms/header";
import { Inter } from "next/font/google";
import { Footer } from "@namehash/namehashlabs-react";

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
  openGraph: {
    title: "NameKit - Engaging ENS user journeys made easy",
    description:
      "Easily integrate rich ENS user journeys into your wallet or web3 app. Customize NameKit to match your brand and UI.",
    url: "https://namekit.io",
    images: [
      {
        url: "/images/namekit/og-image.png",
        alt: "NameKit - Engaging ENS user journeys made easy",
      },
    ],
    siteName: "NameKit",
  },
  twitter: {
    card: "summary_large_image",
    title: "NameKit - Engaging ENS user journeys made easy",
    description:
      "Easily integrate rich ENS user journeys into your wallet or web3 app. Customize NameKit to match your brand and UI.",
    images: ["/images/namekit/og-image-twitter.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
