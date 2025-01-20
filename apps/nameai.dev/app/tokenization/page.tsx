import { Suspense } from "react";
import type { Metadata } from "next";

import { RankForm } from "./rank-form";
import Results from "./results";
import { Skeleton } from "../skeleton";
import { Heading, Text } from "@namehash/namekit-react";
import {
  defaultMetaOpengraph,
  defaultMetaTwitter,
} from "@/app/shared-metadata";
import { notFound } from "next/navigation";

interface Props {
  searchParams?: Promise<{
    label?: string;
  }>;
}

export default async function TokenizePage(props: Props) {
  const searchParams = await props.searchParams;
  const label = searchParams?.label || "";
  const labelForAnalysis = label.includes(".") ? label.split(".")[0] : label;

  return (
    <div className="max-w-3xl mx-auto px-6 flex-1 py-12 md:py-20">
      <div className="text-center mb-6 md:mb-12 space-y-3">
        <Heading as="h1">Label Tokenization</Heading>
        <Text as="p" className="text-gray-500">
          Discover the words that otherwise hidden in labels.
        </Text>
      </div>

      <RankForm initialLabel={label} />
      {labelForAnalysis && (
        <Suspense fallback={<Skeleton label={labelForAnalysis} />}>
          <Results name={labelForAnalysis} />
        </Suspense>
      )}
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const label = searchParams?.label || "";

  if (!label) return notFound();

  const labelForAnalysis = label.includes(".") ? label.split(".")[0] : label;

  const title = `Label tokenization for ${labelForAnalysis}`;
  const description = "Discover the words that otherwise hidden in labels";
  const url = `/tokenization?label=${labelForAnalysis}`;

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
