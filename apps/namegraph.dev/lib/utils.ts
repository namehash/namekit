import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  NameGraphGroupedByCategoryResponse,
  NameGraphGroupingCategory,
  NameGraphSuggestion,
} from "@namehash/namegraph-sdk/utils";
import { createNameGraphClient } from "@namehash/namegraph-sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LabelAndModeQueryParams {
  label: string;
  mode: "full";
}

export interface NameGraphRelatedCollection {
  collection_id: string;
  collection_title: string;
  collection_members_count: number;
}

export interface NameGraphSuggestionCategory {
  type: NameGraphGroupingCategory;
  // NameGraph API guarantees "name" will always be a normalized name
  name: string;
  // NameGraph API guarantees "suggestions" will never be an empty list
  suggestions: NameGraphSuggestion[];
  related_collections: NameGraphRelatedCollection[];
}

// This array is used for checking when a category is not a "related" category
const NameGraphSuggestionCategoryTypes = Object.values(
  NameGraphGroupingCategory,
);

/**
 * Common usage NameGraphClient
 */
const NameGraphClient = createNameGraphClient();

/**
 * Main function for fetching name suggestions from the NameGraph API.
 */
export const generateNamesByQuery = async (
  input: LabelAndModeQueryParams,
): Promise<NameGraphSuggestion[]> => {
  if (input.label.includes("."))
    throw new Error("Invalid label for generating name suggestions");

  // Related collections params
  const enable_learning_to_rank = true;
  const max_names_per_related_collection = 10;
  // Determines the number of collections returned in category.related_collections
  const max_recursive_related_collections = 3;
  const name_diverstity_ratio = 0.5;
  const max_related_collections = 6;
  const max_per_type = 2;

  // Other categories params
  const min_total_suggestions = 50;

  // Categories params
  const min_suggestions = 2;
  const max_suggestions = 10;

  const categoriesWithParams = {};
  for (const value of NameGraphSuggestionCategoryTypes) {
    const categoryParams = {
      min_suggestions,
      max_suggestions,
    };

    if (value === NameGraphGroupingCategory.related) {
      Object.assign(categoryParams, {
        ...categoryParams,
        max_recursive_related_collections,
        max_names_per_related_collection,
        max_related_collections,
        enable_learning_to_rank,
        name_diverstity_ratio,
        max_per_type,
      });
    } else if (value === NameGraphGroupingCategory.other) {
      Object.assign(categoryParams, {
        ...categoryParams,
        min_total_suggestions,
      });
    }

    Object.assign(categoriesWithParams, {
      ...categoriesWithParams,
      [value]: categoryParams,
    });
  }

  const payload = {
    label: input.label,
    params: {
      mode: "full",
    },
    categories: categoriesWithParams,
  };

  const nameGeneratorSuggestions = await NameGraphClient.rawRequest(
    "",
    "POST",
    payload,
  );

  return nameGeneratorSuggestions;
};

export const getCollectionsForQuery = async (
  input: string,
): Promise<NameGraphGroupedByCategoryResponse> => {
  if (input.includes("."))
    throw new Error("Invalid label for generating name suggestions");

  const nameGeneratorSuggestions =
    await NameGraphClient.suggestionsByCategory(input);

  return nameGeneratorSuggestions;
};
