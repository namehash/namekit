import { type Metadata } from "next";

import { BrandAssets } from "@/components/2 - molecules/brand-assets";

const description = "Brand assets for NameHash Labs.";

export const metadata: Metadata = {
  title: "Brand Assets",
  description,
  keywords: ["ens", "web3", "eth", "namehash", "brand assets"],
  openGraph: {
    title: "NameHash Labs - Brand Assets",
    description,
  },
  twitter: {
    title: "NameHash Labs - Brand Assets",
    description,
  },
};

export default function Page() {
  return <BrandAssets />;
}
