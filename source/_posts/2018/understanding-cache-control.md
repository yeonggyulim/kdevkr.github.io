---
title: 초보 개발자가 이해하는 캐시 정책
date: 2018-06-09 21:21:18
categories: [개발 이야기, 자바]
---

![](/images/logo/spring.png)

## The Cache-Control Header

`Cache-Control` 헤더는 서버와 브라우저 사이의 `캐시 정책`이라고 할 수 있다. 이 헤더값에 따라서 브라우저가 해당 파일을 캐시해야하는지 언제 다시 서버에게 요청하는지를 결정하게 된다.

### Cache-Control: no-cache 그리고 no-store

캐시 정책을 이해하기 위해서는 `no-cache`와 `no-store`의 차이점을 알아야 한다.

#### no-cache

`no-cache`는 브라우저가 서버의 응답을 캐시할지 스스로 결정할 수 있다. 하지만, 캐시된 정보가 해당 서버에서 제공한 것인지는 요청을 하게 된다.

#### no-store

`no-store`는 브라우저가 서버의 응답을 캐시하지 못하도록 한다. 이 말은 반드시 매번 서버에 요청해야만 한다는 의미이다.

## 스프링 MVC 캐시 정책

스프링 MVC에서 캐시 정책을 설정하기 위해서는 어떻게 해야할까?
다음 글들을 참고해보자.

