# NameGuard Client

NameGuard provides methods to inspect and prevent malicious use of ENS names as well as:

- Confusable grapheme detection
- International accessibility checks
- Rendering checks for different fonts
- ENSIP-15 verification with detailed explanations and auto-suggestions
- Punycode and DNS hostname compatibility checks
- Provides a unified rating system for entire names, as well as detailed explanations for each check

The `@namehash/nameguard` SDK provides full type-safety when working with the NameGuard API. The client is built using `cross-fetch` so it can work in both server and client contexts.

## Installation

```bash
npm install @namehash/nameguard
```

## Usage

The easiest way to get started is by using the `nameguard` singleton.

```ts
import { nameguard } from "@namehash/nameguard";

// single name
await nameguard.inspectName("...");

// Multiple names
await nameguard.inspectName(["...", "..."]);

// namehash
await nameguard.inspectNamehash("...");

// labelhash
await nameguard.inspectionLabelhash("...");
```

## Custom client

You may have a different NameGuard API URL or version, you can instantiate a different client should you need to by importing `createClient`.

```ts
import { createClient } from "@namehash/nameguard";

const nameguard = createClient({
  url: "...",
  version: "v2",
});
```
