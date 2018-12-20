---
title: 잠만보 프로젝트 - Spring WebFlux 전환하기
date: 2099-11-15
categories: [프로젝트, 잠만보]
---

> 잠만보 프로젝트가 스프링 부트 2.0으로 개발하기 때문에 기존에 개발하던 서블릿 방식을 벗어나 새롭게 제공하는 기술을 배워보고 함수형 프로그래밍을 이해하고자 함수형 프로그래밍 및 논 블로킹을 지원하는 Spring-WebFlux를 적용하고자 합니다.  

스프링 프레임워크에 포함된 일반 웹 프레임워크인 `Spring Web MVC`는 서블릿 API와 서블릿 컨테이너를 위한 목적으로 만들어졌습니다. 리액티브 스택 웹 프레임워크인 Spring WebFlux는 5.0 이후 버전에 추가되었습니다.  

## 개요  
비동기, 논 블로킹 영역을 확립한 네티와 같은 서버 처럼 함수형 프로그래밍과 함께 적은 수의 스레드로 동시성을 처리하고 하드웨어 리소스를 작게 확장할 수 있는 논 블로킹 웹 스택이 필요성이 요구되어 `Spring WebFlux`가 만들어졌습니다.  

> 서블릿 3.1이 논 블로킹을 위한 I/O를 지원하였지만, 동기 및 블로킹에서는 아니었습니다.  

