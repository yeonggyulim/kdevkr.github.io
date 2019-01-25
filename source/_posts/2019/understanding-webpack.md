---
title: Webpack 이해하기
date: 2019-01-24
categories: [이해하기, Webpack]
banner:
  url: https://raw.githubusercontent.com/webpack/media/master/logo/logo-on-white-bg.png
---

> Webpack 4 기준으로 작성되었습니다.

```bash
npm i -D webpack
```

## 소개

`Webpack`은 모듈을 위한 번들러이다. 주된 목적은 브라우저에서 사용되는 자바스크립트 파일들을 번들하는것이며 또한, 어떤 리소스와 에셋에 대한 변형, 번들링, 패키징이 가능하다.

#### 브라우저 호환성

`Webpack`은 `ES5`를 호환하는 모든 브라우저를 지원한다. (IE8 이하는 지원하지 않음). 또한, `Wepback`은 `import()`와 `require.ensure()`를 위해 `Promise`가 필요하다.
만약, 구형 브라우저를 지원하기 위해서는 이런 표현을 사용하기 전에 `polyfill`을 불러와야한다.

## ~~개념~~

#### 플러그인

##### uglifyjs-webpack-plugin

##### terser-webpack-plugin

##### extract-text-webpack-plugin

##### webpack-bundle-analyzer

##### webpack-hot-middleware

#### 로더

`Wepback`에 로더를 사용하면 파일들을 전처리할 수 있다. 그러면 정적 리소스를 자바스크립트 이상으로 번들 할 수 있다.

##### raw-loader

Loads raw content of a file (utf-8)

##### file-loader

Emits the file into the output folder and returns the (relative) url

##### url-loader

Works like the file loader, but can return a Data Url if the file is smaller than a limit

##### json-loader

Loads a JSON file (included by default)

##### json5-loader

Loads and transpiles a JSON 5 file

##### babel-loader

Loads ES2015+ code and transpiles to ES5 using Babel

##### ts-loader

Loads TypeScript like JavaScript

##### style-loader

Add exports of a module as style to DOM

##### css-loader

Loads CSS file with resolved imports and returns CSS code

##### sass-loader

Loads and compiles a Sass/SCSS file

##### less-loader

Loads and compiles a LESS file

##### postcss-loader

Loads and transforms a CSS/SSS file using PostCSS

##### eslint-loader

PreLoader for linting code using ESLint

##### vue-loader

Loads and compiles Vue Components

#### 퍼포먼스

webpack uses async I/O and has multiple caching levels. This makes webpack fast and incredibly fast on incremental compilations.

#### 모듈 형식

webpack은 `ES2015+`, `CommonJS`, 그리고 `AMD` 모듈을 지원하여 영리하게 코드의 AST를 정적 분석한다. 단순하게 표현하는 엔진으로 수행되어 대부분의 라이브러리를 즉시 사용할 수 있게 지원한다.

#### 코드 분할

`webpack`은 다수의 청크들을 코드에서 분리시켜준다. 분리된 청크들은 런타임 시점에 비동기로 로드된다. 이렇게 하면 초기로드 시간이 단축된다.

#### 최적화

`webpack`은 자주 사용되어지는 모듈의 중복을 제거, 코드 분할을 통한 런타임 로드를 제어하여 자바스크립트의 결과 사이즈를 줄이기위한 많은 최적화를 수행할 수 있다. 또한, 코드의 청크들을 해시를 사용해서 캐시하게 할 수 있다.
