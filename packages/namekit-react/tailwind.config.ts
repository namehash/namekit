import type { Config } from "tailwindcss";

const config: Config = {
  content: ["src/**/*.{ts,tsx,js,jsx,mdx}"],
  prefix: "nk-",
  theme: {
    extend: {
      screens: {
        mobile: "390px",
      },
      colors: {
        alto: "#DBDBDB",
        "mine-shaft": "#272727",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
};

export default config;
