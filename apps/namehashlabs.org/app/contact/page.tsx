import { type Metadata } from "next";
import { Metadata as NamehashMetadata } from "@namehash/internal";

import { ContactSection } from "@/components/2 - molecules/contact-us-section";

const description = "Contact NameHash Labs.";

export const metadata: Metadata = {
  ...NamehashMetadata.defaultMetdata,
  title: "Contact Us",
  description,
  keywords: ["ens", "web3", "eth", "namehash", "contact"],
  openGraph: {
    ...NamehashMetadata.defaultMetdata.openGraph,
    title: "NameHash Labs - Contact Us",
    description,
    url: "/contact",
  },
  twitter: {
    ...NamehashMetadata.defaultMetdata.twitter,
    title: "NameHash Labs - Contact Us",
    description,
  },
};

export default function Page() {
  return <ContactSection />;
}
