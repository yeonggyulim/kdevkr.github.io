---
    title: 초보 개발자가 만들어보는 코딩 스타일 가이드
    date: 2019-02-02
    categories: [개발 이야기, 코딩 스타일]
    banner:
        url: https://i.imgur.com/P58yvJI.png
---

현재 다니고 있는 회사의 개발팀에서는 (다른 본부는 모르겠다) 코딩 스타일 가이드가 존재하지 않아 

각 개발자가 원하는 방향대로 코드를 작성해서 `코드를 파악하기가 힘든 문제점`이 있다.

코딩 스타일 가이드를 만들어 좀 더 협업에 용이하도록 해보자.

![](https://i.imgur.com/P58yvJI.png)

## 자바 스타일 가이드

자바 코드는 주로 인텔리제이를 사용하기 때문에 대부분의 백엔드 개발자가 동일한 작성방법을 굳이 제공할 필요성은 없는 것 같다.

다만, 클래스와 메소드 단위의 주석은 달도록 전파해야겠다.

## 뷰 스타일 가이드

현재 개발팀에서 진행하는 프로젝트의 프론트엔드는 대부분 `Vue.js`를 기반으로 만들어 진다.

따라서, 뷰 스타일 가이드를 만들어보자.

### 정적 분석 도구 선택

코드 작성 스타일 체크는 `ESLint`라는 `정적 분석 도구`를 사용할 것이다.

대부분의 ESLint 개발자들이 추천하는 항목인 `eslint:recommended`과 Vue 개발자들이 추천하는 항목인 `plugin:vue/recommended`를 기반으로 설정하여야 한다.

이렇게 하는 이유는 처음 부터 모든 항목을 체크해서 적용하기에는 시간이 많이 없기 때문이다.

추천하는 항목을 적용하고 굳이 현 개발팀에서 필요없다고 생각되거나 이외에 필요하다고 생각하는 항목을 추가하도록 하자.

#### ESLint 및 플러그인 설치

일단 eslint와 각 플러그인을 설치한다.

```sh
npm install --save-dev eslint eslint-plugin-recommended eslint-plugin-vue
```

그리고 프로젝트 루트 디렉토리에 `.eslintrc.js`라는 ESLint 설정 파일을 만들어 규칙을 적용하자.

##### .eslintrc.js

```js
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "plugin:vue/recommended"],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "rules": {
        // 에러 예방
        "eqeqeq": ["error", "always"],
        "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
        
        "vue/no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],

        // 가독성 향상
        "indent": ["error", 4], // 들여쓰기 공백 4개
        "brace-style": ["error", "1tbs", { "allowSingleLine": false }],
        "array-bracket-newline": ["error", "consistent"],
        "array-element-newline": ["error", "consistent"],
        "computed-property-spacing": ["error"],
        "semi-style": ["error", "last"], // 세미콜론 위치
        "semi-spacing": ["error", { "before": false, "after": true }], // 세미콜론에 대한 간격
        "comma-style": ["error", "last"],
        "comma-spacing": ["error", { "before": false, "after": true }], // 쉼표에 대한 간격
        "comma-dangle": ["error", "never"],
        "array-bracket-spacing": ["error", "never"],
        "block-spacing": ["error", "always"],
        "no-whitespace-before-property": ["error"],
        "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }], // 공백 라인 제한
        "no-trailing-spaces": ["error", { skipBlankLines: true, ignoreComments: true }],
        "object-curly-spacing": ["error", "always"], // 중괄호 간격
        "template-curly-spacing": ["error", "never"],
        "space-before-blocks": ["error", "always"], // 
        "space-before-function-paren": ["error", "never"],
        "space-in-parens": ["error", "never"],
        "space-infix-ops": ["error"],
        "switch-colon-spacing": ["error", { "after": true, "before": false }],

        "vue/html-indent": ["error", 4, { "baseIndent": 1 }], // 템플릿 구문 들여쓰기
        "vue/script-indent": ["error", 4, { "baseIndent": 1 }], // 스크립트 구문 들여쓰기
        "vue/max-attributes-per-line": ["error", { "singleline": 3, "multiline": { "max": 1, "allowFirstLine": false } }],
        "vue/html-self-closing": "off", // 엘리먼트 자체 닫기
        "vue/attributes-order": "off", // 엘리먼트 속성 순서
    },
    "overrides": [
        {
            "files": ["*.vue"],
            "rules": {
                "indent": "off",
                "no-undef": "off"
            }
        }
    ],
    globals: {
        "$": true,
        "jQuery": true,
        window: true,
        "_": true
    }
}
```

#### ESLint.Rules
내가 위에서 설정한 규칙에 대해서 알아보자.

##### eqeqeq
항등 연산자 스타일에 대한 설정이다.

항등 연산에 대하여 완전하게 체크하도록 하였다.

##### indent
들여쓰기에 대한 설정이다. 

`eslint:recommended`에 의해 `no-mixed-spaces-and-tabs`라는 규칙이 기본으로 적용되어 탭과 스페이스를 섞어 쓸 수 없다.

들여쓰기 스타일에 대한 항목이 없기 때문에 어떤 에디터에서도 동일하게 보이게 하기 위해 공백 4개로 설정하도록 했다.

공백 2개가 아니라 4개로 선택한 이유는 좀 더 `가독성을 주기 위해서`이다.

##### vue/html-indent, vue/script-indent
이 항목들은 `.vue` 파일 내에서 들여쓰기에 대한 설정이다.

`indent`와 마찬가지로 공백 4개로 설정하였다.

단, `.vue` 파일에 대한 `eslint:indent` 규칙은 제외하여 중복해서 체크하는 일이 없도록 하였다.

##### brace-style
중괄호 스타일을 체크한다.

##### array-bracket-newline, array-element-newline
배열의 대괄호 또는 항목을 표현하는 것을 일관성있게 표현하도록 체크한다.

##### computed-property-spacing
오브젝트의 속성에 접근할 때 공백을 허용하지 않도록 하여 불필요한 공백을 없앴다.

##### semi-style, semi-spacing
세미콜론의 위치는 문장의 끝이어야 하며, 세미콜론 앞의 공백은 허용하지 않는다.

##### comma-style, comma-spacing, comma-dangle
쉼표 다음에는 공백이 와야한다.

코드 포맷팅 시 문제가 있을 수 있으므로 여분의 쉼표를 표현하지 않도록 한다.

##### array-bracket-spacing
배열의 대괄호 안의 공백을 허용하지 않는다.

##### block-spacing, space-before-blocks
중괄호 블록이 표현되면 안에는 공백이 있어야 하며 블록이 시작되기 전에 공백이 우선 표현되어야 한다.

##### no-whitespace-before-property
속성 접근시 공백이 오면 안된다.

##### object-curly-spacing
중괄호 안의 공백을 일관되게 표현하자.

##### vue/html-self-closing
HTML 엘리먼트 중에서 자체적으로 닫을 수 있는 것들에 대한 체크를 하지 않도록 하였다.

HTML 스펙에서 지원하지 않기 때문에 `Self Closing`를 의무화할 필요는 없다.

##### vue/max-attributes-per-line
HTML 엘리먼트 속성을 한줄로 나열할 때 속성의 최대 개수에 대한 설정이다.

기본은 최대 1개이므로 3개 까지 늘렸다.

##### vue/attributes-order
HTML 엘리먼트 속성의 순서에 대한 체크를 하지 않는다.

단, `vue/order-in-components`는 컴포넌트 구조를 맞추기 위해 반드시 체크한다.

#### 에디터 활용
백엔드 개발자는 `Intellij`를 사용하고 프론트엔드 개발자는 `Atom` 또는 `VSCode`를 사용하고 있다.

각 에디터를 활용할 때 ESLint를 활성화 하여 코드를 작성하는 방법을 설명한다.

> 현재 개발팀 내 Atom을 많이 사용하는데 `잠만보`가 추천해서 사용중이다...

##### IntelliJ IDEA
인텔리제이에서는 기본적으로 `ESLint 플러그인`을 포함하고 있다.

기본으로 활성화되어있지는 않기 때문에 Settings/Preferences > Languages and Frameworks > Code Quality Tools > `ESLint`에서 활성화한다.

단, ESLint 구성이 수정된 경우에는 컨텍스트 메뉴에서 `Apply ESLint Code Style Rules`를 선택해서 적용해야 한다.

##### Atom
아톰 에디터에서는 `linter-eslint` 패키지를 설치해서 사용해야 한다.

그리고 `.vue`파일에 대한 ESLint 활성화를 위하여 `List of scopes to run eslint on`에 `text.html.vue`를 추가한다.

> `Atom Beautifier`를 사용해서 포맷팅을 하지 말 것을 추천한다.

##### VSCode

마이크로소프트에서 공식적으로 지원하는 `eslint` 확장 플러그인에서 `.vue`파일에 대한 지원을 추가한다.

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    { "language": "vue", "autoFix": true }
  ]
}
```

### UI 스타일 가이드
UI 스타일 가이드는 프론트엔드 개발자분께 요청하였다.

회신 받은 내용으로는 `FIRST`기반 구성과 `BEM` CSS 네이밍 규칙으로 작성하면 좋겠다는 내용이다.

##

각 규칙에 대한 설명서와 예제 코드를 만들어야 되고

개발자들이 각 규칙을 이해하기 전까지는 웹팩 빌드시 `ESLint-Loader`를 적용하면 안될 듯 싶다.

다음 프로젝트에서는 빌드 과정에도 넣어야?

## 참고
- [ESLint Rules](https://eslint.org/docs/rules/)
