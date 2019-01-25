---
title: CSS 이해하기 - PostCSS
date: 2018-10-12 00:00:00
categories: [이해하기, CSS]
banner:
  url: http://creator.dwango.co.jp/wp-content/uploads/2016/04/postcss_top-1.jpg
---

> `PostCSS`는 자바스크립트를 이용하여 CSS 파일로 변환하는 `도구`입니다.\
> CSS 작성 시 Lint를 적용하거나 최신의 CSS 문법 및 변수를 사용할 수 있도록 도와주는 플러그인이 있습니다.\
> 오늘은 PostCSS에 대해서 알아보면서 CSS 분야에 대한 역량을 키워보도록 합시다.  

PostCSS는 마치 Webpack과 같은 번들러 처럼 여러가지 플러그인과 설정을 통해 그 동작을 수행하게 됩니다.
그러면 이제 PostCSS가 주요 지원하는 것들에 대해서 알아볼까요?  

## 벤더별 접두어 추가

> [`Autoprefixer`](https://github.com/postcss/autoprefixer) will use the data based on current browser popularity and property support to apply prefixes for you.  

PostCSS는 Autoprefixer 플러그인을 통하여 개발자가 CSS를 작성할 때 다양한 브라우저들에 대한 접두어, `-webkit-`, `-o-`, `-moz-`, `-ms-`들을 신경쓰지 않아도 자동으로 추가해줍니다.\
Autoprefixer를 경험해보고싶다면 [Autoprefixer CSS Online](https://autoprefixer.github.io/)를 이용합시다.  

## 모던 CSS 문법

> [`PostCSS Preset Env`](https://github.com/csstools/postcss-preset-env) lets you convert modern CSS into something most browsers can understand, determining the polyfills you need based on your targeted browsers or runtime environments, using cssdb.

```sh
npm i -D postcss-preset-env
```

PostCSS Preset Env는 아무런 설정을 하지 않으면 기본적으로 `Stage 2` 특징들과 대부분의 브라우저를 지원합니다.  

## CSS 압축

> [`cssnano`](https://cssnano.co/) takes your nicely formatted CSS and runs it through many focused optimisations, to ensure that the final result is as small as possible for a production environment.  

```sh
npm i -D cssnano
```

cssnano는 여러분이 이쁘게 여백을 두어 작성한 CSS를 압축해주는 플러그인입니다. CSS가 배포되는 환경에서는 최대한 리소스 사이즈를 줄이기 위하여 압축을 필수로 적용하기도 합니다.  

## Webpack과 함께 설정하고 싶어요

> [`postcss-loader`](https://github.com/postcss/postcss-loader)를 추가하면 Webpack에서 간단하게 PostCSS를 설정할 수 있습니다.  

```sh
npm i -D postcss-loader
```

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  }
}
```

그리고나서 `webpack.config.js`와 동등한 위치에 `postcss.config.js` 파일을 만들어 적용하고 싶은 플러그인을 추가 또는 옵션을 지정하면 됩니다.  

```js
module.exports = {
  plugins: [
    require('precss'),
    require('autoprefixer'),
    require('postcss-preset-env'),
    require('cssnano')
  ]
}
```

## Lint

> Enforce consistent conventions and avoid errors in your stylesheets with [`stylelint`](https://stylelint.io/), a modern CSS linter. It supports the latest CSS syntax, as well as CSS-like syntaxes, such as SCSS.  

CSS Lint에 대해서는 개인적으로 다루지 않으니 넘어가도록 하겠습니다.  

* * *

## 참고

-   [PostCSS 소개](https://medium.com/@FourwingsY/postcss-%EC%86%8C%EA%B0%9C-727310aa6505)  
-   [PostCSS 안내서](https://gratiaa.github.io/young-blog/2016/11/13/an-introduction-to-postCSS/)  
-   [Introduction to PostCSS](https://flaviocopes.com/postcss/)  
