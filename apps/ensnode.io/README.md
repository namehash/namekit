# ensnode.io

This repository contains all of the code for the [ensnode.io](https://ensnode.io) website. The website is built using [Next.js](https://nextjs.org), and is deployed to Vercel.

## Local Development

You must clone the full monorepo and install dependencies with PNPM before you can run it locally:

1. `git clone https://github.com/namehash/namekit.git`
2. `pnpm install` (run from the root directory of the monorepo)
3. `cd apps/ensnode.io`
4. `pnpm dev`

## Deploy

This repository is connected to the Vercel project [`ensnode-website`](https://vercel.com/namehash/ensnode.io), and any pull request automatically receives a preview environment. When a PR is merged to the main branch, the production instance is automatically updated.

## License

Licensed under the MIT License, Copyright © 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
