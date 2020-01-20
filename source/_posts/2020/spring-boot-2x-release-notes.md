---
    title: 스프링 부트 2.X 릴리즈 노트
    date: 2020-01-19
    categories: [개발 이야기]
---

[스프링 부트 1.5.4에서 2.0으로 마이그레이션 하기](https://kdevkr.github.io/archives/2020/spring-boot-2.0-migration-from-1.5.4/)에 이어서 번외편으로 스프링 부트 2.X의 릴리즈 노트와 함께 가이드 문서를 확인해보고자 합니다.

### 2.0
리액티브 스택을 통한 비동기 및 논-블로킹 API를 지원하며 액추에이터와 관련된 부분이 많이 변경되었습니다.

- [리액티브 스택](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html) 지원 (WebFlux)
- WebFlux를 위한 Embedded Netty Server
- [HTTP/2](https://developers.google.com/web/fundamentals/performance/http2?hl=ko) 지원 (JDK 8 제외) - Undertow 1.4.0+ 또는 Tomcat 9+ with JDK9
- 새로운 `Binder` API 지원 및 프로퍼티 바인딩 매커니즘 수정
- Spring Boot’s Gradle plugin has been largely rewritten to enable a number of significant improvements.
- 액추에이터 앤드포인트 개선
    - There have been many improvements and refinements to the actuator endpoints with Spring Boot 2.0. All HTTP actuator endpoints are now exposed under the /actuator path and resulting JSON payloads have been improved.
    - The JSON payloads returned from many endpoints have been improved with Spring Boot 2.0.
        - Extensive REST API documentation is now also generated using Spring REST Docs and published with each release.
    - 자체 Metrics API가 아닌 [micrometer.io](https://micrometer.io/) 사용
    - Spring Session users can now find and delete sessions via the sessions actuator endpoint.
    - The loggers actuator endpoint now allows you to reset a logger level to its default.
    - Scheduled tasks (i.e. @EnableScheduling) can be be reviewed using the scheduledtasks actuator endpoint.

- The default database pooling technology in Spring Boot 2.0 has been switched from Tomcat Pool to HikariCP. We’ve found that Hakari offers superior performance, and many of our users prefer it over Tomcat Pool.
- The JdbcTemplate that Spring Boot auto-configures can now be customized via spring.jdbc.template properties. Also, the NamedParameterJdbcTemplate that is auto-configured reuses the JdbcTemplate behind the scenes.
- When using an embedded container, the context path is logged alongside the HTTP port when your application starts.
    - Tomcat started on port(s): 8080 (http) with context path '/foo'
- Web filters are now initialized eagerly on all supported containers.
- A new spring-boot-starter-json starter gathers the necessary bits to read and write JSON. It provides not only jackson-databind, but also useful modules when working with Java8: jackson-datatype-jdk8, jackson-datatype-jsr310 and jackson-module-parameter-names. This new starter is now used where jackson-databind was previously defined.
    - If you prefer something other than Jackson, our support for GSON has been greatly improved in Spring Boot 2.0.
- Auto-configuration support is now include for the Quartz Scheduler. ou can use in-memory JobStores, or a full JDBC-based store. All JobDetail, Calendar and Trigger beans from your Spring application context will be automatically registered with the Scheduler.
    - https://docs.spring.io/spring-boot/docs/2.0.x/reference/htmlsingle/#boot-features-quartz
- @ConditionalOnBean now uses a logical AND rather than a logical OR when determining whether or not the condition has been met.
- 움직이는 ASCII 아트 지원 (ex. animated GIF banners)
  ![](https://github.com/spring-projects/spring-boot/wiki/images/animated-ascii-art.gif)





### 2.1
Spring Boot 2.0에서 지원 중단되는 것들이 제거되었습니다.

https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.1-Release-Notes

- Java 11 Support
- 스프링 프레임워크 5.1
- Bean overriding has been disabled by default to prevent a bean being accidentally overridden. If you are relying on overriding, you will need to set spring.main.allow-bean-definition-overriding to true.
- Exclusions are now applied consistently rather than only being applied locally. This applies to any exclusion defined on @EnableAutoConfiguration, @SpringBootApplication, @ImportAutoConfiguration or the spring.autoconfigure.exclude property.
- If spring-security is on the classpath without any security configuration, /info and /health are now exposed publicly for consistency. If you have spring-security on your classpath and do not provide any security configuration, you will need to explicitly secure them.
- HttpPutFormContentFilter has been deprecated in favor of FormContentFilter. As a result the spring.mvc.formcontent.putfilter.enabled property is no longer defined. If you were using this feature, please update to spring.mvc.formcontent.filter.enabled.
- Dependency management for json-simple is no longer provided and the JsonParser implementation using it has been removed.
- Spring Boot 2.1 has upgraded to Lombok 1.18.x from 1.16.x. In 1.18, Lombok will no longer generate a private, no-args constructor by default. It can be enabled by setting lombok.noArgsConstructor.extraPrivate=true in a lombok.config configuration file.
- 내장 웹 서버의 일관된 HTTP 헤더 사이즈 (8kB)
- Profile matching has been improved to support an expression format. For instance production & (us-east | eu-central) indicates a match if the production profile is active and either the us-east or eu-central profiles are active.
- Spring Boot now provides auto-configuration for ThreadPoolTaskExecutor. If you are using @EnableAsync, your custom TaskExecutor can be removed in favor of customizations available from the spring.task.execution namespace. Custom ThreadPoolTaskExecutor can be easily created using TaskExecutorBuilder.
- Similarly to the new task execution support, Spring Boot auto-configures a ThreadPoolTaskScheduler when @EnableScheduling is specified. The task scheduler can be customized using the spring.task.scheduling namespace. A TaskSchedulerBuilder is also available by default.
- Logger groups can be defined to allow related loggers to be configured in one go.
```
# define the group
logging.group.tomcat=org.apache.catalina, org.apache.coyote, org.apache.tomcat

# use the group (possibly in a different configuration file)
logging.level.tomcat=TRACE
```
- Spring Data includes repository support for JDBC and will automatically generate SQL for the methods on CrudRepository. Spring Boot will auto-configure Spring Data’s JDBC repositories when the necessary dependencies are on the classpath. They can be added to your project with a single dependency on spring-boot-starter-data-jdbc.
- As an alternative option to Jest, auto-configurations for RestClient and RestHighLevelClient are provided with configurable options from the spring.elasticsearch.rest.* namespace.
- Auto-configuration exclusions are now applied consistently.
- HiddenHttpMethodFilter can be disabled using a property
- Error page shows stacktraces when Devtools is in use.
- 

#### Deprecations in Spring Boot 2.1

- Methods used to set a data size using int have been deprecated and replaced with variants that take a DataSize.
- REQUEST_WRAPPER_FILTER_MAX_ORDER in AbstractFilterRegistrationBean and FilterRegistrationBean have been replaced by OrderedFilter.REQUEST_WRAPPER_FILTER_MAX_ORDER.

### 2.2
https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.2-Release-Notes

- Java 13 support
- Actuator HTTP Trace and Auditing are disabled by default
- Tomcat’s MBean Registry
- HttpHiddenMethodFilter disabled by default
- Health Indicator
- Health Endpoint JSON
- Performance improvements
    - Startup time and memory usage have been reduced by making use of proxyBeanMethods=false in Spring Boot’s @Configuration classes.
    - When launching an application at development time with bootRun in Gradle or spring-boot:run in Maven, the JVM will be configured with flags (-Xverify:none and -XX:TieredStopAtLevel=1) to optimise it for reduced launch time. 
    - Time taken to bind large numbers of configuration properties has been significantly reduced
    - Injection points in auto-configurations have been refined to only apply when a bean has to be created
    - Beans related to Actuator endpoints are now only created if the endpoint is both enabled and exposed (via JMX or HTTP)
    - Tomcat’s MBean Registry has been disabled by default, reducing Tomcat’s memory footprint by approximately 2MB
- Lazy initialization
    - It is now possible to enable global lazy initialization to reduce startup time via the spring.main.lazy-initialization property
        - Handling of HTTP requests may take longer while any deferred initialisation occurs
        - Failures that would normally occur at startup will now not occur until later
- Shutdown configuration of task execution and scheduling
- Configuration properties now support constructor-based binding, which allows a @ConfigurationProperties-annotated class to be immutable. Constructor-based binding can be enabled by annotating a @ConfigurationProperties class or one of its constructors with @ConstructorBinding.
- The ApplicationContextRunner test utility now allows to register bean inline
- Plain text support for Thread dump endpoint
- The build info goal has an extra time property that allows to configure how build.time is handled. It can be disabled completely or set to a fixed time to make the output of build.properties repeatable.
- A HealthIndicator is now provided for Hazelcast.
- It is now possible to track the total size of a connection pool by tracking the size and idle metrics.
- It is now possible to organize health indicators into groups
- The sanitization performed by the configprops and env endpoints has been improved to include URI properties. Any password found in the URI’s user information will now be sanitized.
- YAML configuration can now use on or off for boolean types.
- Support for Spring Session’s flush mode.
- Dependency management for Oracle’s JDBC driver has been added.
- Joda time support is deprecated in favour of java.time.
- ApplicationHealthIndicator in favour of PingHealthIndicator that is always contributed.