![](https://spring.io/img/homepage/diagram-boot-reactor.svg)  

#### 프로그래밍 모델  
Spring WebFlux는 두가지 프로그래밍 모델을 선택할 수 있도록 지원합니다.  

- Annotated Controllers : spring-web 모듈으로 Spring MVC와 함께 같은 어노테이션을 기반하도록 고려되었습니다. 하나의 차이점이라면 WebFlux는 리액티브한 `@requestBody` 인자도 지원합니다.  

- Functional Endpoints : 람다 기반의 함수형 프로그래밍 모델입니다. 애플리케이션을 라우트하거나 요청을 처리하는 유틸리티들의 집합 또는 작은 라이브러리로 생각할 수 있습니다. annotated controllers와 큰 차이는 애플리케이션이 어노테이션을 통해 진입하고 콜백되는 것과 달리 요청 처리를 처음부터 끝까지 담당한다는 점입니다.  

#### 동시성 모델  
Spring MVC와 Spring WebFlux는 같이 운용될 수 있기 때문에 의미가 없는 항목이긴 합니다. 하지만, 블로킹을 중점을 두는 JPA, JDBC와 같은 퍼시스턴스 API 또는 네트워크 API를 사용할때 Spring MVC가 일반적인 아키텍처로 최선의 선택입니다.

## WebFlux 구성하기  
기존에 저는 `spring-boot-starter-web`을 그레이들 디펜던시에 추가하여 스프링 부트가 MVC 환경을 구성하였습니다. [`Spring WebFlux Reference`]에 따라 WebFlux 환경을 구성하기 위해 spring-boot-starter-web을 지우고 `spring-boot-starter-webflux`를 추가합니다.  

```js
dependencies: {
    // implementation('org.springframework.boot:spring-boot-starter-web')
    implementation('org.springframework.boot:spring-boot-starter-webflux')
}
```

이제 기존의 WebMvcConfigurer 대신 `WebFluxConfigurer`를 구현하시면 됩니다. 관련된 클래스를 reactive 패키지에서도 제공하니 걱정하지 마시기 바랍니다.  

```java  
@Configuration
public class WebFluxConfiguration implements WebFluxConfigurer {

    @Autowired
    ObjectMapper objectMapper;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("**").allowedOrigins("*").allowedHeaders("*").allowedMethods("*");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.DAYS))
                .addResourceLocations("classpath:/META-INF/resources/", "classpath:/resources/", "classpath:/static/")
                .resourceChain(true)
                .addResolver(new EncodedResourceResolver()).addResolver(new PathResourceResolver());
    }

    @Override
    public void configureHttpMessageCodecs(ServerCodecConfigurer configurer) {
        configurer.defaultCodecs().enableLoggingRequestDetails(true);
        configurer.defaultCodecs().jackson2JsonEncoder(new Jackson2JsonEncoder(objectMapper));
        configurer.defaultCodecs().jackson2JsonDecoder(new Jackson2JsonDecoder(objectMapper));
    }
}
```

#### SecurityConfigurerAdaptor 대신 SecurityWebFilterChaining  
스프링 시큐리티 설정을 MVC에서는 WebSecurityConfigurerAdapter를 확장하는 구성 클래스를 만들었다면 WebFlux를 위한 시큐리티 설정에는 SecurityWebFilterChain를 빈으로 등록함으로써 대신 수행합니다.  

```java  
@Configuration
public class SecurityConfiguration  {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http.httpBasic().disable();
        return http.build();
    }
}
```

#### Reactor-Netty말고 Embedded-Tomcat으로  
`spring-boot-starter-webflux`는 reactor-netty를 기본 내장 서버로 의존 모듈을 가지고 있습니다. 만약, 기존과 같이 Tomcat으로 서버를 실행하고 싶다면 `spring-boot-starter-tomcat`을 디펜던시에 추가하세요.  

```js  
dependencies: {
    // implementation('org.springframework.boot:spring-boot-starter-web')
    implementation('org.springframework.boot:spring-boot-starter-webflux')
    implementation('org.springframework.boot:spring-boot-starter-tomcat')
}
```

이 상태에서 서버를 실행시키면 HTTPS를 가지는 톰캣 서버로만 동작하게 됩니다. 기존에는 TomcatServletWebServerFactory의 addAdditionalTomcatConnectors 메소드를 통해 톰캣 커넥터를 추가하였는데 WebFlux 환경에서는 TomcatReactiveWebServerFactory로써 내장 서버를 구성해야 합니다.  

> 그런데 reactor-netty 의존성은 제외 안하나요?  
> 네. 저는 추후 RestTemplate 대신에 WebClient를 사용할 것이므로 의존성을 유지하겠습니다.  
> 왜 WebClient를 사용하냐구요? RestTemplate를 이후 버전에서 제외한다고 예고했습니다.  
> = The RestTemplate will be deprecated in a future version and will not have major new features added going forward.

```java  
@Configuration
public class TomcatConfiguration {

    @Value("${server.port}")
    int port;

    @Value("${server.http.port}")
    int httpPort;

    @Value("${server.http.redirect.https}")
    boolean httpToHttps;

    @Bean
    public ReactiveWebServerFactory reactiveWebServerFactory() {
        TomcatReactiveWebServerFactory factory = new TomcatReactiveWebServerFactory();
        factory.addContextCustomizers(context -> {
            SecurityConstraint securityConstraint = new SecurityConstraint();
            securityConstraint.setUserConstraint("CONFIDENTIAL");

            if(httpToHttps) {
                SecurityCollection securityCollection = new SecurityCollection();
                securityCollection.addPattern("/*");
                securityConstraint.addCollection(securityCollection);
            }
            context.addConstraint(securityConstraint);
        });

        factory.addConnectorCustomizers(connector -> {
            Connector httpConnector = new Connector();
            httpConnector.setScheme("http");
            httpConnector.setSecure(false);
            httpConnector.setPort(httpPort);
            if(httpToHttps) {
                httpConnector.setRedirectPort(port);
            }

            connector.getService().addConnector(httpConnector);
        });
        return factory;
    }
}
```

> TomcatReactiveWebServerFactory는 addAdditionalTomcatConnectors를 제공하지 않습니다!  
> 대신 addConnectorCustomizers를 통해 커넥터의 서비스에 새로운 커넥터로 추가하세요  

```java  
2018-11-15 22:11:23.377  INFO 3360 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 9443 (https) 9000 (http) with context path ''
```

#### (Optional) Rendering.class  
[Spring WebFlux](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#webflux-resulthandling)는 기존의 MVC로 제공하던 어노테이션 기반도 제공하면서 Rendering이라는 새로운 오브젝트 타입으로 뷰를 리턴할 수 있습니다.

```java  
@Controller
public class IndexController extends AbstractController {

//    @GetMapping("/")
//    public String index() {
//        return "index";
//    }

    @GetMapping("/")
    public Rendering index() {
        return Rendering.view("index").build();
    }
}
```

다음 포스트에서는 어노테이션을 지정한 API 컨트롤러 대신에 `Functional Endpoints`로 응답을 해보겠습니다.  
도대체 `API 통신 간 도메인 모델 바인딩 방식` 및 `검증`, `에러 메시지 처리`에 대한 설정은 언제쯤 하는걸까요...

## 참고  
- [Spring WebFlux](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#webflux)  
- [Spring Docs : howto-embedded-web-servers](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-embedded-web-servers.html#howto-configure-webserver)  
- [Spring Security - webflux-redirect-https](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#webflux-redirect-https)  
