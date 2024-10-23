import { type Metadata } from "next";
import { Metadata as NamehashMetadata } from "@namehash/internal";

import { BrandAssets } from "@/components/2 - molecules/brand-assets";

const title = "Brand Assets";
const description = "Brand assets for NameHash Labs.";

export const metadata: Metadata = {
  ...NamehashMetadata.defaultMetdata,
  title,
  description,
  keywords: ["ens", "web3", "eth", "namehash", "brand assets"],
  openGraph: {
    ...NamehashMetadata.defaultMetdata.openGraph,
    title,
    description,
    url: "/brand-assets",
    siteName: "NameHash Labs",
  },
  twitter: {
    ...NamehashMetadata.defaultMetdata.twitter,
    title,
    description,
  },
};

export default function Page() {
  return <BrandAssets />;
}
