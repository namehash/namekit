import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',  
    client: 'src/client.ts', 
  },
  format: ['esm', 'cjs'], 
  dts: true, 
  splitting: true,  
  sourcemap: true, 
  clean: true, 
  external: ['react', 'react-dom', '@headlessui/react', '@headlessui-float/react'],
  minify: true, 
  treeshake: true,
});
