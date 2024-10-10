import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@namehash/internal/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        "250": "2.5", // Add a '250' key for 2.5 times scaling
      },
      screens: {
        xSmall: "425px",
        small: "550px",
        medium2x: "889px",
        tall: { raw: "(min-height: 600px)" },
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
    },
    keyframes: {
      spin: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
      scaleAvatar: {
        "0%": { transform: "scale(1)", zIndex: "50" },
        "50%": { transform: "scale(1.025)", zIndex: "50" },
        "100%": { transform: "scale(1.05)", zIndex: "50" },
      },
      scaleDownAvatar: {
        "0%": { transform: "scale(1.05)" },
        "100%": { transform: "scale(1)" },
      },
      widen: {
        "0%": { width: "0%" },
        "100%": { width: "100%" },
      },
      slideIn: {
        "0%": { transform: "translateX(0)", opacity: "1" },
        "33%": { transform: "translateX(15%)", opacity: "0" },
        "66%": { transform: "translateX(-15%)", opacity: "0" },
        "100%": { transform: "translateX(0%)", opacity: "1" },
      },
      slideOut: {
        "0%": { transform: "translateX(0)", opacity: "1" },
        "33%": { transform: "translateX(-15%)", opacity: "0" },
        "66%": { transform: "translateX(15%)", opacity: "0" },
        "100%": { transform: "translateX(0%)", opacity: "1" },
      },
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      rotate360: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
    },
    animation: {
      fadeIn: "fadeIn 1s linear forwards",
      scaleAvatar: "0.2s scaleAvatar 0s linear forwards",
      scaleDownAvatar: "scaleDownAvatar 0.45s linear forwards",
      spinSlow: "rotate360 150s linear infinite",
      slideIn: "slideIn 0.5s ease-out",
      slideOut: "slideOut 0.5s ease-in",
      widen: "widen 5s linear forwards",
      spin: "spin 1s linear infinite",
    },
  },
  plugins: [],
};
export default config;
