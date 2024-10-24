import { type Metadata } from "next";
import { Metadata as NamehashMetadata } from "@namehash/internal";

import { PartnersPage } from "@/components/3 - organisms/partners-section";

const title = "Partners";
const description = "NameHash Labs Partners.";

export const metadata: Metadata = {
  ...NamehashMetadata.defaultMetdata,
  title,
  description,
  keywords: ["ens", "web3", "eth", "referral program"],
  openGraph: {
    ...NamehashMetadata.defaultMetdata.openGraph,
    title,
    description,
    url: "/partners",
    siteName: "NameHash Labs",
  },
  twitter: {
    ...NamehashMetadata.defaultMetdata.twitter,
    title,
    description,
  },
};

export default function Page() {
  return <PartnersPage />;
}
