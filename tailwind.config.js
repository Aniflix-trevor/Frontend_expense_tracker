/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8AB4F8", //  blue for accents
        dark: {
          900: "#0F0F0F",  // Pure black
          800: "#1E1E1E",  // Slightly lighter for containers
          700: "#2D2D2D",  // Borders/
          600: "#3C3C3C"
        },
        text: {
          primary: "#E1E1E1", // Main text
          secondary: "#9AA0A6", // Secondary text (Gemini's gray)
        }
      },
      // <--- ADD THIS BLOCK FOR ANIMATIONS
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-up-delay': 'fade-in-up 0.8s ease-out 0.3s forwards', // Example with delay
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
      },
      // <--- END ANIMATION BLOCK
    },
  },
  plugins: [],
}