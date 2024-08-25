import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  skipNodeModulesBundle: true,
  target: [
    "chrome123",
    "edge122",
    "opera108",
    "firefox123",
    "safari17",
    "node20",
  ],
});
