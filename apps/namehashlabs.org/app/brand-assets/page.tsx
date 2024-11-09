import { type Metadata } from "next";

import { defaultMetaOpengraph, defaultMetaTwitter } from "../shared-metadata";

import { BrandAssets } from "@/components/2 - molecules/brand-assets";

const title = "Brand Assets";
const description = "Brand assets for NameHash Labs.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["ens", "web3", "eth", "namehash", "brand assets"],
  openGraph: {
    ...defaultMetaOpengraph,
    title,
    description,
    url: "/brand-assets",
  },
  twitter: {
    ...defaultMetaTwitter,
    title,
    description,
  },
};

export default function Page() {
  return <BrandAssets />;
}
