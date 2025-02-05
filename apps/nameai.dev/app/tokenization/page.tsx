import type { Metadata } from "next";
import { Form } from "./form";
import { Heading, Text } from "@namehash/namekit-react";
import Balancer from "react-wrap-balancer";
import {
  defaultMetaOpengraph,
  defaultMetaTwitter,
  defaultTitleTemplate,
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
    <div className="relative bg-blue">
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          width: "100vw",
          height: "472px",
          flexShrink: 0,
          opacity: 0.15,
          background: `linear-gradient(180deg, rgba(249, 250, 251, 0.00) 0%, #F9FAFB 74.87%), 
                    linear-gradient(90deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)`,
        }}
      />
      <div className="max-w-3xl mx-auto px-6 flex-1 py-12 md:py-20">
        <div className="text-center mb-6 md:mb-12 space-y-3">
          <Heading as="h1">AI Tokenization Demo</Heading>
          <Text as="p" className="text-gray-500 text-balance">
            <Balancer>
              Extract recognizable words that are otherwise &quot;smashed
              together&quot; in labels.
            </Balancer>
          </Text>
        </div>

        <Form initialValue={label} />
      </div>
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const label = searchParams?.label || "";

  const labelForAnalysis = label.includes(".") ? label.split(".")[0] : label;

  const title = "AI Tokenization Demo";
  const description =
    'Extract recognizable words that are otherwise "smashed together" in labels.';
  const url = labelForAnalysis
    ? `/tokenization?label=${labelForAnalysis}`
    : "/tokenization";

  return {
    title: defaultTitleTemplate(title),
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
