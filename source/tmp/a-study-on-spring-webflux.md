---
    title: Spring WebFlux에 대해서 알아보기
    date: 2021-01-25
    categories: [개발 이야기]
    tags: [Spring, WebFlux, Reactive Stack]
---

## Spring Reactive Stack

스프링 리액티브 스택에 대한 자세한 내용은 공식 레퍼런스인 [`Web on Reactive Stack`](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html)을 참고하세요

### Reactive Core
스프링 리액티브 스택은 [Reactive Streams](https://www.reactive-streams.org/)를 기반으로 합니다. 이 Reactive Stremas는 리액티브 프로그래밍에 대한 표준이라고 할 수 있습니다. 그리고 스프링에서는 Reactive Streams의 저수준 API를 확장한 [Reactor](https://projectreactor.io/)를 채택하였습니다.

> Reactor는 Pivotal 그룹에서 진행한 프로젝트로 사실상 스프링에서 리액티브 스택을 지원하기 위한 초석이라고 봐도 무방합니다.

Reactor에 대한 내용은 [Reactor에 대해서 알아보기](https://kdevkr.github.io/archives/2020/a-study-on-reactor/) 글을 참고하세요.

### Spring WebFlux
Spring WebFlux는 스프링 5.X에 추가된 리액티브 웹 프레임워크로써 [기본적으로는 Reactor Netty를 사용하지만 원한다면 Undertow 또는 Servlet 3.1+ 컨테이너도 사용](https://docs.spring.io/spring-boot/docs/2.1.10.RELEASE/reference/html/howto-embedded-web-servers.html#howto-use-another-web-server)할 수 있습니다.

#### Enable WebFlux
WebFlux 설정을 활성화하려면 @EnableWebFlux를 사용하면 됩니다.
또한, WebFluxConfigurer 인터페이스를 구현할 수도 있습니다.

```java
@Configuration
@EnableWebFlux
public class WebConfig implements WebFluxConfigurer {}
```

@EnableWebFlux을 사용하면 `DelegatingWebFluxConfiguration`이 추가됩니다. 이 DelegatingWebFluxConfiguration은 WebFluxConfigurer 유형의 빈들을 감지하고 위임합니다.

> 실제로 Spring Boot 에서는 WebFluxAutoConfiguration을 통해 DelegatingWebFluxConfiguration을 빈으로 등록하고 WebFluxConfigurer를 구현합니다.

#### Customize
WebFlux에 대한 커스터마이즈에 대해 알아보겠습니다.

##### CORS
Spring WebFlux의 HandlerMapping 구현체는 요청을 핸들러에 매핑한 후에 요청과 핸들러에 대한 CORS 설정을 확인합니다. 

**_CorsConfiguration_**  
다음은 CORS 설정을 전역으로 설정할 수 있는 예시입니다.
```java
@Configuration
public class WebConfig implements WebFluxConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://github.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

```

**_@CrossOrigin_**
다음은 컨트롤러 및 핸들러 단위로 설정할 수 있는 예시입니다.

```java
@CrossOrigin(maxAge = 1800)
@Controller
public class DemoController {
    @CrossOrigin(allowCredentials = "true")
    @GetMapping("/api/health")
    public ResponseEntity<Object> health() {
        return ResponseEntity.ok(null);
    }
}
```

**_CorsWebFilter_**  
다음은 함수형 엔드포인트에 적합한 방법입니다.

```java
@Bean
public WebFilter corsWebFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Lists.newArrayList("https://github.com"));
    config.setAllowCredentials(true);
    config.setMaxAge(Duration.ofMinutes(30));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return new CorsWebFilter(source);
}
```

##### View
Spring WebFlux의 뷰 기술은 유연하기 때문에 원하는 것을 결정만 하면 됩니다.

**_FreemarkerConfigurer_**
만약 프리마커로 결정했다면 FreeMarkerConfigurer를 통해 옵션 설정이 가능합니다.

```java
@Configuration
public class WebViewResolverConfig implements WebFluxConfigurer {

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.freeMarker();
    }

    @Bean
    public FreeMarkerConfigurer freeMarkerConfigurer() {
        FreeMarkerConfigurer configurer = new FreeMarkerConfigurer();
        configurer.setTemplateLoaderPath("classpath:/templates");
        return configurer;
    }
}
```

**_ScriptTemplateConfigurer_**  
다음은 스크립트 엔진으로 뷰 기술을 선택하는 경우입니다.

```java
@Configuration
public class WebViewConfig implements WebFluxConfigurer {

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.scriptTemplate();
    }

    @Bean
    public ScriptTemplateConfigurer configurer() {
        ScriptTemplateConfigurer configurer = new ScriptTemplateConfigurer();
        configurer.setCharset(StandardCharsets.UTF_8);
        configurer.setEngineName("nashorn");
        configurer.setScripts("polyfill.js", "handlebars.js", "render.js");
        configurer.setRenderFunction("render");
        configurer.setSharedEngine(false);
        return configurer;
    }
}
```

**_HttpMessageWriterView_**
클라이언트 요청의 Content-Type에 의해 JSON 또는 XML을 위한 Content Negotiation이 필요할 수 있습니다. HttpMessageWriterView는 이를 위해 지원합니다.

> 만약, 뷰 리졸버를 선택하지 않는다면 기본으로 HttpMessageWriterView가 설정됩니다.

##### HTTP Caching
HTTP 캐시는 웹 애플리케이션 성능을 향상시킬 수 있는 하나의 방법입니다. HTTP 캐시는 `Cache-Control` 응답 헤더와 `Last-Modified` 그리고 `ETag`와 같은 부속 요청 헤더에 의해 처리됩니다. 

**_CacheControl with Controller_**  
컨트롤러에서 ServerWebExchange로 CacheControl를 체크할 수 있으며 ResponseEntity 빌더를 통해 CacheControl를 설정할 수 있습니다.

```java
@GetMapping("/api/health")
public ResponseEntity<Object> health(ServerWebExchange exchange) {
    if(exchange.checkNotModified(Instant.now())) {
        return null;
    }

    String eTag = UUID.randomUUID().toString();
    return ResponseEntity.ok().cacheControl(CacheControl.maxAge(Duration.ofHours(1))).eTag(eTag).build();
}
```

**_CacheControl with ResourceHandler_**  
리소스 핸들러에는 CacheControl를 설정할 수 있는 옵션을 제공합니다.

```java
@Configuration
public class WebFilterConfig implements WebFluxConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("/dist", "classpath:/static/")
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(7)));
    }
}
```

##### Path Matching
PathMatchConfigurer를 통해 경로 매칭 전략에 대한 옵션 설정을 할 수 있습니다.

```java
@Configuration
public class WebConfig implements WebFluxConfigurer {
    @Override
    public void configurePathMatching(PathMatchConfigurer configurer) {
        configurer
            .setUseTrailingSlashMatch(true)
            .setUseCaseSensitiveMatch(true)
                .addPathPrefix("/api", HandlerTypePredicate.forAnnotation(RestController.class));
    }
}
```
> Spring WebFlux는 접미사에 대한 패턴 매칭을 지원하지 않습니다.

### Advanced
좀 더 확장된 기능을 알아보도록 하겠습니다.

#### WebClient
WebClient는 Spring MVC의 RestTemplate와 대응되는 HTTP 요청을 위한 논-블로킹 클라이언트입니다.

#### WebSocket

##### Server Configuration


##### WebSocketHandler

##### 

## 참고
- [Spring WebFlux - Spring Framework Reference](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#webflux)  
- [Get Started with Reactive Programming in Spring](https://developer.okta.com/blog/2018/09/21/reactive-programming-with-spring)