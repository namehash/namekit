import { describe, it, expect } from "vitest";

import { createNameGraphClient } from "./index";
import { NameGraphGroupingCategory, NameGraphSortOrderOptions } from "./utils";

const namegraph = createNameGraphClient({
  namegraphEndpoint: "https://api.namegraph.dev/",
});

const exampleLabel = "zeus";
const exampleQuery = "zeus god";
const exampleCollectionId = "3vkCFOZ101p1"; // "Greek mythological figures"
const labelWithDots = "zeus.eth";


// No mocking (we should probably mock)

describe("groupedByCategory", () => {
  it("should fetch suggestions grouped by category for a label", async () => {
    const response = await namegraph.groupedByCategory(exampleLabel);
    
    expect(response).toBeDefined();
    expect(response.categories).toBeDefined();
    expect(Array.isArray(response.categories)).toBe(true);
    expect(response.categories.length).toBeGreaterThan(0);
  });

  it("shouldn't reject empty label", async () => {
    const response = await namegraph.groupedByCategory("");
    
    expect(response).toBeDefined();
    expect(response.categories).toBeDefined();
    expect(Array.isArray(response.categories)).toBe(true);
    expect(response.categories.length).toBeGreaterThan(0);
  });

  it("should reject label with dots", async () => {
    await expect(namegraph.groupedByCategory(labelWithDots)).rejects.toThrow();
  });
});

describe("suggestionsByCategory", () => {
  it("should fetch suggestions with related collections", async () => {
    const response = await namegraph.suggestionsByCategory(exampleLabel);
    
    expect(response).toBeDefined();
    expect(response.categories).toBeDefined();
    expect(Array.isArray(response.categories)).toBe(true);
    expect(response.categories.length).toBeGreaterThan(0);
  });

  it("should respect maxRelatedCollections parameter", async () => {
    const maxRelated = 2;
    const response = await namegraph.suggestionsByCategory(exampleLabel, maxRelated);
    
    const relatedCategories = response.categories.filter(c => c.type === NameGraphGroupingCategory.related);
    expect(relatedCategories.length).toBeLessThanOrEqual(maxRelated);
  });

  it("should respect max_labels_per_related_collection parameter", async () => {
    const response = await namegraph.suggestionsByCategory(exampleLabel);

    const relatedCategories = response.categories.filter(c => c.type === NameGraphGroupingCategory.related);
    relatedCategories.forEach(c => {
      expect(c.suggestions.length).toBeLessThanOrEqual(10);
    });
  });

  it("should reject label with dots", async () => {
    await expect(namegraph.suggestionsByCategory(labelWithDots)).rejects.toThrow();
  });

  it("should throw error for invalid max_suggestion_per_grouping_category", async () => {
    await expect(namegraph.suggestionsByCategory(exampleLabel, undefined, {
      max_suggestion_per_grouping_category: 31 // Above max allowed value of 30
    })).rejects.toThrow();
  });

  it("should respect min_suggestion_per_grouping_category parameter", async () => {
    const minSuggestions = 2;
    const response = await namegraph.suggestionsByCategory(exampleLabel, undefined, {
      min_suggestion_per_grouping_category: minSuggestions
    });

    response.categories.forEach(category => {
      if (category.type === NameGraphGroupingCategory.related) {
        expect(category.suggestions.length).toBeGreaterThanOrEqual(minSuggestions);
      }
    });
  });

  it("should throw error for invalid min_suggestion_per_grouping_category", async () => {
    await expect(namegraph.suggestionsByCategory(exampleLabel, undefined, {
      min_suggestion_per_grouping_category: -1 // Below min allowed value of 0
    })).rejects.toThrow();
  });
});


