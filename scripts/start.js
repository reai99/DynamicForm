
const { merge } = require('webpack-merge');
const base = require('./webpack.common');

module.exports = function (env) {
  const mode = env.NODE_ENV;
  // 设置环境
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;
  // 选择环境配置
  const config = mode === 'production' ? require('./webpack.prod') : require('./webpack.dev');
  return merge(base, config)
};
