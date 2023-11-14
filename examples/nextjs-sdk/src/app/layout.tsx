/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import "./globals.css";
import { Avatar } from "./components/Avatar";
import { ToggleNameGuard } from "./components/ToggleNameGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NameGuard Example: Next.js App Router",
};

const messages = [
  {
    address: "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776",
  },
  {
    address: "0xFD9eE68000Dc92aa6c67F8f6EB5d9d1a24086fAd",
  },
  {
    address: "0xFF040ebe9806689aBD1414e47EA61F70E18fe660",
  },
  {
    address: "0x63A93f5843aD57d756097ef102A2886F05c7a29c",
  },
  {
    address: "0xfA9A134f997b3d48e122d043E12d04E909b11073",
  },
  {
    address: "0xa007D946BaD4e53C4E57f37E7e10Bef28e5bbc5E",
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
            <div className="flex flex-col w-full h-screen overflow-y-auto md:max-w-[350px]">
              <div className="border-l border-r border-b border-gray-200 bg-gray-100 h-16 p-4 pt-5 flex items-center">
                <ToggleNameGuard />
              </div>
              <div className="overflow-hidden flex flex-col h-full bg-gray-100 border-x">
                {messages.map(({ address }, index) => (
                  <Link
                    key={index}
                    href={`/address/${address}`}
                    className="flex justify-between items-center border-0 border-b border-gray-200 outline-blue outline-b-0 h-min cursor-pointer p-4 hover:bg-gray-200 space-x-3 font-mono"
                  >
                    <Avatar address={address} />
                    <span className="overflow-clip overflow-ellipsis">
                      {address}
                    </span>
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
