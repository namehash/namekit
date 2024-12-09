import type { Config } from "tailwindcss";

const EXACT_MATCH_BACKGROUND_GRADIENT_VAR_NAME = "--tw-exact-match-bg-gradient";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        inter: ["Inter", "Adobe Blank"],
        unifont: ["Unifont", "Adobe Blank"],
        notoBlack: ["Noto Emoji", "Adobe Blank"],
        notoEmoji: ["Noto Color Emoji", "Adobe Blank"],
      },
      keyframes: {
        rotateAIActionIcon: {
          "0%": { transform: "rotateZ(0)" },
          "25%": { transform: "rotateZ(-20deg)" },
          "50%": { transform: "rotateZ(0deg)" },
          "75%": { transform: "rotateZ(20deg)" },
        },
        slide: {
          "0%": { transform: "translateY(-100px)" },
          "100%": { transform: "translateY(0px)" },
        },
        loading: {
          "0%": { transform: "translateY(-5px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeInAndSlideUp: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "2%": { opacity: "1", transform: "translateY(0)" },
          "5%": { opacity: "1", transform: "translateY(0)" },
          "7%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "0", transform: "translateY(20px)" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slide: "slide 1s ease-in-out",
        fadeInAndSlideUp: "fadeInAndSlideUp 11s linear infinite",
        fadeIn: "fadeIn 1s linear forwards",
        fadeOut: "fadeOut 1s linear forwards",
        rotateAIActionIcon: "rotateAIActionIcon 0.5s linear forwards",
      },
      boxShadow: {
        "outer-top":
          "0px -1px 3px rgba(0, 0, 0, 0.1), 0px -1px 2px rgba(0, 0, 0, 0.06);",
        "explore-web3-card":
          "0px 0px 10px -5px rgba(0, 0, 0, 0.02), 0px 4px 25px -5px rgba(0, 0, 0, 0.05)",
        "explore-web3-card-hover":
          "0px 2px 20px -5px rgba(0, 0, 0, 0.20), 0px 4px 40px -5px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "gradient-radial": `radial-gradient(225.76% 400.63% at 100% 50.11%, rgba(255,255,255, 0) 0%, var(${EXACT_MATCH_BACKGROUND_GRADIENT_VAR_NAME}) 100%)`,
        "gradient-rainbow":
          "linear-gradient(90deg, #9FE479 0%, #007FF4 32.29%, #5F3DF1 66.15%, #EA6E4B 100%)",
        "gradient-no-visibility":
          "linear-gradient(180deg, rgba(255,255,255, 0.60) 0%, rgba(255,255,255, 0.60) 100%)",
        "gradient-white-to-transparent":
          "linear-gradient(270deg, rgba(255,255,255,1) 50%, rgba(255,255,255,0.80) 60%, rgba(255,255,255,0.70) 65%, rgba(255,255,255,0.60) 70%, rgba(255,255,255,0.50) 75%, rgba(255,255,255,0.40) 80%, rgba(255,255,255,0.30) 85%, rgba(255,255,255,0.15) 90%, rgba(255,255,255,0) 100%)",
        "gradient-gray-to-transparent":
          "linear-gradient(270deg, rgba(248,250,252,1) 0%, rgba(248,250,252,0.90) 20%, rgba(248,250,252,0.80) 30%, rgba(248,250,252,0.70) 40%, rgba(248,250,252,0.60) 50%, rgba(248,250,252,0.50) 60%, rgba(255,255,255,0.40) 70%, rgba(248,250,252,0.30) 80%, rgba(248,250,252,0.15) 90%, rgba(248,250,252,0) 100%)",
        "noise-texture": "url('/images/noisetexture.png')",
        "gradient-to-white":
          "linear-gradient(180deg, rgba(255,255,255, 0) 0%, rgba(248,250,252,1) 100%)",
        "custom-gradient":
          "linear-gradient(90deg, #9FE479 0%, #007FF4 32.29%, #5F3DF1 66.15%, #EA6E4B 100%)",
      },
      width: {
        // IS stands for "Instant Search"
        ISNameKitDomainCard: "calc(50% - 20px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