describe("sampleCollectionMembers", () => {
  it("should fetch random sample of collection members", async () => {
    const response = await namegraph.sampleCollectionMembers(exampleCollectionId);
    
    expect(response).toBeDefined();
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBeLessThanOrEqual(5); // max_sample_size is 5
  });

  it("should return reproducible results with same seed", async () => {
    const seed = 42;
    const sample1 = await namegraph.sampleCollectionMembers(exampleCollectionId, { seed });
    const sample2 = await namegraph.sampleCollectionMembers(exampleCollectionId, { seed });
    
    expect(sample1).toEqual(sample2);
  });

  it("should respect max_sample_size parameter", async () => {
    const maxSampleSize = 3;
    const response = await namegraph.sampleCollectionMembers(exampleCollectionId, {
      max_sample_size: maxSampleSize
    });
    expect(response.length).toBeLessThanOrEqual(maxSampleSize);
  });

  it("should reject float max_sample_size parameter", async () => {
    await expect(namegraph.sampleCollectionMembers(exampleCollectionId, {
      max_sample_size: 2.3
    })).rejects.toThrow();
  });

  it("should throw error for invalid max_sample_size", async () => {
    await expect(namegraph.sampleCollectionMembers(exampleCollectionId, {
      max_sample_size: 101 // Above max allowed value of 100
    })).rejects.toThrow();
  });
});

describe("fetchTopCollectionMembers", () => {
  it("should fetch top members from collection", async () => {
    const response = await namegraph.fetchTopCollectionMembers(exampleCollectionId);

    expect(response).toBeDefined();
    expect(response.suggestions).toBeDefined();
    expect(Array.isArray(response.suggestions)).toBe(true);
    expect(response.suggestions.length).toBeGreaterThan(0);
  });

  it("should fetch at most 10 members", async () => {
    const response = await namegraph.fetchTopCollectionMembers(exampleCollectionId);
    expect(response.suggestions.length).toBeLessThanOrEqual(10);
  });
});

describe("scrambleCollectionTokens", () => {

  it("should generate scrambled variations", async () => {
    const response = await namegraph.scrambleCollectionTokens(exampleCollectionId);
    
    expect(response).toBeDefined();
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBeGreaterThan(0);
  });

  it("should respect seed parameter for reproducibility", async () => {
    const seed = 42;
    const scrambled1 = await namegraph.scrambleCollectionTokens(exampleCollectionId, { seed });
    const scrambled2 = await namegraph.scrambleCollectionTokens(exampleCollectionId, { seed });
    
    expect(scrambled1).toEqual(scrambled2);
  });

  it("should return at most 10 scrambled suggestions", async () => {
    const response = await namegraph.scrambleCollectionTokens(exampleCollectionId);
    expect(response.length).toBeLessThanOrEqual(10);
  });

  it("should respect max_suggestions parameter", async () => {
    const maxSuggestions = 5;
    const response = await namegraph.scrambleCollectionTokens(exampleCollectionId, {
      max_suggestions: maxSuggestions
    });
    expect(response.length).toBeLessThanOrEqual(maxSuggestions);
  });

  it("should reject float max_suggestions parameter", async () => {
    await expect(namegraph.scrambleCollectionTokens(exampleCollectionId, {
      max_suggestions: 2.3
    })).rejects.toThrow();
  });

  it("should throw error for invalid max_suggestions", async () => {
    await expect(namegraph.scrambleCollectionTokens(exampleCollectionId, {
      max_suggestions: -1 // Below min allowed value of 0
    })).rejects.toThrow();
  });
});


