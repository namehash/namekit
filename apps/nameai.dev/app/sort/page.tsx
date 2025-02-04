import { nameai } from "@namehash/nameai";
import { Heading, Text } from "@namehash/namekit-react";
import type { Metadata } from "next";

import { Client } from "./client";
import {
  defaultMetaOpengraph,
  defaultMetaTwitter,
} from "@/app/shared-metadata";

export interface LabelItem {
  label: string;
  sortScore: number;
}

const defaultLabels = ["vitalik", "ethereum", "web3", "blockchain", "defi"];

async function getInitialLabelsItems(): Promise<LabelItem[]> {
  const loadedNames = await Promise.all(
    defaultLabels.map(async (label) => {
      const result = await nameai.inspectName(label);
      return {
        label,
        sortScore: result.nameai.sort_score,
      };
    }),
  );

  return loadedNames.sort((a, b) => b.sortScore - a.sortScore);
}

export default async function SortPage() {
  const initialLabels = await getInitialLabelsItems();

  return (
    <div className="relative bg-blue">
      <div
        className="absolute top-0 left-0 w-full h-full z-0"
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
          <Heading as="h1">AI Sort Demo</Heading>
          <Text as="p" className="text-gray-500">
            Bring names more likely to be interesting to the top.
          </Text>
        </div>

        <Client initialLabels={initialLabels} />
      </div>
    </div>
  );
}

const title = "AI Sort";
const description = "Bring names more likely to be interesting to the top.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    ...defaultMetaOpengraph,
    title,
    description,
    url: "/sort",
  },
  twitter: {
    ...defaultMetaTwitter,
    title,
    description,
  },
};
