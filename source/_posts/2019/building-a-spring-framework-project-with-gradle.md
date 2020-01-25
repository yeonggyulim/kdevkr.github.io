---
    title: Gradle과 함께 스프링 프레임워크 프로젝트 구성하기
    date: 2019-02-01
    categories: [개발 이야기, 그래들, 스프링]
    banner:
        url: https://cdn.greenhouse.io/external_greenhouse_job_boards/logos/000/001/539/original/Logo_einfarbig_40_KB_Gradle-145_2x.png?1490258779
---

Gradle Project를 만들어 스프링 웹 MVC 애플리케이션을 구성하고 톰캣으로 웹 애플리케이션을 구동해보자.

## 그래들 프로젝트 만들기

`인텔리제이`로 스프링 프레임워크를 선택해서 프로젝트를 만들게 되면 `메이븐`과 `XML` 기반으로 구성된다.

이렇게 하지 않고 프로젝트 관리 도구로 `그래들`을 사용하면서 스프링 웹 MVC 애플리케이션을 구성하자.

일단 먼저 `그래들 프로젝트`를 만들어야 한다.

![](/images/internship/01.png)

### 웹 애플리케이션 디렉토리 구조
일반적인 자바 웹 애플리케이션 구조는 다음과 같다.

![](/images/internship/03.png)

그런데 그래들 프로젝트를 만들면 프로젝트 구조에 `src/main/java`와 `src/test/java`와 같은 모듈 디렉토리가 없을 수 있다.

이럴 때 `Preference`에서 `Gradle` 찾아 `Create directories for empty content roots automatically`를 활성화하면 `프로젝트 루트`에 모듈 디렉토리가 없을 경우 자동으로 만들어준다.

![](/images/internship/02.png)

#### webapp
webapp 디렉토리는 웹 애플리케이션의 특별한 폴더이다. 

`src/main/webapp` 디렉토리를 만들자.

그리고 그 안에 `WEB-INF` 폴더 까지 만들자

![](/images/internship/03.png)

## Spring Web MVC

이제 프로젝트에 스프링 웹 애플리케이션을 만들어보자.

### 라이브러리 의존성

`build.gradle`의 의존성 항목에 `Spring Web MVC 3.4.8.RELEASE`를 추가하자.

```groovy
dependencies {
    implementation 'org.springframework:spring-webmvc:4.3.8.RELEASE'
    providedCompile 'javax.servlet:javax.servlet-api:4.0.1'
}
```

### Spring MVC Architecture
스프링 웹 MVC의 구성은 다음과 같다.

