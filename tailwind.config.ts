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
        gold: '#D4AF37', // גוון זהב יוקרתי
        white: '#f8fafc',
        black: '#000000', // צבע שחור
        'luxury-gold': '#a69359', // זהב כהה
        darkGray: '#333333', // אפור כהה לשימוש בריחופים
        'hover-gold': '#C49A29', // צבע זהב כהה יותר למעבר
        'hover-red': '#C24D47', // אדום כהה למעבר על כפתורים
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
