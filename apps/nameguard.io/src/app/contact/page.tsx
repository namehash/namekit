import { type Metadata } from "next";
import { ContactSection } from "@/components/organisms/ContactUsSection";

import { defaultMetaOpengraph, defaultMetaTwitter } from "../shared-metadata";

const title = "Contact Us";
const description = "Contact NameGuard.";

export const metadata: Metadata = {
  title,
  description,
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
