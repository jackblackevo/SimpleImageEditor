const path = require('path');
const webpack = require('webpack');

module.exports = {
  // __dirname 代表此設定檔（webpack.config.js）的所在目錄
  context: path.join(__dirname, 'src'),
  // entry（進入點）檔案
  entry: './index.js',
  // 輸出設定
  output: {
    // 目標路徑
    path: path.join(__dirname, 'dist/js'),
    // 輸出檔名
    filename: 'bundle.js',
    // webpack-dev-server 運作時的檔案對應 publicPath 目錄
    // webpack-dev-server 運作時並不會真的產出檔案，而是在記憶體中
    publicPath: 'js/'
  },
  plugins: [
    // Hot Module Reloading
    new webpack.NamedModulesPlugin()
  ],
  // entry 依賴的模組
  module: {
    // 設定轉譯規則
    rules: [{
      // 正則表示法，表示作用在所有 *.js 檔案
      test: /\.js$/,
      // 排除 node_modules 目錄
      exclude: /node_modules/,
      use: [{
        // 使用的 loader，也可以只寫 'babel'（Webpack 2 不可簡寫）
        loader: 'babel-loader',
        // 提供給 loader 使用的參數，設定方式也可以寫在 loader 裡：
        // loader: 'babel-loader?presets[]=es2015'
        options: {
          presets: [
            ['es2015']
          ]
        }
      }]
    }]
  }
};