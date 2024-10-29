import type { Config } from "tailwindcss";

const config: Config = {
  content: ["src/**/*.{ts,tsx,js,jsx,mdx}"],
  prefix: "nk-",
  theme: {
    extend: {
      colors: {
        alto: "#DBDBDB",
        "mine-shaft": "#272727",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};

export default config;
