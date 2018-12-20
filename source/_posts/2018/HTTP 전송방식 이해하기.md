---
title: HTTP 전송방식 이해하기
date: 2099-12-13
categories: [끄적끄적]
---

## 개요  
HTTP는 데이터를 서버로 보내는 방법 중 하나인데 요청시 보내어지는 바디 타입은 `Content-Type` 헤더에 따라 결정되죠 이번에 확인하고자하는 것은 이러한 HTTP를 이용해서 서버로 데이터를 전송할때 어떠한 방식을 사용하는지 이해하고자 합니다.  

## Content-Type
많이 사용하는 REST 요청 클라이언트인 Postman과 Insomnia를 보면 다음과 같이 컨텐트 타입을 제공하고 있습니다.

![](/images/2018/01.png)
![](/images/2018/02.png)

여기서 우리가 중점적으로 봐야할 것은 multipart/form-data, x-www-form-urlencoded, application/json 입니다.  

현재 우리가 많이 사용하는 컨텐트 타입은 application/json일 수 있습니다. 마치 다음과 같이 사용하죠  

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

> 서버가 스프링으로 구성되면 컨트롤러에서 @RequestBody 어노테이션을 명시해서 모델 바인딩을 시도할 거에요  

#### x-www-form-urlencoded  
그런데 일반적인 HTML Form을 이용해서 서버로 데이터를 전송하게 되면 컨텐트 타입은 x-www-form-urlencoded인 것을 아시나요?

그러면 x-www-form-urlencoded 컨텐트 타입이 리퀘스트 바디로 전송되는 데이터가 어떻게 구성되어지는지 알아보겠습니다.

다음은 모질라 웹 레퍼런스 문서에서 제공하는 예시입니다.
```html
POST / HTTP/1.1
Host: foo.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 13

say=Hi&to=Mom
```

바로 say=Hi&to=Mom가 리퀘스트에 포함되는 데이터 부분이죠 키와 값을 =와 함께 표현하고 &의 묶음으로 표현되는게 바로 x-www-form-urlencoded 컨텐트 타입의 데이터 구조입니다. 간단하게 키와 값으로 이루어진다라고 이해합시다.

> 키와 값으로 이루어진 문자열 표현을 `쿼리 스트링`이라고 합니다.

그러면 간단한 Ajax를 코드로 보내는 예제를 보겠습니다.
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

