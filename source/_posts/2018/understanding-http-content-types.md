---
title: 초보 개발자가 이해하는 HTTP Content-Type
date: 2018-12-13
categories: [개발 이야기, HTTP]
banner:
    url: https://dpsvdv74uwwos.cloudfront.net/statics/img/ogimage/Importance-content-type-header-http-requests.png
---

HTTP는 하이퍼텍스트 통신 프로토콜으로 서버와 클라이언트가 서로 통신하기 위하여 요청과 응답을 받는다.

이때 클라이언트가 서버에게 요청할 때 보내는 데이터 유형과 어떻게 보내야 올바른지 알아보자.

REST 클라이언트 앱인 `Postman`은 다음과 같은 `Content-Type`을 제공한다.

![](/images/2018/01.png)

일반적인 HTML 폼으로 전송할 때는 `x-www-form-urlencoded` 또는 `multipart/form-data`로 전송된다고 알고 있다.

혹시 모르고 있었더라도 걱정하지 말아라. 이제 알았으면 된거다.

중요한 것은 왜 요청 바디가 `raw`일 때 `text/plain`, `application/json`, `application/xml`등을 선택할 수 있는지를 아는 것이다.

## Content-Type 헤더

우리가 중점적으로 알아보아야 할 것은 `multipart/form-data`, `x-www-form-urlencoded`, `application/json`이다.

#### application/json

대부분의 API에서 활용하는 `Content-Type` 헤더로써 `application/json`으로 페이로드와 함께 HTTP 요청을 하게 되면 서버가 `JSON 타입`으로 변환해서 사용한다.

```javascript
const data = {
    key1: 'foo',
    key2: 'bar'
}

axios({
    method: 'post',
    url: 'https://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    },
    data: data
}).then((res) => {
    // handle success
}).catch((err) => {
    // handle error
}).then(() => {
    // always
})
```

::: tip Spring MVC
스프링 컨트롤러에서 @RequestMapping과 함께 @RequestBody로 요청 페이로드를 Jackson ObjectMapper를 통해 JSON으로 받을 수 있다.
:::

#### x-www-form-urlencoded

위에서 일반적으로 서버로 요청할 때는 `x-www-form-urlencoded`를 `Content-Type` 헤더로 명시하여 전송한다고 말했다.

그러면 `x-www-form-urlencoded`를 `Content-Type`으로 사용할 경우 요청 페이로드는 어떻게 구성되는지 살펴보자.

다음은 모질라 웹 레퍼런스 문서에서 제공하는 예시이다.

```html
POST / HTTP/1.1
Host: foo.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 13

say=Hi&to=Mom
```

`say=Hi&to=Mom`가 위 요청에 대한 페이로드 부분이다.

이 페이로드는 키와 값을 =와 함께 표현하고 &의 묶음으로 표현하는게 `x-www-form-urlencoded`의 데이터 구조이다.

```javascript
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const data = {
    key1: 'foo',
    key2: 'bar'
}

axios({
    method: 'post',
    url: 'https://localhost:8080',
    data: data
}).then((res) => {
    // handle success
}).catch((err) => {
    // handle error
}).then(() => {
    // always
})
```

## 스프링 MVC에서의 모델 바인딩

사실 이 글을 쓰는 이유는 초보 개발자 입장에서 `스프링 MVC`에서 HTTP 요청 데이터에 대하여 어떻게 `모델로 바인딩`을 하는지 알려주기 위해서이다.

