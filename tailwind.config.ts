import type { Config } from "tailwindcss";

// WCMT brand palette — from the planning conversation, kept as a single
// source of truth here rather than scattered as hex literals in components.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "wcmt-navy": "#0B2545",
        "wcmt-ocean": "#134074",
        "wcmt-coastal": "#4EA5D9",
        "wcmt-orange": "#F26B38",
        "wcmt-green": "#2BB673",
        "wcmt-bg": "#F5F7FA",
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
