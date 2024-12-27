import { type Metadata } from "next";

import { PartnersPage } from "@/components/3 - organisms/partners-section";

import { defaultMetaOpengraph, defaultMetaTwitter } from "../shared-metadata";

const title = "Partners";
const description = "NameHash Labs Partners.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["ens", "web3", "eth", "referrals", "partner program"],
  openGraph: {
    ...defaultMetaOpengraph,
    title,
    description,
    url: "/partners",
  },
  twitter: {
    ...defaultMetaTwitter,
    title,
    description,
  },
};

export default function Page() {
  return <PartnersPage />;
}
