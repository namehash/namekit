import { writersBlockSuggestions } from "./writers-block-suggestions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// TODO: move this function to namegraph-sdk
export const sampleWritersBlockSuggestions = (
  suggestionsCount: number,
  catalog?: WritersBlockCollection[],
): WritersBlockSuggestion[] => {
  const uniqueCollectionsNames = new Set();
  const uniqueSuggestionsNames = new Set();
  const result = [];

  let collections = undefined;
  if (catalog?.length) collections = catalog;
  else collections = writersBlockSuggestions;

  while (
    result.length !== suggestionsCount &&
    result.length !== collections.length
  ) {
    const writersBlockSuggestion = getRandomWritersBlockSuggestion(collections);

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
