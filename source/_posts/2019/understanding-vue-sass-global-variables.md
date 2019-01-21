---
title: Vue 이해하기 - SCSS 전역 변수
date: 2019-01-21
categories: [이해하기, Vue]
banner:
  url: https://image.toast.com/aaaadh/real/2016/techblog/vuejs.png
---

오늘은 Vue 컴포넌트 파일에서 SCSS 파일을 공통으로 적용하기 위한 방법을 공유하고자 한다.

## Webpack - [Module Resolution](https://webpack.js.org/concepts/module-resolution/)
리졸버(resolver)는 모듈의 절대경로를 찾는데 도움을 주는 라이브러리이다. 

### Webpack에서의 리졸빙 규칙
Webpack은 `enhanced-resolve`를 사용해서 절대경로, 상대경로, 모듈경로를 리졸브해준다. 그 중에서 모듈 경로를 리졸브하는 경우를 알아보자.

#### 모듈 경로
모듈은 `resolve.modules`에 정의되어 있는 모든 디렉토리에서 검색된다. 그리고 `resolve.alias` 옵션을 사용해서 기존 모듈 경로에 대해 별칭을 사용하여 대체할 수 있다.

## Using SCSS in Vue
Vue 파일 안에서 SCSS를 사용하려면 `lang="scss"`를 지정했을 것이다. 그러면 `sass-loader`가 SCSS 문법으로 읽어드릴테니 이제 해당 태그안에서 공통된 변수들을 쓸 수 있도록 해보자.

#### Check resolve option
다음과 같이 `css`파일들을 모듈 경로에 등록해야 한다.

```js
module.exports = {
    resolve: {
        modules: [
            path.resolve(__dirname, './src/main/resources/static/css'),
            "node_modules",
        ]
    }
}
```

그러면 Vue 파일 내의 `Style` 태그에서 다음과 같이 `전역 alias`를 사용하여 표현할 수 있다.
```html
<style lang="scss">
  @import "~variables.scss";
</style>
```

#### Import Environment variables for sass-loader
그러나 매번 컴포넌트를 만들때마다 `@import` 구문으로 변수들을 추가하기에는 불편함을 가져온다. 

[`sass-loader`](https://github.com/webpack-contrib/sass-loader#environment-variables)는 공통으로 처리할 수 있도록 `data` 옵션을 제공하므로 이를 이용하면 된다.

```js
module.exports = {
    module: {
        rules: [
            {
              test: /\.scss$/,
              use: ExtractTextPlugin.extract({
                  use: [{
                      loader: "css-loader"
                  }, {
                      loader: "sass-loader",
                      options: {
                          data: `
                          @import "~variables.scss";
                          `
                      }
                  }]
              })
           }
        ]
    }
}
```

## 참조
- https://github.com/webpack-contrib/sass-loader#environment-variables
- https://vueschool.io/articles/vuejs-tutorials/globally-load-sass-into-your-vue-js-applications/
