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
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
