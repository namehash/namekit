import { describe, it, expect } from "vitest";
import { sampleWritersBlockSuggestions, WritersBlockCollection } from "./utils";

describe("sampleWritersBlockSuggestions", () => {
  const mockCatalog: WritersBlockCollection[] = [
    {
      collection_id: "1",
      collection_name: "Collection 1",
      names: [
        {
          normalized_name: "name1",
          tokenized_name: ["name", "1"],
        },
        {
          normalized_name: "name2",
          tokenized_name: ["name", "2"],
        },
      ],
    },
    {
      collection_id: "2",
      collection_name: "Collection 2",
      names: [
        {
          normalized_name: "name3",
          tokenized_name: ["name", "3"],
        },
        {
          normalized_name: "name4",
          tokenized_name: ["name", "4"],
        },
      ],
    },
  ];

  it("should return requested number of suggestions", () => {
    const suggestionsCount = 2;
    const result = sampleWritersBlockSuggestions(suggestionsCount, mockCatalog);
    expect(result).toHaveLength(suggestionsCount);
  });

  it("should return unique suggestions", () => {
    const suggestionsCount = 2;
    const result = sampleWritersBlockSuggestions(suggestionsCount, mockCatalog);
    const uniqueSuggestions = new Set(result.map((s) => s.suggestedName));
    expect(uniqueSuggestions.size).toBe(result.length);
  });

  it("should return suggestions with correct structure", () => {
    const result = sampleWritersBlockSuggestions(1, mockCatalog);
    const suggestion = result[0];

    expect(suggestion).toHaveProperty("collectionName");
    expect(suggestion).toHaveProperty("suggestedName");
    expect(suggestion).toHaveProperty("tokenizedSuggestedName");
    expect(Array.isArray(suggestion.tokenizedSuggestedName)).toBe(true);
  });

  it("should not return more suggestions than available in catalog", () => {
    const suggestionsCount = 10; // More than available in mock catalog
    const result = sampleWritersBlockSuggestions(suggestionsCount, mockCatalog);
    expect(result.length).toBeLessThanOrEqual(mockCatalog.length);
  });

  it("should return empty array for empty catalog", () => {
    const result = sampleWritersBlockSuggestions(1, []);
    expect(result).toHaveLength(0);
  });

  it("should return suggestions from different collections", () => {
    const suggestionsCount = 2;
    const result = sampleWritersBlockSuggestions(suggestionsCount, mockCatalog);
    const uniqueCollections = new Set(result.map((s) => s.collectionName));
    expect(uniqueCollections.size).toBe(result.length);
  });
});
