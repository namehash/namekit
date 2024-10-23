import { type Metadata } from "next";
import { Metadata as NamehashMetadata } from "@namehash/internal";

import { BrandAssets } from "@/components/2 - molecules/brand-assets";

const description = "Brand assets for NameHash Labs.";

export const metadata: Metadata = {
  title: "Brand Assets",
  description,
  keywords: ["ens", "web3", "eth", "namehash", "brand assets"],
  openGraph: {
    ...NamehashMetadata.defaultMetdata.openGraph,
    title: "NameHash Labs - Brand Assets",
    description,
    url: "/brand-assets",
    siteName: "NameHash Labs",
  },
  twitter: {
    ...NamehashMetadata.defaultMetdata.twitter,
    title: "NameHash Labs - Brand Assets",
    description,
  },
};

export default function Page() {
  return <BrandAssets />;
}
