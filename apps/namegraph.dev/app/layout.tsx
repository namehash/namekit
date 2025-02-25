import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { GithubIcon } from "@/components/footer/github-icon";
import { TldSelect } from "@/components/tld-select";
import { Providers } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Footer } from "@namehash/internal";
import "@namehash/namekit-react/styles.css";
import "@namehash/nameguard-react/styles.css";
import "ethereum-identity-kit/css";
import NextLink from "next/link";
import { SearchFieldWithUrl } from "@/components/collections/search-field-with-url";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NameGraph",
  description: "Explore and discover names",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            <header className="sticky bg-white top-0 w-full z-50 border-b border-gray-300 h-[56px] py-[9px] sm:h-[70px] sm:py-4 select-none">
              <div className="max-w-7xl mx-auto items-center justify-between flex flex-row px-6">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row justify-between items-center gap-1 cursor-pointer flex-shrink-0 pr-2">
                    <a
                      href="/"
                      className="text-black not-italic font-bold text-[22.683px] leading-[22.683px] tracking-[-0.907px] sm:text-[27.816px] sm:leading-[27.816px] sm:tracking-[-1.113px]"
                    >
                      NameGraph
                    </a>
                  </div>
                  <NextLink href="/">
                    <div className="relative -top-1.5 bg-black w-fit h-fit p-[2.8px] rounded-[2.8px] flex-shrink-0">
                      <p className="text-white not-italic font-semibold pb-[0.5px] text-[6.857px] leading-[7.619px] sm:text-[8.409px] sm:leading-[9.343px]">
                        beta
                      </p>
                    </div>
                  </NextLink>
                </div>
                <div className="w-full px-6">
                  <SearchFieldWithUrl />
                </div>
                <div className="flex flex-row items-center justify-between md:gap-5 h-[40px]">
                  <TldSelect />
                  <div className="hidden items-center justify-center lg:flex gap-2">
                    <div className="hidden items-center justify-center xl:flex gap-2">
                      <Button variant="ghost" asChild>
                        <Link href="http://api.namegraph.dev/docs">
                          API Docs
                        </Link>
                      </Button>

                      <Button variant="ghost" asChild>
                        <Link href="https://github.com/namehash/namegraph">
                          <GithubIcon className="hidden md:block fill-current" />{" "}
                          GitHub
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <Providers>
              <main className="flex-1">{children}</main>
            </Providers>
            <Footer />
          </div>
        </body>
      </Providers>
    </html>
  );
}
