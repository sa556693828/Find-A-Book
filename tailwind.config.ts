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
        pink: "#E3007F",
        grey: "#F6F6F6",
      },
      transitionTimingFunction: {
        "ease-in-out-cubic": "cubic-bezier(.65,1.51,.58,.92)",
      },
    },
  },
  plugins: [],
} satisfies Config;
