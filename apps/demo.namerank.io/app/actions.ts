"use server";

import { createClient, NameRankResponse } from "@namehash/namerank";

const namerank = createClient({
  namerankEndpoint:
    "https://izzkysqb6d6qzhnpv4ybqyty2e0ktjwe.lambda-url.us-east-1.on.aws/namerank",
});

export async function analyzeNameRank(
  name: string,
): Promise<NameRankResponse | null> {
  if (!name) {
    throw new Error("Name is required");
  }

  return await namerank.inspectName(encodeURIComponent(name), {});
}
