module.exports = {
  plugins: [
    require("autoprefixer")(),
    require("postcss-logical")(["padding-inline", "inset"]),
    require("flex-gap-polyfill"),
  ],
};
