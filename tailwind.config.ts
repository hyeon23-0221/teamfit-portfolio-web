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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      minHeight: {
        dvh: "100dvh",
      },
      height: {
        dvh: "100dvh",
      },
      maxHeight: {
        dvh: "100dvh",
      },
    },
  },
  plugins: [],
};
export default config;
