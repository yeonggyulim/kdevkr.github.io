---
title: Webpack 이해하기 - 모듈과 번들러
date: 2018-10-28 00:00:00
categories: [이해하기, Webpack]
---

> 기존에 작성했던 Webpack 관련 글들을 지우고 Webpack을 이해하는 포스트로 다시 시작하려고 합니다.  

[`webpack`](https://webpack.js.org/)은 모던 자바스크립트 애플리케이션을 위한 정적 `모듈 번들러`입니다.  

## 모듈  

모던 자바스크립트에서는 모듈이라는 작은 코드 조각으로써 파일 단위로 분리되어 있고 애플리케이션은 필요에 따라 명시적으로 모듈을 로드하여 재사용합니다.  

기존 애플리케이션에서는 HTML 안에 스크립트 파일이 각각 로드되어 서로 내부적으로 사용하는 이름이 충돌할 가능성이 있었습니다.  

이를 보완하고나 많은 자바스크립트 개발자들이 모듈 도입의 필요성을 제기하게 되었고 CommonJS와 AMD로써 모듈이라는 개념을 지원하게 되었습니다. 서버 사이드 언어인 Node.js는 모듈 구조를 위해 CommonJS 를 사용하기로 하였고 ES6에서 부터는 내부적으로 `export` 와 `import`라는 키워드를 통해 자바스크립트 모듈 의존성을 지원하게 됩니다.  

```js
// CommonJS
const _ = require('lodash');
module.exports = {}
```

```js
// ES2015
import _ from 'lodash';
export default {};
```

하지만, ES(ECMAScript)가 표준화된 자바스크립트 스펙이지만 모든 브라우저가 이 자바스크립트 모듈 구조를 지원하는 것은 아닙니다.  Node.js는 ES6의 모듈을 지원하지 않고 있기 때문에 ES6의 문법으로 모듈을 사용하기 위해서는  Webpack과 함께 `Babel`이라는 것을 사용해야만 합니다.  

Node.js와는 대조적으로 웹팩의 모듈은 다음과 같이 다양한 방법으로 표현할 수 있습니다.  
> - An ES2015 `import` statement
> - A CommonJS `require()` statement
> - An AMD `define` and `require` statement
> - An `@import` statement inside of a css/sass/less file.
> - An image url in a stylesheet (`url(...)`) or html (`<img src=...>`) file.

## 모듈 번들러  

모던 자바스크립트 애플리케이션에서는 모듈화된 자바스크립트 라이브러리들을 어떻게 웹 페이지에 불러와야하는가에 대한 것이 가장 이슈로 남아있습니다.  

예전에는 인터넷 업/다운로드 속도가 낮아서 개별적으로 불러왔지만 현재 서버 환경이 발전함에 따라 자바스크립트 모듈을 불러오는 속도 보다는 어떻게 효율적으로 불러올까가 더욱 중요해졌습니다.  

자바스크립트 애플리케이션 개발자들은 모듈화 하는 것이 코드의 가독성 및 유지보수성이 높아질 것이고 웹 페이지에서는 모듈들을 파일별로 묶어서 불러오는 것이 가장 좋은 효율을 가질 것 입니다.  

따라서, 자바스크립트 모듈을 하나의 파일에 그룹화해주는 역할을 하는 도구를 모듈 번들러라고 합니다.  

모듈 번들러에는 [`browserify`](http://browserify.org/), `webpack`, [`parcel`](https://parceljs.org/)등이 있습니다. parcel이 가장 최근에 만들어진 번들러이지만 많은 개발자들이 webpack을 주로 사용하고 있습니다.  


> 모듈 번들러가 어떤 방식으로 동작하는 이해하고 싶다면 [`minipack`](https://github.com/ronami/minipack)를 참고하시기 바랍니다.  

다음 포스트에서는 Webpack으로 번들링하기 위하여 어떻게 설정해야하는가를 알아보도록 하겠습니다.  


## 참고  
- [Webpack Official](https://webpack.js.org)  
- [Webpack 같은 모듈 번들러를 만들어 보자](https://engineering.linecorp.com/ko/blog/detail/338)  
- [ES6 Module](https://poiemaweb.com/es6-module)  
- [ES require Vs import](https://blueshw.github.io/2017/05/16/ES-require-vs-import/)  
- [How JavaScript bundlers work](https://medium.com/@gimenete/how-javascript-bundlers-work-1fc0d0caf2da)  
