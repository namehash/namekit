import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Favicon from "../../public/favicon/favicon_package_v0-2/favicon.ico";
import AppleTouchIcon from "../../public/favicon/favicon_package_v0-2/apple-touch-icon.png";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NameGuard - Protect your community with NameGuard for ENS",
  description: "Guard your users from heartbreak and encourage best practice usage of ENS.",
  icons: [
      { rel: 'icon', url: Favicon.src },
      {rel: 'apple-touch-icon', url: AppleTouchIcon.src},
    ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
