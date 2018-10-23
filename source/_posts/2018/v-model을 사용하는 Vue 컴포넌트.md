---
title: v-model을 사용하는 Vue 컴포넌트
date: 2018-10-17
categories: [Vue]
---

> VueJS의 컴포넌트를 이용하다보면 v-model 디렉티브를 적용한 컴포넌트를 확인할 수 있습니다. 주로 input이나 select와 같은 Element 컴포넌트와 같은 값의 변경이 양방향으로 유지되어야하는 경우와 같이 말입니다. 그러면 이 v-model 디렉티브를 사용하는 컴포넌트는 어떻게 만들 수 있을까요?

## v-model = prop + input
v-model 디렉티브는 사실 value라는 prop과 input이라는 event로 구성되어 있습니다. 따라서 다음과 같이 value를 prop으로 지정하고 input 이벤트를 전파해주면 됩니다.
```js
export default {
  props: ['value'],
  methods: {
    onChange(value) {
      this.$emit('input', value)
    }
  }
}
```

## Customizing Component `v-model`
> v-model은 기본적으로 value라는 prop과 input이라는 이벤트로 이용하지만 2.2.0+ 부터는 model이라는 옵션을 통해 이를 변경할 수 있습니다.

```js
export default {
  model: {
    prop: 'data',
    event: 'change'
  },
  props: ['data'],
  methods: {
    onChange(data) {
      this.$emit('change', value)
    }
  }
}
```

## 참고
- [Using v-model on Components](https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components)
- [Customizing Component v-model](https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model)
