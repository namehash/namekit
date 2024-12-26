import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-[#E7DBF7]",
    "bg-[#1FA3C7]",
    "bg-[#FE097C]",
    "bg-[#FFBE00]",
    "bg-[#DB3D58]",
    "bg-[#00619A]",
    "bg-[#01C69A]",
    "bg-[#8464CA]",
    "bg-[#E84233]",
    "bg-[#F5851E]",
    "bg-[#CBECEC]",
    "bg-[#FDE2CB]",
    "bg-[#F0C3F3]",
    "bg-[#B3D1F5]",
    "bg-[#FFEAB9]",
    "bg-[#EE5A3D]",
    "bg-[#1683FE]",
    "bg-[#F3B5D5]",
    "bg-[#0DAF6E]",
    "bg-[#390D2D]",
  ],
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
