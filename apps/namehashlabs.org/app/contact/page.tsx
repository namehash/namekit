import { type Metadata } from "next";

import { ContactSection } from "@/components/2 - molecules/contact-us-section";

import { defaultMetaOpengraph, defaultMetaTwitter } from "../shared-metadata";

const title = "Contact Us";
const description = "Contact NameHash Labs.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["ens", "web3", "eth", "namehash", "contact"],
  openGraph: {
    ...defaultMetaOpengraph,
    title,
    description,
    url: "/contact",
  },
  twitter: {
    ...defaultMetaTwitter,
    title,
    description,
  },
};

export default function Page() {
  return <ContactSection />;
}
