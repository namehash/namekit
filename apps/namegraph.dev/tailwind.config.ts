import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
