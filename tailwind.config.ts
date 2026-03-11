import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50:  "#EEF4FB",
          100: "#DDEAF7",
          200: "#BBCEF0",
          300: "#88A8DF",
          400: "#5585CF",
          500: "#3A6EC8",
          600: "#2567C2",
          700: "#1B5FC1",
          800: "#1550A8",
          900: "#0F3F87",
        },
      },
    },
  },
  plugins: [],
};
export default config;
