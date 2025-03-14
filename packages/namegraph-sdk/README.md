# NameGraph SDK

A TypeScript SDK for interacting with the NameGraph APIs, providing access to the world's largest collection of names. This SDK enables easy integration with the NameGraph API endpoints for name and collection suggestions.

## Features

- **Category-based Suggestions**: Get name suggestions organized by various categories including related terms, wordplay, alternates, and more
- **Collection Management**: Find, count, and analyze collections of names
- **Smart Sampling**: Sample and fetch top members from collections
- **Advanced Search**: Search collections by string or by collection ID


## Installation

```bash
npm install namegraph-sdk
# or
yarn add namegraph-sdk
```

## Quick Start

```typescript
import { createNameGraphClient } from "namegraph-sdk";

// Create a client instance
const client = createNameGraphClient();

// Or use the default client
import { namegraph } from "namegraph-sdk";

// Get name suggestions grouped by category
const suggestions = await namegraph.groupedByCategory("zeus");
```

## API Reference

### Client Configuration

```typescript
const client = createNameGraphClient({
  namegraphEndpoint: "https://custom-api.endpoint.com", // Optional, defaults to https://api.namegraph.dev/
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

#### Fetch Collection Members

```typescript
// with pagination
const members = await client.fetchCollectionMembers("collection_id", {offset: 0, limit: 20});

// Top members
const topMembers = await client.fetchTopCollectionMembers("collection_id");
```

#### Generate Scrambled Variations of Collection Tokens

```typescript
const scrambled = await client.scrambleCollectionTokens('collection_id', {seed: 42});
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

#### Get Collection by ID
```typescript
const collection = await client.getCollectionById("collection_id");
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

## Modes

The SDK supports three modes for processing requests:

- Instant Mode (`instant`):
  - Fastest response time
  - More basic name generations
  - Some advanced generators like W2VGenerator are disabled (weight multiplier = 0)
  - Often used for real-time suggestions

- Domain Detail Mode (`domain_detail`):
  - Intermediate between instant and full
  - More comprehensive than instant, but still optimized for performance
  - Some generators have reduced weights compared to full mode
  - Expanded search window for collection ranking and sampling

- Full Mode (`full`):
  - Most comprehensive name generation
  - Includes all enabled generators
  - Uses full weights for most generators
  - Accesses advanced generators like `Wikipedia2VGenerator` and `W2VGenerator`
  - Takes longer to process, but provides the most diverse results


## Contact Us

Visit our [website](https://namehashlabs.org/) to get in contact.

## License

Licensed under the MIT License, Copyright © 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
