---
title: Setting the Cache-Control policy in the Spring Framework
date: 2018-06-09 21:21:18
categories: [끄적끄적, 자바]
tags:
banner:
 url: https://hue9010.github.io/images/header/java-spring-logo.png
---

## The Cache-Control Header  
> Cache-Control 헤더는 서버와 브라우저 사이의 캐시 정책이라고 할 수 있습니다. 이 헤더값에 따라서 브라우저가 해당 파일을 캐시할 수 있느냐 없느냐, 언제 다시 갱신해서 가져오느냐를 결정할 수 있습니다.  

### Cache-Control: no-cache VS no-store  
> no-cache와 no-store의 차이점을 이해하는게 이 포스트의 핵심입니다.  

`no-cache`  
no-cache는 브라우저는 서버의 응답을 캐시할지를 스스로 결정할 수 있습니다. 하지만, 캐시된 정보가 해당 서버에서 제공한 것인지는 요청을 하게 됩니다.  

`no-store`  
no-store는 브라우저가 서버의 응답을 캐시하지 못하도록 합니다. 반드시 매번 서버에 요청해야 한다는 의미입니다.  


## What mistake did I make  
> 사건의 발단은 진행했던 프로젝트가 [GS인증](https://www.swit.or.kr/GOODSW/gsauthen/introBiz.do)을 받고나서 였습니다. 테스트 결과서에 로그아웃 기능에 대한 오류가 있다는 것입니다. ㅡ3ㅡ? 로그인 후 페이지를 이용한 후 로그아웃을 한다음 뒤로가기 버튼으로 계속 서비스를 이용할 수 있다는 것 입니다.  

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

    @Bean
    public GTemplateResolver templateResolver() {
        GTemplateResolver templateResolver = new GTemplateResolver();
        templateResolver.setPrefix("classpath:/templates/");
        templateResolver.setCacheable(false);
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode("HTML5");
        templateResolver.setCharacterEncoding("UTF-8");
        templateResolver.setOrder(1);
        return templateResolver;
    }

    @Bean
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver());
        return templateEngine;
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


위는 기존에 프로젝트에 설정되어있던 캐시 관련 부분입니다. 나머지는 불필요한 코드이기 때문에 표현하지 않았습니다.  

브라우저 캐시에 대해서 아무런 지식이 없었기에 도대체 브라우저가 왜 해당 페이지를 캐시하는지 이해할 수가 없었습니다.

- [browser가 caching 하지 않게 하는 http header](https://www.lesstif.com/pages/viewpage.action?pageId=20775788)  
- [Internet Explorer에서 캐싱을 방지하는 방법](https://support.microsoft.com/ko-kr/help/234067/how-to-prevent-caching-in-internet-explorer)  
- [더 빠른 웹을 위하여 - 웹 캐쉬](http://cyberx.tistory.com/9)  

위 글들에 따라 응답 헤더를 보도록 합시다.  

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

스프링에서 브라우저 캐시와 관련된 정보를 검색하다보면 위와 같이 이용하는 것을 많이 찾을 수 있습니다. 그런데 스프링 프레임워크에서 캐시 전략을 적용하기 위해서는 WebContentInterceptor라는 것을 활용해야 합니다...  

> 아주 의미없는 행위는 아니지만 Cache-Control 헤더에 대해서는 WebContentInterceptor를 따릅니다.  

하지만 저희 프로젝트에는 이미 WebContentInterceptor가 등록되어 있었습니다. 더구나 `setCacheSeconds`에 0을 지정하고 있습니다.
> setCacheSeconds(int seconds) in WebContentGenerator.java  
> Cache content for the given number of seconds, by writing cache-related HTTP headers to the response: seconds == -1 (default value): no generation cache-related headers seconds == 0: "Cache-Control: no-store" will prevent caching seconds > 0: "Cache-Control: max-age=seconds" will ask to cache content

-1이면 캐시 관련 헤더를 만들지 않으며 0일 경우에는 Cache-Control 헤더에 no-store를 지정한다고 합니다.  

그럼 도대체 무엇 때문에 캐시를 했던 것일까요?  

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

HTTP/1.1이면 Cache-Control에 no-cache 전략을 지정한다?... 잘못된 코드가 맞습니다. Cache-Control은 HTTP/1.1 스펙이니까요 많은 예제들이 잘못된 코드를 사용하고 있던 것입니다. 그리고 모든 요청에 대해서 Cache-Control을 지정하는 것이 아니고 요청에 따라 구분해서 적용해야 하는게 맞습니다.  

> Pragma : no-cache 도 HTTP/1.0의 표준 스펙은 아닙니다. 다만, Cache-Control을 지원하지 않으므로 대안으로 사용하는 것 입니다.

그러므로 스프링은 WebContentInterceptor을 제공하고 캐시 전략을 등록하게 도와주는 것입니다. 최종적으로 WebContentInterceptor에 의해 캐시 방지 처리된 페이지 결과는 다음과 같습니다.

`Chrome`  
```
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
```
Cache-Control: no-store, must-revalidate, proxy-revalidate
Connection: keep-alive
Content-Language: ko
Content-Length: 2049
Content-Type: text/html; charset=UTF-8
Date: Sat, 09 Jun 2018 08:24:47 GMT
Server: nginx/1.10.3
X-Application-Context: application:production:5000
```

> WebContentInterceptor.setCacheMappings(Properties cacheMappings) 또는 WebContentInterceptor.addCacheMapping(CacheControl cacheControl,
                            String... paths)을 이용하면 Path에 따라 캐시 전략을 세울 수 있습니다.  



## Java Configuration For Cache-Control
Cache-Control에 대해서 알아보았으니 이제는 샘플 애플리케이션을 만들어 어떻게 설정하는게 좋을지 확인해보겠습니다.

샘플 애플리케이션은
/ => index.html, /main => main.html
/api/users => JSON
/resources/index.js => Static Resources
으로 아주 간단하게 구성하였습니다.

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

### / => index.html  
> index.html은 아무런 캐시 전략을 설정하지 않았습니다.

![](/images/spring/index-public.png)

index.html을 처음 응답받을 때 Cache-Control이 포함되어 있지 않으므로 브라우저는 이 파일에 대해서 캐시를 하여 서버로의 요청을 줄이고 캐시된 파일을 제공하려고 할 것입니다.  

![](/images/spring/index-disk-cache.png)  

위 경우는 / 에서 /main으로 이동한 뒤 브라우저의 뒤로가기 기능을 통해 다시 / 로 갔을 때의 index.html의 응답 헤더입니다. `from disk cache` 디스크에 저장된 캐시 파일을 제공했다는 것이죠  

### /main => main.html  
> main.html은 no-store 캐시 전략을 설정하였습니다.

![](/images/spring/main-no-store.png)  

이후 브라우저는 이 파일에 대해서 캐시를 하지않고 무조건 다시 서버에 요청해서 응답받습니다.

### /resouces/index.js => index.js
> index.js는 max-age 캐시 전략을 설정하였습니다.  

![](/images/spring/index-js-memory-cache.png)  

위 처럼 max-age를 설정하면 해당 리소스의 Last-Modified 헤더에 따라 캐시할 기간이 설정되어지며 기간이 지났으면 다시 서버에서 요청하여 제공합니다.  

## Reference  
- [Cache-Control](https://www.incapsula.com/cdn-guide/glossary/cache-control.html)  
- []()
