import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@namehash/internal/src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@namehash/namehashlabs-react/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "translate(-50%, -50%) rotate(0deg)" },
          to: { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
        "border-rotate": {
          "0%": { "--rotation": "0deg" },
          "100%": { "--rotation": "360deg" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s linear forwards",
        "spin-slow": "spin-slow 5s linear infinite",
        "border-rotate": "border-rotate 3s linear infinite",
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
