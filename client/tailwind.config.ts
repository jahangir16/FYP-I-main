import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"], // Enable class-based dark mode
  theme: {
    extend: {
      // Custom font families
      fontFamily: {
        Poppins: ["var(--font-Poppins)"],
        Josefin: ["var(--font-Josefin)"],
      },
      // Custom background gradients
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // Custom screen breakpoints
      screens: {
        "400px": "400px",
        "800px": "800px",
        "1000px": "1000px",
        "1100px": "1100px",
        "1200px": "1200px",
        "1300px": "1300px",
        "1500px": "1500px",
      },
      // Custom colors
      colors: {
        primary: {
          DEFAULT: "#4f46e5", // Default primary color (indigo-600)
          50: "#eef2ff", // Indigo-50
          100: "#e0e7ff", // Indigo-100
          200: "#c7d2fe", // Indigo-200
          300: "#a5b4fc", // Indigo-300
          400: "#818cf8", // Indigo-400
          500: "#6366f1", // Indigo-500
          600: "#4f46e5", // Indigo-600
          700: "#4338ca", // Indigo-700
          800: "#3730a3", // Indigo-800
          900: "#312e81", // Indigo-900
        },
        dark: {
          DEFAULT: "#1e1e1e", // Default dark background color
          text: "#ffffff", // Text color for dark mode
          secondary: "#2d2d2d", // Secondary dark color
        },
        light: {
          DEFAULT: "#ffffff", // Default light background color
          text: "#1e1e1e", // Text color for light mode
          secondary: "#f5f5f5", // Secondary light color
        },
      },
      // Custom animations
      animation: {
        pulse: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite", // Custom pulse animation
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [
    // Add the scrollbar-hide utility
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, any>) => void;
    }) {
      const newUtilities = {
        ".scrollbar-hide": {
          /* Hide scrollbar for Chrome, Safari, and Opera */
          "&::-webkit-scrollbar": {
            display: "none",
          },
          /* Hide scrollbar for IE, Edge, and Firefox */
          "-ms-overflow-style": "none", // IE and Edge
          "scrollbar-width": "none", // Firefox
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
