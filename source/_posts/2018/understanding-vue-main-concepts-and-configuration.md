---
title: Webpack 이해하기 - 주요 컨셉과 환경설정
date: 2018-10-28 00:00:01
categories: [이해하기, Webpack]
banner:
  url: https://raw.githubusercontent.com/webpack/media/master/logo/logo-on-white-bg.png
---

> Webpack 이해하기 - 모듈과 번들러에 이어서 주요 컨셉과 환경설정에 대한 포스트 입니다.     

## Core Concepts  
Webpack이 가지는 기본적인 개념에 대해서 알아보겠습니다.  

#### [Entry](https://webpack.js.org/configuration/entry-context/)  
엔트리 포인트는 내부적인 종속성을 만들기 위한 웹팩 모듈이라고 할 수 있습니다. 웹팩은 엔트리 포인트가 의존하고 있는 다른 모듈 또는 라이브러리를 파악합니다.  

```js
const path = require('path')

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index')
  },
}
```

> 웹팩은 단일 뿐만 아니라 다중 엔트리 포인트를 지원합니다.

#### [Output](https://webpack.js.org/configuration/output/)  
결과는 웹팩이 엔트리 포인트로 파악한 의존성을 어느 위치에 어떠한 이름으로 번들 파일로 생성할지를 결정합니다.  

```js
const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'source'),
    filename: 'js/[name].bundle.js'
  },
}
```

#### [Module](https://webpack.js.org/configuration/module/)  
모듈은 엔트리 포인트에서 의존하는 다른 모듈들에 대해서 특정 파일 형식에 대한 것을 개별적인 로더를 이용하여 변환하거나 검증할 수 있도록 합니다.  

예를 들어, 다음과 같이 `.scss` 파일에 대해서 번들링 하고 싶다면 sass-loader를 지정하면 됩니다.  

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // importLoaders allow to configure which loaders should be applied to @imported resources.  
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
      }
    ]
  }
}
```

> webpack compiler는 `require()` 또는 `import`문 안에 `.scss`가 포함되면 엔트리 포인트 번들 파일에 추가하기 전에 style-loader, css-loaer, postcss-loader, sass-loader를 순서대로 거쳐 변환합니다.  

#### [Plugins](https://webpack.js.org/configuration/plugins/)  
로더가 특정 형식의 모듈을 변환하는데 사용된다면 플러그인은 번들 최적화, 에셋 관리, 환경 변수 주입등 좀더 넓은 범위의 작업을 수행합니다.  

#### [Mode](https://webpack.js.org/concepts/mode/)  
모드는 웹팩이 어떤 환경을 위해서 최적화할지를 설정합니다. 기본적으로는 `production`으로 배포 환경을 위한 최적화를 제공합니다.  

각 모드별로 제공되는 설정은 다음과 같습니다.  
> - `development`
>   Sets process.env.NODE_ENV on DefinePlugin to value development. Enables NamedChunksPlugin and NamedModulesPlugin.  
> - `production`
>   Sets process.env.NODE_ENV on DefinePlugin to value production. Enables FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin and UglifyJsPlugin.  
> - `none`
>   Opts out of any default optimization options.  

#### Browser Compatibility  
웹팩은 `import()`와 `require.ensure()`를 위해 `Promise`가 필요하기 때문에 ES5를 호환하는 모든 브라우저를 지원합니다. 만약 구형 브라우저도 지원하고 싶다면 [`polyfill`](https://webpack.js.org/guides/shimming/#loading-polyfills)을 먼저 불러와야합니다.  

## Configuration  
Webpack은 기본적으로 프로젝트 루트 폴더의 `webpack.config.js`를 설정파일로 사용합니다. 만약 이 파일이 없다면 `src/index`를 엔트리 포인트로 `dist/main.js`를 결과로 설정하며 배포 환경을 위한 번들링을 진행합니다.  

다음은 웹팩 문서에서 제공하는 샘플 설정 파일입니다.  
```js
const path = require('path');

module.exports = {
  mode: "production", // "production" | "development" | "none"  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: "./app/entry", // string | object | array  // defaults to './src'
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "bundle.js", // string    // the filename template for entry chunks
    publicPath: "/assets/", // string    // the url to the output directory resolved relative to the HTML page
    library: "MyLibrary", // string,
    // the name of the exported library
    libraryTarget: "umd", // universal module definition    // the type of the exported library
    /* Advanced output configuration (click to show) */  },
  module: {
    // configuration regarding modules
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preference over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include
        issuer: { test, include, exclude },
        // conditions for the issuer (the origin of the import)
        enforce: "pre",
        enforce: "post",
        // flags to apply these rules, even if they are overridden (advanced option)
        loader: "babel-loader",
        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide
        options: {
          presets: ["es2015"]
        },
        // options for the loader
      },
      {
        test: /\.html$/,
        use: [
          // apply multiple loaders and options
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      },
      { oneOf: [ /* rules */ ] },
      // only use one of these nested rules
      { rules: [ /* rules */ ] },
      // use all of these nested rules (combine with conditions to be useful)
      { resource: { and: [ /* conditions */ ] } },
      // matches only if all conditions are matched
      { resource: { or: [ /* conditions */ ] } },
      { resource: [ /* conditions */ ] },
      // matches if any condition is matched (default for arrays)
      { resource: { not: /* condition */ } }
      // matches if the condition is not matched
    ],
    /* Advanced module configuration (click to show) */  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".css"],
    // extensions that are used
    alias: {
      // a list of module name aliases
      "module": "new-module",
      // alias "module" -> "new-module" and "module/path/file" -> "new-module/path/file"
      "only-module$": "new-module",
      // alias "only-module" -> "new-module", but not "only-module/path/file" -> "new-module/path/file"
      "module": path.resolve(__dirname, "app/third/module.js"),
      // alias "module" -> "./app/third/module.js" and "module/file" results in error
      // modules aliases are imported relative to the current context
    },
    /* alternative alias syntax (click to show) */
    /* Advanced resolve configuration (click to show) */  },
  performance: {
    hints: "warning", // enum    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: "source-map", // enum  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory
  target: "web", // enum  // the environment in which the bundle should run
  // changes chunk loading behavior and available modules
  externals: ["react", /^@angular\//],  // Don't follow/bundle these modules, but request them at runtime from the environment
  serve: { //object
    port: 1337,
    content: './dist',
    // ...
  },
  // lets you provide options for webpack-serve
  stats: "errors-only",  // lets you precisely control what bundle information gets displayed
  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },
  plugins: [
    // ...
  ],
  // list of additional plugins
  /* Advanced configuration (click to show) */}
```