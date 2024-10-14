import { type Metadata } from "next";
import { ContactSection } from "@/components/organisms/ContactUsSection";

export default function Page() {
  return <ContactSection />;
}

const description = "Contact NameGuard.";

export const metadata: Metadata = {
  title: "Contact Us",
  description,
  openGraph: {
    title: "NameGuard - Contact Us",
    description,
  },
  twitter: {
    title: "NameGuard - Contact Us",
    description,
  },
};
