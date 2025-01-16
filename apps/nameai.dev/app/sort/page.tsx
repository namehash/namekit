import { nameai } from "@namehash/nameai";
import { Heading, Text } from "@namehash/namekit-react";

import { Client } from "./client";

export interface LabelItem {
  label: string;
  interestingScore: number;
}

const defaultLabels = ["vitalik", "ethereum", "web3", "blockchain", "defi"];

async function getInitialLabelsItems(): Promise<LabelItem[]> {
  const loadedNames = await Promise.all(
    defaultLabels.map(async (label) => {
      const result = await nameai.inspectName(label);
      return {
        label,
        interestingScore: result.nameai.interesting_score,
      };
    }),
  );

  return loadedNames.sort((a, b) => b.interestingScore - a.interestingScore);
}

export default async function SortPage() {
  const initialLabels = await getInitialLabelsItems();

  return (
    <div className="max-w-3xl mx-auto px-6 flex-1 py-12 md:py-20">
      <div className="text-center mb-6 md:mb-12 space-y-3">
        <Heading as="h1">AI Sort</Heading>
        <Text as="p" className="text-gray-500">
          Bring names more likely to be interesting to the top.
        </Text>
      </div>

      <Client initialLabels={initialLabels} />
    </div>
  );
}
