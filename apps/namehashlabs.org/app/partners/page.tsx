import { type Metadata } from "next";

import { PartnersPage } from "@/components/3 - organisms/partners-section";

export const metadata: Metadata = {
  title: "Partners",
  description: "NameHash Labs partners.",
  keywords: ["ens", "web3", "eth", "namehash", "partners"],
};

export default function Page() {
  return <PartnersPage />;
}
