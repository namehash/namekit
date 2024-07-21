import type { Metadata } from "next";

export const defaultMetdata: Metadata = {
  ...(process.env.VERCEL_PROJECT_PRODUCTION_URL && {
    metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  }),
  keywords: ["ens", "web3", "eth", "nameguard", "namegraph", "namekit"],
  twitter: {
    card: "summary_large_image",
    site: "@NamehashLabs",
    creator: "@NamehashLabs",
  },
  openGraph: {
    type: "website",
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL && {
      url: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    }),
  },
};
