---
    title: Gradle과 함께 스프링 프레임워크 프로젝트 구성하기
    date: 2019-01-31
    categories: [개발 이야기, 그래들, 스프링]
    banner:
        url: https://cdn.greenhouse.io/external_greenhouse_job_boards/logos/000/001/539/original/Logo_einfarbig_40_KB_Gradle-145_2x.png?1490258779
---

Gradle로 프로젝트를 만들고 스프링 프레임워크 환경을 넣어 임베디드 톰캣으로 프로젝트를 구동해보고자 한다.

본 내용은 인턴에게 스프링에 대하여 알려주기 위한 세미나를 준비하기 위한 목적으로 작성하였다.

## 새 그래들 프로젝트

`인텔리제이`로 스프링 프레임워크를 선택해서 프로젝트를 만들게 되면 `메이븐`과 `XML` 기반으로 구성하여 해준다.

프로젝트 관리 도구로 `그래들`을 사용하면서 자바 기반의 스프링 프레임워크 환경을 넣어보고자 한다.

일단 먼저 `그래들 프로젝트`를 만들어야 한다.

다음처럼 프로젝트를 만들때 그래들을 선택하자.

![](/images/internship/01.png)

### 프로젝트 모듈 디렉토리

잠깐, 프로젝트에 대한 `src/main/java`와 `src/test/java`와 같은 모듈 디렉토리가 없을 수 있다.

이럴 때 `Preference`에서 `Gradle` 찾아 `Create directories for empty content roots automatically`를 활성화하면 `프로젝트 루트`에 모듈 디렉토리가 없을 경우 자동으로 만들어준다.

![](/images/internship/02.png)

### 그래들 프로젝트 구조

이제 그래들 프로젝트 구조는 다음과 같을 것이다.

![](/images/internship/03.png)

## 스프링 프레임워크 구성

이제 프로젝트에 스프링 프레임워크 환경을 넣어보자.

### 스프링 프레임워크 추가

`build.gradle`의 의존성 항목에 `스프링 MVC 3.4.8.RELEASE`를 추가하자.

```groovy
dependencies {
    implementation 'org.springframework:spring-webmvc:4.3.8.RELEASE'
}
```

#### Spring MVC Configuration

`web.xml` 역할을 하는 `WebApplicationInitializer`를 구현해서 `DispatcherServlet`을 등록하고

`JSP 템플릿`을 처리할 수 있는 `뷰 리졸버`를 빈으로 등록하자.

```java
@EnableWebMvc
@ComponentScan(basePackages = "com.demo.app")
@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter implements WebApplicationInitializer {

    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("resources/templates/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }

    @Override
    public void onStartup(ServletContext servletContext) {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.setConfigLocation("com.demo.app.config");
        servletContext.addListener(new ContextLoaderListener(context));
        ServletRegistration.Dynamic dispatcher = servletContext.addServlet("dispatcherServlet", new DispatcherServlet(context));
        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/");
    }
}
```

#### HomeController

인덱스 페이지를 처리하는 `HomeController`를 빈으로 등록하자.

위에서 `@ComponentScan` 어노테이션을 통해 `@Controller`만 명시해도 컨트롤러 빈으로 등록해주게 되었다.

```java
@Controller
public class HomeController {

    @GetMapping
    public String index() {
        return "index";
    }
}
```

## 톰캣

스프링 부트 프로젝트가 아니고서야 기본적으로 내장된 톰캣으로 바로 서버를 구동시킬 수 없다.

일반적으로는 톰캣을 설치하고 `Edit Configurations...`를 통해 톰캣 서버로 실행할 수 있는 환경을 추가해야한다.

![](/images/internship/10.png)

### 임베디드 톰캣

