---
title: CSS 이해하기 - 초기화
date: 2018-06-26 21:21:18
categories: [이해하기, CSS]
banner:
  url: https://cdn-images-1.medium.com/max/1200/1*OFsc0SD55jhi8cjo7aCA4w.jpeg
---

## CSS 초기화

> 기본적으로 우리가 사용하는 Internet Explorer 또는 Chrome, Safari, FireFox와 같은 브라우저는 개별적으로 제공되는 CSS가 있습니다.
> 여기서 발생하는 문제는 이 기본 CSS가 브라우저마다 다르다는 것 때문에 이를 무시하고 개발을 진행하다보면 [크로스 브라우징 이슈](https://github.com/nhnent/fe.javascript/wiki/%ED%81%AC%EB%A1%9C%EC%8A%A4%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A7%95-%EC%9D%B4%EC%8A%88)들을 가지게 됩니다.

오해의 소지가 있겠습니다만 CSS를 초기화한다고해서 모든 크로스 브라우징 이슈를 해결할 수 있는 것은 아닙니다. 하지만 CSS와 관련된 이슈를 해결할 수 있겟죠  

## [Normalize.css](https://necolas.github.io/normalize.css/)

> 브라우저 간의 렌더링 차이를 줄이기 위해서 Eric Mayer가 고안한 [`Reset CSS`](https://meyerweb.com/eric/tools/css/reset/)를 많이 사용해왔습니다. 마지막 업데이트는 `2011년 1월 26일` 입니다.\
> Reset CSS의 업데이트가 더이상 진행이 안되면서 [`Normalize.css`](https://necolas.github.io/normalize.css/)라는 대안 프로젝트를 많이 사용하고 있습니다. 현재 반응형 CSS 프레임워크로 많이 사용중인 부트스트랩도 Normalize를 적용합니다.

```sh
# cdn : https://yarnpkg.com/en/package/normalize.css
npm install --save normalize.css
```

## 참고

-   [LESS Official](http://lesscss.org/)  
-   [CSS 초기화](http://webdir.tistory.com/455)  
-   [Normalize.css](https://github.com/necolas/normalize.css/)  
