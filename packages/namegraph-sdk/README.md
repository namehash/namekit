# NameGraph SDK

A TypeScript SDK for interacting with the NameGraph APIs, providing access to the world's largest collection of word-wiki names. This SDK enables easy integration with the NameGraph API endpoints for name and collection suggestions.

## Installation

```bash
npm install namegraph-sdk
# or
yarn add namegraph-sdk
```

## Quick Start

```typescript
import { createClient } from "namegraph-sdk";

// Create a client instance
const client = createClient();

// Or use the default client
import { namegraph } from "namegraph-sdk";

// Get name suggestions grouped by category
const suggestions = await namegraph.groupedByCategory("zeus");
```

## Features

- **Category-based Suggestions**: Get name suggestions organized by various categories including related terms, wordplay, alternates, and more
- **Collection Management**: Find, count, and analyze collections of names
- **Smart Sampling**: Sample and fetch top members from collections
- **Advanced Search**: Search collections by string or by collection ID

## API Reference

### Client Configuration

```typescript
const client = createClient({
  namegraphEndpoint: "http://custom-api.endpoint.com", // Optional, defaults to http://api.namegraph.dev/
});
```

### Core Methods

#### Group Names by Category

```typescript
const response = await client.groupedByCategory("zeus");
```

#### Get Suggestions by Category

```typescript
const suggestions = await client.suggestionsByCategory("zeus");
```

#### Sample Collection Members

```typescript
const members = await client.sampleCollectionMembers("collection_id");
```

#### Fetch Top Collection Members

```typescript
const topMembers = await client.fetchTopCollectionMembers("collection_id");
```

#### Find Collections

```typescript
// By string
const collections = await client.findCollectionsByString("zeus god");

// By collection ID
const related = await client.findCollectionsByCollection("collection_id");

// By member
const memberCollections = await client.findCollectionsByMember("zeus");
```

#### Count Collections

```typescript
// By string
const stringCount = await client.countCollectionsByString("zeus god");

// By member
const memberCount = await client.countCollectionsByMember("zeus");
```

### Response Types

The SDK provides TypeScript types for all API responses. Key types include:

- `NameGraphSuggestion`
- `NameGraphCategory`
- `NameGraphCollection`
- `NameGraphGroupedByCategoryResponse`
- `NameGraphFetchTopCollectionMembersResponse`
- `NameGraphCountCollectionsResponse`

### Error Handling

The SDK throws `NameGraphError` for API-related errors. Handle them appropriately:

```typescript
try {
  const suggestions = await client.groupedByCategory("example");
} catch (error) {
  if (error instanceof NameGraphError) {
    console.error(`API Error ${error.status}: ${error.message}`);
  }
}
```

### Request Cancellation

Cancel ongoing requests using the `abortAllRequests` method:

```typescript
client.abortAllRequests();
```

## Categories

The SDK supports various grouping categories for name suggestions:

- `related`: Related terms and concepts
- `wordplay`: Creative word variations
- `alternates`: Alternative versions
- `emojify`: Emoji-enhanced variations
- `community`: Community-suggested names
- `expand`: Expanded versions
- `gowild`: Creative variations
- `other`: Additional suggestions
