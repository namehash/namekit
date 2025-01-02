import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@namehash/nameguard-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@namehash/internal/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "figma-black": "#201F1F",
        "code-gray": "#434446",
      },
      padding: {
        "7.5": "30px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        purple_background:
          "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.00) 0%, #FFF 100%), linear-gradient(90deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)",
        green_background:
          "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.00) 0%, #FFF 100%), linear-gradient(180deg, #FDC46A 0%, #2ED3C6 32.29%, #6DFFB7 70.83%, #6DFFB7 95.83%)",
        purple_background_mobile:
          "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.60) 0%, #FFF 100%), linear-gradient(90deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)",
        green_background_mobile:
          "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.60) 0%, #FFF 100%), linear-gradient(180deg, #FDC46A 0%, #2ED3C6 32.29%, #6DFFB7 70.83%, #6DFFB7 95.83%)",
        exit_section_background:
          "linear-gradient(0deg, rgba(255, 255, 255, 0.85) 2.25%, #FFF 96.18%), linear-gradient(90deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)",
        hero_background:
          "linear-gradient(180deg, rgba(249, 250, 251, 0.00) 0%, #F9FAFB 100%)",
        generate_raport_background:
          "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.8) 0%, #FFF 100%), linear-gradient(0deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)",
        in_touch_background:
          "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.6) 0%, #FFF 100%), linear-gradient(0deg, #4C3FA0 0%, #F112D9 32.29%, #2ED3C6 58.85%, #FFAF00 100%)",
        error404_background_mobile:
          "radial-gradient(50% 25% at 50% 40%, rgba(255, 255, 255, 0.7) 0%, #FFF 100%), linear-gradient(90deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)",
        error404_background_desktop:
          "radial-gradient(50% 35% at 50% 40%, rgba(255, 255, 255, 0.7) 0%, #FFF 100%), linear-gradient(90deg, #FFAF00 0%, #F112D9 32.29%, #4C3FA0 70.83%, #2ED3C6 95.83%)",
      },
      fontSize: {
        footer_text: ["12px", "20px"],
      },
      keyframes: {
        carousel: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      animation: {
        carousel: "carousel 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

export default config;
