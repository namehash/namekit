import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
    },
  },
  plugins: [],
} satisfies Config;
