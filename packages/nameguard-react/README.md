# @namehash/nameguard-react

## Usage

These components are shared between the website and NameKit.

### Search

The `<Search />` contains its own state for the chat modal and settings, the settings can be changed inside the search modal.

```tsx
import { Search } from "@namehash/nameguard-react";

export default () => <Search />;
```

### Report

If you want to load a report for an ENS name, just pass the `name` prop with your value. **NameGuard will always parse this name.**

```tsx
import { Report } from "@namehash/nameguard-react";

export default () => <Report name="notrab.eth" />;
```

If you want to customize any of the settings used to parse the name, you can pass an optional `settings` prop.

```tsx
import { Report, NameParserSettings } from "@namehash/nameguard-react";

const settings: NameParserSettings = {
  // attemptEnsNormalization: true,
  // assumedTld: "eth",
  trimWhitespace: true,
};

export default () => <Report name="notrab.eth" settings={settings} />;
```

So that the chat modal can be presented, you need to pass the store.

```tsx
import { Report, useChatModalStore } from "@namehash/nameguard-react";

export default () => (
  <Report name="notrab.eth" chatModalStore={useChatModalStore} />
);
```
