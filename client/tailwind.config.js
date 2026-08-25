/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12181B",
        surface: "#F6F8F6",
        accent: {
          DEFAULT: "#8FE13D",
          dark: "#6FC220",
        },
        slateline: "#E4E8E4",
        muted: "#66716C",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      boxShadow: {
        soft: "0 12px 40px -12px rgba(18, 24, 27, 0.18)",
      },
    },
  },
  plugins: [],
};

