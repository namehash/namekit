import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
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
