/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode } from "react";
import { Header } from "../2 - molecules/header";
import { Footer } from "../2 - molecules";
import { HeadlineBanner } from "../1 - atoms";
import { Inter } from "next/font/google";

interface Props {
  children?: ReactNode;
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const Layout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}></body>
      <div className="w-full">
        <HeadlineBanner />
        <div className="w-full flex flex-col relative items-center justify-center">
          <div className="absolute top-0 left-0 w-full z-40">
            <Header />
          </div>

          {children}
        </div>

        <Footer />
      </div>
    </html>
  );
};
