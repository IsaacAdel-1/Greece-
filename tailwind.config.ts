import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Refined, restrained luxury palette.
        ink: "#1a1815", // near-black warm charcoal — primary text
        bone: "#f6f3ee", // warm off-white — page background
        sand: "#e8e2d8", // soft neutral — borders/surfaces
        clay: "#3b4f6e", // muted navy — secondary text (higher contrast than the old taupe)
        brass: "#9c7a4d", // restrained metallic accent (logo gold)
        navy: "#1f3a63", // deep brand navy (logo wordmark)
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.18em",
      },
      maxWidth: {
        content: "80rem",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
