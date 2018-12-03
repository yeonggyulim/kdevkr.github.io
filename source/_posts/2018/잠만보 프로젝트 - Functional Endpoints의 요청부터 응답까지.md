---
title: 잠만보 프로젝트 - Functional Endpoints의 요청부터 응답까지
date: 2018-11-17
categories: [프로젝트, 잠만보]
---

오늘은 Spring WebFlux의 `Functional Endpoints`를 알아보면서 모델 바인딩, 모델 검증, 파일 업로드/다운로드에 대해 알아보도록 하겠습니다.  

## [Functional Endpoints](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#webflux-fn)  
기존의 @Controller와 @RequestMapping은 `RouterFunction`으로 요청에 대한 처리와 응답의 구현은 `HandlerFunction`으로 대신할 수 있습니다.  

#### 라우터 매핑    
라우터 매핑을 위한 @Configuration이 명시된 클래스를 통해 RouterFunction을 빈으로 등록하면 `RouterFunctionMapping`이 만들어지게 됩니다.  

예를 들어, 간단하게 파일을 업로드하고 다운로드할 수 있는 API를 위한 라우터를 매핑하고 싶다면 다음과 같이 하면 됩니다.  
```java  
@Configuration
public class FileApi extends AbstractApi {

    @Bean
    public RouterFunction<ServerResponse> routes(FileHandler handler) {
        return RouterFunctions
                .route(GET("/api/files"), handler::getFiles)
                .andRoute(POST("/api/files").and(accept(MediaType.MULTIPART_FORM_DATA)), handler::uploadFile)
                .andRoute(GET("/api/files/{fileKey}"), handler::downloadFile);
    }
}
```

> 위 처럼 한번에 묶어서 체이닝 방식으로 표현할 수 도 있고 각각 빈으로 등록하여도 상관 없습니다.  
> 그리고 제대로 매핑되었는지 확인하시려면 다음의 로깅 레벨을 TRACE로 변경하세요  

```java
// logging.level.org.springframework.web.reactive.function.server.support.RouterFunctionMapping=TRACE
2018-11-17 21:30:17.674 o.s.w.r.f.s.s.RouterFunctionMapping      : Mapped (GET && /api/files) -> kr.kdev.app.api.FileApi$$Lambda$436  
((POST && /api/files) && Accept: [multipart/form-data]) -> kr.kdev.app.api.FileApi$$Lambda$438
(GET && /api/files/{fileKey}) -> kr.kdev.app.api.FileApi$$Lambda$439  
```


그러면 우리는 서버가 실행될 때 다음과 같이 확인할 수 있습니다.  


기존에 어노테이션을 붙인 컨트롤러와 메소드를 만드는 것과 달리 굉장히 단순한 코드로 이를 수행하게 되었습니다. 이게 바로 함수형 프로그래밍의 장점이라고 볼 수 있어요  

#### 요청 처리와 응답    
앞서, 요청의 처리와 응답은 `HandlerFunction`이 대신한다고 했습니다. 이 HandlerFunction은 ServerRequest를 인자로 받으며 Mono<ServerResponse> 또는 Flux<ServerResponse>를 반환하는 함수로 구성됩니다.  

> Mono가 뭐고 Flux는 또 뭘까요?  
> 카카오 블로그의 사용하면서 알게 된 Reactor, 예제 코드로 살펴보기에서는 `Mono는 0-1개의 결과만을 처리`하기 위한 Reactor 객체이고, `Flux는 0-N개인 여러 개의 결과를 처리`하는 객체입니다 라고 설명하네요.  

#### 에러 처리    
WebFlux에서는 @ControllerAdvice로 에러 처리를 할 수 없습니다. 하지만 `WebExceptionHandler`의 구현체를 빈으로 선언하면 간단하게 적용할 수 있도록 지원합니다.  

WebExceptionHandler의 구현체에는 `ResponseStatusExceptionHandler` 그리고 이를 확장한 `WebFluxResponseStatusExceptionHandler`가 있는데 WebFluxResponseStatusExceptionHandler는 @ResponseStatus 어노테이션으로 HttpStatus를 결정할 수 있도록 해줍니다.  

```java  
@Order(-2)
@Component
public class DefaultExceptionHandler extends WebFluxResponseStatusExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(DefaultExceptionHandler.class);

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        if (ex instanceof BadRequestException) {
            LOG.warn("{}", ex.getMessage());
        } else if (ex instanceof ForbiddenException) {
            LOG.warn("{}", ex.getMessage());
            return Mono.error(ex);
        } else if (ex instanceof ValidationException) {
            LOG.warn("{}", ex.getMessage());
        }

        return super.handle(exchange, ex);
    }

    @Override
    protected HttpStatus determineStatus(Throwable ex) {
        return super.determineStatus(ex);
    }
}
```

> ForbiddenException에서 Mono.error(ex)를 한 이유는 403에 대한 응답을 내릴 때 에러 응답 오브젝트를 포함해서 내려주기 위함입니다.  

근데 에러 응답에 대한 오브젝트 맵은 어디서 제공하는 것일까요?  답은 `ErrorAttributes`입니다.  
다음과 같이 DefaultErrorAttritubes를 확장한 클래스를 빈으로 등록하면 응답 오브젝트를 변경할 수 있습니다.  

```java
@Component
public class ErrorAttributes extends DefaultErrorAttributes {
    @Override
    public Map<String, Object> getErrorAttributes(ServerRequest request, boolean includeStackTrace) {
        Map<String, Object> errorAttributes = super.getErrorAttributes(request, false);
        errorAttributes.put("params", request.queryParams());

        Throwable throwable = getError(request);
        errorAttributes.put("exception", throwable.getClass());
        errorAttributes.put("message", throwable.getMessage());
        return errorAttributes;
    }
}
```

#### 모델 검증  
아쉽게도 아직 [Functional Endpoints에서 자동으로 검증 처리를 하는 것은 포함되어있지 않다](https://stackoverflow.com/a/46540102)고 합니다. 공식 문서에서도 어노테이션 기반에 대한 설명만 존재하는 걸 확인할 수 있었습니다.  
> 아쉽게도 [OKKY에 물어보신 분](https://okky.kr/article/434778)이 계시지만 답변은 달리지 않았습니다.  

음... 일단은 더 알아보고 방법이 마땅치 않다면 어노테이션 기반으로 다시 작성해야할 필요가 있어보입니다. 

어찌어찌 관련 정보를 찾으면서 구성해보긴 했는데 아직 리액티브 프로그래밍에 대한 이해가 좀 처럼 잡히지가 않네요  

## 참고
- [WebFlux - fn](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#webflux-fn)  
- [사용하면서 알게 된 Reactor, 예제 코드로 살펴보기](http://tech.kakao.com/2018/05/29/reactor-programming/)  
- [entzik/reactive-spring-boot-examples/reactiveupload](https://github.com/entzik/reactive-spring-boot-examples/blob/master/src/main/java/com/thekirschners/springbootsamples/reactiveupload/ReactiveUploadResource.java)  
- [Webflux-error-handling](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-developing-web-applications.html#boot-features-webflux-error-handling)  
