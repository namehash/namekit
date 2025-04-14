import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@namehash/namehashlabs-react/src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: ["rounded-big", "rounded-biggest"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-white-to-transparent":
          "linear-gradient(270deg, rgba(255,255,255,1) 50%, rgba(255,255,255,0.80) 60%, rgba(255,255,255,0.70) 65%, rgba(255,255,255,0.60) 70%, rgba(255,255,255,0.50) 75%, rgba(255,255,255,0.40) 80%, rgba(255,255,255,0.30) 85%, rgba(255,255,255,0.15) 90%, rgba(255,255,255,0) 100%)",
        "gradient-white-to-transparent-top-bottom":
          "linear-gradient(180deg, rgba(255,255,255,1) 50%, rgba(255,255,255,0.80) 60%, rgba(255,255,255,0.70) 65%, rgba(255,255,255,0.60) 70%, rgba(255,255,255,0.50) 75%, rgba(255,255,255,0.40) 80%, rgba(255,255,255,0.30) 85%, rgba(255,255,255,0.15) 90%, rgba(255,255,255,0) 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInFadeOut: {
          "0%": { opacity: "0" },
          "33%": { opacity: "1" },
          "66%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        longFadeOut: {
          "0%": { opacity: "1" },
          "95%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        longFadeIn: {
          "0%": { opacity: "0" },
          "95%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        moveLeft: {
          "0%": { transform: "translate(-50%, -50%)" },
          "70%": { transform: "translate(-50%, -50%)" },
          "100%": { transform: "translate(-33%, -57%)" },
        },
      },
      textShadow: {
        thick:
          "0 2px 4px rgba(0, 0, 0, 1), 0 0 8px rgba(0, 0, 0, 1), 0 0 16px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.8), 0 0 32px rgba(0, 0, 0, 0.7)",
        puffier:
          "0 0 10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.6)",
        strong:
          "0 2px 4px rgba(0, 0, 0, 1), 0 0 8px rgba(0, 0, 0, 1), 0 0 16px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.9), 0 0 32px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.7), 0 0 50px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 0, 0, 0.5)",
      },
    },
    animation: {
      fadeIn: "fadeIn 1s linear forwards",
      longFadeOut: "longFadeOut 7s linear forwards",
      longFadeIn: "longFadeIn 10s linear forwards",
      fadeInFadeOut: "fadeInFadeOut 4s linear forwards",
      fadeInAndMoveLeft:
        "fadeIn 1s linear forwards, moveLeft 8s ease-in-out forwards",
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        ".text-shadow-thick": {
          textShadow:
            "0 2px 4px rgba(0, 0, 0, 1), 0 0 8px rgba(0, 0, 0, 1), 0 0 16px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.8), 0 0 32px rgba(0, 0, 0, 0.7)",
        },
        ".text-shadow-strong": {
          textShadow:
            "0 2px 4px rgba(0, 0, 0, 1), 0 0 8px rgba(0, 0, 0, 1), 0 0 16px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.9), 0 0 32px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.7), 0 0 50px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 0, 0, 0.5)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
export default config;
