---
title: Vue - 유효성 검사  
---

> 이번 포스트는 Vue.js에서 Validation을 적용하는 것을 정리해보고자 합니다.  

## Vuelidate  
> Vuelidate는 Vue.js 2.0을 지원하는 경량화된 모델 기반의 검증체입니다.  

```sh
npm i vuelidate  
```

Vue 플러그인으로 등록하면 모든 컴포넌트에서 검증체 설정을 할 수 있습니다.
```js
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
```
or  
```js
import { validationMixin } from 'vuelidate'

var Component = Vue.extend({
  mixins: [validationMixin],
  validations: { ... }
})
```

## 콘텍스트화된 유효성 검사  
콘텍스트화된 유효성 검사로 연관된 필드를 연결할 수 있습니다. 빌트인된 ㄱ
