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
        eldorado: {
          dark: "#262019",
          muted: "#4a4033",
          subtle: "#6b5f4e",
          bg: "#F9FAFB",
          surface: "#EDEFF2",
          // Estaciones
          green1: "#1B9951",
          teal1: "#2B8487",
          teal2: "#197084",
          green2: "#419372",
          forest: "#385F18",
          amber: "#EB9301",
          orange: "#DA3501",
          red: "#BE0D00",
          sky: "#178FD5",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "sans-serif"],
        heading: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
