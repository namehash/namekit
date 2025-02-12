# NameAI SDK

[![NPM Version](https://img.shields.io/npm/v/@namehash/nameai)](https://www.npmjs.com/package/@namehash/nameai)

[NameAI](https://nameai.io) extends [NameGuard](https://nameguard.io) with sophisticated natural language processing capabilities to help evaluate and understand Ethereum Name Service (ENS) names.

[NameGuard](https://nameguard.io) is designed to inspect and prevent malicious use of ENS names by providing comprehensive security checks. See the [NameGuard SDK documentation](../nameguard-sdk/README.md) for details about the base security features.

⚠️ **This SDK is BETA. Things will change based on the community feedback.**

## API Implementation

This SDK provides a TypeScript interface to the NameAI API. Developers interested in the NameAI API internals can find the implementation in the [NameAI backend service](https://github.com/namehash/namekit/tree/main/apps/api.nameai.io).

## Features

Additional features provided by NameAI on top of NameGuard:
- **Natural Language Processing**: Evaluate how well ENS names represent meaningful words or phrases
- **Tokenization**: Break down names into meaningful word components with probability scoring
- **Purity Scoring**: Assess the cleanliness and quality of ENS names
- **Sort Scoring**: Get relative ranking scores for ENS names

The `@namehash/nameai` SDK provides full type-safety when working with the NameAI API.

## Install

Install NameAI via npm, yarn or pnpm:

```bash
npm install @namehash/nameai
```

## Usage

Import `nameai`:

```ts
import { nameai } from "@namehash/nameai";
```

### Basic Name Inspection

Inspect a name:

```ts
const report = await nameai.inspectName("vitalik.eth");

// Example response:
{
  nameai: {
    // Quality score (0.0 to 1.0) for the first label
    purity_score: 0.29,
    
    // Ranking score (0.0 to 1.0) for the first label
    sort_score: 0.35,
    
    analysis: {  // undefined for uninspected names
      // The normalization status of the name (normalized, unnormalized, or unknown)
      status: "normalized",
      
      // Details about the inspected name component
      inspection: {
        label: "vitalik",
        // ... other inspection details
      },
      
      // Text meaningfulness (0.0 to 1.0)
      probability: 0.95,
      
      // Natural log of probability (≤ 0.0)
      log_probability: -0.05,
      
      // Minimum words in valid tokenizations
      word_count: 1,
      
      // Recommended word breakdown (may be undefined)
      top_tokenization: ["vitalik"],
      
      // All possible tokenizations (up to 1000)
      tokenizations: [
        {
          tokens: ["vitalik"],
          probability: 0.95,
          log_probability: -0.05
        }
      ]
    }
  },
  nameguard: NameGuardReport  // Standard NameGuard security inspection
}
```

### Tokenization Inspection

The SDK provides detailed tokenization inspection:

```ts
const { nameai: { analysis } } = await nameai.inspectName("cryptowallet.eth");

console.log(analysis.top_tokenization); // ["crypto", "wallet"]
console.log(analysis.tokenizations); // Array of possible tokenizations with probabilities
```

### Custom Client

You can create a custom client with different settings:

```ts
import { createClient } from "@namehash/nameai";

const nameai = createClient({
  nameaiEndpoint: "...",
  network: "sepolia"
});
```

## Limitations

- Maximum name length: 200 characters (including dots)
- Maximum unknown labels: 5
- Names exceeding these limits will have undefined analysis

## Contact Us

Visit our [website](https://namehashlabs.org/) to get in contact.

## License

Licensed under the MIT License, Copyright © 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
