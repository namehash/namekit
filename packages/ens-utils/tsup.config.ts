import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true,
  treeshake: true,
  target: [
    "chrome123",
    "edge122",
    "opera108",
    "firefox123",
    "safari17",
    "node20",
  ],
  format: ["esm"],
  skipNodeModulesBundle: true,
  external: ["node_modules"],
});
