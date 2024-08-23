import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: {
    resolve: true,
  },
  external: ["@namehash/ens-utils"],
  noExternal: ["@namehash/ens-utils"],
});
