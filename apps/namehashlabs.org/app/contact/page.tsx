import { type Metadata } from "next";

import { ContactSection } from "@/components/2 - molecules/contact-us-section";

const description = "Contact NameHash Labs.";

export const metadata: Metadata = {
  title: "Contact Us",
  description,
  keywords: ["ens", "web3", "eth", "namehash", "contact"],
  openGraph: {
    title: "NameHash Labs - Contact Us",
    description,
  },
  twitter: {
    title: "NameHash Labs - Contact Us",
    description,
  },
};

export default function Page() {
  return <ContactSection />;
}
