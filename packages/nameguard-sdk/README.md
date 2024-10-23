# NameGuard SDK

![Tests](https://github.com/namehash/namekit/actions/workflows/nameguard-end-to-end-tests.yml/badge.svg?branch=main)
![NPM Version](https://img.shields.io/npm/v/@namehash/nameguard)

[NameGuard](https://nameguard.io) is designed to inspect and prevent malicious use of Ethereum Name Service (ENS) names. It provides a comprehensive set of functionalities to check the normalization status of names, labels, and graphemes, conduct various safety checks on ENS names, and verify the authenticity of ".eth" names in NFTs.

NameGuard also supports multiple networks including Ethereum Mainnet and testnets.

⚠️ **This SDK is BETA. Things will change based on the community feedback.**

## Features

- **Normalization Status Checks**: Determine if a name, label, or grapheme is normalized, unnormalized, or unknown.
- **Safety Checks**: Conduct various checks on ENS names for risks like impersonation, typing difficulty, and font support.
- **ENS Name Verification**: Verify the authenticity of ".eth" names associated with NFTs.
- **Network-Specific Inspections**: Customize inspections based on different Ethereum networks.

The `@namehash/nameguard` SDK provides full type-safety when working with the NameGuard API.

## Install

Install NameGuard via npm, yarn or pnpm:

```bash
npm install @namehash/nameguard
```

## Usage

Import `nameguard`:

```ts
import { nameguard } from "@namehash/nameguard";
```

### Basic Inspections

Inspect a name:

```ts
const nameGuardReport = await nameguard.inspectName("nick.eth");
```

### Batch Name Inspections

Inspect multiple names at once:

```ts
const names = ["vitalik.eth", "notrab.eth"];
const reports = await nameguard.bulkInspectNames(names);
```

### Secure Primary Name Lookup

Lookup the secure primary ENS name for an Ethereum address:

```ts
const ethereumAddress = "0x..."; // replace with actual Ethereum address
const securePrimaryNameResult =
  await nameguard.getSecurePrimaryName(ethereumAddress);
```

This function is crucial for verifying the primary ENS name associated with an Ethereum address, ensuring its normalization status and checking for potential impersonation risks.

### Verify ".eth" Names

Check if an NFT is associated with an authentic ".eth" name:

```ts
const fakeNameCheckResult = await nameguard.fakeEthNameCheck(
  contractAddress,
  tokenId,
);
```

### Inspecting Graphemes

Inspect a single grapheme for various checks:

```ts
const graphemeReport = await nameguard.inspectGrapheme("𝒶");
```

### Inspecting Labelhashes

Inspect a name based on a labelhash:

```ts
const labelhash = "0x..."; // replace with actual labelhash
const parentName = "eth"; // optional, defaults to 'eth'
const labelhashReport = await nameguard.inspectLabelhash(labelhash, {
  parent: parentName,
});
```

### Inspecting Namehashes

Inspect the name associated with a specific namehash:

```ts
const namehash = "0x..."; // replace with actual namehash
const namehashReport = await nameguard.inspectNamehash(namehash);
```

These functions allow for a more granular level of inspection, particularly useful for applications that deal directly with ENS internals or require detailed analysis of the component parts of ENS names.

## Custom client

You may have a different NameGuard API URL or network, you can instantiate a different client should you need to by importing `createClient`.

```ts
import { createClient } from "@namehash/nameguard";

const nameguard = createClient({
  url: "...",
  network: "sepolia",
});
```

## Contact Us

Visit our [website](https://namehashlabs.org/) and get in contact.

## License

Licensed under the MIT License, Copyright &copy; 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