아파치는 톰캣을 설치하지 않고도 구동할 수 있도록 [`Tomcat Embed`](https://mvnrepository.com/artifact/org.apache.tomcat.embed/tomcat-embed-core/9.0.14)를 제공한다.

```groovy
compile group: 'org.apache.tomcat.embed', name: 'tomcat-embed-core', version: '9.0.14'
compile group: 'org.apache.tomcat.embed', name: 'tomcat-embed-jasper', version: '9.0.14'
```

그래들로 위 라이브러리들을 임포트했다면 `Application.java`를 만들어 톰캣을 구동시키도록 작성하자.

```java
public class Application {

    public static void main(String[] args) throws LifecycleException {
        Tomcat tomcat = new Tomcat();
        Connector connector = tomcat.getConnector();
        connector.setURIEncoding("UTF-8");

        tomcat.addWebapp("/", new File("src/main").getAbsolutePath());

        tomcat.setPort(8080);
        tomcat.start();
        tomcat.getServer().await();
    }
}
```

이제 `Application.java`를 실행하면 다음 로그처럼 `톰캣`이 구동된다.

```java
2월 01, 2019 9:38:55 오후 org.apache.catalina.core.StandardContext setPath
경고: A context path must either be an empty string or start with a '/' and do not end with a '/'. The path [/] does not meet these criteria and has been changed to []
2월 01, 2019 9:38:55 오후 org.apache.coyote.AbstractProtocol init
정보: Initializing ProtocolHandler ["http-nio-8080"]
2월 01, 2019 9:38:55 오후 org.apache.catalina.core.StandardService startInternal
정보: Starting service [Tomcat]
2월 01, 2019 9:38:55 오후 org.apache.catalina.core.StandardEngine startInternal
정보: Starting Servlet engine: [Apache Tomcat/9.0.14]
2월 01, 2019 9:38:55 오후 org.apache.catalina.startup.ContextConfig getDefaultWebXmlFragment
정보: No global web.xml found
2월 01, 2019 9:38:57 오후 org.apache.jasper.servlet.TldScanner scanJars
정보: At least one JAR was scanned for TLDs yet contained no TLDs. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JARs during scanning can improve startup time and JSP compilation time.
2월 01, 2019 9:38:57 오후 org.apache.catalina.core.ApplicationContext log
정보: 1 Spring WebApplicationInitializers detected on classpath
2월 01, 2019 9:38:58 오후 org.apache.catalina.core.ApplicationContext log
정보: Initializing Spring root WebApplicationContext
2월 01, 2019 9:38:58 오후 org.springframework.web.context.ContextLoader initWebApplicationContext
정보: Root WebApplicationContext: initialization started
2월 01, 2019 9:38:58 오후 org.springframework.web.context.support.AnnotationConfigWebApplicationContext prepareRefresh
정보: Refreshing Root WebApplicationContext: startup date [Fri Feb 01 21:38:58 KST 2019]; root of context hierarchy
2월 01, 2019 9:38:58 오후 org.springframework.web.context.support.AnnotationConfigWebApplicationContext loadBeanDefinitions
정보: Found 1 annotated classes in package [com.demo.app.config]
2월 01, 2019 9:38:58 오후 org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping register
정보: Mapped "{[],methods=[GET]}" onto public java.lang.String com.demo.app.controller.HomeController.index()
2월 01, 2019 9:38:58 오후 org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter initControllerAdviceCache
정보: Looking for @ControllerAdvice: Root WebApplicationContext: startup date [Fri Feb 01 21:38:58 KST 2019]; root of context hierarchy
2월 01, 2019 9:38:58 오후 org.springframework.web.context.ContextLoader initWebApplicationContext
정보: Root WebApplicationContext: initialization completed in 528 ms
2월 01, 2019 9:38:58 오후 org.apache.catalina.core.ApplicationContext log
정보: Initializing Spring FrameworkServlet 'dispatcherServlet'
2월 01, 2019 9:38:58 오후 org.springframework.web.servlet.DispatcherServlet initServletBean
정보: FrameworkServlet 'dispatcherServlet': initialization started
2월 01, 2019 9:38:58 오후 org.springframework.web.servlet.DispatcherServlet initServletBean
정보: FrameworkServlet 'dispatcherServlet': initialization completed in 13 ms
2월 01, 2019 9:38:58 오후 org.apache.coyote.AbstractProtocol start
정보: Starting ProtocolHandler ["http-nio-8080"]
```

정말 구동되어 서버가 JSP를 처리할 수 있을까?

`http://localhost:8080/`으로 접속해보자.

![](/images/internship/11.png)

그래들 프로젝트에 스프링 프레임워크를 넣고 임베디드 톰캣으로 서버를 구동해보았다.

이제

## 참고

-   [Java Configuration](https://github.com/kdevkr/spring-demo-configuration/tree/master/spring-demo-java)
-   [How do I embed Tomcat in a Spring Framework MVC application?](https://stackoverflow.com/questions/45169586/how-do-i-embed-tomcat-in-a-spring-framework-mvc-application)
