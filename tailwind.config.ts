import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#E8C84A',
        },
        purple: {
          DEFAULT: '#7C3AED',
          soft: '#A78BFA',
          deep: '#6B21A8',
        },
      },
    },
  },
  plugins: [],
};
export default config;
