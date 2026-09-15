import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      colors: {
        green: "#123d32",
        "green-light": "#1f6b55",
        sand: "#f5f0e8",
        ink: "#17211e",
        muted: "#66736f",
      },
    },
  },
  plugins: [],
};

export default config;
