"use server";

import { ens_normalize } from "@adraffy/ens-normalize";
import { nameai } from "@namehash/nameai";

export async function analyzeLabel(label: string) {
  if (!label) {
    return { error: "Label is required" };
  }

  try {
    const normalizedLabel = ens_normalize(label);
    const result = await nameai.inspectName(normalizedLabel, {});

    if (!result.nameai || !result.nameai.analysis) {
      return { error: "Analysis failed. Please try again." };
    }

    return {
      success: true,
      label: normalizedLabel,
      analysis: result.nameai.analysis,
    };
  } catch (error) {
    return { error: `Invalid ENS label. Please enter a valid value. ${error}` };
  }
}
