const webpack = require('webpack')
const path = require('path')
const WebpackStylish = require('webpack-stylish')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const rf = require('read-file')
const jsYaml = require('js-yaml')
let highlightTheme = 'github'
try {
  const doc = jsYaml.safeLoad(rf.sync('../../_config.yml', 'utf8'))
  highlightTheme = doc.highlight.theme || 'github'
}
catch(exception){
  // console.warn('Not found \'_config.yml\'')
}


module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index')
  },
  output: {
    path: path.resolve(__dirname, 'source'),
    filename: 'js/[name].bundle.js'
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    },
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader']
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              limit: 1024,
              publicPath: '/',
              name: 'images/[name].[ext]'
          }
      },
      {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              limit: 1024,
              publicPath: '/',
              name: 'fonts/[name].[ext]'
          }
      },
    ]
  },
  plugins: [
    new WebpackStylish(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].bundle.css",
      chunkFilename: "[id].css"
    }),
    new webpack.DefinePlugin({
      $highlight_theme: JSON.stringify(highlightTheme)
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      // new OptimizeCSSAssetsPlugin({})
    ]
  },
  node: {
    global: true,
    fs: 'empty'
  },
  stats: 'minimal'
}
