/**
 * NameGraph grouping categories
 **/
export const NameGraphGroupingCategory = {
  related: "related",
  wordplay: "wordplay",
  alternates: "alternates",
  emojify: "emojify",
  community: "community",
  expand: "expand",
  gowild: "gowild",
  other: "other",
} as const;

export type NameGraphGroupingCategory =
  (typeof NameGraphGroupingCategory)[keyof typeof NameGraphGroupingCategory];

/**
 * NameGraph Class related code
 **/
export class NameGraphError extends Error {
  constructor(
    public status: number,
    message?: string,
  ) {
    super(message);
  }
}

/**
 * NameGraph Endpoints related code
 **/
export const NameGraphSortOrderOptions = {
  /** Use intelligent endpoint-specific ranking (e.g. with Learning to Rank) */
  AI: "AI",
  /** Sort by title alphabetically ascending */
  AZ: "A-Z",
  /** Sort by title alphabetically descending */
  ZA: "Z-A",
  /** Use relevance ranking */
  RELEVANCE: "Relevance",
} as const;
export type NameGraphSortOrderOptions =
  (typeof NameGraphSortOrderOptions)[keyof typeof NameGraphSortOrderOptions];

/**
 * Writers block suggestions and collections
 */
export type WritersBlockSuggestion = {
  collectionName: string;
  suggestedName: string;
  tokenizedSuggestedName: string[];
};

export type WritersBlockName = {
  normalized_name: string;
  tokenized_name: string[];
};

export type WritersBlockCollection = {
  collection_id: string;
  collection_name: string;
  names: WritersBlockName[];
};

const getRandomElementOfArray = <Type>(array: Type[]): Type =>
  array[Math.floor(Math.random() * array.length)];

const getRandomWritersBlockSuggestion = (
  array: WritersBlockCollection[],
): WritersBlockSuggestion => {
  const rawWritersBlockSuggestion = getRandomElementOfArray(array);
  const rawName = getRandomElementOfArray(rawWritersBlockSuggestion.names);
  return {
    collectionName: rawWritersBlockSuggestion.collection_name,
    suggestedName: rawName.normalized_name,
    tokenizedSuggestedName: rawName.tokenized_name,
  };
};

/**
 * Gets one suggestion for each catalog's collections until suggestionsCount is reached.
 * @param suggestionsCount max suggestions that will be returned
 * @param catalog a catalog of collections to be sampled
 * @returns an array of suggestions based on the catalog given. If no catalog is given, default catalog is used.
 */
export const sampleWritersBlockSuggestions = (
  suggestionsCount: number,
  catalog: WritersBlockCollection[],
): WritersBlockSuggestion[] => {
  const uniqueCollectionsNames = new Set();
  const uniqueSuggestionsNames = new Set();
  const result = [];

  while (
    result.length !== suggestionsCount &&
    result.length !== catalog.length
  ) {
    const writersBlockSuggestion = getRandomWritersBlockSuggestion(catalog);

    if (
      uniqueCollectionsNames.has(writersBlockSuggestion.collectionName) ||
      uniqueSuggestionsNames.has(writersBlockSuggestion.suggestedName)
    ) {
      continue;
    } else {
      uniqueCollectionsNames.add(writersBlockSuggestion.collectionName);
      uniqueSuggestionsNames.add(writersBlockSuggestion.suggestedName);
      result.push(writersBlockSuggestion);
    }
  }

  return result;
};

export const ScrambleMethod = {
  "left-right-shuffle": "left-right-shuffle",
  "left-right-shuffle-with-unigrams": "left-right-shuffle-with-unigrams",
  "full-shuffle": "full-shuffle",
} as const;

export type ScrambleMethod =
  (typeof ScrambleMethod)[keyof typeof ScrambleMethod];
