import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ktds: {
          red: "#ec1c24",
          black: "#111111",
          grey: {
            dark: "#1a1a1a",
            light: "#a7a9ac",
            border: "#2d2d2d",
          }
        },
        accent: {
          cyan: "#22d3ee",
          green: "#4ade80",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
