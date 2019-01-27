---
title: 초보 개발자가 이해하는 HTTP Content-Type
date: 2018-12-13
categories: [개발 이야기, HTTP]
banner:
    url: https://dpsvdv74uwwos.cloudfront.net/statics/img/ogimage/Importance-content-type-header-http-requests.png
---

HTTP는 하이퍼텍스트 통신 프로토콜으로 서버와 클라이언트가 서로 통신하기 위하여 요청과 응답을 받는다.
이때 클라이언트가 서버에게 요청할 때 보내는 데이터 유형에 알아보고자 한다.

REST 요청 클라이언트인 Postman과 Insomnia를 보면 다음과 같이 컨텐트 타입을 제공하고 있다.

![](/images/2018/01.png)
![](/images/2018/02.png)

## Content-Type 헤더

우리가 중점적으로 봐야할 것은 multipart/form-data, x-www-form-urlencoded, application/json이다.

#### application/json

대부분의 API에서 활용하는 Content-Type 헤더로써 HTTP 요청 페이로드를 서버가 JSON 타입으로 변환해서 사용한다.

```javascript
const data = {
    key1: 'foo',
    key2: 'bar'
}
// http post request using JQuery.ajax
$.ajax({
    url: 'https://localhost:8080',
    type: 'POST',
    contentType: 'application/json',
    processData: false,
    data: JSON.stringify(data),
    success: function(res) {
        // do something
    },
    error: function(err) {
        // do something
    }
})
```

::: tip Spring MVC
스프링 컨트롤러에서 @RequestMapping과 함께 @RequestBody로 요청 페이로드를 JSON형식으로 받을 수 있다.
:::

#### x-www-form-urlencoded

일반적으로 서버로 요청할 때는 `x-www-form-urlencoded`를 Content-Type 헤더로 명시하여 전송한다.

그러면 x-www-form-urlencoded를 Content-Type으로 사용할 경우 요청 페이로드는 어떻게 구성되는지 살펴보자.
다음은 모질라 웹 레퍼런스 문서에서 제공하는 예시이다.

```html
POST / HTTP/1.1
Host: foo.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 13

say=Hi&to=Mom
```

`say=Hi&to=Mom`가 위 요청에 대한 페이로드 부분이다. 이 페이로드는 키와 값을 =와 함께 표현하고 &의 묶음으로 표현하는게 `x-www-form-urlencoded` Content-Type의 데이터 구조이다.

::: tip Query String
간단하게 키와 값으로 이루어진 문자열로 보낸다라고 이해하자.
:::

이번에는 Ajax 방식의 HTTP 요청에 대해서 살펴도록 하자.

```javascript
const data = {
    key1: 'foo',
    key2: ['foo', 'bar']
}
// http post request using JQuery.ajax
$.ajax({
    url: 'https://localhost:8080',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // default
    processData: true, // default
    data: data, // Object must be Key/Value pairs
    success: function(res) {
        // do something
    },
    error: function(err) {
        // do something
    }
})
```