[`jquery.ajax`](http://api.jquery.com/jquery.ajax/) 문서에 따르면 data는 PlainObject, String, Array가 와야한다고 설명하고 있습니다. 다시 말해서 Object가 주어질 경우 반드시 키와 값으로 이루어져야 한다는 것입니다.

이때 processData라는 옵션이 중요해집니다. 이 옵션은 컨텐트 타입이 `application/x-www-form-urlencoded`일 때 컨텐트 타입에 맞춰 쿼리 스트링으로 변환해야하는지에 대한 여부입니다.

> Array가 올 경우 a[]=1&a[]=2 이런식으로 변환됩니다.  

따라서, x-www-form-urlencoded 컨텐트 타입일 때 URL의 쿼리스트링으로 보내는 행위와 동일하다라고 이해할 수 있습니다.

## Spring Model Binding  
실제로 관심이 가는 부분은 스프링 컨트롤러에서 리퀘스트 바디를 파라미터로 어떻게 모델을 바인딩해주는가에 대한 부분입니다.

[스프링 공식 레퍼런스 : Setting and Getting Basic and Nested Properties](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#beans-beans-conventions)에서는 프로퍼티를 가져오거나 설정하는 것을 `getPropertyValue`와 `getPropertyValues` 그리고 `setPropertyValue`와 `setPropertyValues` 메소드로 수행한다고 합니다. 그리고 자바빈 스펙에 따라 오브젝트의 프로퍼티로 나타내는 규칙도 설명하죠  

#### Examples of properties  
##### name  
Indicates the property name that corresponds to the getName() or isName() and setName(..) methods.  

##### account.name  
Indicates the nested property name of the property account that corresponds to (for example) the getAccount().setName() or getAccount().getName() methods.  

##### account[2]  
Indicates the third element of the indexed property account. Indexed properties can be of type array, list, or other naturally ordered collection.  

##### account[COMPANYNAME]  
Indicates the value of the map entry indexed by the COMPANYNAME key of the account Map property.  

간단하게 살펴보면 account 클래스의 name 프로퍼티를 바인딩할 경우에는 account.name이라고 표현되어야하고 account[2]라고 표현되면 3번째 인덱스 프로퍼티로 나타내며 account[COMPANYNAME]이면 COMPANYNAME을 키로 가지는 Map 프로퍼티인 것입니다.  

#### @ModelAttribute  
이 [`@ModelAttribute`](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-ann-modelattrib-method-args) 어노테이션은 컨트롤러에서 리퀘스트 파라미터를 쉽게 빈 오브젝트로 바인딩하기 위해 사용합니다.  

그런데 다음과 같이 빈 오브젝트 클래스에 맵 프로퍼티가 존재할 경우 @ModelAttribute로 데이터 바인딩을 시도할 때 주의해야합니다. 앞서 x-www-form-urlencoded 컨텐트 타입의 데이터 구조를 살펴본 것은 바로 이 때문입니다.  

만약에 빈 오브젝트에 메타데이터로 맵 오브젝트를 담고 싶다고 가정할 때 서버로 맵 오브젝트를 보내고 싶어할 것입니다. 그런데 위 자바빈 스펙 규칙에 따르면 맵 프로퍼티는 metadata[address][location]와 같이 표현되어야 합니다.  

서버로 요청되는 데이터가 metadata[address][location]=value 가 되어버리면 metadata 프로퍼티의 address가 배열의 인덱스인지 맵의 인덱스 키인지 구별할 수 없어 [관련 포스트](https://homoefficio.github.io/2017/04/25/Spring-%EA%B0%80-%ED%8F%AC%ED%95%A8%EB%90%9C-URL-%ED%8C%8C%EB%9D%BC%EB%AF%B8%ED%84%B0-%EB%B0%94%EC%9D%B8%EB%94%A9-%ED%95%98%EA%B8%B0/)처럼 다음과 같은 오류가 발생할 것입니다.  

```java
Property referenced in indexed property path 'metadata[address][location]' is neither an array nor a List nor a Map
```

그래서 관련 포스트에서는 @ModelAttribute를 사용하지 않고 Spring MVC의 request 객체에서 parameterMap을 받아 []로 구성된 parameterName을 스프링이 이해할 수 있는 .형식으로 변환해서 에러없이 값을 집어넣을 수 있다고 하는데 이는 빈 오브젝트의 프로퍼티가 다시 빈으로 표현될 때의 이야기입니다.   

왜냐하면 자바빈 스펙에 따라 account 빈 오브젝트의 name 필드는 account.name이 되기 때문입니다.

위와 같은 상황은 서버에서 @ModelAttribute를 그대로 사용하고 프론트에서 서버로 데이터를 보낼때 [.형식으로 데이터를 변환](https://gist.github.com/codesnik/1433581)해서 던져주면 됩니다.  

하지만, 맵 프로퍼티로 바인딩하기 위해서는 account[COMPANYNAME]이어야 만 합니다.

> 결국 돌고 도는 문제...

## 결론  
따라서, 복잡한 형태로 데이터를 전송해야한다면 x-www-form-urlencoded가 아니라 applicaton/json으로 JSON 형식 데이터로 보내어 서버가 처리하도록 하는게 맞다고 봅니다.

```json
{"metadata":{"address":{"location":"value"}}}
```

이와 같은 문제로 회사 내 팀장님께서는 되게 해야지 하셨는데 안되는 것은 안되는 거다.

또한, @ModelAttribute 또는 @RequestBody를 사용하지 않고 BeanWrapper 또는 DataBinder를 구현하는것도 하나의 방법이긴 한데 데이터 형태에 따라 맞춰줘야하므로 데이터 바인딩을 하기 위한 코드로 인해 배보다 배꼽이 커지게 될 수 있습니다.

#### 모르고 있는 것과 알고 처리하는 것에는 차이가 있습니다.

## 참고  
- [HTTP Post Method](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/POST)  
- [JQuery.ajax](http://api.jquery.com/jquery.ajax/)  
- [Content Type : x-www-form-urlencoded, form-data and json](https://medium.com/@mohamedraja_77/content-type-x-www-form-urlencoded-form-data-and-json-e17c15926c69)  
- [Understanding HTML Form Encoding: URL Encoded and Multipart Forms](https://dev.to/sidthesloth92/understanding-html-form-encoding-url-encoded-and-multipart-forms-3lpa)
- [Validation, Data Binding, and Type Conversion](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#validation)
- [Spring - []가 포함된 URL 파라미터 바인딩 하기](https://homoefficio.github.io/2017/04/25/Spring-%EA%B0%80-%ED%8F%AC%ED%95%A8%EB%90%9C-URL-%ED%8C%8C%EB%9D%BC%EB%AF%B8%ED%84%B0-%EB%B0%94%EC%9D%B8%EB%94%A9-%ED%95%98%EA%B8%B0/)