![](https://docs.spring.io/spring/docs/4.3.22.RELEASE/spring-framework-reference/htmlsingle/images/mvc.png#center)

모든 요청에 대하여 우선적으로 받는 `DispatcherServlet`(위 그림에서 FrontController)를 서블릿 컨텍스트에 등록해야하고 톰캣이 그 컨텍스트로 서버를 동작시킨다.

톰캣은 `web.xml`이라는 배포 서술자에 따라 서버를 동작시키는데 스프링은 `WebApplicationInitializer`의 구현체로 그 역할을 대신할 수 있게 해준다.

#### WebApplicationInitializer
`WebApplicationInitializer` 구현체를 만들면 코드 기반 설정을 감지하고 자동으로 서블릿 3+ 컨테이너를 초기화한다. 여기에 `DispatcherServlet`을 ServletContext에 등록하자.

```java
public class MyWebApplicationInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext container) {
        // 
    }
}
```

#### DispatcherServlet


```java
public class MyWebApplicationInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext container) {
        ServletRegistration.Dynamic registration = container.addServlet("dispatcher", new DispatcherServlet());
        registration.setLoadOnStartup(1);
        registration.addMapping("/");
    }
}
```

기본 DispatcherServlet을 등록하고 톰캣을 통해 서버를 실행시키면 다음과 같은 오류를 내뿜으며 실행이 되지 않는다.

```java
org.apache.catalina.core.StandardContext loadOnStartup
심각: Servlet [dispatcher] in web application [] threw load() exception
java.io.FileNotFoundException: Could not open ServletContext resource [/WEB-INF/dispatcher-servlet.xml]
```

기본으로 `WEB-INF` 디렉토리에 있는 `[servlet-name]-servlet.xml`파일을 읽어 초기화하도록 되어있기 때문이다.

그래서 우리는 애플리케이션 컨텍스트를 만들어 디스패쳐 서블릿에 넣어주자.

```java
AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
context.scan("com.demo.app");

ServletRegistration.Dynamic dispatcher = servletContext.addServlet("dispatcher", new DispatcherServlet(context));
dispatcher.setLoadOnStartup(1);
dispatcher.addMapping("/");
```

그러면 아래와 같이 디스패처 서블릿이 `독립적인 서블릿 웹 컨텍스트`를 가진다.

![](https://docs.spring.io/spring/docs/4.3.22.RELEASE/spring-framework-reference/htmlsingle/images/mvc-context-hierarchy.png)

위 그림에서 확인할 수 있듯이 독립적인 서블릿 웹 컨텍스트를 가지므로 다른 스프링 모듈(스프링은 모듈간 결합이 가능하다)에서 서블릿 웹 컨텍스트에 등록되어 `관리되는 빈들을 공유할 수 없다`.

스프링은 각 `애플리케이션 컨텍스트(빈 팩토리)`의 빈들을 공통으로 관리할 수 있도록 `ContextLoader`를 제공한다.

`ContextLoaderListener`로 애플리케이션 컨텍스트를 등록하고 서블릿 컨텍스트에 이 리스너를 추가하자.

```java
AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
context.setConfigLocation("com.demo.app");
servletContext.addListener(new ContextLoaderListener(context));
        
ServletRegistration.Dynamic dispatcher = servletContext.addServlet("dispatcher", new DispatcherServlet(context));
dispatcher.setLoadOnStartup(1);
dispatcher.addMapping("/");
```

### Spring MVC Configuration
서블릿 컨테이너에 디스패쳐 서블릿까지 등록했으면 스프링 웹 MVC를 활성화해야한다.

#### @EnableWebMvc
스프링 웹 MVC는 간단하게 @Configuration가 명시된 설정 클래스에 @EnableWebMvc 어노테이션을 명시하면 된다.


```java
@EnableWebMvc
@ComponentScan(basePackages = "com.demo.app")
@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.setConfigLocation("com.demo.app");
        servletContext.addListener(new ContextLoaderListener(context));
        
        ServletRegistration.Dynamic dispatcher = servletContext.addServlet("dispatcher", new DispatcherServlet(context));
        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/");
    }
}
```

#### @Controller
스프링 웹 MVC를 활성화 했으면 요청을 담당하는 컨트롤러를 `@Controller`를 명시해서 등록할 수 있다.

```java
@Controller
public class HomeController {

    @RequestMapping
    public String index(Model model) {
        model.addAttribute("message", "Hello");
        return "index";
    }
}
```

이 상태로 \"/\"에 접속해보자. 그러면 다음과 같이 `ViewResolver`를 설정하라고 알려준다.

#### ViewResolver
컨트롤러 내에 `@RequestMapping`이 붙은 메소드가 문자열을 응답하면 해당 이름을 가진 뷰로 응답하도록 처리된다.

그런데 위에서는 그 뷰를 처리할 수 있는 뷰 리졸버가 빈으로 등록되어 있지 않았던 것이다.

뷰 리졸버는 `InternalResourceViewResolver`, `FreemarkerViewResolver` 등 많은 종류가 있는데

우리는 JSP 템플릿을 처리하기 위해 사용하는 `InternalResourceViewResolver`를 등록해보자.

```java
@Bean
public InternalResourceViewResolver viewResolver() {
    InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
    viewResolver.setPrefix("/WEB-INF/views/");
    viewResolver.setSuffix(".jsp");
    return viewResolver;
}
```

## Run on Server

자바 웹 애플리케이션을 구동시키기 위해서는 톰캣같은 서블릿 엔진이 필요하다.

일반적으로는 톰캣을 설치하고 `Edit Configurations...`를 통해 톰캣 서버로 실행할 수 있는 환경을 추가해야한다.

![](/images/internship/10.png)

### 임베디드 톰캣

아파치는 굳이 톰캣을 설치하지 않고도 구동할 수 있도록 [`Tomcat Embed`](https://mvnrepository.com/artifact/org.apache.tomcat.embed/tomcat-embed-core/9.0.14)를 제공한다.

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

        tomcat.addWebapp("/", new File("src/main/webapp").getAbsolutePath());

        tomcat.setPort(8080);
        tomcat.start();
        tomcat.getServer().await();
    }
}

```

이제 `Application.java`를 실행하면 다음 로그처럼 `톰캣`이 구동된다.

```java
2월 09, 2019 8:07:13 오후 org.springframework.web.context.support.AnnotationConfigWebApplicationContext loadBeanDefinitions
정보: Found 2 annotated classes in package [com.demo.app]
2월 09, 2019 8:07:14 오후 org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping register
정보: Mapped "{[],methods=[GET]}" onto public java.lang.String com.demo.app.controller.HomeController.index(org.springframework.ui.Model)

2월 09, 2019 8:07:14 오후 org.springframework.web.servlet.DispatcherServlet initServletBean
정보: FrameworkServlet 'dispatcher': initialization completed in 14 ms
2월 09, 2019 8:07:14 오후 org.apache.coyote.AbstractProtocol start
정보: Starting ProtocolHandler ["http-nio-8080"]
```

정말 구동되어 서버가 JSP를 처리할 수 있을까?

`http://localhost:8080/`으로 접속해보자.

![](/images/internship/11.png)

## 참고

-   [Java Configuration](https://github.com/kdevkr/spring-demo-configuration/tree/master/spring-demo-java)
-   [How do I embed Tomcat in a Spring Framework MVC application?](https://stackoverflow.com/questions/45169586/how-do-i-embed-tomcat-in-a-spring-framework-mvc-application)
