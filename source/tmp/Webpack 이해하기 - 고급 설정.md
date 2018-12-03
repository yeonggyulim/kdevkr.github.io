---
title: Webpack 이해하기 - 고급 설정
date: 2018-10-28 00:00:02
categories: [이해하기, Webpack]
---
> Webpack 이해하기 - 주요 컨셉과 환경설정에 이어서 고급 설정에 대한 포스트 입니다.  

## Optimization  

## devtool

## [Target](https://webpack.js.org/configuration/target/)  
target은 다양한 환경을 위해 컴파일 할 수 있게 지원하는 옵션입니다.  ``

> - `node`
>   Compile for usage in a Node.js-like environment (uses Node.js require to load chunks)  
> - `web`
>   Compile for usage in a browser-like environment (default)  


## [Resolve](https://webpack.js.org/configuration/resolve/)  
resolve는 모듈을 어떻게 해석할 것인지에 대한 옵션입니다.  

```js
const path = require('path');
module.exports = {
  //...
  resolve: {
    alias: {
      ~: path.resolve(__dirname, 'src'),
    }
  }
};
```

그러면 각 모듈에서 ~를 경로에 대한 별칭으로 사용할 수 있습니다.  

```js
import App from '~/app';
```

## DevServer  
