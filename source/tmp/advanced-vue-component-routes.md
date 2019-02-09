---
    title: 초보 개발자가 알려주는 Vue Router 제대로 활용하기
    date: 2019-02-04
    categories: [개발 이야기, Vue, Vue Router]
    banner:
        url: https://scotch-res.cloudinary.com/image/upload/w_900,q_auto:good,f_auto/media/3660/h49pHk3ORDWKylIlU7bE_maxresdefault.jpg
---

![](https://scotch-res.cloudinary.com/image/upload/w_900,q_auto:good,f_auto/media/3660/h49pHk3ORDWKylIlU7bE_maxresdefault.jpg#center)

`Vue`를 이용한 싱글 웹페이지 애플리케이션을 만들때 공식 라우터인 `Vue Router`를 사용해서 메뉴를 표현하거나 페이지 이동 또는 접근을 제한하는 행위를 수행한다.

초보 개발자인 `잠만보`와 함께 이 `Vue Router`를 제대로 활용하는 방법에 대해서 알아보자.

## 뷰 라우터
일반적으로 `Vue Router`를 사용하기 위해서는 Vue 인스턴스를 만들때 다음과 같이 라우터를 주입하면 된다.

```js
import Vue from 'vue'
import VueRouter from 'vue-router'

const routes = []

const router = new VueRouter({
    routes // short for `routes: routes`
})

Vue.use(VueRouter)

const app = new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
})
```

### 동적 라우트 매칭
실제 프로젝트에서는 라우터 경로를 지정해놓는 것이 아니라 REST에 맞춰 경로 매칭을 사용해야 한다. 뷰 라우터는 [`동적 라우트 매칭`](https://router.vuejs.org/kr/guide/essentials/dynamic-matching.html#%EB%8F%99%EC%A0%81-%EB%9D%BC%EC%9A%B0%ED%8A%B8-%EB%A7%A4%EC%B9%AD)이라는 것을 통해 라우트 경로에 대한 값을 `라우트 객체의 파라미터로 바인딩`해주는 기능을 제공한다.

### 라우트 중첩
라우트 중첩은 뷰 컴포넌트가 하위의 라우트 컴포넌트를 갖을 때를 말한다. 

## 고급

### 네비게이션 가드를 이용한 라우트 접근 제한
뷰 라우트 객체에 따라 메뉴를 구성할 때 사용자 또는 내부 서비스 구조에 따라 해당 라우트 경로에 대한 접근 제한이 필요할 때가 있다. 이때는 `네비게이션 가드`를 이용해서 접근을 제한하는 방법을 제공한다.


#### 전역가드
`beforeEach`와 `beforeResolve`로 

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

### 지연된 로딩
뷰는 번들러를 사용하기 때문에 애플리케이션 라우트 규모가 증가할 경우 페이지를 로드하는 시간이 점점 커질 수가 있다. 뷰는 프로미스 기반의 [`비동기 컴포넌트`](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components)를 지원하고 웹팩의 [`다이나믹 임포트`](https://github.com/tc39/proposal-dynamic-import)를 이용해서 `비동기 컴포넌트`를 만들고 `코드 분할`을 사용할 수 있다.

```js
const Foo = () => import('./Foo.vue')
```

#### 청크 그룹화
위에서 지연된 로딩을 적용했다면 웹팩의 `webpackChunkName` 주석을 통해 라우트에 대한 청크 그룹을 지정할 수 있다. 

```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

비동기 컴포넌트에 대해 청크 그룹화를 하게 되면 해당 비동기 컴포넌트를 로드할 때 연관된 다른 컴포넌트를 로드시켜 놓을 수 있다.

## 참고
- [Vue.js Lazy load 적용하기](https://medium.com/@jeongwooahn/vue-js-lazy-load-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0-b1925e83d3c6)
