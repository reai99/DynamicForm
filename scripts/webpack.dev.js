const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const publicPath = '/';

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'web',
  devtool: 'cheap-module-source-map',
  // 入口
  entry: {
    app: './example/index.js'
  },
  // 输出
  output: {
    clean: true,
    filename: 'static/js/bundle.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
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
        exclude: /node_modules|lib|scripts/,
        include: path.join(__dirname, '../'),
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
    // html文件中引入的外部资源,生成创建html入口文件
    new HtmlWebpackPlugin({ filename: 'index.html', inject: 'body', template: resolveApp('example/public/index.html') }),
    // 解决html文件中标签语法问题
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, process.env),
    // css兼容优化
    new OptimizeCssAssetsWebpackPlugin(),
    // 解决process无法获取问题
    new webpack.ProvidePlugin({ process: 'process' }),
    // 进度条
    new webpack.ProgressPlugin({ percentBy: 'entries' }),
     // 热更新
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin({
      forceEnable: true,
      exclude: [/node_modules/, /bootstrap\.jsx$/],
      overlay: false  //修改了错误叠加集成在插件中的工作方式，false则不显示报错
    }),
  ],
  optimization: {
    usedExports: true,
    providedExports: true,
  },
  devServer: {
    open: true,
    historyApiFallback: true, // 使用history模式需要进行开启
    hot: true,
    port: 3000,
    host: "localhost",
    proxy: {
      "/api": {
        target: "https://localhost:3001",
        secure: false,
        changeOrigin: true
      }
    }
  }
}