import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  splitting: true,
  sourcemap: true,
  minify: false,
  clean: true,
  skipNodeModulesBundle: true,
  dts: true,
  external: [
    "react",
    "react-dom",
    "@namehash/nameguard",
    "@namehash/ens-utils",
    "@namehash/ens-webfont",
  ],
});
