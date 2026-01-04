/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // We name them semantically so you can swap codes later without breaking code
        retro: {
          red: "#BF1A1A", // Your 1st color (Actions/Alerts)
          orange: "#FF6C0C", // Your 2nd color (Highlights)
          cream: "#FFE08F", // Your 3rd color (Backgrounds)
          blue: "#060771", // Your 4th color (Text/Borders)
        },
      },
      fontFamily: {
        // Suggestion: Import "VT323" or "Courier Prime" from Google Fonts
        retro: ['"Courier Prime"', "monospace"],
        display: ['"VT323"', "monospace"],
      },
      boxShadow: {
        // The "Hard" shadow typical of the 90s
        hard: "4px 4px 0px 0px #060771",
        "hard-sm": "2px 2px 0px 0px #060771",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        animation: {
          marquee: "marquee 25s linear infinite",
        },
      },
    },
  },
  plugins: [],
};
