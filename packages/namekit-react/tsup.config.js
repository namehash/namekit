import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',  
    client: 'src/client.ts', 
  },
  dts: true, 
  format: ["esm"],
  clean: true,
  skipNodeModulesBundle: true,
});
