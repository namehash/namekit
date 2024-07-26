# Namekit

Easily integrate rich ENS user journeys into your wallet, app, or game.

<!-- PROJECT SHIELDS -->
[![TypeScript Build Status](https://img.shields.io/github/actions/workflow/status/namehash/namekit/ci_sdk.yml?logo=typescript&logoColor=ffffff)](https://github.com/namehash/namekit/actions/workflows/ci_sdk.yml?query=branch%3Amain) [![Python Build Status](https://img.shields.io/github/actions/workflow/status/namehash/namekit/ci_api.yml?logo=python&logoColor=ffffff)](https://github.com/namehash/namekit/actions/workflows/ci_api.yml?query=branch%3Amain) [![status: alpha](https://img.shields.io/badge/status-alpha-FFFF00?logo=rocket&logoColor=ffffff)](#project-status)

## Project Status

🏗️ NameKit is currently an alpha preview. Expect APIs and interfaces to experience breaking changes.

## Project Directory

The NameKit monorepo contains multiple packages and apps.

### Packages

<!-- PACKAGES TABLE -->
| Package                                     | Summary                                                                                                 | Published Version                                                                                                                                                 |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [ens-utils](packages/ens-utils)             | General utilities for building on ENS.                                                                  | [![ NPM Version ]( https://img.shields.io/npm/v/%40namehash%2Fens-utils?style=flat&color=2282c2 )](https://www.npmjs.com/package/@namehash/ens-utils)             |
| [ens-webfont](packages/ens-webfont)         | Increase rendering support for emojis and other special graphemes that may appear in ENS names.         | [![ NPM Version ]( https://img.shields.io/npm/v/%40namehash%2Fens-webfont?style=flat&color=2282c2 )](https://www.npmjs.com/package/@namehash/ens-webfont)         |
| [nameguard-js](packages/nameguard-js)       | A JavaScript implementation of NameGuard. Currently implements securePrimaryName with more coming soon. | [![ NPM Version ]( https://img.shields.io/npm/v/%40namehash%2Fnameguard-js?style=flat&color=2282c2 )](https://www.npmjs.com/package/@namehash/nameguard-js)       |
| [nameguard-react](packages/nameguard-react) | React UI components for building on NameGuard.                                                          | [![ NPM Version ]( https://img.shields.io/npm/v/%40namehash%2Fnameguard-react?style=flat&color=2282c2 )](https://www.npmjs.com/package/@namehash/nameguard-react) |
| [nameguard-sdk](packages/nameguard-sdk)     | A lightweight JavaScript client for the NameGuard API.                                                  | [![ NPM Version ]( https://img.shields.io/npm/v/%40namehash%2Fnameguard?style=flat&color=2282c2 )](https://www.npmjs.com/package/@namehash/nameguard-sdk)         |
| [namekit-react](packages/namekit-react)     | React UI components for building on NameKit.                                                            | [![ NPM Version ]( https://img.shields.io/npm/v/%40namehash%2Fnamekit-react?style=flat&color=2282c2 )](https://www.npmjs.com/package/@namehash/namekit-react)     |

## Local Development

You must clone this respository, and install the dependencies using [PNPM](https://pnpm.io/installation) before you can run it locally:

1. `git clone https://github.com/namehash/namekit.git`
2. `cd namekit`
3. `pnpm i`
4. `pnpm dev`

It's recommended you run `pnpm dev` in the root of the repository to start all apps, packages, and internal resources to support local development.

## Testing

Tests are automatically ran when a new Pull Request is opened. You can run them locally using `pnpm test`.

If you're developing locally, you can watch changes and run tests automatically using `pnpm test:watch`.

## Continuous Deployment

We use [changesets](https://github.com/changesets/changesets) to manage our releases.

1. Run `pnpm changeset`
2. Choose the packages you want to release
3. Add a summary of the changes
4. Commit the file
5. Open a Pull Request
6. Once the PR is merged, a new or existing `Version Packages` PR will open.
7. Merge the `Version Packages` PR when you're ready to release a new version (of all packages) to NPM, or wait to merge in other changesets first.

## Storybook

We use [Storybook](https://storybook.namekit.io/) to preview components across our core packages:

- `@namehash/namekit-react`
- `@namehash/nameguard-react`
- `@namehash/ens-webfont`
- `@namehash/ui`
  - These components are mostly internal and not intended for public use, but they are used across our packages.
