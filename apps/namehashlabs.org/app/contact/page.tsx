import { type Metadata } from "next";
import { Metadata as NamehashMetadata } from "@namehash/internal";

import { ContactSection } from "@/components/2 - molecules/contact-us-section";

const title = "Contact Us";
const description = "Contact NameHash Labs.";

export const metadata: Metadata = {
  ...NamehashMetadata.defaultMetdata,
  title,
  description,
  keywords: ["ens", "web3", "eth", "namehash", "contact"],
  openGraph: {
    ...NamehashMetadata.defaultMetdata.openGraph,
    title,
    description,
    url: "/contact",
  },
  twitter: {
    ...NamehashMetadata.defaultMetdata.twitter,
    title,
    description,
  },
};

export default function Page() {
  return <ContactSection />;
}
