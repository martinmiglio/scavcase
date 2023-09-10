const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      dark: "#1B1B1C",
      background: "#2d2d2f",
      background2: "#2C2B2D",
      foreground: "#4f4f4f",
      text: "#c7c5b3",
      primary: "#9a8866",
      secondary: "#757257",
      "call-to": "#0292c0",
    },
    extend: {
      animation: {
        bounce: "bounce 1s ease-in-out infinite",
        bounce200: "bounce 1s ease-in-out 200ms infinite",
        bounce400: "bounce 1s ease-in-out 400ms infinite",
      },
    },
  },
  plugins: [require("tailwindcss-patterns")],
};
export default config;
