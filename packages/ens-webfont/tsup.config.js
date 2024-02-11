import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["styles/font-config.css", "fonts/Unifont.otf"],
  format: ["esm", "cjs"],
  splitting: true,
  sourcemap: true,
  minify: false,
  clean: true,
  skipNodeModulesBundle: true,
  dts: true,
  external: ["node_modules"],
});
