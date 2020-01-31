---
    title: RestTemplate와 WebClient로 Open API를 사용하는 방법 비교하기
    date: 2020-01-31
    categories: [개발 이야기]
    tags: [RestTemplate, WebClient, Open API]
---

## 들어가며
공공데이터포털에서 제공하는 [한국전력거래소 계통운영 정보](https://www.data.go.kr/dataset/3043723/openapi.do)와 같은 Open API를 RestTemplate(블로킹 클라이언트)와 WebClient(리액티브 논-블로킹 클아이언트)를 활용하여 호출하고 응답받는 방법을 비교해보겠습니다.

## HTTP Request Client

### RestTemplate
`RestTemplate`는 [Apache HttpComponents](https://hc.apache.org/) 또는 [OkHttp](https://square.github.io/okhttp/)와 같은 라이브러리를 사용하여 HTTP 요청을 수행하는 클라이언트입니다.

> The RestTemplate will be deprecated in a future version and will not have major new features added going forward.

위 설명에 따르면 RestTemplate에 대한 기능 지원은 없을 예정이며 언제가 될지는 모르겠으나 없어질 수 있다고 합니다. 새로 추가된 WebClient로 통합하려고 하는 듯 합니다.

#### Example
그러면 기존에 사용하던 RestTemplate로 Open API를 호출하는 예제를 살펴보겠습니다.

> 본 예제는 인코딩된 서비스 키를 사용하므로 쿼리 파라미터에 대한 인코딩 설정을 하지 않았습니다.

```java
@Test
    public void TEST_000_http_request_using_rest_template() {
        RestTemplate restTemplate = new RestTemplate();

        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory("https://openapi.kpx.or.kr");
        uriBuilderFactory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);

        UriBuilder uriBuilder = uriBuilderFactory.builder();
        uriBuilder
            .path("/openapi/sukub5mToday/getSukub5mToday")
            .queryParam("ServiceKey", "[encodedServiceKey]");

        ResponseEntity<String> responseEntity = restTemplate.exchange(uriBuilder.build(), HttpMethod.GET, null, String.class);
        String response = responseEntity.getBody();
    }
```

### WebClient
`WebClient`는 리액티브 스택을 지원할 수 있도록 [Reactor Netty](https://github.com/reactor/reactor-netty)를 사용하여 논-블로킹으로 HTTP 요청을 수행하는 리액티브 클라이언트입니다. 

#### Example
이제 RestTemplate와 비교하여 똑같은 동작을 해보겠습니다.

```java
@Test
    public void TEST_001_http_request_using_web_client() {

        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory("https://openapi.kpx.or.kr");
        uriBuilderFactory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);

        WebClient webClient = WebClient.builder().uriBuilderFactory(uriBuilderFactory).build();
        WebClient.ResponseSpec responseSpec = webClient.get().uri(uriBuilder -> uriBuilder
                .path("/openapi/sukub5mToday/getSukub5mToday")
                .queryParam("ServiceKey", "[encodedServiceKey]")
                .build()
        ).retrieve();

        String response = responseSpec.bodyToMono(String.class).block();
    }
```

> Mono.block()을 통해 비동기가 아닌 RestTemplate와 같은 동기로 수행할 수 있습니다.

## 참고
- [RestTemplate](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html)
- [WebClient](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/reactive/function/client/WebClient.html)
- [RestTemplate 말고 WebClient](https://junebuug.github.io/2019-02-11/resttemplate-vs-webclient)
- [Spring WebClient vs. RestTemplate](https://www.baeldung.com/spring-webclient-resttemplate)