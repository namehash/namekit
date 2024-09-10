import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',  
    client: 'src/client.ts', 
  },
  dts: true, 
  format: ["esm"],
  splitting: true,
  sourcemap: true,
  minify: false,
  clean: true,
  skipNodeModulesBundle: true,
});
