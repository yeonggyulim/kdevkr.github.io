---
title: Vue - 좀더 효율적으로
categories: [Vue]
---

## 프론트엔드 자바스크립트 프레임워크를 사용해야하는 이유  

> [Gitlab은 왜 vue.js를 선택했나](https://taegon.kim/archives/6690)에서 "GitLab의 각 이슈는 closed 또는 open이라는 상태가 된다. 이 간단한 값은 자주 변경될 뿐만 아니라 여러 뷰에서 표현이 되어야 한다.  
> jQuery를 사용할 때 우리는 이 변화를 전파(propagate)하는 30줄 이상의 코드를 작성했고 이 코드의 각 줄은 여러 클래스와 DOM을 일일이 조회하게 되어있었다.  
>이 작업이 Vue.js에서는 자바스크립트 한 줄이면 충분했다.  

```js
import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
});
```

Vue는 이해하기 쉽게 구성된다.  

## JQuery는 최대한 사용하지 말자  
> [Gitlab은 Vue를 어떻게 사용하는가](https://taegon.kim/archives/6698)에서  우리는 jQuery와 Vue를 함께 사용하는 건 그리 좋은 생각이 아니라는 결론에 이르렀다.  
> jQuery를 DOM 선택이 필요한 아주 적은 상황에서만 사용하겠다고 한다면 이러한 상황을 계량화해야 한다. 대신 Vue 안에서는 DOM을 직접 질의하지 않아야 한다.  

## 프론트와 서버가 할일을 구분하자  
> [Gitlab은 Vue를 어떻게 사용하는가](https://taegon.kim/archives/6698)에서 Gitlab에서 우리(프론트엔드 개발자)는 백엔드 개발자들과 대화하며 우리가 사용할 데이터의 구조를 명확히 했다.  

## 컴포넌트화를 잘하자  
> Vue.js는 싱글 파일 컴포넌트로 템플릿, 스크립트, 스타일을 하나의 컴포넌트내에서 구성하는 것을 추구한다.  

#### 컴포넌트 테스트도 하자  
[vue-test-utils](https://vue-test-utils.vuejs.org/)와 [vue-test-utils-jest-example](https://github.com/vuejs/vue-test-utils-jest-example)를 보고 유닛 테스트도 진행하면 좋다  

## 가이드를 확인하자  
> [nuxt-js를 활용하여 개편 소개 페이지 만들기](http://webholic.net/nuxt-js%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%98%EC%97%AC-%EA%B0%9C%ED%8E%B8-%EC%86%8C%EA%B0%9C-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%A7%8C%EB%93%A4%EA%B8%B0/)에서 모든 문제의 정답은 가이드에 있다. Nuxt.js 가이드 문서에 없는 내용은 각 개발 도구의 가이드 문서를 찾아보면 있다  

[Vue.js 공식 가이드 문서](https://vuejs.org/v2/guide/)를 보면 항목별로 잘 정리되어있다. 왠만한 이슈들은 가이드 문서의 항목을 잘 찾아보면 그 해결방법이 존재한다.  

## 참고  
- [Gitlab은 왜 vue.js를 선택했나](https://taegon.kim/archives/6690)  
- [Gitlab은 Vue를 어떻게 사용하는가](https://taegon.kim/archives/6698)  
- [Renderless Vue 컴포넌트 만들기](https://github.com/nhnent/fe.javascript/wiki/Renderless-Vue-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0)  
- [뷰 컴포넌트 테스트를 위한 치트시트](https://github.com/nhnent/fe.javascript/wiki/%EB%B7%B0-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%ED%85%8C%EC%8A%A4%ED%8A%B8%EB%A5%BC-%EC%9C%84%ED%95%9C-%EC%B9%98%ED%8A%B8%EC%8B%9C%ED%8A%B8)  
- [Vue.js 한국 사용자 모임](http://vuejs.kr/)  
- [Vue.js 스타일 가이드](https://vuejs.org/v2/style-guide/)  
- [Gitlab Front Development Guidlines - Vue](https://docs.gitlab.com/ee/development/fe_guide/vue.html)  
-
