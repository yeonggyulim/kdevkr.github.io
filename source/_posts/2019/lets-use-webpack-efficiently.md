---
title: Webpack을 효율적으로 사용하자
date: 2019-01-27
categories: [이해하기, Webpack]
banner:
  url: https://raw.githubusercontent.com/webpack/media/master/logo/logo-on-white-bg.png
---

::: tip 잠만보 웹팩 설정 가이드
본 포스트는 [잠만보의 웹팩 설정 가이드](https://github.com/kdevkr/webpack-guide)에 따라 작성되었습니다.
:::

## 설치

웹팩의 최신 릴리즈 버전은 4.29.0이며 `webpack-cli`와 같이 동작하게 된다.

```bash
npm i -D webpack webpack-cli @webpack-cli/init
```

#### 실행

NPM 스크립트로 웹팩을 실행할 수 있다.

```json
{
    "scripts": {
        "build": "webpack --config webpack.config.js"
    }
}
```

#### 브라우저 호환성

`Webpack`은 `ES5`를 호환하는 모든 브라우저를 지원한다. (IE8 이하는 지원하지 않음). 또한, `Wepback`은 `import()`와 `require.ensure()`를 위해 `Promise`가 필요하다.
만약, 구형 브라우저를 지원하기 위해서는 `import()`를 사용하기 전에 `polyfill`을 불러와야한다.

```sh
npm install --save @babel/polyfill
```

```js
require("@babel/polyfill");
```

## 웹팩의 번들링 리포팅 분석

### 번들링 리포터를 변경하자

웹팩의 기본 번들링 로그보다는 더 유용하게 리포팅해주는 리포터 플러그인을 사용하는게 좋다.

#### Webpack Stylish

[`webpack-stylish`](https://github.com/webpack-contrib/webpack-stylish)는 기본 번들링 로그를 변경해서 출력한다.
웹팩 4+에 `webpack-stylish` 리포팅 기능이 추가되었기 때문에 기본 Webpack-cli의 `stats` 옵션은 비활성화 해야한다.

![](https://github.com/webpack-contrib/webpack-stylish/raw/master/assets/screenshot.png)

#### Friendly Errors Webpack Plugin :heart_eyes:

[`friendly-errors-webpack-plugin`](https://github.com/geowarin/friendly-errors-webpack-plugin)는 번들링 과정에서 `오류가 발생할 때 원인`을 좀 더 보기 편하게 알려준다.

##### ESLint 에러가 발생한 경우

![](https://camo.githubusercontent.com/8d8e98c4430a5f6ccabe0604318e47ae2800a30f/687474703a2f2f692e696d6775722e636f6d2f7859526b6c64722e676966)

##### 모듈을 찾을 수 없는 경우

![](https://camo.githubusercontent.com/2e42570a995dd411ac49739cd02ebabf447b559b/687474703a2f2f692e696d6775722e636f6d2f4f6976573441732e676966)

### 번들링 결과를 분석하자

#### Speed Measure Plugin

[`speed-measure-webpack-plugin`](https://github.com/stephencookdev/speed-measure-webpack-plugin)는 Webpack이 번들링하는데 걸리는 시간을 플러그인과 로더별로 구분해서 측정해준다.

![](https://github.com/stephencookdev/speed-measure-webpack-plugin/raw/master/preview.png)

##### Duplicate Package Checker Webpack Plugin

[`duplicate-package-checker-webpack-plugin`](https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin)는 같은 패키지를 각각 다른 버전으로 의존하고 있는지 파악할 때 사용한다. 각기 다른 버전의 패키지를 사용하면 중복해서 번들에 추가될 수 있다.

```sh
npm i -D duplicate-package-checker-webpack-plugin
```

#### Webpack Visualizer

[`webpack-visualizer`](https://github.com/chrisbateman/webpack-visualizer)는 `webpack-bundle-analyzer`처럼 번들링을 분석해서 결과를 알려준다.

![](https://cloud.githubusercontent.com/assets/1145857/10471320/5b284d60-71da-11e5-8d35-7d1d4c58843a.png)

#### Webpack Jarvis :heart_eyes:

[`webpack-jarvis`](https://github.com/zouhir/jarvis)는 웹팩의 `--watch` 옵션 또는 `webpack-dev-server`가 동작할때 웹팩의 번들링 결과에 대한 정보를 브라우저로 확인할 수 있다.

![](https://github.com/zouhir/jarvis/raw/master/.github/screenshot.png?raw=true)

## 웹팩 번들링 최적화

웹팩 4+는 기본적으로 `모드`에 따른 최적화 설정을 제공한다. 그러나 실제로는 각종 옵션을 프로젝트에 맞게 변경해야 할 수 있다.

### 최적화

```js
module.exports = {
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },
            chunks: 'async',
            minChunks: 1,
            minSize: 30000,
            name: true
        }
    },
}
```

#### terser-webpack-plugin

[`terser-webpack-plugin`](https://github.com/webpack-contrib/terser-webpack-plugin)는 `terser`를 사용해서 Minify 한다.
웹팩 4+의 `production` 모드는 terser-webpack-plugin를 기본 `minimizer`로 사용한다.

```sh
npm i -D terser-webpack-plugin
```

```js
module.exports = {
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                parallel: true // Enable/disable multi-process parallel running.
            })
        ]
    },
}
```

##### (Optional) uglifyjs-webpack-plugin

`terser-webpack-plugin`을 굳이 적용하고 싶지 않다면 기존의 `uglifyjs-webpack-plugin`을 적용하자. 다만, `uglify-js`가 `ES6+`를 지원하지 않는다.
따라서, `babel`과 함께 사용하는 것을 추천한다.

### 번들 파일을 압축해서 용량을 줄이자

#### Compression Webpack Plugin :blush:

[`compression-webpack-plugin`](https://github.com/webpack-contrib/compression-webpack-plugin)는 번들링 파일을 `Content-Encoding`으로 압축해준다.

기본 알고리즘은 `gzip`으로 원한다면 다음과 같이 알고리즘을 변경할 수 있다.

```js
const zopfli = require('@gfx/zopfli');

module.exports = {
  plugins: [
    new CompressionPlugin({
      compressionOptions: {
         numiterations: 15
      },
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback);
      }
    })
  ]
}
```

### CSS는 개별 번들로 추출하자

각 엔트리에 CSS 포함시킬 경우 번들 파일의 용량이 많이 커진다. CSS 부분은 따로 추출하는게 좋다.

#### Mini CSS Extract Plugin

웹팩 4+에서는 [`mini-css-extract-plugin`](https://github.com/webpack-contrib/mini-css-extract-plugin)로 번들되는 엔트리 파일에서 CSS 부분을 추출해야 한다.
기존의 `extract-text-webpack-plugin`과 비교해서 `HMR`을 지원하지는 않지만 비동기로 로딩하거나 중복해서 컴파일하는 경우가 없다.

```sh
npm i -D mini-css-extract-plugin
```

#### Optimize CSS Assets Webpack Plugin

[`optimize-css-assets-webpack-plugin`](https://github.com/NMFR/optimize-css-assets-webpack-plugin)는 `CSS에 대한 최적화`를 지원한다.

```sh
npm i -D optimize-css-assets-webpack-plugin cssnano
```

minimizer는 `cssnano`를 추천한다.

```js
new OptimizeCssAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
    },
    canPrint: true
})
```

## 다음 개념에 대해서 알아보자

웹팩을 효율적으로 사용하기 위해서 알면 좋은 개념인데 이에 대해서는 공부를 진행하고 포스트 할 예정이다. 각 키워드를 검색해서 알아보자

#### 코드 분할

[`코드 분할(Code Splitting)`](https://webpack.js.org/guides/code-splitting/)은 웹팩이 제공하는 좋은 기술중 하나이다. 엔트리에서 사용하는 공통된 작은 번들로 나눌 수 있어 잘 사용하면 애플리케이션을 로드하는 시간에 영향을 줄 수 있다.

#### 늦은 로딩

[`늦은 로딩(Lazy Loading)`](https://webpack.js.org/guides/lazy-loading/)은 애플리케이션을 최적화하는 좋은 방법 중 하나이다.

#### 트리 쉐이킹

[`트리 쉐이킹(Tree Shaking)`](https://webpack.js.org/guides/tree-shaking/)은 일명 죽은 코드라고 불리는 것을 제거하기 위한 자바스크립트 에서 사용되는 용어로써 `Rollup`에 의해 알려졌다.

웹팩 4+에서는 `package.json`의 `sideEffects`라는 속성으로 컴파일러에게 힌트를 제공할 수 있게 되었다.

## 참조

-   [Webpack official guide](https://webpack.js.org/guides/)
-   [Awesome Webpack](https://github.com/webpack-contrib/awesome-webpack)
-   [요즘 잘나가는 프론트엔드 개발 환경 만들기(2018): Webpack 4](https://meetup.toast.com/posts/153)
-   [Webpack 4의 Tree Shaking에 대한 이해](http://huns.me/development/2265)
-   [웹팩4로 청크 관리 및 코드 스플리팅 하기](https://www.zerocho.com/category/Webpack/post/58ad4c9d1136440018ba44e7)
-   [TreeShaking으로 webpack 번들 결과 용량 줄이기](https://beomi.github.io/2017/11/29/JS-TreeShaking-with-Webpack/)
-   [Webpack and Dynamic Imports: Doing it Right](https://medium.com/front-end-weekly/webpack-and-dynamic-imports-doing-it-right-72549ff49234)
-   [HTTP/2와 Webpack](https://velog.io/@doondoony/HTTP2-and-Webpack)
