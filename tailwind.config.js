/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        handwritten: ["Caveat", "cursive"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted-bg)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
        line: "var(--line)",
        info: "var(--info)",
        success: "var(--success)",
        dimension: "var(--dimension)",
        "dimension-foreground": "var(--dimension-foreground)",
      },
    },
  },
  plugins: [],
};
