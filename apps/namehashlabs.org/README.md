# namehashlabs.org

This repository contains all of the code for the [namehashlabs.org](https://namehashlabs.org) website. The website is built using [Next.js](https://nextjs.org), and is deployed to Vercel.

## Local Development

You must clone the full monorepo and install dependencies with PNPM before you can run it locally:

1. `git clone https://github.com/namehash/nameguard.git`
2. `pnpm install` (run from the root directory of the monorepo)
3. `cd apps/namehashlabs.org`
4. Configure environment variables. Members of the NameHash Labs team on Vercel should use the [Vercel CLI](https://vercel.com/docs/cli) to run the following commands. Otherwise you must manually configure the required environment variables (see [.example.env](./.example.env) for details).
   1. `vercel link` to attach the local environment with the Vercel project.
   2. `vercel env pull` to fetch the required environment variables from Vercel.
5. `pnpm dev`

## Deploy

This repository is connected to the Vercel project [`namehashlabs-website`](https://vercel.com/namehash/namehashlabs-website), and any pull request automatically receives a preview environment. When a PR is merged to the main branch, the production instance is automatically updated.

## License

Licensed under the MIT License, Copyright © 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
