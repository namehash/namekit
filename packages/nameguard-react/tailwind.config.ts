// tailwind config is required for editor support
import sharedConfig from "@namehash/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "presets"> = {
  presets: [
    {
      ...sharedConfig,
      prefix: "ng-",
    },
  ],
};

export default config;
