import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    splitting: false,
    sourcemap: true,
    clean: true,
    bundle: true,
    external: ["@namehash/ens-utils"],
  },
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: {
      only: true,
      resolve: true,
    },
    external: ["@namehash/ens-utils"],
  },
]);
