const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  purge: {
    enabled: isProduction,
    content: [
      "./public/**/*.html",
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: "hsl(227 2% 94%)",
      black: "hsl(227 94% 4%)",
      green: "hsl(140 100% 20%)",
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
