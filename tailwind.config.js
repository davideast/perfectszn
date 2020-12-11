const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  purge: {
    enabled: isProduction,
    content: [
      "./src/**/*.tsx",
    ],
    options: {
      safelist: ['szn-topic--shake'],
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: "hsl(0 0% 100%)",
      black: "hsl(0 0% 5%)",
      green: "hsl(139 80% 38%)",
      yellow: "hsl(54 100% 50%)",
      red: "hsl(7 74% 54%)",
      orange: "hsl(21 100% 55%)",
      blue: "hsl(222 100% 34%)",
      purple: "hsl(275 49% 37%)",
    },
    fontFamily: {
      body: ["'Karla'", "sans-serif"],
      display: ["'Arvo'", "sans-serif"],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // It's a fixed grid so we don't need a container
    // TODO(davideast): is this needed b/c of the css purge?
   container: false,
  },
}
