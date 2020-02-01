---
    title: 자바스크립트
    description: 자바스크립트와 관련된 글 모음
    comments: false
---

## JavaScript

### [JavaScript Standard Style](https://standardjs.com/readme-kokr.html)  

교정 & 자동 코드 수정을 도와주는 JavaScript 스타일 가이드
standard에 대해 배우는 가장 좋은 방법은 그냥 설치하고 코드에 시도해 보는 것입니다.

### [Vue Development In 2019: What You Need To Know](https://vuejsdevelopers.com/2018/12/04/vue-js-2019-knowledge-map)  

![](https://vuejsdevelopers.com/images/posts/versions/vue_developer_knowledge_map_1200.webp)  

If you're new to Vue development, you've probably heard a lot of jargon terms thrown around like single-page apps, async components, server-side rendering, and so on.

You've might also have heard of tools and libraries that are commonly mentioned alongside Vue like Vuex, Webpack, Vue CLI, and Nuxt.

Perhaps you find this myriad of terms and tools to be a frustration. You're not alone in that; developers of all experience levels feel the persistent pressure of what they don't know and feel like they should.

Trying to learn everything all at once would be overwhelming and ineffective, so here I'm presenting a high-level "knowledge map" which captures the key areas of professional Vue development. You can use this map to target areas for your own learning in 2019.

## CSS  

### [SVG, JS, CSS로 만드는 라이언 로그인 폼](https://taegon.kim/archives/9658)  

얼마 전 [LoginCritter](https://github.com/cgoldsby/LoginCritter)라는 재밌는 프로젝트를 봤다. 로그인 정보를 입력하는 동안 귀여운 곰이 커서를 따라 눈길을 주는 것이었다. 그 프로젝트는 iOS 기반이었기 때문에 웹으로 구현해봐도 재미있겠다는 생각이 들어 며칠 시간을 들여 로그인 폼을 작성해보았다. 자바스크립트 개발자로 살고 있음에도 SVG와 CSS3를 사용해 이런 애니메이션을 만들 일은 별로 없었는데 덕분에 배운 것도 많아서 여기에 정리해보려고 한다.

### [Design Better Forms](https://uxdesign.cc/design-better-forms-96fadca0f49c)  

Common mistakes designers make and how to fix them

![](https://miro.medium.com/max/2880/1*VvQeOFsY57NJxtZmKyRnHA.jpeg)

Whether it is a signup flow, a multi-view stepper, or a monotonous data entry interface, forms are one of the most important components of digital product design. This article focuses on the common dos and don’ts of form design. Keep in mind that these are general guideline and there are exceptions to every rule.

## Lint

### [ESLint 조금 더 잘 활용하기](https://tech.kakao.com/2019/12/05/make-better-use-of-eslint/)  

안녕하세요. 카카오 FE플랫폼팀의 Joah입니다. 최근에 팀에서 사용하는 JavaScript 스타일 가이드를 개선하는 업무에 참여했습니다. 업무를 하며 스타일 가이드에서 사용하고 있는 ESLint에 관심이 생기게 되었고, 어떻게 동작하는지 소스코드를 분석해보다가 ESLint에 직접 컨트리뷰션 하는 경험도 하게 되었습니다.

이 과정들에서 알게 된 ESLint를 조금 더 잘 활용할 수 있는 방법에 대해 정리해 보았는데요. 기본적인 사용법은 포함하고 있지 않기 때문에 궁금하신 분은 ESLint getting-started를 참고하시면 됩니다.

이 글에서는 ESLint의 설정 공유하는 방법, 규칙을 직접 만드는 방법에 대해 정리했습니다. 글 중간중간 스타일 가이드 업무를 하며 알게 된 점이나, 컨트리뷰션을 하며 얻게 된 지식도 정리해 보았습니다.

## Webpack

### [Webpack에서 Tree Shaking 적용하기](https://medium.com/naver-fe-platform/webpack%EC%97%90%EC%84%9C-tree-shaking-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0-1748e0e0c365)  

![](https://cdn-images-1.medium.com/fit/t/800/240/1*he7Z9ibRPt_aoEznzQZltA.png)  

Tree Shaking은 사용하지 않는 코드를 제거함으로써 용량을 줄일 수 있는 방식입니다.

특정 라이브러리를 참조하면 참조한 라이브러리의 크기만큼 최종 번들의 용량이 증가하게 됩니다. 하지만 특정 라이브러리의 모든 코드를 쓰지 않습니다.

## [Simple Vue.js Form Validation with Vuelidate](https://vuejsdevelopers.com/2018/08/27/vue-js-form-handling-vuelidate/)  

![](https://vuejsdevelopers.com/images/posts/versions/form_handling_vuelidate_1200.webp)

Thanks to Vue's reactivity model, it's really easy to roll your own form validations. This can be done with a simple method call on the form submit, or a computed property evaluating input data on each change.

Using your form validation can quickly become cumbersome and annoying, however, especially when the number of inputs in the form increase, or the form structure gets more complicated e.g. multi-step forms.

Thankfully, there are great validation plugins for Vue like Vuelidate. In this article, we'll be looking at how Vuelidate can be used to simplify:

- Validation
- Multi-step form validation
- Child component validation
- Error messages

We'll also see how the Vuelidate-error-extractor plugin can be used to simplify error message display per input, or as an error summary above or below the form.

