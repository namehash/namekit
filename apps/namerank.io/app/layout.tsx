import "./globals.css";
import "@namehash/ens-webfont";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "NameRank Demo",
  description: "Tokenize and analyze names with NameRank demo",
};

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="py-12">{children}</div>
      </body>
    </html>
  );
}
