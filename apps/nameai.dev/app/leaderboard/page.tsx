import { Suspense } from "react";
import { nameai } from "@namehash/nameai";
import { Skeleton } from "../../components/skeleton";
import { Client } from "./client";

interface NameItem {
  name: string;
  interestingScore: number;
}

const defaultNames = ["vitalik", "ethereum", "web3", "blockchain", "defi"];

async function getInitialNames(): Promise<NameItem[]> {
  const loadedNames = await Promise.all(
    defaultNames.map(async (name) => {
      const result = await nameai.inspectName(name);
      return {
        name,
        interestingScore: result.nameai.interesting_score,
      };
    }),
  );
  return loadedNames.sort((a, b) => b.interestingScore - a.interestingScore);
}

export default async function LeaderboardPage() {
  const initialNames = await getInitialNames();

  return (
    <div className="max-w-3xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-4">
        Sort Names by Interesting Score
      </h1>
      <p className="mb-4">
        We are helping people sort lists of names based on how interesting they
        are.
      </p>

      <Client initialNames={initialNames} />
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="w-full h-10" />
      ))}
    </div>
  );
}