[`jquery.ajax`](http://api.jquery.com/jquery.ajax/) 문서에 따르면 data는 PlainObject, String, Array가 와야한다고 설명하고 있다. 다시 말해서 Object가 주어질 경우 반드시 키와 값으로 이루어져야 한다는 것이다.

이때 processData라는 옵션이 중요해진다. 이 옵션은 Content-Type이 `application/x-www-form-urlencoded`일 때 요청 페이로드에 대하여 쿼리 스트링으로 변환 해야하는지에 대한 여부를 나타낸다.

> Array가 올 경우 a\[]=1&a\[]=2 이런식으로 변환된다.

따라서, `x-www-form-urlencoded`일 때 URL의 쿼리스트링으로 보내는 행위와 동일하다라고 이해할 수 있다.

#### form-data & multipart/form-data

`form-data`와 `multipart/form-data`은 HTML Form 방식으로 전송한다고 이해하자. 특히, `multipart/form-data`는 파일 전송 시 사용한다.

## Spring Model Binding

사실 이 글을 쓰는 이유는 바로 `스프링 MVC`에서 `HTTP 요청 페이로드`를 변환할 때의 방식에 궁금증이 생겼기 때문이다.

[스프링 공식 레퍼런스 : Setting and Getting Basic and Nested Properties](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#beans-beans-conventions)에서는 프로퍼티를 가져오거나 설정하는 것을 `getPropertyValue`와 `getPropertyValues` 그리고 `setPropertyValue`와 `setPropertyValues` 메소드로 수행한다고 설명한다. 그리고 자바빈 스펙에 따라 오브젝트의 프로퍼티로 나타내는 규칙도 같이 알려주고 있다.

::: tip Examples of properties

-   name\\
    Indicates the property name that corresponds to the getName() or isName() and setName(..) methods.
-   account.name\\
    Indicates the nested property name of the property account that corresponds to (for example) the getAccount().setName() or getAccount().getName() methods.
-   account[2]\\
    Indicates the third element of the indexed property account. Indexed properties can be of type array, list, or other naturally ordered collection.
-   account[COMPANYNAME]\\
    Indicates the value of the map entry indexed by the COMPANYNAME key of the account Map property.\\
    :::

간단하게 살펴보면 account 클래스의 `name 프로퍼티`를 바인딩할 경우에는 `account.name`이라고 표현되어야하고 `account[2]`라고 표현되면 3번째 `인덱스 프로퍼티`로 나타내며 `account[COMPANYNAME]`이면 `COMPANYNAME`을 키로 가지는 `Map 프로퍼티`인 것이다.

#### @ModelAttribute

이 [`@ModelAttribute`](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-ann-modelattrib-method-args) 어노테이션은 컨트롤러에서 리퀘스트 파라미터를 쉽게 빈 오브젝트로 바인딩하기 위해 사용한다.

그런데 다음과 같이 빈 오브젝트에 `맵 프로퍼티`가 존재할 경우 `@ModelAttribute`로 데이터 바인딩을 시도할 때 `주의`해야한다. 앞서 `x-www-form-urlencoded` Content-Type의 데이터 구조를 살펴본 것은 바로 이 때문이다.

만약에 빈 오브젝트에 메타데이터로 맵 오브젝트를 담고 싶다고 가정할 때 서버로 맵 오브젝트를 보내어야하는 요구사항이 생긴다. 그런데 위 자바 빈 스펙 규칙에 따르면 맵 프로퍼티는 `metadata[address][location]`와 같이 표현되어야 한다.

그런데 서버로 요청되는 페이로드가 `metadata[address][location]=value`가 되어버리면 metadata 프로퍼티의 address가 배열의 인덱스인지 맵의 인덱스 키인지 `구별할 수 없어` [관련 포스트](https://homoefficio.github.io/2017/04/25/Spring-%EA%B0%80-%ED%8F%AC%ED%95%A8%EB%90%9C-URL-%ED%8C%8C%EB%9D%BC%EB%AF%B8%ED%84%B0-%EB%B0%94%EC%9D%B8%EB%94%A9-%ED%95%98%EA%B8%B0/)처럼 다음과 같은 오류가 발생할 것이다.

```java
Property referenced in indexed property path 'metadata[address][location]' is neither an array nor a List nor a Map
```

그래서 관련 포스트에서는 `@ModelAttribute`를 사용하지 않고 Spring MVC의 request 객체에서 parameterMap을 받아 `[]로 구성된 parameterName을 스프링이 이해할 수 있는 .형식으로 변환해서 에러없이 값을 집어넣을 수 있다고` 하는데 이는 빈 오브젝트의 프로퍼티가 다시 빈으로 표현될 때의 이야기이다.

> 자바빈 스펙에 따라 account 빈 오브젝트의 name 필드는 `account.name`이 되기 때문이다.

위와 같은 상황은 서버에서 @ModelAttribute를 그대로 사용하고 프론트에서 서버로 데이터를 보낼때 [.형식으로 데이터를 변환](https://gist.github.com/codesnik/1433581)해서 요청하는 것으로 처리가 가능하다.

하지만, 맵 프로퍼티로 바인딩하기 위해서는 account[COMPANYNAME]이어야만 하기 때문에 돌고도는 문제가 될 수 밖에 없다.

#### 복잡한 페이로드라면 Application/json Content-Type을 사용하자.

따라서, 복잡한 형태로 데이터를 전송해야한다면`x-www-form-urlencoded`가 아니라 `applicaton/json`으로 명시하여 서버가 처리할 수 있도록 해야하는게 좋다.

```json
{"metadata":{"address":{"location":"value"}}}
```

사실 이와 같은 문제를 회사 내 팀장님께 물어봤지만 유연하게 되게 해야지라고 답변해주셨지만 어떻게 해야하는지는 알려주지 않으신다.

`x-www-form-urlencoded`로 요청하고 개별 바인딩 함수를 만들거나 BeanWrapper 또는 DataBinder를 구현하는것도 하나의 방법이긴 한데 데이터 형태에 따라 맞춰줘야하므로 데이터 바인딩을 하기 위한 코드로 인해 배보다 배꼽이 커지게 될 수 있다.

따라서, API에서 복잡한 페이로드를 요구한다면 `applicaton/json`으로 요청받는게 올바른 것 같다.

### 참조

-   [HTTP Post Method](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/POST)
-   [JQuery.ajax](http://api.jquery.com/jquery.ajax/)
-   [Content Type : x-www-form-urlencoded, form-data and json](https://medium.com/@mohamedraja_77/content-type-x-www-form-urlencoded-form-data-and-json-e17c15926c69)
-   [Understanding HTML Form Encoding: URL Encoded and Multipart Forms](https://dev.to/sidthesloth92/understanding-html-form-encoding-url-encoded-and-multipart-forms-3lpa)
-   [Validation, Data Binding, and Type Conversion](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#validation)
-   [HTTP multipart/form-data raw 데이터는 어떤 형태일까?](https://lng1982.tistory.com/209)
-   [Spring - \[\]가 포함된 URL 파라미터 바인딩 하기](https://homoefficio.github.io/2017/04/25/Spring-%EA%B0%80-%ED%8F%AC%ED%95%A8%EB%90%9C-URL-%ED%8C%8C%EB%9D%BC%EB%AF%B8%ED%84%B0-%EB%B0%94%EC%9D%B8%EB%94%A9-%ED%95%98%EA%B8%B0/)