[스프링 공식 레퍼런스 : Setting and Getting Basic and Nested Properties](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#beans-beans-conventions)에서는 프로퍼티를 가져오거나 설정하는 것을 `getPropertyValue`와 `getPropertyValues` 그리고 `setPropertyValue`와 `setPropertyValues` 메소드로 수행한다고 설명한다.

그리고 자바빈 스펙에 따라 `오브젝트의 프로퍼티로 나타내는 규칙`도 같이 알려주고 있다.

##### 프로퍼티 예시

-   name
    Indicates the property name that corresponds to the getName() or isName() and setName(..) methods.
-   account.name
    Indicates the nested property name of the property account that corresponds to (for example) the getAccount().setName() or getAccount().getName() methods.
-   account[2]
    Indicates the third element of the indexed property account. Indexed properties can be of type array, list, or other naturally ordered collection.
-   account[COMPANYNAME]
        Indicates the value of the map entry indexed by the COMPANYNAME key of the account Map property.

간단하게 살펴보면 account 클래스의 `name 프로퍼티`를 바인딩할 경우에는 `account.name`이라고 표현되어야하고 `account[2]`라고 표현되면 3번째 `인덱스 프로퍼티`로 나타내며 `account[COMPANYNAME]`이면 `COMPANYNAME`을 키로 가지는 `Map 프로퍼티`인 것이다.

#### @ModelAttribute

이 [`@ModelAttribute`](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-ann-modelattrib-method-args) 어노테이션은 컨트롤러에서 리퀘스트 파라미터를 쉽게 빈 오브젝트로 바인딩하기 위해 사용한다.

그런데 다음과 같이 빈 오브젝트에 `맵 프로퍼티`가 존재할 경우 `@ModelAttribute`로 데이터 바인딩을 시도할 때 `주의`해야한다. 앞서 `x-www-form-urlencoded`의 데이터 구조를 살펴본 것은 바로 이 때문이다.

만약에 빈 오브젝트에 메타데이터로 맵 오브젝트를 담고 싶다고 가정할 때 서버로 맵 오브젝트를 보내어야하는 요구사항이 생긴다.

```java
public class Person {
    private String name;
    private Map<String, Object> metadata;
}
```

그런데 위 자바 빈 스펙 규칙에 따르면 맵 프로퍼티는 `metadata[address][location]`와 같이 표현되어야 한다.

그런데 서버로 요청되는 페이로드가 `metadata[address][location]=value`가 되어버리면 metadata 프로퍼티의 address가 배열의 인덱스인지 맵의 인덱스 키인지 `구별할 수 없다`

결국 [관련 포스트](https://homoefficio.github.io/2017/04/25/Spring-%EA%B0%80-%ED%8F%AC%ED%95%A8%EB%90%9C-URL-%ED%8C%8C%EB%9D%BC%EB%AF%B8%ED%84%B0-%EB%B0%94%EC%9D%B8%EB%94%A9-%ED%95%98%EA%B8%B0/)처럼 다음과 같은 오류가 발생할 것이다.

```java
Property referenced in indexed property path 'metadata[address][location]' is neither an array nor a List nor a Map
```

그러면 요청 페이로드가 [.형식으로 데이터를 변환](https://gist.github.com/codesnik/1433581)되어 `metadata.address.location=value`로 전송된다면 올바르게 바인딩 할 수 있을까?

답은 아니다!

바인딩이 되지 않는다.

맵 프로퍼티로 바인딩하기 위해서는 person.metadata[address]이어야만 하기 때문이다.

#### 복잡한 페이로드라면 application/json을 사용하자.

따라서, 복잡한 형태로 데이터가 구성되어야 한다면`x-www-form-urlencoded`가 아니라 `application/json`으로 명시하여 서버가 처리할 수 있도록 해야하는게 좋다.

그리고 서버 API도 복잡한 형태의 오브젝트를 페이로드로 받도록 요구된다면 애초에 `application/json`만 요청할 수 있도록 하자.

```json
{"metadata":{"address":{"location":"value"}}}
```

물론 스프링이 `BeanWrapper` 또는 `DataBinder`를 구현하는 것도 하나의 방법이긴 하다.

하지만, 모델 바인딩을 위한 코드를 API와 오브젝트별로 작성해야 하기에 배보다 배꼽이 더 커질수가 있다.

그리고 `@Valid`와 `@Validated`를 이용한 벨리데이션을 쉽게 적용할 수 없고 `Validator`도 추가로 직접 호출해서 오브젝트를 `검증`해야 한다.

## 참조

-   [Content Type : x-www-form-urlencoded, form-data and json](https://medium.com/@mohamedraja_77/content-type-x-www-form-urlencoded-form-data-and-json-e17c15926c69)
-   [Understanding HTML Form Encoding: URL Encoded and Multipart Forms](https://dev.to/sidthesloth92/understanding-html-form-encoding-url-encoded-and-multipart-forms-3lpa)
-   [Validation, Data Binding, and Type Conversion](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#validation)
-   [Content-Type vs Accept, HTTP Header](http://1ambda.github.io/content-type-vs-accept-http-header/)
-   [Http Method는 POST, Content-Type이 application/x-www-form-urlencoded인 경우 body를 encoding하는게 맞을까?](https://gist.github.com/jays1204/703297eb0da1facdc454)
