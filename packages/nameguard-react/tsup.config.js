import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  external: ["react", "react-dom"],
  clean: true,
  skipNodeModulesBundle: true,
  dts: true,
});
