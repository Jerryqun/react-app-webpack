const path = require("path");

const ESLintPlugin = require("eslint-webpack-plugin");

const CopyWebpackPlugin = require("copy-webpack-plugin"); // 拷贝资源插件

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css

const HtmlWebpackPlugin = require("html-webpack-plugin"); // 自动创建一个HTML文件，并把打包好的JS插入到HTML文件中

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 压缩css

const TerserPlugin = require("terser-webpack-plugin"); //压缩js

const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin"); //压缩html

const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 在每一次打包之前，删除整个输出文件夹下所有的内容 webpack4  webpack5下无效

// const PreloadWebpackPlugin = require("preload-webpack-plugin"); webpack5 下这个插件会报错无法使用

const ProgressBarPlugin = require("progress-bar-webpack-plugin"); // 编译进度条插件 如果资源太小可能看不出效果

module.exports = {
  entry: "./src/index",
  mode: "development", // mode：编译模式短语，支持 development、production 等值，Webpack 会根据该属性推断默认配置；
  // 开发模式禁用产物优化
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    // 代码压缩 默认值false 开启后默认只对js代码进行压缩 如果是css 需要配置CssMinimizerPlugin 插件  webpack5默认集成了Terser 插件
    minimize: false,
    // minimize开启才能生效
    minimizer: [
      // Webpack5 之后，约定使用 `'...'` 字面量保留默认 `minimizer` 配置
      "...",
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            reduce_vars: true,
            pure_funcs: ["console.log"],
          },
          // ...
        },
      }),
      new HtmlMinimizerPlugin({
        minimizerOptions: {
          // 折叠 Boolean 型属性
          collapseBooleanAttributes: true,
          // 使用精简 `doctype` 定义
          useShortDoctype: true,
          // ...
        },
      }),
    ],
    // 关闭代码分包
    splitChunks: {
      chunks: "all",
      // 设定引用次数超过 2 的模块才进行分包
      minChunks: 2,
      // minChunks：用于设置引用阈值，被引用次数超过该阈值的 Module 才会进行分包处理；
      // maxInitialRequest/maxAsyncRequests：用于限制 Initial Chunk(或 Async Chunk) 最大并行请求数，本质上是在限制最终产生的分包数量；
      // minSize： 超过这个尺寸的 Chunk 才会正式被分包；
      // maxSize： 超过这个尺寸的 Chunk 会尝试继续做分包；
      // maxAsyncSize： 与 maxSize 功能类似，但只对异步引入的模块生效；
      // maxInitialSize： 与 maxSize 类似，但只对 entry 配置的入口模块生效；
      // enforceSizeThreshold： 超过这个尺寸的 Chunk 会被强制分包，忽略上述其它 size 限制；
      // cacheGroups：用于设置缓存组规则，为不同类型的资源设置更有针对性的分包策略。
    },
    // 模块合并 默认值 false
    concatenateModules: false,
    // 是否开启Tree-shaking 功能 删除没用到的变量
    usedExports: false,
  },
  target: "web", // 用于配置编译产物的目标运行环境，支持 web、node、electron 等值，不同值最终产物会有所差异；
  profile: true, // 生成性能分析文件
  //使用 externals 也能将部分依赖放到构建体系之外，实现与 noParse 类似的效果
  // externals: {
  //   react: "React",
  // },

  output: {
    // filename: "[name].js",
    // [fullhash]：整个项目的内容 Hash 值，项目中任意模块变化都会产生新的 fullhash；
    // [chunkhash]：产物对应 Chunk 的 Hash，Chunk 中任意模块变化都会产生新的 chunkhash；
    // [contenthash]：产物内容 Hash 值，仅当产物内容发生变化时才会产生新的 contenthash，因此实用性较高。
    filename: "[name]-[contenthash].js",
    path: path.join(__dirname, "./dist"),
    // libraryTarget: "commonjs",
    // publicPath: "https://cdn.example.com/assets/", // 构建后文件引入路径的前缀
  },
  // 缓存类型，支持 'memory' | 'filesystem'，需要设置为 filesystem 才能开启持久缓存；
  /**
   * cache.type：缓存类型，支持 'memory' | 'filesystem'，需要设置为 filesystem 才能开启持久缓存；
     cache.cacheDirectory：缓存文件路径，默认为 node_modules/.cache/webpack ；
     cache.buildDependencies：额外的依赖文件，当这些文件内容发生变化时，缓存会完全失效而执行完整的编译构建，通常可设置为各种配置文件，如：
   */
  cache: {
    type: "filesystem",
  },
  // 用于实现 entry 或异步引用模块的按需编译，这是一个非常实用的新特性！
  experiments: {
    lazyCompilation: false,
  },
  devtool: "source-map", // 是否生成source-map文件  "source-map" | "eval",
  devServer: {
    hot: true,
    open: true,
    // progress: true, // 显示打包的进度条 webpack4
    // 设置代理
    proxy: {
      // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
      "/api": "http://localhost:3000",

      // 将本地 /api2/xxx 代理到 localhost:3000/xxx
      "/api2": {
        target: "http://localhost:3000",
        pathRewrite: {
          "/api2": "",
        },
      },
    },
  },
  resolve: {
    /**
     * resolve.modules用于配置webpack去哪些目录下寻找第三方模块，默认是 node_modules
     * 寻找第三方，默认是在当前项目目录下的node_modules里面去找，如果没有找到，就会去上一级目录../node_modules找，再没有会去../../node_modules中找，以此类推，和Node.js的模块寻找机制很类似。
       如果我们的第三⽅模块都安装在了项⽬根⽬录下，就可以直接指明这个路径。
     */
    modules: [path.resolve(__dirname, "./node_modules")],
    // 如果想优化到极致的话，不建议用extensionx, 因为它会消耗一些性能。虽然它可以带来一些便利
    extensions: [".ts", ".js", ".jsx", ".tsx"], // 引入的时候这些文件可以不要写后缀
    /**
     * 定义文件夹默认文件名
       例如对于 import './dir' 请求，假设 resolve.mainFiles = ['index', 'home'] ，Webpack 会按依次测试 ./dir/index 与 ./dir/home 文件是否存在。
     */
    // mainFiles: ["test"],
    // 快捷引入
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
  // performance: {
  //   // 设置所有产物体积阈值
  //   maxAssetSize: 172 * 1024,
  //   // 设置 entry 产物体积阈值
  //   maxEntrypointSize: 244 * 1024,
  //   // 报错方式，支持 `error` | `warning` | false
  //   hints: "error",
  //   // 过滤需要监控的文件类型
  //   assetFilter: function (assetFilename) {
  //     return assetFilename.endsWith(".js");
  //   },
  // },
  // 用于声明模块加载规则，例如针对什么类型的资源需要使用哪些 Loader 进行处理；
  module: {
    // 使用 noParse 跳过文件编译
    // noParse: /react|react-dom/,
    rules: [
      {
        test: /\.js$/,
        // Webpack 在处理 node_modules 中的 js 文件时会直接跳过这个 rule 项，不会为这些文件执行 Loader 逻辑。
        include: path.resolve(__dirname, "./src"),
        use: [
          {
            loader: "babel-loader",

            options: { presets: ["@babel/preset-typescript"] },
          },
        ],
      },
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, "./src"),

        use: "ts-loader",
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "./src"),

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
        include: path.resolve(__dirname, "./src"),

        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        include: path.resolve(__dirname, "./src"),

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
        include: path.resolve(__dirname, "./src"),

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
        include: path.resolve(__dirname, "./src"),

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
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(process.cwd(), "./vendor/"),
          to: path.join(process.cwd(), "./dist/"),
        },
      ],
    }),
    new ProgressBarPlugin(),
    new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹 webpack4
    new ESLintPlugin({ extensions: [".js", ".ts", ".jsx", ".tsx"] }),
    new MiniCssExtractPlugin({ filename: "[name]-[contenthash].css" }),
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
    // new PreloadWebpackPlugin({
    //   rel: "preload",
    //   as(entry) {
    //     //资源类型
    //     if (/\.css$/.test(entry)) return "style";
    //     if (/\.woff$/.test(entry)) return "font";
    //     if (/\.png$/.test(entry)) return "image";
    //     return "script";
    //   },
    //   include: "allChunks", // preload模块范围，还可取值'initial'|'allChunks'|'allAssets',
    //   fileBlacklist: [/\.svg/], // 资源黑名单
    //   fileWhitelist: [/\.script/], // 资源白名单
    // }),
  ],
};
