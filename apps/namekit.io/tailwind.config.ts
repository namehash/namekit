import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s linear forwards",
      },
      boxShadow: {
        "explore-web3-card":
          "0px 0px 10px -5px rgba(0, 0, 0, 0.02), 0px 4px 25px -5px rgba(0, 0, 0, 0.05)",
        "explore-web3-card-hover":
          "0px 2px 20px -5px rgba(0, 0, 0, 0.20), 0px 4px 40px -5px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "noise-texture": "url('/images/noisetexture.png')",
        "gradient-to-white":
          "linear-gradient(180deg, rgba(255,255,255, 0) 0%, rgba(248,250,252,1) 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
