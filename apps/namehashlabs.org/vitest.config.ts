import { UserConfig, defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
      alias: {
        '@': '/.'
      },
    },
} as UserConfig);