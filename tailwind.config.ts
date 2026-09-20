import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      colors: {
        green: "#2c6d90",
        "green-light": "#d8653b",
        sky: "#8fc1cf",
        peach: "#db905a",
        sand: "#edf6f8",
        ink: "#18384a",
        muted: "#607987",
      },
    },
  },
  plugins: [],
};

export default config;
