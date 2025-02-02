import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DEFAULT_FULL_MODE,
  DEFAULT_MAX_RELATED_COLLECTIONS,
  NameGraphCollection,
  NameGraphCollectionByMemberResponse,
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphFindCollectionsResponse,
  NameGraphGroupedByCategoryResponse,
  NameGraphGroupingCategory,
  NameGraphSortOrderOptions,
  NameGraphSuggestion,
  ScrambleMethod,
} from "@namehash/namegraph-sdk/utils";
import { createNameGraphClient } from "@namehash/namegraph-sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This array is used for checking when a category is not a "related" category
export const NameGraphSuggestionCategoryTypes = Object.values(
  NameGraphGroupingCategory,
);

/**
 * Common usage NameGraphClient
 */
const NameGraphClient = createNameGraphClient();

export const RELATED_COLLECTION_PILLS_RESULTS_NUMBER = 3;

/**
 * Main function for fetching name suggestions from the NameGraph API.
 */
export const generateNamesByQuery = async (
  label: string,
): Promise<NameGraphSuggestion[]> => {
  if (label.includes("."))
    throw new Error("Invalid label for generating name suggestions");

  // Related collections params
  const enable_learning_to_rank = true;
  const max_labels_per_related_collection = 10;
  // Determines the number of collections returned in category.related_collections
  const max_recursive_related_collections =
    RELATED_COLLECTION_PILLS_RESULTS_NUMBER;
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
        max_labels_per_related_collection,
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
    label,
    params: {
      mode: DEFAULT_FULL_MODE,
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
  maxRelatedCollections = DEFAULT_MAX_RELATED_COLLECTIONS,
): Promise<NameGraphGroupedByCategoryResponse> => {
  if (input.includes("."))
    throw new Error("Invalid label for generating name suggestions");

  const nameGeneratorSuggestions = await NameGraphClient.suggestionsByCategory(
    input,
    maxRelatedCollections,
  );

  return nameGeneratorSuggestions;
};

export const findCollectionsByString = async (
  input: string,
  options?: {
    offset?: number;
    min_other_collections?: number;
    max_other_collections?: number;
    max_total_collections?: number;
    max_related_collections?: number;
    sort_order?: NameGraphSortOrderOptions;
  },
): Promise<NameGraphFindCollectionsResponse> => {
  let query = input;
  if (input.includes(".")) {
    query = input.split(".")[0];
  }

  const nameGeneratorSuggestions =
    await NameGraphClient.findCollectionsByString(query, options);

  return nameGeneratorSuggestions;
};

export const findCollectionsByCollection = async (
  collection_id: string,
): Promise<NameGraphFindCollectionsResponse> => {
  const nameGeneratorSuggestions =
    await NameGraphClient.findCollectionsByCollection(collection_id);

  return nameGeneratorSuggestions;
};

export const fetchCollectionMembers = async (
  collection_id: string,
  options?: {
    offset?: number;
    limit?: number;
  },
): Promise<NameGraphFetchTopCollectionMembersResponse> => {
  const nameGeneratorSuggestions = await NameGraphClient.fetchCollectionMembers(
    collection_id,
    options,
  );

  return nameGeneratorSuggestions;
};

export const findCollectionsByMember = async (
  query: string,
  options?: {
    offset?: number;
    max_results?: number;
    limit_labels?: number;
    sort_order?: NameGraphSortOrderOptions;
  },
): Promise<NameGraphCollectionByMemberResponse> => {
  const nameGeneratorSuggestions =
    await NameGraphClient.findCollectionsByMember(query, options);

  return nameGeneratorSuggestions;
};

export const getCollectionById = async (
  collection_id: string,
): Promise<NameGraphCollection> => {
  const collectionById = await NameGraphClient.getCollectionById(collection_id);

  return collectionById;
};

export const sampleNamesByCollectionId = async (
  collectionId: string,
  options?: {
    seed?: number;
  },
): Promise<NameGraphSuggestion[]> => {
  const nameGeneratorSuggestions =
    await NameGraphClient.sampleCollectionMembers(collectionId, options);

  return nameGeneratorSuggestions;
};

export const scrambleNamesByCollectionId = async (
  collectionId: string,
  options?: {
    seed?: number;
    method?: ScrambleMethod;
  },
): Promise<NameGraphSuggestion[]> => {
  const nameGeneratorSuggestions =
    await NameGraphClient.scrambleCollectionTokens(collectionId, options);

  return nameGeneratorSuggestions;
};

/**
 * Random nice colors pallete
 */
export const customizedPillsColors = [
  "#E7DBF7",
  "#1FA3C7",
  "#FE097C",
  "#FFBE00",
  "#DB3D58",
  "#01C69A",
  "#8464CA",
  "#E84233",
  "#F5851E",
  "#CBECEC",
  "#FDE2CB",
  "#F0C3F3",
];

export const getRandomColor = () =>
  customizedPillsColors[
    Math.floor(Math.random() * customizedPillsColors.length)
  ];

export const FromNameGraphSortOrderToDropdownTextContent: Record<
  NameGraphSortOrderOptions,
  string
> = {
  [NameGraphSortOrderOptions.AI]: "AI with Learning to Rank",
  [NameGraphSortOrderOptions.AZ]: "A-Z (asc)",
  [NameGraphSortOrderOptions.ZA]: "Z-A (desc)",
  [NameGraphSortOrderOptions.RELEVANCE]: "Relevance",
};
