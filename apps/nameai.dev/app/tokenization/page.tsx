import type { Metadata } from "next";
import { Form } from "./form";
import { Heading, Text } from "@namehash/namekit-react";
import {
  defaultMetaOpengraph,
  defaultMetaTwitter,
} from "@/app/shared-metadata";

interface Props {
  searchParams?: Promise<{
    label?: string;
  }>;
}

export default async function TokenizePage(props: Props) {
  const searchParams = await props.searchParams;
  const label = searchParams?.label || "";

  return (
    <div className="max-w-3xl mx-auto px-6 flex-1 py-12 md:py-20">
      <div className="text-center mb-6 md:mb-12 space-y-3">
        <Heading as="h1">Label Tokenization</Heading>
        <Text as="p" className="text-gray-500">
          Discover the words that otherwise hidden in labels.
        </Text>
      </div>

      <Form initialValue={label} />
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const label = searchParams?.label || "";

  const labelForAnalysis = label.includes(".") ? label.split(".")[0] : label;

  const title = labelForAnalysis
    ? `Label tokenization for ${labelForAnalysis}`
    : "Label Tokenization";
  const description = "Discover the words that otherwise hidden in labels";
  const url = labelForAnalysis
    ? `/tokenization?label=${labelForAnalysis}`
    : "/tokenization";

  return {
    title,
    description,
    openGraph: {
      ...defaultMetaOpengraph,
      title,
      description,
      url,
    },
    twitter: {
      ...defaultMetaTwitter,
      title,
      description,
    },
  };
}
