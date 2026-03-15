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
        primary: "#7C3AED",
        secondary: "#F59E0B",
        healingBlue: "#A7C7E7",
        healingPurple: "#E6D9FF",
        healingGreen: "#D8F3DC",
        healingPink: "#FFD6E7",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(168, 85, 247, 0.8)" },
        },
      },
      animation: {
        gradient: "gradient 8s ease infinite",
        float: "float 4s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [],
};

export default config;
