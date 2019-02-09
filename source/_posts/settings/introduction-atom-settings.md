---
title: 잠만보가 사용하는 아톰 설정
date: 2019-01-25
categories: [개발 환경, 아톰]
banner:
    url: https://tr1.cbsistatic.com/hub/i/2014/10/17/6d0afe4a-ace2-475d-8f33-00f9e7a82e16/atom-mark1200x630.png
---

![](https://user-images.githubusercontent.com/378023/49132477-f4b77680-f31f-11e8-8357-ac6491761c6c.png)

## 유저 인터페이스 꾸미기

기본적인 에디터 설정은 다음과 같이 했다.

```cson
editor:
    fontFamily: "D2Coding, Hack, DejaVu Sans Mono, Menlo, Consolas, monospace"
    showInvisibles: true
    softWrap: true
    tabLength: 4
```

폰트의 경우 [`fonts`](https://atom.io/packages/fonts)를 설치해도 된다. ([폰트 미리보기](https://app.programmingfonts.org/))

### 테마

개인적으로 추천하는 테마 조합이다. 나는 기본값인 `One Dark`를 선호한다.

-   One Dark (default) ⭐
-   Atom Material + Atom Material Dark
-   Atom Material + One Dark

### 아이콘

기본 아이콘을 사용하기 보다는 [`file-icons`](https://atom.io/packages/file-icons)를 적용했다.

![](https://raw.githubusercontent.com/file-icons/atom/6714706f268e257100e03c9eb52819cb97ad570b/preview.png)

### 툴바

[`tool-bar`](https://atom.io/packages/tool-bar) 패키지는 인터페이스에 툴바를 만들어준다.
tool-bar를 설치하면 생기는 빈 툴바에 사용할 플러그인을 추가로 설치해야한다. [`tool-bar-main`](https://atom.io/packages/tool-bar-main)은 가장 심플한 툴바 메뉴를 만들어준다. 그리고 마크다운을 위한 [`tool-bar-markdown-writer`](https://atom.io/packages/tool-bar-markdown-writer)도 설치했다.

![](https://i.github-camo.com/8387595328108e1dce2b658a6827140047e286e9/687474703a2f2f636c2e6c792f696d6167652f3277307533633178314b33572f53637265656e73686f742d323031352d30342d32312d31362e34362e34392e706e67)

## 개발 환경 구성하기

개발 시 활용되는 패키지를 구성하고 관련된 설정을 해보자.

### 구문 하이라이팅

아톰은 `Vue.js`에 대한 구문 하이라이팅을 기본으로 제공하지 않는다.

#### Vue

[`langauge-vue`](https://atom.io/packages/language-vue)는 Vue 파일에서 구문 하이라이팅을 [`vue-syntax-highlight`](https://github.com/vuejs/vue-syntax-highlight/tree/479672799b4162996e3c3c7e09583fb6d98e1e6c) 기반으로 지원하게 해준다.

### Formatting

아톰에서 Formatting을 위한 패키지로 [`atom-beautify`](https://atom.io/packages/atom-beautify)를 사용한다.
그리고 자주 사용하는 파일들의 포맷 방식을 설정하자. 모든 들여쓰기 사이즈는 공백 4개이다.

#### Javascript

Default Beautifier - JS Beautifier
Brace Style - collapse-preserve-inline

#### SCSS

Default Beautifier - Pretty Diff

#### Vue

Default Beautifier - Vue Beautifier
Brace Style - collapse-preserve-inline
Space Before Conditional - ✔️
Wrap Attributes - force-aligned

#### Markdown

Default Beautifier - Remark
Commonmark - ✔️
Gfm - ✔️

### 코드 분석

#### linter

[`linter`](https://atom.io/packages/linter)는 작성된 코드를 분석하여 알려주거나 고쳐주는 것을 지원한다.

![](https://i.github-camo.com/a7fa1da3b5b4bdea00b5d25591f47e0751f64d4e/68747470733a2f2f636c6f75642e67697468756275736572636f6e74656e742e636f6d2f6173736574732f343237383131332f32333837393933332f31616231376532612d303837322d313165372d383033642d3366653063636663363739302e676966)

#### linter-eslint

[`linter-eslint`](https://atom.io/packages/linter-eslint)는 자바스크립트를 `eslint`를 사용해서 분석한다.

##### Enable ESlint-Plugin-Vue

만약, `Vue.js`를 위해 `ESlint-Plugin-Vue`를 적용했다면 `linter-eslint`에 `text.html.vue` 포맷을 추가해야한다.
List of scoped to run ESLint on - source.js, source.jsx, source.js.jsx, source.flow, source.babel, source.js-semantic, text.html.vue

#### linter-stylelint

[`linter-stylelint`](https://atom.io/packages/linter-stylelint)는 스타일 관련 파일을 [`stylelint`](https://github.com/stylelint/stylelint)를 사용해서 분석한다.
![](https://i.github-camo.com/0f7ea286f12d90256431c2edb65087dacb8ad73a/68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f41746f6d4c696e7465722f6c696e7465722d7374796c656c696e742f6d61737465722f64656d6f2e706e67)

### 유용하게 사용할 수 있는 패키지

#### vue-hyperclick

[vue-hyperclick](https://atom.io/packages/vue-hyperclick)는 Vue 컴포넌트 파일에서 `마우스 클릭`으로 해당 모듈이 선언된 파일로 이동하는 기능이다. [`hyperclick`](https://atom.io/packages/hyperclick)와 [`js-hyperclick`](https://atom.io/packages/js-hyperclick)를 요구한다.

![](https://i.github-camo.com/a917b5ee7f755895922efa2706d699b0a5c167f7/68747470733a2f2f6672697a692e78797a2f65787465726e616c732f7675652d6879706572636c69636b2d64656d6f2e676966)

#### autoclose-html

[`autoclose-html`](https://atom.io/packages/autoclose-html)은 HTML 태그들을 작성할 때 자동으로 닫아주는 아주 유용한 패키지이다.

#### bracket-colorizer

[`bracket-colorizer`](https://atom.io/packages/bracket-colorizer)는 중첩된 브라켓에서 서로 매칭되는 것들을 `컬러`로 구별해준다.

![](https://i.github-camo.com/c33845e7be99491bd3e728ec53941753c680dcb2/68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f766e2d6b692f627261636b65742d636f6c6f72697a65722f76312e322e302f2e6769746875622f73637265656e73686f74312e706e67)

#### pigments

[`pigments`](https://atom.io/packages/pigments)는 색상과 관련된 코드에 색상을 입혀 보여준다. 또한, `RGB <-> HSL 변환 기능도 지원`한다.

![](https://i.github-camo.com/802d8b759d01e70861f95f99495731f19b145b03/687474703a2f2f61626533332e6769746875622e696f2f61746f6d2d7069676d656e74732f7069676d656e74732e6769663f7261773d74727565)

#### 실시간 페어 프로그래밍

[`teletype`](https://atom.io/packages/teletype)은 워크스페이스를 공유하여 팀원들과 실시간으로 코딩할 수 있다.

## 아톰 동기화하기

[`sync-setting`](https://atom.io/packages/sync-settings)은 기본 설정 및 설치했던 패키지들을 `Gist`로 저장해서 동기화를 도와준다.

## 참조

-   [awesome-atom](https://github.com/mehcode/awesome-atom)
