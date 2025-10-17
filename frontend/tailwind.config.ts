import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta NSR: tons neutros com toque metálico
        primary: {
          black: "#0A0A0A",
          white: "#FAFAFA",
          beige: "#E8DCC4",
          gold: "#C9A96E",
          bronze: "#B87333",
        },
        dark: {
          bg: "#0D0D0D",
          card: "#1A1A1A",
          border: "#2A2A2A",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Special Elite", "monospace"],
        arabic: ["var(--font-arabic)", "serif"],
        display: ["var(--font-display)", "Special Elite", "monospace"],
        nsr: ["var(--font-nsr)", "Nsr", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-metallic": "linear-gradient(135deg, #C9A96E 0%, #B87333 100%)",
      },
      boxShadow: {
        "soft": "0 4px 24px rgba(0, 0, 0, 0.12)",
        "soft-lg": "0 8px 40px rgba(0, 0, 0, 0.18)",
        "gold": "0 4px 20px rgba(201, 169, 110, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
