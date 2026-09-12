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
          primary: {
          DEFAULT: "#8FE13D",
          dark: "#6FC71E",
          light: "#E9FBD3",
        },
        slateline: "#E4E8E4",
        muted: "#66716C",

        ink: {
          DEFAULT: "#12140F",
          soft: "#4B4F45",
          faint: "#8B9086",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F6F8F3",
          panel: "#14140F",
        },
        line: "#E6E9E1",
        danger: "#E14D3D",
        warning: "#E8A93A",
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

