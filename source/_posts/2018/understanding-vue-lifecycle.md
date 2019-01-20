---
title: Vue 이해하기 - 라이프 사이클
date: 2018-05-31 21:21:18
categories: [이해하기, Vue]
tags:
banner:
  url: https://image.toast.com/aaaadh/real/2016/techblog/vuejs.png
---

> [`vue.js`](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)를 이해하는 가장 첫 걸음은 라이프 사이클을 이해하는 것입니다.  

![](/images/vue/vue-life-cycle.png)  

## created  
> 데이터와 이벤트가 초기화되었을 때의 상태  

## mounted  
> DOM Element가 그려졌을 때의 상태    

#### data 속성에 대한 변경 트리거 문제
Vue는 모든 속성에 대해서 Object.defineProperty를 사용하여 getter/setter로 변환한다고 합니다. `(ES5로 인해 IE8 이하를 지원하지 않는 이유)` 하지만, 자바스크립트 문제로 인해 이 속성의 추가 또는 제거를 감지할 수 없게 됩니다.  

가끔 data 속성의 Object 내 값을 변경하여도 렌더링을 다시 하지 않는 현상을 겪었을 겁니다. 바로 위에서 언급한 감지 문제로 `Vue.set` 인스턴스 메소드를 이용하라고 합니다.  
```js
this.$set(this.someObject, 'b', 2)
```
그리고 `Object.assign()` 또는 `_.extend()`를 이용해서 많은 속성을 할당하기도 합니다.  

```js
// `Object.assign(this.someObject, { a: 1, b: 2 })` 대신에 새 객체를 만들라고 합니다.
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

또한, `JSON.stringify`와 `JSON.parse`를 이용할 수도 있습니다.  
```js
this.someObject.b = 2
this.someObject = JSON.parse(JSON.stringify(this.someObject))
// 다만, JSON.stringify에 의해 Object가 String으로 변환하는 것에 주의하세요.
// https://scotch.io/bar-talk/copying-objects-in-javascript
```

## updated  
> DOM Element가 다시 그려졌을 때의 상태  

#### `v-if` with `v-for`  
뷰 템플릿을 작성하다보면 v-if와 v-for 디렉티브를 같은 레벨의 엘리먼트에 지정하곤 합니다. 하지만, `v-if` 보다 `v-for`의 우선순위가 높기 때문에 v-if는 v-for를 가진 엘리먼트를 감싸는 래퍼 엘리먼트에 지정하는 것이 좋습니다.  

##### keys in v-for  
To give Vue a hint so that it can track each node’s identity, and thus reuse and reorder existing elements, you need to provide a unique key attribute for each item. An ideal value for key would be the unique id of each item. This special attribute is a rough equivalent to track-by in 1.x, but it works like an attribute, so you need to use v-bind to bind it to dynamic values (using shorthand here):  

```html
<!-- v-for="(value, key, index) in itemObject" -->
<div v-for="(item, index) in items" :key="item.id">
  <!-- content -->
</div>
```

> In 2.2.0+, when using v-for with a component, a key is now required.

## destroyed  
> DOM에서 element가 제거 되었을 때의 상태  


## 참고  
- [vue.js 2.0 라이프사이클 이해하기](https://medium.com/witinweb/vue-js-%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-7780cdd97dd4)  
- [Vue의 Lifecycle](http://blog.martinwork.co.kr/vuejs/2018/02/05/vue-lifecycle-hooks.html)
- [Understanding Vue.js Lifecycle Hooks](https://alligator.io/vuejs/component-lifecycle/)  
