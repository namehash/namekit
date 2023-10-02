# @namehash/nameguard

## Install

```bash
npm install @namehash/nameguard
```

## Usage

The easiest way to get started is by using the `nameguard` singleton.

```ts
import { nameguard } from "@namehash/nameguard";

// single name
await nameguard.name("...");

// Multiple names
await nameguard.names(["...", "..."]);

// labelhash
await nameguard.labelhash("...");

// namehash
await nameguard.namehash("...");
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
