import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

import "./globals.css";
import { Avatar } from "./components/Avatar";
import { SecurePrimaryName } from "./components/SecurePrimaryName";
import { SecurePrimaryNameLoading } from "./components/SecurePrimaryNameLoading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NameGuard Example: Next.js App Router",
};

const messages = [
  {
    address: "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776",
  },
  {
    address: "0x9d32572997DA4948063E3Fc11c2552Eb82F7208E",
  },
  {
    address: "0xfA9A134f997b3d48e122d043E12d04E909b11073",
  },
  {
    address: "0xaf738F6C83d7D2C46723b727Ce794F9c79Cc47E6",
  },
  {
    address: "0x794911B0d7bEe86c2E6c2b5d129d5202D94C6B87",
  },
  {
    address: "0xd0eFbeDFEd3C813fEB87248dABfc5d5AB21770dF",
  },
  {
    address: "0xD52d7Fc160DF558F3b284CD544c17124D60d223e",
  },
  {
    address: "0x7c7160A23b32402ad24ED5a617b8a83f434642d4",
  },
  {
    address: "0x23503CE307b3990Da8B8ab275D657aA604B937F2",
  },
  {
    address: "0x99578a1a733456aA292Ea2b4583253Fa814B16a7",
  },
  {
    address: "0xd39EF1Bd16F75649ae71E69198F615f729B64C13",
  },
  {
    address: "0x4735F0ce83c1d328045a7737a7Dd53504714DFA5",
  },
  {
    address: "0xf4A4D9C75dA65d507cfcd5ff0aCB73D40D3A3bCB",
  },
] as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-full md:h-full overflow-auto flex flex-col md:flex-row">
          <div className="flex">
            <div className="flex flex-col justify-between h-screen bg-white px-3 border-r border-gray-200 shadow-lg w-16">
              <div></div>
              <div></div>
            </div>
            <div className="flex flex-col h-screen overflow-y-auto w-[350px]">
              <div className="border-l border-r border-b border-gray-200 bg-gray-100 h-16 p-4 pt-5 flex items-center">
                <div className="flex justify-between items-center">
                  <span className="flex">
                    <h1 className="font-bold text-lg mr-2">All messages</h1>
                  </span>
                </div>
              </div>
              <div className="overflow-y-scroll flex flex-col h-full bg-gray-100 border-x">
                {messages.map(({ address }, index) => (
                  <Link
                    key={index}
                    href={`/address/${address}`}
                    className="flex items-center border-0 border-b border-gray-200 outline-blue outline-b-0 h-min cursor-pointer p-4 hover:bg-gray-200 space-x-3 font-mono"
                  >
                    <Avatar address={address} />
                    <Suspense fallback={<SecurePrimaryNameLoading address={address} />}>
                      <SecurePrimaryName address={address} />
                    </Suspense>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col h-screen overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
