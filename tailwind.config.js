/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8AB4F8", // Gemini-like blue for accents
        dark: {
          900: "#0F0F0F",  // Pure black (Gemini's main bg)
          800: "#1E1E1E",  // Slightly lighter for containers
          700: "#2D2D2D",  // Borders/divider
        },
        text: {
          primary: "#E1E1E1", // Main text
          secondary: "#9AA0A6", // Secondary text (Gemini's gray)
        }
      },
    },
  },
  plugins: [],
}

