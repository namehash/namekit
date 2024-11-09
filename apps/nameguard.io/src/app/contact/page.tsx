import { type Metadata } from "next";
import { ContactSection } from "@/components/organisms/ContactUsSection";

const title = "Contact Us";
const description = "Contact NameGuard.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/contact",
  },
  twitter: {
    title,
    description,
  },
};

export default function Page() {
  return <ContactSection />;
}