-   [browser가 caching 하지 않게 하는 http header](https://www.lesstif.com/pages/viewpage.action?pageId=20775788)
-   [Internet Explorer에서 캐싱을 방지하는 방법](https://support.microsoft.com/ko-kr/help/234067/how-to-prevent-caching-in-internet-explorer)
-   [더 빠른 웹을 위하여 - 웹 캐쉬](http://cyberx.tistory.com/9)

다음 코드는 캐시 정책이 설정되지 않는다. 무엇이 문제일까.

```java
@Configuration
@EnableWebMvc
public class MvcConfig extends WebMvcConfigurerAdapter {

  	@Override
  	public void addResourceHandlers(ResourceHandlerRegistry registry) {
  		registry.addResourceHandler("/**")
                  .setCachePeriod(0)
                  .addResourceLocations("classpath:/META-INF/resources/","classpath:/resources/","classpath:/static/","classpath:/public/")
                  .resourceChain(true)
                  .addResolver(new PathResourceResolver()).addResolver(new GzipResourceResolver());
  	}

  	@Override
  	public void addInterceptors(InterceptorRegistry registry) {
      registry.addInterceptor(new HandlerInterceptorAdapter() {

          @Override
          public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
              response.setHeader("Cache-Control","private, no-cache, no-store, must-revalidate");
              response.setHeader("Pragma","no-cache");
              response.setDateHeader("Expires",0);

              if (request.getProtocol().equals("HTTP/1.1")) {
                  response.setHeader("Cache-Control", "no-cache");
              }
          }
      });
      registry.addInterceptor(webContentInterceptor());
    }

  	@Bean
  	public WebContentInterceptor webContentInterceptor() {
  		WebContentInterceptor webContentInterceptor = new WebContentInterceptor();
  		webContentInterceptor.setCacheSeconds(0);
  		return webContentInterceptor;
  	}
}
```

혹시 다음 부분에서 문제가 있었을까?

```java
registry.addInterceptor(new HandlerInterceptorAdapter() {
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        response.setHeader("Cache-Control","private, no-cache, no-store, must-revalidate"); // HTTP/1.1
        response.setHeader("Pragma","no-cache"); // HTTP/1.0
        response.setDateHeader("Expires",0);

        if (request.getProtocol().equals("HTTP/1.1")) {
            response.setHeader("Cache-Control", "no-cache");
        }
    }
});
```

스프링에서 브라우저 캐시와 관련된 정보를 검색하면 위와 같이 설정하는 것을 많이 찾을 수 있다. 그런데 사실 스프링 프레임워크에서 캐시 정책을 적용하기 위해서는 `WebContentInterceptor`라는 것을 이용해야 한다.

이상하다. 위 코드에서 `WebContentInterceptor`는 이미 빈으로 등록하고 있다. 더구나 `setCacheSeconds(0)`이다.

#### WebContentGenerator.setCacheSeconds

WebContentGenerator의 setCacheSeconds 함수에 대해서 살펴보면 다음과 같이 설명하고 있다.

::: tip WebContentGenerator.setCacheSeconds
Cache content for the given number of seconds, by writing cache-related HTTP headers to the response:

seconds == -1 (default value) : no generation cache-related headers
seconds == 0 : "Cache-Control: no-store" will prevent caching
seconds > 0 : "Cache-Control: max-age=seconds" will ask to cache content
:::

CacheSeconds가 -1이면 캐시와 관련된 헤더를 만들지 않고 0이면 `Cache-Control: no-store`로 캐시를 막는다.
이미 `setCacheSeconds(0)`인데 그럼 무엇때문에 캐시를 했던 것일까

```java
registry.addInterceptor(new HandlerInterceptorAdapter() {
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        response.setHeader("Cache-Control","private, no-cache, no-store, must-revalidate"); // HTTP/1.1
        response.setHeader("Pragma","no-cache"); // HTTP/1.0
        response.setDateHeader("Expires",0);

        // ERROR!
        if (request.getProtocol().equals("HTTP/1.1")) {
            response.setHeader("Cache-Control", "no-cache");
        }
    }
});
```

자세히 살펴보면 요청 프로토콜이 HTTP/1.1일때 `Cache-Control: no-cache`를 지정한다는 것이 잘못된 코드이다. 프로토콜에 따라 무조건 적용하는 것이 아니라 요청에 의한 응답 리소스에 따라 캐시 정책을 지정해야 한다.

> `Pragma : no-cache` 도 HTTP/1.0의 표준 스펙은 아니다. 다만, Cache-Control을 지원하지 않으므로 대안으로 사용하는 것일 뿐이다.

그래서 스프링 MVC는 `인터셉터`를 통해 헤더에 직접 지정하지 않고 `WebContentInterceptor`를 제공하여 캐시 정책을 등록하게 도와준다.

그러므로 스프링은 WebContentInterceptor을 제공하고 캐시 전략을 등록하게 도와주는 것입니다.

> `인터셉터`에서 캐시 정책을 지정하는 부분을 지우자.

최종적으로 WebContentInterceptor에 의해 캐시 방지 처리된 페이지 결과는 다음과 같다.

`Chrome`

```zsh
HTTP/1.1 200
Cache-Control: no-store, must-revalidate, proxy-revalidate
Content-Language: ko-KR
Content-Type: text/html;charset=UTF-8
Date: Sat, 09 Jun 2018 07:54:50 GMT
Server: nginx/1.10.3
X-Application-Context: application:production:5000
Content-Length: 2049
Connection: keep-alive
```

`IE 11`

```zsh
Cache-Control: no-store, must-revalidate, proxy-revalidate
Connection: keep-alive
Content-Language: ko
Content-Length: 2049
Content-Type: text/html; charset=UTF-8
Date: Sat, 09 Jun 2018 08:24:47 GMT
Server: nginx/1.10.3
X-Application-Context: application:production:5000
```

#### Path별 캐시 정책 지정하기

스프링 MVC에서 Path별 캐시 정책을 지정할 수 있다. `WebContentInterceptor.setCacheMappings(Properties cacheMappings`와 `WebContentInterceptor.addCacheMapping(CacheControl cacheControl, String... paths)`으로 지원한다.

## 샘플 애플리케이션에 캐시 정책을 지정해보자

스프링 MVC에서 캐시 정책을 지정하는 방법을 알아보았다. 이제는 실제로 캐시 정책을 지정해보도록 하겠다.

먼저, `캐시 정책을 지정하기 위한 샘플 애플리케이션`은 다음과 같이 구성된다.

**/**
index.html으로 렌더링한 페이지를 응답한다.

**/main**
main.html으로 렌더링한 페이지를 응답한다.

**/api/users**
샘플 애플리케이션의 사용자 목록을 응답하는 API으로 JSON 형식으로 응답된다.

**/resources/index.js**
/resources/index.js 경로로 index.js라는 정적 리소스를 응답한다.

인터셉터에서는 `Cache-Control` 헤더를 지정하지 않고 응답하기전에 `Cache-Control`의 헤더를 확인만 한다.

```java
Configuration
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer {
    private static final Logger console = LoggerFactory.getLogger(MvcConfig.class);

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(webContentInterceptor());
        registry.addInterceptor(new HandlerInterceptorAdapter() {
            @Override
            public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
                console.info("---- Cache-Control ----");
                console.info("request : {}", request.getHeader("Cache-Control"));
                console.info("response : {}", response.getHeader("Cache-Control"));
            }
        });
    }

    // Serve For Static Resources
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("classpath:/static/")
//                .setCachePeriod(3600)
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .resourceChain(true)
                .addResolver(new GzipResourceResolver())
                .addResolver(new PathResourceResolver());
    }

    // Serve For Dynamic Response
    @Bean
    public WebContentInterceptor webContentInterceptor() {
        WebContentInterceptor webContentInterceptor = new WebContentInterceptor();
        webContentInterceptor.addCacheMapping(CacheControl.noStore().mustRevalidate().proxyRevalidate().cachePrivate(), "/api/**");
//        webContentInterceptor.addCacheMapping(CacheControl.noCache(), "/main/**");
        webContentInterceptor.addCacheMapping(CacheControl.noStore(), "/main/**");
        return webContentInterceptor;
    }
}
```

### index.html의 캐시 정책

동적 리소스인 index.html은 아무런 캐시 전략을 설정하지 않았다.

![](/images/spring/index-public.png)

index.html을 응답받은 브라우저는 응답 헤더에 `Cache-Control`이 없으므로 스스로 판단하여 캐시 정책을 설정하게 된다.

다음은 `/`에서 `/main`으로 이동한 뒤에 브라우저의 뒤로가기 기능으로 `/`로 되돌아 갔을 때의 `index.html`의 응답 헤더이다.

![](/images/spring/index-disk-cache.png)

브라우저는 `from disk cache` 디스크에 저장된 캐시 파일로 index.html을 보여주고 있다.

### main.html의 캐시 정책

`동적 리소스`인 main.html은 `no-store` 캐시 정책을 설정하였다.

브라우저는 main.html에 대하여 캐시 정책을 세우지 않고 매번 서버에 요청한다.

![](/images/spring/main-no-store.png)

### index.js의 캐시 정책

index.js와 같은 정적 리소스의 경우에는 `ResourceHandlerRegistry`에서 캐시 정책을 지정할 수 있다. `ResourceHandlerRegistry.setCacheControl`으로 `CacheControl.maxAge(1, TimeUnit.HOURS)`을 지정하여 index.js의 캐시 기간은 1시간이 된다.

![](/images/spring/index-js-memory-cache.png)

위 처럼 `max-age`를 설정하면 해당 리소스의 `Last-Modified 헤더`에 따라 캐시할 기간이 설정되어지며 기간이 지났으면 다시 서버에서 요청한다.

## 참조

-   [Cache-Control](https://www.incapsula.com/cdn-guide/glossary/cache-control.html)
