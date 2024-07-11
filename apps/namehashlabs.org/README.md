# namehashlabs.org

This repository contains all of the code for the [namehashlabs.org](https://namehashlabs.org) website. The website is built using [Next.js](https://nextjs.org), and is deployed to Vercel.

## Local Development

You must clone this repository, install the dependencies with NPM before you can run it locally:

1. `git clone https://github.com/namehash/namehash-labs.git`
2. `cd namehashlabs-labs`
3. `pnpm install`
4. `pnpm dev`

Members of the NameHash team on Vercel may optionally use the [Vercel CLI](https://vercel.com/docs/cli) to run `vc link` to attach the local environment with the Vercel project to fetch any required environment variables.

## Deploy

This repository is connected to the Vercel project [`namehashlabs-website`](https://vercel.com/namehash/namehashlabs-website), and any pull request automatically receives a preview environment. When a PR is merged to the main branch, the production instance is automatically updated.

## License

Licensed under the MIT License, Copyright © 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
