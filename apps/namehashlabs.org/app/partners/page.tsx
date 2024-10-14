import { type Metadata } from "next";

import { PartnersPage } from "@/components/3 - organisms/partners-section";

const title = "Partners";
const description = "NameHash Labs Partners.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["ens", "web3", "eth", "referral program"],
  openGraph: {
    title,
    description,
    url: "/partners",
    siteName: "NameHash Labs",
  },
  twitter: {
    title,
    description,
  },
};

export default function Page() {
  return <PartnersPage />;
}
