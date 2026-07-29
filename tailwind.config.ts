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
        "atlas-bg": "#0b1120",
        "atlas-bg-alt": "#0f1729",
        "atlas-card": "#131c31",
        "atlas-card-light": "#1a2540",
        "atlas-border": "#25324f",
        "atlas-gold": "#e0a52c",
        "atlas-gold-light": "#f0c264",
        "atlas-gold-dark": "#a8781c",
        "atlas-teal": "#2dd4bf",
        "atlas-text": "#e8ecf5",
        "atlas-text-muted": "#8b96b3",
      },
      fontFamily: {
        "atlas-serif": ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        "atlas-sans": ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "atlas-glow": "0 0 40px -10px rgba(224, 165, 44, 0.35)",
        "atlas-glow-teal": "0 0 40px -10px rgba(45, 212, 191, 0.35)",
      },
      backgroundImage: {
        "atlas-radial": "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
      },
      animation: {
        "spin-slow": "spin 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;