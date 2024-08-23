import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  external: [],
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true,
  external: ["@namehash/ens-utils"],
});
