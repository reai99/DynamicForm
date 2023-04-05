const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'production',
  bail: true,
  entry: './src/index.js',
  devtool: "source-map",
  // 输出
  output: {
    path: path.resolve(__dirname, '../lib'), // 输出文件夹
    filename: 'index.js',
    libraryTarget: 'umd', // 打包方式
    libraryExport: 'default',
  },
  // 定义外部依赖，避免把react和react-dom打包进去
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom"
    }
  },
  module: {
    rules: [
      // 处理图片和字体图标
      {
        test: /\.(png|gif|jpg|jpeg|woff|woff2|eot|ttf|otf|svg)$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 1000,
              name: '[name].[hash:8].[ext]',
            }
          }
        ]
      },
      // 处理jsx文件
      {
        test: /.jsx|.js?$/,
        exclude: /node_modules/,
        include: path.join(__dirname, '../src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            }
          }
        ],
      },
      // 匹配css文件
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      // 匹配less文件
      {
        test: /.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true
              },
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // css兼容优化
    new OptimizeCssAssetsWebpackPlugin(),
    // 解决process无法获取问题
    new webpack.ProvidePlugin({ process: 'process' }),
    // 进度条
    new webpack.ProgressPlugin({ percentBy: 'entries' }),
  ],
  optimization: {
    // 告知 webpack使用TerserPlugin插件压缩
    minimize: true,
    // 确定那些由模块提供的导出内容
    providedExports: true,
    // 决定每个模块使用的导出内容
    usedExports: true,
    // 寻找模块图形中的片段，哪些是可以安全地被合并到单一模块中
    concatenateModules: true,
    // 告知 webpack 去辨识 package.json 中的 副作用 标记或规则，以跳过那些当导出不被使用且被标记不包含副作用的模块
    //识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
    //依赖于optimization.providedExports和optimization.usedExports
    sideEffects: true,
    // 告知 webpack 检测或移除这些 chunk
    removeEmptyChunks: true,
    //取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
    emitOnErrors: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        exclude: /node_modules/,
        terserOptions: {
          compress: {
            warnings: true,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        }
      }),
      new CssMinimizerPlugin(),
    ],
  }
}