describe("findCollectionsByString", () => {
  it("should find collections matching query", async () => {
    const response = await namegraph.findCollectionsByString(exampleQuery);
    
    expect(response).toBeDefined();
    expect(response.related_collections).toBeDefined();
    expect(Array.isArray(response.related_collections)).toBe(true);
    expect(response.related_collections.length).toBeGreaterThan(0);
  });

  it("should respect pagination parameters", async () => {
    const offset = 2;
    const response = await namegraph.findCollectionsByString(exampleQuery);
    const response_with_offset = await namegraph.findCollectionsByString(exampleQuery, {
      offset,
    });
    
    const first_two_collections = response.related_collections.slice(0, 2);
    expect(response_with_offset.related_collections).not.toContainEqual(first_two_collections[0]);
    expect(response_with_offset.related_collections).not.toContainEqual(first_two_collections[1]);
  });


  it("should respect max and min collection size parameters", async () => {
    const min_other_collections = 1;
    const max_other_collections = 2;
    const response_other = await namegraph.findCollectionsByString(exampleQuery, {
      min_other_collections: min_other_collections,
      max_other_collections: max_other_collections
    });

    expect(response_other.other_collections.length).toBeGreaterThanOrEqual(min_other_collections);
    expect(response_other.other_collections.length).toBeLessThanOrEqual(max_other_collections);

    const max_related_collections = 1;
    const response_related = await namegraph.findCollectionsByString(exampleQuery, {
      max_related_collections: max_related_collections
    });

    expect(response_related.related_collections.length).toBeLessThanOrEqual(max_related_collections);

    const max_total_collections = 3;

    const response_total = await namegraph.findCollectionsByString(exampleQuery, {
      max_total_collections: max_total_collections
    });

    expect(response_total.related_collections.length + response_total.other_collections.length).toBeLessThanOrEqual(max_total_collections);

  });

  it("should respect max_per_type parameter", async () => {
    const maxPerType = 2;
    const response = await namegraph.findCollectionsByString(exampleQuery, {
      max_per_type: maxPerType
    });

    const allSuggestions = response.related_collections.concat(response.other_collections)

    const typeGroups = allSuggestions.reduce((acc: Record<string, number>, collection) => {
        collection.types.forEach((type: string) => acc[type] = (acc[type] || 0) + 1);
        return acc;
    }, {});

    Object.values(typeGroups).forEach(count => {
      expect(count).toBeLessThanOrEqual(maxPerType);
    });
  });
});

describe("fetchCollectionMembers", () => {
  it("should fetch members with pagination", async () => {
    const response = await namegraph.fetchCollectionMembers(exampleCollectionId);
    
    expect(response).toBeDefined();
    expect(response.suggestions).toBeDefined();
    expect(Array.isArray(response.suggestions)).toBe(true);
  });

  it("should respect limit", async () => {
    const limit = 5;
    const response = await namegraph.fetchCollectionMembers(exampleCollectionId, {
      limit,
    });
    
    expect(response.suggestions.length).toBeLessThanOrEqual(limit);
  });

  it("should respect offset", async () => {
    const offset = 2;
    const response = await namegraph.fetchCollectionMembers(exampleCollectionId);
    const response_with_offset = await namegraph.fetchCollectionMembers(exampleCollectionId, {
      offset,
    });

    const first_two_collections = response.suggestions.slice(0, 2);
    expect(response_with_offset.related_collections).not.toContainEqual(first_two_collections[0]);
    expect(response_with_offset.related_collections).not.toContainEqual(first_two_collections[1]);
  });
});

describe("countCollectionsByString", () => {
  it("should count collections matching query", async () => {
    const response = await namegraph.countCollectionsByString(exampleQuery);
    
    expect(response).toBeDefined();
    expect(response.count).toBeDefined();

    const count = response.count;
    expect(typeof count === "number" || count === "1000+").toBeTruthy();
  });

  it("should return number for rare queries", async () => {
    const response = await namegraph.countCollectionsByString("kosciuszko");
    expect(typeof response.count).toBe("number");
    expect(response.count).toEqual(84);
  });

  it("should return 1000+ for common queries", async () => {
    const response = await namegraph.countCollectionsByString(exampleQuery);
    expect(response.count).toEqual("1000+");
  });
});


