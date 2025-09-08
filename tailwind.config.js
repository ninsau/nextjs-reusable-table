module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to prevent leakage
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
