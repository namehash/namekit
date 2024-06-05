import type { Config } from "tailwindcss";

const config: Config = {
  content: ["src/**/*.{ts,tsx,js,jsx,mdx}"],
  prefix: "ng-",
  variants: {
    extend: {
      display: ["group", "group-hover"],
    },
  },
};

export default config;
