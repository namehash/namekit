# @namehash/nameguard-react

![NPM Version](https://img.shields.io/npm/v/@namehash/nameguard-react)

## Install

```bash
npm install @namehash/nameguard-react
```

## Setup

The `nameguard-react` package comes with its own styles exported for some components, as well as global Tailwind styles (soon to be removed).

Make sure you import the `styles.css` file somewhere in your app:

```tsx
import "@namehash/nameguard-react/styles.css";
```

## Usage

These components can be used to interface with NameGuard with React.

### Search

The `<Search />` contains its own state for the chat modal and settings, the settings can be changed inside the search modal.

```tsx
import { Search, SearchModal, SettingsModal } from "@namehash/nameguard-react";

export default () => (
  <>
    <Search />
    <SettingsModal />
    <SearchModal />
  </>
);
```

### Report

If you want to load a report for an ENS name, just pass the `name` prop with your value.

```tsx
import { Report } from "@namehash/nameguard-react";

export default () => <Report name="notrab.eth" />;
```

If you want to customize any of the settings used to with NameParser, you can pass an optional `settings` prop.

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

## Creating components

When creating components, you should use the Tailwind prefix `ng-` for all class names. This means when using `@namehash/nameguard-react` components in projects not using Tailwind, it works as expected.

```tsx
<p className="ng-text-red-500">Hello world</p>
```

## Contact Us

Visit our [website](https://namehashlabs.org/) and get in contact.

## License

Licensed under the MIT License, Copyright &copy; 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