describe("findCollectionsByCollection", () => {

  it("should find related collections", async () => {
    const response = await namegraph.findCollectionsByCollection(exampleCollectionId);
    
    expect(response).toBeDefined();
    expect(response.related_collections).toBeDefined();
    expect(Array.isArray(response.related_collections)).toBe(true);
  });

  it("should respect max_related_collections parameter", async () => {
    const response = await namegraph.findCollectionsByCollection(exampleCollectionId);

    expect(response.related_collections.length).toBeLessThanOrEqual(3); // max_related_collections is 3
  });

  it("should respect max_per_type parameter", async () => {
    const maxPerType = 2;
    const response = await namegraph.findCollectionsByCollection(exampleCollectionId, {
      max_per_type: maxPerType
    });

    const typeGroups = response.other_collections.reduce((acc: Record<string, number>, collection) => {
      collection.types.forEach((type: string) => acc[type] = (acc[type] || 0) + 1);
      return acc;
  }, {});

    Object.values(typeGroups).forEach(count => {
      expect(count).toBeLessThanOrEqual(maxPerType);
    });
  });

  it("should throw error for negative max_related_collections", async () => {
    await expect(namegraph.findCollectionsByCollection(exampleCollectionId, {
      max_related_collections: -1
    })).rejects.toThrow();
  });
});

describe("countCollectionsByMember", () => {
  it("should count collections containing member", async () => {
    const response = await namegraph.countCollectionsByMember(exampleLabel);
    
    expect(response).toBeDefined();
    expect(response.count).toBeDefined();

    const count = response.count;
    expect(typeof count === "number" || count === "1000+").toBeTruthy();
  });
});

describe("findCollectionsByMember", () => {
  it("should find collections containing member", async () => {
    const response = await namegraph.findCollectionsByMember(exampleLabel);
    
    expect(response).toBeDefined();
    expect(response.collections).toBeDefined();
    expect(Array.isArray(response.collections)).toBe(true);
  });

  it("should respect max_results parameter", async () => {
    const maxResults = 2;
    const response = await namegraph.findCollectionsByMember(exampleLabel, {
      max_results: maxResults
    });
    
    expect(response.collections.length).toBeLessThanOrEqual(maxResults);
  });

  it("should respect offset parameter", async () => {
    const offset = 2;
    const response = await namegraph.findCollectionsByMember(exampleLabel);
    const response_with_offset = await namegraph.findCollectionsByMember(exampleLabel, {
      offset,
    });

    const first_two_collections = response.collections.slice(0, 2);
    expect(response_with_offset.collections).not.toContainEqual(first_two_collections[0]);
    expect(response_with_offset.collections).not.toContainEqual(first_two_collections[1]);
  });

  it("should respect sort parameter", async () => {
    const sort = NameGraphSortOrderOptions.AZ;
    const response = await namegraph.findCollectionsByMember(exampleLabel, {
      sort_order:sort,
    });

    const sorted_collections = response.collections.sort((a, b) => a.title.localeCompare(b.title));
    expect(response.collections).toEqual(sorted_collections);
  });
});


describe("getCollectionById", () => {
  it("should fetch collection by ID", async () => {
    const response = await namegraph.getCollectionById(exampleCollectionId);
    
    expect(response).toBeDefined();
    expect(response.collection_id).toBe(exampleCollectionId);
  });

  it("should handle non-existent collection ID", async () => {
    const nonExistentId = "nonexistent123";
    await expect(namegraph.getCollectionById(nonExistentId)).rejects.toThrow();
  });
});

describe("Namegraph constructor", () => {
  it("should ensure endpoint ends with trailing slash", () => {
    const client1 = createNameGraphClient({
      namegraphEndpoint: "https://api.namegraph.dev",
    });
    expect(client1["namegraphEndpoint"].href).toBe(
      "https://api.namegraph.dev/",
    );

    const client2 = createNameGraphClient({
      namegraphEndpoint: "https://api.namegraph.dev/",
    });
    expect(client2["namegraphEndpoint"].href).toBe(
      "https://api.namegraph.dev/",
    );
  });
});