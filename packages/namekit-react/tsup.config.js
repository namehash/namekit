import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',  
    client: 'src/client.ts', 
  },
  dts: true, 
  splitting: true,  
  sourcemap: true, 
  minify: true, 
  treeshake: true,
  format: ["esm"],
  clean: true,
  skipNodeModulesBundle: true,
});
