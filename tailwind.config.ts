import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      white: "#FFFFFF",
      black: "#000000",
      primary: "#BEE719",
      "primary-hover": "#E8FF89",
      "primary-active": "#8AA814",
      grey: "#8F8F8F",
      "grey-hover": "#343434",
      "grey-active": "#CFCFD0",
      error: "#F04438",
      warning: "#EAB946",
      info: "#12B76A",
    },
    extend: {
      backgroundImage: {
        logoBG: "url('/images/background/bg-brand.png')",
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};
export default config;
