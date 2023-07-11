const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config");
const path = require("path");

module.exports = [
  merge(baseConfig, {
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "./dist-double-default"),
    },
  }),
  merge(baseConfig, {
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "./dist-double-amd"),
      libraryTarget: "amd",
    },
  }),
  merge(baseConfig, {
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "./dist-double-umd"),
      libraryTarget: "umd",
    },
  }),
  merge(baseConfig, {
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "./dist-double-commonjs"),
      libraryTarget: "commonjs",
    },
  }),
];
