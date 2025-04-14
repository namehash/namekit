import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@namehash/internal/src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@namehash/namehashlabs-react/src/**/*.{js,jsx,ts,tsx}",
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
      backgroundImage: {
        "skeleton-shimmer":
          "linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0))",
      },
      backgroundColor: {
        skeleton: "rgba(0, 0, 0, 0.05)",
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
      shimmer: {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(100%)" },
      },
      pulse: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.2" },
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
      skeleton: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      shimmer: "shimmer 2s infinite linear",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
  },
  plugins: [],
};
export default config;
