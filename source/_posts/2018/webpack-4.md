---
title: Webpack 4
date: 2018-06-27 00:00:00
categories: [끄적끄적, Webpack]
tags:
banner:
  url: https://raw.githubusercontent.com/webpack/media/master/logo/logo-on-white-bg.png
---

# [Webpack 4 release at 2018.02.25](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4)  
> Wepback 4가 릴리즈되었지만 Webpack 설정에 관한 포스트들을 검색해보면 전부 Webpack 3 기준으로 작성되어있습니다. 물론 [Webpack Documentation](https://webpack.js.org/concepts/)을 제공하고 있지만 이것이 마냥 친절하진 않습니다.  

일단 Webpack 3+를 아무것도 모르는 상태에서 Webpack 4+로 업데이트 해보겠습니다.

```sh
npm i -D webpack@latest

npm WARN babel-minify-webpack-plugin@0.2.0 requires a peer of webpack@^2.0.0 || ^3.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN extract-text-webpack-plugin@3.0.2 requires a peer of webpack@^3.1.0 but none is installed. You must install peer dependencies yourself.
npm WARN webpack-dev-middleware@1.12.2 requires a peer of webpack@^1.0.0 || ^2.0.0 || ^3.0.0 but none is installed. You must install peer dependencies yourself.
+ webpack@4.12.2
```

이 상태에서 빌드를 해보겠습니다.  

## Issue 1 : [Commons-Chunk-Plugin](https://webpack.js.org/plugins/commons-chunk-plugin/)  
> The CommonsChunkPlugin has been removed in webpack v4 legato. To learn how chunks are treated in the latest version, check out the SplitChunksPlugin.  
>
> Since webpack v4, the CommonsChunkPlugin was removed in favor of optimization.splitChunks.  

```sh
# npm run build
webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
```

webpack.optimize.CommonsChunkPlugin이 제외됬다고 알려주며 빌드가 실패가 되어버립니다. 알려주는 대로 CommonsChunkPlugin 설정을 [optimization.splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/)로 변경하도록 하겠습니다.  

[CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin/) 뿐만 아니라 [UglifyjsWebpackPlugin](UglifyjsWebpackPlugin)과 [NoEmitOnErrorsPlugin](https://webpack.js.org/configuration/optimization/#optimization-noemitonerrors)도 [optimization](https://webpack.js.org/configuration/optimization/) 속성으로 통합되었기 때문에 같이 변경하도록 하겠습니다.  

```js
module.exports = {
  //...
  optimization: {
    minimize: false // `production` 모드에서는 이 옵션을 지정하지 않아도 true를 기본값으로 가집니다.
    // 기본으로 제공되는 minimizer를 오버라이딩하여 uglify를 구성할 수 있습니다.
    minimizer: {
      new UglifyJsPlugin({ /* your config */ })
    },
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          name: '_vendor',
          test: /[\\/]node_modules[\\/]/
        },
        default: {
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    },
    noEmitOnErrors: true
  }
};
```

## Issue 2 : [Extract-Text-Webpack-Plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)  

```sh
# Error: Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
npm i -D extract-text-webpack-plugin@next
+ extract-text-webpack-plugin@4.0.0-beta.0
```

그랬더니 Chunks.groupsIterable를 사용하라고 합니다. 일단 검색을 통하여 extract-text-webpack-plugin을 최신버전으로 변경 해주었습니다.  

## Issue 3 : [Required mode](https://webpack.js.org/concepts/mode/)  

```sh
DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
Version: webpack 4.12.2
Time: 358ms
Built at: 2018-06-28 12:20:20
            Asset      Size  Chunks  Chunk Names
console.bundle.js  1.19 KiB       0  console
  index.bundle.js  1.19 KiB       1  index
Entrypoint index = index.bundle.js
Entrypoint console = console.bundle.js

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior.
Learn more: https://webpack.js.org/concepts/mode/
```


> `none`, `development`, `production` 중 하나는 필수적으로 지정되어야합니다  

```js
module.exports = {
  //...
  mode: 'production'
};
```

### development  
> Enables NamedChunksPlugin and NamedModulesPlugin.  

### production  
> Enables FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin and UglifyJsPlugin.

## Issue 4 : [Eslint-Loader](https://github.com/webpack-contrib/eslint-loader)  

```sh
ERROR in ./src/main/resources/static/js/entries/index.js
Module build failed (from ./node_modules/eslint-loader/index.js):
TypeError: Cannot read property 'eslint' of undefined
    at Object.module.exports (/Users/kdevkr/Documents/git/[PROTECTED]/node_modules/eslint-loader/index.js:148:18)
 @ multi ./src/main/resources/static/js/entries/index.js

npm i -D eslint-loader@latest
+ eslint-loader@2.0.0
```

undefined된 변수에서 eslint 속성을 찾을 수 없다고 하는데 자세히 보니 `eslint-loader`에서 문제가 발생했으니
[관련 링크](https://github.com/webpack-contrib/eslint-loader/issues/215)처럼 2.0.0에서 수정되었다고 하니 버전을 올리겠습니다.  

## Issue 5 : [Html-Webpack-Plugin](https://github.com/jantimon/html-webpack-plugin)  

```sh
# npm run dev
Module build failed (from ./node_modules/css-loader/index.js):
Error: Plugin could not be registered at 'html-webpack-plugin-after-emit'. Hook was not found.
BREAKING CHANGE: There need to exist a hook at 'this.hooks'. To create a compatiblity layer for this hook, hook into 'this._pluginCompat'.
```

오류는 css-loader에서 발생하였지만 오류 상세 내용을 보면 `html-webpack-plugin-after-emit`을 플러그인에 등록할 수 없다는 내용입니다. Webpack 4+ 부터 hooks API가 추가되면서 HtmlWebpackPlugin 프로젝트에 관련된 Hooks가 추가되었습니다.  

> Webpack 4의 새로운 API 사용으로 인하여 기존의 플러그인과 로더들의 버전을 업데이트 해야합니다. `예를 들어 HTML Webpack Plugin은 3+에서 Webpack 4 API를 지원합니다.`  

```sh
npm i -D html-webpack-plugin@latest
+ html-webpack-plugin@3.2.0
```
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
{
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```
> HtmlWebpackPlugin을 등록하면서 Hooks가 Extend 되었기에 아래의 코드 둘다 가능합니다.  

```js
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function () {
    hotMiddleware.publish({ action: 'reload' })
  })
})

// 이 방식을 이용하시기를 추천합니다.
compiler.hooks.compilation.tap('html-webpack-plugin-after-emit', () => {
    hotMiddleware.publish({
        action: 'reload'
    })
 })
```

Webpack 4+를 지원하기 위하여 vue-loader도 15+로 업데이트 되었습니다. 공식 레퍼런스에서도 15+를 기준으로 설명하고 있고 v14에서 마이그레이션하기 위한 방법도 제공하고 있습니다.  

`vue-loader의 버전을 굳이 올릴 필요는 없습니다.`
```sh
npm i -D vue-loader@latest
+ vue-loader@15.2.4

# npm run dev
vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.
```

vue-loader 15+ 부터는 반드시 [플러그인을 포함](https://vue-loader.vuejs.org/migrating.html#a-plugin-is-now-required)시켜야 합니다.

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // ...
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

또한, [특정 옵션들이 제외](https://vue-loader.vuejs.org/migrating.html#options-deprecation)되었습니다.  

> 특정 옵션 중 extractCSS가 제외 되었는데 이제는 어떻게 추출해야하는 것일까요?

혹시 extract-text-webpack-plugin 기억하십니까? 어떤 오류때문에 4.0.0-beta 버전으로 업데이트하였습니다. 베타 버전인게 꺼림칙하여 [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)으로 이동해보니 경고 문구가 보입니다.  

> ⚠️ Since webpack v4 the extract-text-webpack-plugin should not be used for css. Use mini-css-extract-plugin instead.  

webpack 4+부터 [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)은 css에 사용할 수 없으므로 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)을 대신 사용하라고 합니다. 아마도 단순 text만을 추출하도록 하고 개별적인 플러그인으로 제공하려고 시도하는 모양입니다.  

vue-loader가 15+로 업데이트 되면서 이 사항을 반영한 듯 보입니다.

```sh
npm i -D mini-css-extract-plugin
+ mini-css-extract-plugin@0.4.0
```

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const devMode = process.env.NODE_ENV !== 'production'
//...

{
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.min.css'
    })
  ]
}
```

`다만, 현재 MiniCssExtractPlugin는 HMR을 지원하지 않습니다.`

> devMode일 경우에는 HMR이 동작하므로 CSS 추출에 대해서 지원하지 않기 때문에 vue-style-loader를 이용해서 js 내에 번들링하도록 합니다.  


# Example for Webpack 4+ Configuration  
> wepback-dev-server 대신 webpack-dev-middleware와 webpack-hot-middleware를 이용하는 방식입니다.  

## `dev-server.js`  
```js
// ...
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.dev.js')
const compiler = webpack(webpackConfig)

// * https://github.com/webpack/webpack-dev-middleware
// Add webpack-dev-middleware the usual way
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath
})

// * https://github.com/webpack-contrib/webpack-hot-middleware
// Add webpack-hot-middleware attached to the same compiler instance
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: (l) => {
      console.log(l)
  }
})

compiler.hooks.compilation.tap('html-webpack-plugin-after-emit', () => {
    hotMiddleware.publish({
        action: 'reload'
    })
 })

const app = express()
app.use(devMiddleware)
app.use(hotMiddleware)
// ...
```

## `dev-client.js`  
```js
// https://github.com/webpack-contrib/webpack-hot-middleware/issues/11
require('eventsource-polyfill')
// https://github.com/webpack-contrib/webpack-hot-middleware#client
const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true&quiet=true')

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
```

## `webpack.base.config.js`  
```js
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ESLintFriendlyFormatter = require('eslint-friendly-formatter')
const CompressionPlugin = require("compression-webpack-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const entries = {}
entries['index'] = [path.resolve(__dirname, './src/main/resources/static/js/entries/index.js')]
entries['console'] = [path.resolve(__dirname, './src/main/resources/static/js/entries/console.js')]

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
    stats: {
        children: false
    },
    entry: entries,
    output: {
        path: path.resolve(__dirname, './src/main/resources/static/dist/'),
        filename: '[name].bundle.js',
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.js', '.vue', '.css'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            images: path.resolve(__dirname, './src/main/resources/static/images'),
            '~': path.resolve(__dirname, './src/main/resources/static')
        },
        modules: [
          path.resolve(__dirname, './src/main/resources/static/css'),
          "node_modules",
        ]
    },
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     options: {
            //         fix: true,
            //         formatter: ESLintFriendlyFormatter
            //     },
            //     exclude: /node_modules/
            // },
            {
              test: /\.s?css$/,
              use: [
                devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'sass-loader'
              ]
            },
            {
              test: /\.less$/,
              use: [
                devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'less-loader'
              ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10,
                    publicPath: '/dist/',
                    name: '[name].[hash].[ext]?[hash]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10,
                    publicPath: '/dist/',
                    name: '[name].[hash].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
          filename: '[name].bundle.min.css'
        }),
        new HtmlWebpackPlugin(),
        new CompressionPlugin({
            test: /\.js/
        }),
        new webpack.ProvidePlugin({
            Vue: 'vue/dist/vue.esm.js',
            $: 'jquery',
            jQuery: 'jquery',
            Highcharts: 'highcharts/highstock',
            _: 'lodash'
        }),
        new CopyWebpackPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
}

```

## `webpack.config.dev.js`  
> for development

```js
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

Object.keys(baseWebpackConfig.entry).forEach((name) => {
  baseWebpackConfig.entry[name] = ['./dev-client'].concat(baseWebpackConfig.entry[name])
})

const webpackConfig = merge(baseWebpackConfig, {
  devtool: 'eval',
  mode: 'development'
})

webpackConfig.plugins = webpackConfig.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new FriendlyErrorsPlugin(),
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    openAnalyzer: false,
    reportFilename: 'webpack-bundle-report.html',
    defaultSizes: 'parsed'
  })
])
module.exports = webpackConfig
```

## `webpack.config.prod.js`  
> for production

```js
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          comments: false, // remove comments
          compress: {
            unused: true,
            dead_code: true, // big one--strip code that will never execute
            warnings: false, // good for prod apps so users can't peek behind curtain
            drop_debugger: true,
            conditionals: true,
            evaluate: true,
            drop_console: false, // strips console statements
            sequences: true,
            booleans: true,
          },
        },
        sourceMap: true
      }),
      new OptimizeCSSPlugin({
          cssProcessorOptions: {
              safe: true,
              discardDuplicates: { removeAll: true },
              discardComments: {removeAll: true }
          }
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: '_vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/
        },
        default: {
          minChunks: 1,
          reuseExistingChunk: true
        }
      }
    }
  }
})

webpackConfig.plugins = webpackConfig.plugins.concat([
  // no plugins
])

module.exports = webpackConfig
```


# Links  
- [Awesome Webpack](https://github.com/webpack-contrib/awesome-webpack)  
- [Vue Loader Migration from v14](https://vue-loader.vuejs.org/migrating.html)  
- [직접 설정해보는 Webpack4 / Babel7](https://gompro.postype.com/post/1699968)  
- [Common-chunk and Vendor-chunk](https://github.com/webpack/webpack/tree/master/examples/common-chunk-and-vendor-chunk)- [웹팩 4 설정하기](https://www.zerocho.com/category/Webpack/post/58aa916d745ca90018e5301d)  
- [upgrade to webpack 4](https://dev.to/flexdinesh/upgrade-to-webpack-4---5bc5)  
- [Migrating to WEbpack 4 today](https://codeburst.io/migrating-to-webpack-4-today-d564b453a3ba)  
