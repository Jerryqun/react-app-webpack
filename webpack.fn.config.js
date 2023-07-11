const path = require("path");

const ESLintPlugin = require("eslint-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function (env, argv) {
  // ...
  return {
    entry: "./src/index",
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "./dist"),
    },
    devServer: {
      hot: true,
      open: true,
    },
    mode: "development",
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: { presets: ["@babel/preset-typescript"] },
            },
          ],
        },
        {
          test: /\.ts$/,
          use: "ts-loader",
        },
        {
          test: /\.css$/i,
          use: [
            process.env.NODE_ENV === "development" //      process.env.NODE_ENV  为undefined  待解决
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  // 添加 autoprefixer 插件 添加兼容不同浏览器的兼容前缀
                  plugins: [require("autoprefixer")],
                },
              },
            },
          ],
        },
        {
          // 预编译语言与postcss能共用
          test: /\.less$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {
          test: /\.jsx$/,
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
            ],
          },
        },
        {
          test: /\.tsx$/,
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
              "@babel/preset-typescript",
            ],
          },
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          // type 属性适用于 Webpack5，旧版本可使用 file-loader
          type: "asset/resource",
          use: [
            {
              loader: "image-webpack-loader", // 图像优化：压缩
              options: {
                // jpeg 压缩配置
                mozjpeg: {
                  quality: 80,
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js", ".jsx", ".tsx"], // 引入的时候这些文件可以不要写后缀
      // 快捷引入
      alias: {
        "@": path.resolve(process.cwd(), "./src"),
      },
    },
    plugins: [
      new ESLintPlugin({ extensions: [".js", ".ts", ".jsx", ".tsx"] }),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        templateContent: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Webpack App1</title>
    </head>
    <body>
      <div id="app" />
    </body>
  </html>
      `,
      }),
    ],
  };
};
