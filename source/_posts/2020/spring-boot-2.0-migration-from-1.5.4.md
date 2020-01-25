---
    title: 스프링 부트 1.5.4에서 2.0으로 마이그레이션 하기
    date: 2020-01-21
    categories: [개발 이야기]
    tags: [스프링 부트, 마이그레이션, 삽질]
---

## 들어가며
현재 개발중인 프로젝트에서 JVM 기반으로 ES6 기반의 자바스크립트를 실행해야하는 요구사항이 있어 이를 지원하는 JDK 9 이상으로 자바 버전을 올려야하는 상황이 발생하였습니다. 😑

> [Nashorn JavaScript Engine in JDK 9](https://www.oracle.com/corporate/features/nashorn-javascript-engine-jdk9.html)에서 ES6 지원을 확인할 수 있습니다.
> 
> 좀 더 알아보니 OpenJDK에서는 Jashorn 엔진을 제외한다고 명시했습니다.
> \- https://openjdk.java.net/jeps/335
> 나중에는 [GraalVM의 GraalJS](https://github.com/graalvm/graaljs) 쪽으로 선회하는 방법이 좋겠습니다.


### 스프링 버전별 JDK 지원
일단 애플리케이션의 기반이 되는 스프링 부트 프레임워크의 버전별 JDK 지원 목록을 확인해야했습니다. JDK 9+를 사용해야하므로 최소한으로 지원하는 버전을 찾아야합니다.

다음은 제가 확인한 버전별 JDK 지원 현황입니다.

|Spring Boot Version|JDK|Compatible|
|---|---|---|
|1.5.9.RELEASE|Java 7|or Java 8|
|2.0.0.RELEASE|Java 8|or Java 9|
|2.1.1.RELEASE|Java 8|is compatible up to Java 11|
|2.1.7.RELEASE|Java 8|is compatible up to Java 12|
|2.2.0.RELEASE|Java 8|is compatible up to Java 13|

그렇다면 제 경우에는 최소한 스프링 부트 2.0.0.RELEASE로 버전을 업그레이드해야하는 상황이 생깁니다. 😱

> [GA 릴리즈](https://github.com/spring-projects/spring-boot/releases) 버전이 `2.1.12.RELEASE`와 `2.2.3.RELEASE`이 있으므로 이중에 선택하면 될것 같습니다.

## 마이그레이션 시작하기
마이그레이션은 `gradle`, `spring-boot`, `jdk` 세가지 영역으로 나누어 진행했습니다.

### Gradle ✅
먼저 진행한 영역은 Gradle입니다.

원래 사용하던 Gradle 버전은 3.5.1이었는데 [스프링 부트 2.X의 Gradle 지원 버전](https://docs.spring.io/spring-boot/docs/2.0.x/reference/htmlsingle/#build-tool-plugins-gradle-plugin)은 4.0+ 입니다.

#### Gradle 버전 업그레이드
gradle 명령 또는 버전을 명시해서 버전을 업그레이드 할 수 있습니다.

업그레이드할 Gradle 버전은 `5.6.4`입니다. 
[Gradle 릴리즈 노트](https://docs.gradle.org/5.6.4/release-notes.html)에 따르면 그루비 컴파일 속도가 빨라졌다고하여 4.10.3이 아닌 5.6.4로 결정하였습니다.

> 추후 문제가 발생하여 최종적으로는 6.1로 다시 업그레이드했습니다.
> 이에 대한 내용은 문제가 발생한 곳에서 설명하겠습니다.

**gradlew**
```sh
#gradle wrapper --gradle-version 5.6.4
gradlew wrapper --gradle-version 5.6.4
```

**gradle-wrapper.properties**
```properties
#distributionUrl=https\://services.gradle.org/distributions/gradle-3.5.1-all.zip
distributionUrl=https\://services.gradle.org/distributions/gradle-5.6.4-all.zip
#distributionUrl=https\://services.gradle.org/distributions/gradle-6.1-all.zip
```

##### 인텔리제이 Gradle 플러그인 충돌 ⚠️
인텔리제이 버전에서 Gradle Wrapper 버전을 올린 후 자체 Gradle 플러그인 버전과 충돌되는 문제가 있었습니다.
```sh
org.jetbrains.plugins.gradle.tooling.util.ModuleComponentIdentifierImpl.getModuleIdentifier()
```

[Intellij Platform SDK DevGuide / Build Number Ranges](http://www.jetbrains.org/intellij/sdk/docs/basics/getting_started/build_number_ranges.html)에서 192와 193 브랜치를 확인해보니 [192](https://github.com/JetBrains/intellij-community/blob/192/build/dependencies/gradle/wrapper/gradle-wrapper.properties)에서는 Gradle Wrapper가 4.10-all이고 [193](https://github.com/JetBrains/intellij-community/blob/193/build/dependencies/gradle/wrapper/gradle-wrapper.properties)에서 5.5-all로 변경되었습니다.

> 자체 Gradle Wrapper가 아닌 자체 Gradle 버전을 바라보는 것은 무슨 문제일까요?
> 이로 인해, 인텔리제이 커뮤니티 버전을 사용하는 분들께는 버전 업그레이드를 권고해드렸습니다.

##### Lombok Plugin
Gradle 5+부터는 빌드를 위해 `롬복` 플러그인을 사용하거나 `annotationProcessor`를 사용해야 합니다.

> https://projectlombok.org/setup/gradle

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("io.freefair.gradle:lombok-plugin:4.1.6")
    }
}

apply plugin: "io.freefair.lombok"
```

또는 직접 명시

```groovy
dependencies {
    compileOnly('org.projectlombok:lombok')
    annotationProcessor('org.projectlombok:lombok')
}
```

Gradle 버전을 업그레이드하여도 빌드 및 구동이 정상적으로 되니 다음 영역으로 넘어가겠습니다.

### Spring Boot ✅
이제 대망의 스프링 부트 프레임워크의 버전을 업그레이드할 차례입니다. 

두근두근 🤪
> 자 이제 시작이야. 내꿈을, 내꿈을 위한 여행. XXX.
> 찾아라 비밀의 열쇠, 미로같이 얽힌 모험들

#### 기존 애플리케이션 검토
먼저 기존 애플리케이션의 의존성을 간단하게 검토해보았습니다.

|이름|버전|비고|
|---|---|---|
|JDK|1.8|jdk8u232-b09|
|Gradle|~~3.5.1~~ 5.6.4||
|Spring Boot|1.5.4||
|Spring|4.3.7||
|Embed Tomcat|8.5.47||
|org.springframework.boot:spring-boot-gradle-plugin|1.5.7.RELEASE|   |
|io.spring.gradle:dependency-management-plugin|0.5.2.RELEASE|   |

> Gradle은 앞서 업그레이드하였으므로 반영하였습니다.

#### Spring Boot 2.0.X Migration ✅
마이그레이션 시 [Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)를 참고하였습니다.

> 이런 것 까지 준비해주시는 스프링 개발자분들 존경합니다 ㅠㅡㅠ.

##### 의존성 검토
스프링 부트 2.X는 1.5.X와 비교하여 `리액티브 스택`을 추가로 지원함에따라 패키지 구조와 구성을 위한 프로퍼티에 대한 변화가 많습니다. 그리고 스프링 부트에서 사용하는 여러가지 의존성의 버전이 업데이트되면서 사용자마다 사용하는 기술 스택에 대한 의존성 버전을 확인해야합니다.

- [1.5.X의 의존성 버전](https://docs.spring.io/spring-boot/docs/1.5.x/reference/html/appendix-dependency-versions.html)
- [2.0.X의 의존성 버전](https://docs.spring.io/spring-boot/docs/2.0.x/reference/html/appendix-dependency-versions.html)

|Group ID|Artifact ID|Version||
|---|---|---|---|
|com.fasterxml.jackson.core|jackson-core|2.8.11|2.9.8|
||jackson-databind|2.8.11.3|2.9.8|
|com.hazelcast|hazelcast|3.7.8|3.9.4|
||hazelcast-spring|3.7.8|3.9.4|
|com.google.code.gson|gson|2.8.5|2.8.5|
|com.zaxxer|HikariCP|2.5.1|2.7.9|
|commons-beanutils|commons-beanutils|1.9.3|X|
|commons-collections|commons-collections|3.2.2|X|
|javax.mail|javax.mail-api|1.5.6|1.6.2|
|javax.validation|validation-api|1.1.0.Final|2.0.1.Final|
|org.apache.httpcomponents|httpclient|4.5.9|4.5.8|
|org.apache.tomcat.embed|tomcat-embed-core|8.5.43|8.5.39|
|org.assertj|assertj-core|2.6.0|3.9.1|
|org.codehaus.groovy|groovy|2.4.17|2.4.16|
|org.elasticsearch|elasticsearch|2.4.6|5.6.16|
|org.elasticsearch.client|transport|X|5.6.16|
|org.hibernate|hibernate-validator|5.3.6.Final|6.0.16.Final|
||hibernate-validator-annotation-processor|5.3.6.Final|6.0.16.Final|
|org.postgresql|postgresql|9.4.1212.jre7|42.2.5|
|org.quartz-scheduler|quartz|X|2.3.1|
||quartz-jobs|X|2.3.1|
|org.reactivestreams|reactive-streams|X|1.0.2|
|org.springframework|spring-core|4.3.25.RELEASE|5.0.13.RELEASE|
|io.micrometer|micrometer-core|X|1.0.10|
|com.sun.mail|javax.mail|1.5.6|1.6.2|

> 간단하게 추렸는데도 꽤 많아보이네요

##### 프로퍼티 마이그레이터 설정
스프링 부트 2.0에서 많은 설정 프로퍼티가 변경, 삭제되어서 이를 업데이트해야합니다. 스프링 부트에서는 이 작업을 도와주기 위하여 `spring-boot-properties-migrator` 모듈을 제공합니다.

```groovy
dependencies {
    runtime("org.springframework.boot:spring-boot-properties-migrator")
}

// Once you’re done with the migration, please make sure to remove this module from your project’s dependencies.
```

위와 같이 설정하면 런타임 시에 애플리케이션 환경을 분석해주고 임시적으로 변경된 프로퍼티로 바꿔줍니다.

> 변경된 프로퍼티가 존재하면 WARN 레벨의 로그로 출력되며, 삭제된 프로퍼티를 사용하는 경우 ERROR 레벨의 로그를 출력합니다.

##### 변경사항 확인
릴리즈 노트를 통해서 무엇이 바뀌었는지 간단하게 확인하였습니다.

**_기본 데이터베이스 커넥션 풀이 Tomcat-JDBC에서 HikariCP로 변경되었습니다._**
> 기존에도 HikariCP를 사용하게 변경하여서 고려할 부분은 없었습니다.

**_리액티브 스택 지원으로 인한 의존성이 추가되어 임베디드 컨테이너 패키지가 광범위하게 리팩토링되었습니다._**
> Tomcat의 AJP 프로토콜 사용 설정을 위한 코드 변경이 필요했습니다.

**_액추에이터가 자체적인 매트릭 API이 아닌 Micrometer에 의존합니다._**
> Management 서버를 이용하지 않고 자체적으로 엔드포인트를 호출하여 사용했는데 이 엔드포인트에 대한 변경사항이 많아서 코드 로직을 다시 구현했습니다.

**_스프링 소셜에 대한 자동 구성이 제외되어 의존성 관리 목록에서 제거되었습니다._**
> 스프링 소셜 기능을 사용하지 않으므로 무시합니다.

**_레디스 드라이버로써 Jedis가 아닌 Lettuce를 사용합니다._**
> 리액티브 스택 지원을 위해 서블릿 기반의 Jedis가 아닌 Lettuce를 선택한 듯 보입니다.

**_엘라스틱서치가 5.4+으로 업그레이드 되었습니다. 엘라스틱에서 임베디드 엘라스틱을 더이상 지원하지 않으므로 NodeClient에 대한 자동 구성이 제외되었습니다._**
> 엘라스틱서치 7.3.2를 사용하고있어 의존성 버전을 고정했습니다.

```groovy
ext {
    set('elasticsearch.version', "7.3.2")
}
```

**_Spring Boot Gradle Plugin의 많은 부분이 개선되었습니다. 이제 의존성 관리 플러그인을 자동으로 적용하지 않으므로 이제 직접 명시해야 합니다._**  
```groovy
apply plugin: 'org.springframework.boot'
apply plugin: 'io.spring.dependency-management' 
```

- `bootRepackage` 태스크가 `bootJar`와 `bootWar`로 대체되었습니다. 더이상 `jar`와 `war` 태스크가 관여하지 않습니다.
- `BootRun`, `BootJar`, `BootWar` 태스크는 이제 메인 클래스 이름 설정을 위해 `mainClassName` 프로퍼티를 사용합니다.

**_ConditionalOnBean이 OR이 아닌 논리적 AND를 사용합니다._**
> @ConditionalOnBean 사용 시 조심해야겠네요

**_AOP 지원을 포함하여 기본적으로 CGLIB를 사용합니다._**
> 인터페이스 기반의 프록시가 필요하다면 spring.aop.proxy-target-class를 설정하면 되는데 @EnableAspectJAutoProxy(proxyTargetClass = true)를 명시해서 사용하고 있으므로 별다른 변경은 없어보입니다.

**_[완화된 바인딩과 관련하여 규칙이 강화](https://docs.spring.io/spring-boot/docs/2.0.9.RELEASE/reference/html/boot-features-external-config.html#boot-features-external-config-relaxed-binding)되었으며 새로운 구조로 대체되어 기존의 `org.springframework.boot.bind` 패키지를 더이상 이용할 수 없습니다._**
> 이로 인해 spring-boot-admin 1.5.7을 더이상 사용할 수 없었습니다.

##### 문제점 해결 ⚠️
업그레이드 후 발생한 문제점을 확인하고 해결해야합니다.

**프로퍼티 변경**
제외된 프로퍼티 또는 변경된 프로퍼티가 있으면 알려주므로 쉽게 변경하였습니다.

```properties
# server.contextPath=
server.servlet.context-path=

# server.session.timeout=
server.servlet.session.timeout=

# spring.http.multipart.max-file-size=
# spring.http.multipart.max-request-size=
spring.servlet.multipart.max-file-size=
spring.servlet.multipart.max-request-size=

# spring.datasource.jmx-enabled=
spring.datasource.tomcat.jmx-enabled=

# security.basic.enabled= # The security auto-configuation no longer custormizable
# security.oauth2.resource.filter-order= # The security auto-configuration no longer provide several security configurations
# security.user.name=
# security.user.password=
spring.security.user.name=
spring.security.user.password=

# endpotins.enabled=
# endpoints.info.enabled=
management.endpoints.enabled-by-default=
management.endpoint.info.enabled=

# management.context-path=
# management.security.enabled= a global security is auto-configuation is provided
# management.ssl.enabled=
management.server.servlet.context-path=
management.server.ssl.enabled=
```

**임베디드 톰캣 커스터마이저 코드 변경** 
임베디드 컨테이너 패키지가 리팩토링되어 기존의 톰캣 커스터마이즈를 위한 클래스를 변경해야합니다.

|Before|After|
|---|---|
|EmbeddedServletContainer|WebServer|
|org.springframework.boot.context.embedded|org.springframework.boot.web.server|
|EmbeddedServletContainerCustomizer|WebServerFactoryCustomizer|
|TomcatEmbeddedServletContainerFactory|TomcatServletWebServerFactory|
|EmbeddedServletContainerCustomizer|WebServerFactoryCustomizer\<TomcatServletWebServerFactory\>|

**Spring Boot Admin 의존성 변경**
[Relaxed Binding](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide#relaxed-binding)이 변경되면서 org.springframework.boot.bind의 RelaxedPropertyResolver가 삭제되었는데 spring-boot-admin:1.5.7에서 RelaxedPropertyResolver를 참조하므로 더이상 사용할 수 없게 되어 버전을 업그레이드 하였습니다.

```
Exception encountered during context initialization - 
cancelling refresh attempt: org.springframework.beans.factory.BeanDefinitionStoreException: Failed to process import candidates for configuration class [net.ion.VppApplication]; 

nested exception is java.lang.IllegalStateException: 
Could not evaluate condition on de.codecentric.boot.admin.client.config.SpringBootAdminClientAutoConfiguration due to org/springframework/boot/bind/RelaxedPropertyResolver not found. 

Make sure your own configuration does not rely on that class. 
This can also happen if you are @ComponentScanning a springframework package (e.g. if you put a @ComponentScan in the default package by mistake)
```

#### Spring Boot from 2.0.X to 2.1.X
2.0.0.RELEASE로 마이그레이션을 완료하였으며 다시 한번 2.1.X로 버전을 업그레이드 시도해보았습니다. 그 이유는 개발 시 활용하는 [HotswapAgent가 Java 8과 Java 11을 지원](http://hotswapagent.org/mydoc_quickstart-jdk11.html)하기 때문입니다.

> 물론, [openjdk-jdk9](https://github.com/HotswapProjects/openjdk-jdk9)과 [openjdk-jdk10](https://github.com/HotswapProjects/openjdk-jdk10)에 대한 시도는 있었던 것 같습니다.

하지만 정식으로 제공하는 것은 Java 8과 Java 11입니다.

결국 HotSwap 기능을 활성화하려면 JDK 11으로 빌드 및 구동할 수 있어야합니다. 앞서 알아본 스프링 버전별 JDK 지원 항목에 의해서 Java 11을 커버할 수 있는 2.1.1.RELEASE로 한 단계 더 업그레이드 하겠습니다.

##### 변경사항 확인  
이번에도 무엇이 바뀌었는지 확인하고 크게 바뀐 부분이 있는지 확인합니다.

**_이제 Java 11을 지원합니다._**
> 그래서 업그레이드를 시도하고 있죠

**_기본적으로 [빈 오버라이딩](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.1-Release-Notes#bean-overriding)을 허용하지 않도록 변경되었습니다._**
> 같은 유형의 빈을 다시 정의하는 것을 방지하는 기능인데 다시 정의하는 것들이 있어서 

**_자동 구성 제외에 대한 일관성을 제공합니다. `@EnableAutoConfiguration`, `@SpringBootApplication`, `@ImportAutoConfiguration` 또는 `spring.autoconfigure.exclude`로 정의합니다._**
> 다양항 방식으로 자동 구성을 끌 수 있겠네요

**_서블릿 패스 속성이 `server.servlet.path`에서 `spring.mvc.servlet.path`로 변경되었습니다._**
> 해당 프로퍼티를 사용하지 않아 문제가 없습니다.

**_웹 애플리케이션이 동작하는 동안의 디버그 로깅 출력이 개선되었습니다._**
> HTTP 처리 과정을 자세히 확인할 수 있을 듯 보입니다.

**_`HttpPutFormContentFilter`이 제외되었으며 `FormContentFilter`를 사용합니다. 따라서, `spring.mvc.formcontent.putfilter.enabled`는 더이상 정의할 수 없으며 `spring.mvc.formcontent.filter.enabled`으로 변경해야합니다._**

**_`json-simple`에 대한 의존성 관리가 제공되지않으며 `JsonParser` 구현체가 제거되었습니다._**

**_Lombok이 1.18.x로 변경되어 더 이상 프라이빗 빈 생성자를 생성하지 않습니다._**
> lombok.config의 lombok.noArgsConstructor.extraPrivate=true를 설정해야 합니다.

**_임베디드 웹 서버가 일관된 최대 HTTP 헤더 크기를 갖습니다._**
> (8kB, server.max-http-header-size)

**_컨텍스트 ApplicationConversionService을 지원합니다._**
> Environment와 BeanFactory에 ApplicationConversionService가 기본으로 등록됩니다.

```java
@Value("${my.duration:10s}")
private Duration duration;
```

**_프로파일 표현 형식 지원이 향상되었습니다._**
> 자세한 내용은 [여기](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.1-Release-Notes#profile-expression)를 참고하세요


**_ThreadPoolTaskExecutor에 대한 자동 구성을 지원합니다._**

**_@EnableScheduling이 명시된 경우 ThreadPoolTaskScheduler에 대한 자동 구성을 지원합니다._**

**_연관된 로거들을 하나의 그룹으로 정의하는 로거 그룹을 지원합니다._**
> 로거에 대한 레벨 설정시 그룹 단위로 지정할 수 있습니다.

**_Spring Data가 JDBC에 대한 리파지토리를 지원합니다._**
> 제가 관심있는 부분인데 JPA를 사용하지 않고 리파지토리 기능을 사용할 수 있습니다.

**_RestClient와 RestHighLevelClient에 대한 자동 구성 및 spring.elasticsearch.rest.\* 네임스페이스로 구성 옵션을 제공합니다._**  
> 수동으로 elasticsearch를 이용하므로 의미가 없습니다.

**_액추에이터 앤드포인트 추가 및 개선되었습니다._**
> 런타임시 HealthIndicatorRegistry 빈으로 HealthIndicator를 추가 및 제거할 수 있습니다.
> 또한, Health 엔드포인트가 특정 상태 인디케이터를 쿼리할 수 있습니다.

```java
@ReadOperation
public Health healthForComponent(@Selector String component) {
	HealthIndicator indicator = getNestedHealthIndicator(this.healthIndicator,
			component);
	return (indicator != null) ? indicator.health() : null;
}
```

**_`spring.jackson.visiblity.*`를 사용하여 Jackson visibility를 설정할 수 있습니다._**
> ObjectMapper를 수동으로 등록하므로 사용하지 않습니다.

**_HiddenHttpMethodFilter를 프로퍼티로 비활성화 할 수 있습니다._**
> 수동으로 FilterRegistrationBean을 통해 HiddenHttpMethodFilter를 등록하는 부분을 프로퍼티로 변경해야겠습니다.

**_@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)로 별도의 랜덤 포트를 적용할 수 있습니다._**
> 테스트 시 포트 문제가 해결될 듯 합니다.

그외 변경된 부분이 더 있으므로 [릴리즈 노트](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.1-Release-Notes)를 참고하시길 바랍니다. 

##### 문제점 해결 ⚠️

**빈 오버라이딩 허용 안됨**
```
The bean 'freeMarkerConfiguration', defined in class path resource [org/springframework/boot/autoconfigure/freemarker/FreeMarkerServletWebConfiguration.class], could not be registered. 
A bean with that name has already been defined in class path resource [../config/MailConfig.class] and overriding is disabled.
```

Freemaker를 메일 템플릿 엔진으로 사용하고 있었는데 freemarker.template.Configuration 빈이 오버라이딩 되기 때문에 오류가 발생했습니다.

```java
class FreeMarkerServletWebConfiguration extends AbstractFreeMarkerConfiguration {
    @Bean
    public freemarker.template.Configuration freeMarkerConfiguration(
    		FreeMarkerConfig configurer) {
    	return configurer.getConfiguration();
    }
}

class MailConfig {
    
    // @Deprecated
    @Bean
    public freemarker.template.Configuration freeMarkerConfiguration() throws IOException, TemplateException {
        FreeMarkerConfigurationFactory freeMarkerConfigurationFactory = new FreeMarkerConfigurationFactory();
        freeMarkerConfigurationFactory.setTemplateLoaderPath("classpath:/templates/mails");
        return freeMarkerConfigurationFactory.createConfiguration();
    }
}
```

MailConfig에서 freemarker.template.Configuration 선언을 제거하고 프로퍼티로
`template-loader-path`를 설정하였습니다.
```properties
spring.freemarker.template-loader-path= classpath:/templates/mails
```

#### Spring Boot from 2.1.X to 2.2.X
굳이 하지 않아도 되는 작업인데 번외로 최근 버전인 2.2.3.RELEASE으로도 업그레이드 시도해보았습니다.

> 또 얼마전에 [2.2.4.RELEASE](https://github.com/spring-projects/spring-boot/releases/tag/v2.2.4.RELEASE)가 릴리즈 되었습니다. 😜
> 여기서 좀 크리티컬한 오류가 생기는데 이에 대해서 개선되었나봅니다.

##### 변경사항 확인
업그레이드 하기 위한 작업은 변경사항을 확인하는 것부터 해야겠죠.

자세한 내용은 [Spring boot 2.2 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.2-Release-Notes)를 참고하세요

**_JAVA 13을 지원합니다._**

**_JMX가 기본적으로 활성화되어있지 않게 됩니다._**
> 이 기능은 `spring.jmx.enabled=true`로 활성화할 수 있습니다

**_가능한 경우 Java EE 의존성에서 Jakarta EE 의존성으로 변경됩니다._**
> `com.sun.mail:javax.mail`는 `com.sun.mail:jakarta.mail`됩니다.

**_`spring-boot-starter-test`가 기본적으로 JUnit5를 지원합니다._**
> Junit4를 사용하려면 의존하는 모듈을 제외하고 Junit4를 포함해야합니다.

**_액추에이터 HTTP 트레이스와 감시 기능이 기본적으로 활성화되지 않습니다._**

**_데이터소스 헬스 인디케이터는 별도의 `validationQuery` 속성을 포함합니다._**

**_Gradle 4.10+가 요구됩니다._**
> 저는 5.6.4를 사용하므로 문제가 되지 않습니다.

**_프리마커 템플릿에 대한 기본 템플릿 확장자가 변경되었습니다._**
> html을 사용하기 때문에 무시해도 될 것 같습니다.

**_톰캣 MBean 레지스트리가 기본적으로 비활성화되어 약 2MB의 힙이 절약됩니다._**
> MBean 매트릭이 필요하면 활성화해야겠네요

**_HttpHiddenMethodFilter가 기본적으로 비활성화됩니다._**
> 다시 활성화하려면 spring.webflux.hiddenmethod.filter.enabled 또는 spring.mvc.hiddenmethod.filter.enabled를 true로 설정하세요

**_Helth Indicator 그룹 기능 구현을 위해 여러 클래스가 사용되지 않습니다._**

**_@Configuration 클래스에서 proxyBeanMethods = false를 사용하여 시작 시간과 메모리 사용량이 줄었습니다._**
> 사용자 정의 설정 클래스들을 확인해서 빈을 참조하는지 확인하여 설정하면 됩니다.
> 참조하는 설정 클래스에 해당 옵션을 적용하면 로드 시 문제가 됩니다.

**_Gradle에서 bootRun으로 개발시 응용 프로그램을 시작할 때 JVM에 `-Xverify:none`와 `-XX:TieredStopAtLevel=1` 플래그가 설정됩니다._**
> 속도 향상을 위해 기본 JVM 옵션을 부여하는 듯 합니다. 단, Java 13으로 동작하는 경우 `-Xverify:none`은 지정되지 않습니다.

**_시작 시간 절약을 위해 `spring.main.lazy-initialization` 속성으로 전역 지연 초기화 활성화를 지원합니다._**
> 개발 시에는 이 속성을 사용해서 시작 시간을 앞당길 수 있습니다. 배포 환경에서는 애플리케이션이 로드되었지만 클라이언트 요청에 대해 처리할 수 없을 수 있어 비 추천합니다.

**_ApplicationContextRunner 테스트 유틸리티로 인라인 빈 등록이 가능합니다._**
> 단위 테스트를 위한 유틸리티를 제공합니다.

**_유휴 JDBC 연결 매트릭을 추적하여 제공합니다._**

**_스프링 세션의 플러쉬 모드를 지원합니다._**
> 현재 애플리케이션은 개발 단계로 스프링 세션을 사용하고 있지 않으므로 무시합니다.

**_Oracle’s JDBC driver에 대한 의존성 관리가 추가되었습니다._**
> 현재 애플리케이션은 PostgreSQL를 사용하므로 무시합니다.


##### 문제점 해결 ⚠️

**Cannot choose between the following variants of org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.3.3**

Spring Boot 2.2.3.RELEASE와 Gradle 5.6.4로 빌드를 시도했을때 발생한 문제점입니다.
이 문제는 Gradle 6.1로 업그레이드하니 바로 해결되었습니다.

> 사실 상 Spring Boot 2.2.2.RELEASE에서 2.2.3.RELEASE로 올렸을 때 발생했습니다.

```sh
Cannot choose between the following variants of org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.3.3:
  - enforcedRuntimeElements
  - runtimeElements
All of them match the consumer attributes:
  - Variant 'enforcedRuntimeElements' capability org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.3.3:
      - Unmatched attributes:
          - Found org.gradle.category 'enforced-platform' but wasn't required.
          - Found org.gradle.status 'release' but wasn't required.
          - Found org.gradle.usage 'java-runtime' but wasn't required.
  - Variant 'runtimeElements' capability org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.3.3:
      - Unmatched attributes:
          - Found org.gradle.category 'platform' but wasn't required.
          - Found org.gradle.status 'release' but wasn't required.
          - Found org.gradle.usage 'java-runtime' but wasn't required.
```

이와 관련하여 스프링 부트 깃허브에 [Dependency resolution fails with Gradle 5.3.x to 5.6.x](https://github.com/spring-projects/spring-boot/issues/19783) 이슈가 올라와있어 확인해보니 다음과 같은 답변이 있었습니다.

```
The problem’s caused by spring-boot-dependencies upgrading from Kotlin Coroutines 1.3.2 to 1.3.3. 
Unfortunately this affects pure-Java projects as the Kotlin Coroutines bom is imported in the spring-boot-dependencies bom.

You should be able to work around the problem by overriding the version of the Kotlin Coroutines bom that is imported by Boot’s dependency management:

ext['kotlin-coroutines.version']='1.3.2'

- https://github.com/spring-projects/spring-boot/issues/19783#issuecomment-575506102
```

하지만 의존성 관리 플러그인이 kotlin-coroutines.version을 참조하지 않는지 해결되지 않습니다.

알아본 결과 이를 해결하기 위한 세 가지 방법이 있습니다.

1. Gradle 6.1 사용
2. [io.spring.dependency-management:1.0.9.RELEASE](https://github.com/spring-projects/spring-boot/issues/19783#issuecomment-576235568)버전 사용 _(2020-01-20)_
3. Spring Boot 2.2.4.RELEASE 업그레이드 _(2020-01-20)_

>  https://github.com/spring-projects/spring-boot/issues/19783#issuecomment-577604150
>  결론적으로 제가 업그레이드를 시도했을때는 마침 문제가 있었고 😥 현재는 해결방법이 명확히 존재합니다. 

### JDK ✅
마지막으로 빌드되는 JDK 버전을 업그레이드해야합니다.

#### OpenJDK 10 

##### 문제점 확인 ⚠️

**_JDK9(Java SE 9) 이상에서 JAXB(javax.xml.bind) 클래스 못 찾음 문제_** 

https://blog.leocat.kr/notes/2019/02/12/java-cannot-find-jaxb-from-jdk9-and-above

> 특정 JDK에서 --add-modules 옵션을 사용하지 못했습니다. 이에 대해서는 좀 더 확인해봐야됩니다.

**_cacerts_**
OpenJDK 10에서 애플리케이션 구동 시 인증서를 확인하지 못하는 문제점이 있습니다. 그 이유는 Cacerts에 해당 인증서의 인증기관이 없기 때문인데 JDK8의 cacerts를 대신 사용하도록 하였습니다.

> https://stackoverflow.com/a/53246850

#### OpenJDK 11 for HotswapAgent
프로젝트 개발 시 클래스 동적 로딩을 위해 `HotswapAgent`을 사용했는데 JDK8과 [JDK11](http://hotswapagent.org/mydoc_quickstart-jdk11.html)을 지원하여 [trava-jdk-11-dcevm](https://github.com/TravaOpenJDK/trava-jdk-11-dcevm)을 사용하여 빌드 및 구동 확인하였습니다.

### Deploy (Optional)
저는 젠킨스를 활용해서 깃허브에 개발 브랜치로 푸시된 결과를 확인해 빌드를 진행하도록 설정되어있어 여기서 사용하는 JDK 버전도 변경해야합니다.

#### 젠킨스 OpenJDK 설치하기
기존에는 Oracle JDK 8을 빌드에 사용하고 있었고 JDK9 부터는 OpenJDK로 빌드하려고 합니다. 그래서 `Extract \*.zip/\*.tar.gz`를 이용해 JDK를 설치하여 사용하도록 했습니다.

> [Archived OpenJDK General-Availability Releases](https://jdk.java.net/archive/)

그리고 jdk 파라미터가 있는 경우 해당 JDK 버전을 사용하도록 설정하였습니다.
```groovy
if(project.hasProperty('jdk')) {
    def buildJDK = project.property('jdk')
    sourceCompatibility = JavaVersion.valueOf(buildJDK)
    targetCompatibility = JavaVersion.valueOf(buildJDK)
}
```

> Gradle 이용시 JDK를 구분하여 처리할 수 있는 좋은 방법을 아신다면 공유 부탁드립니다.

## 참고
- [Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)
- [Spring Boot 2.0 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Release-Notes)
- [Spring Boot 2.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.1-Release-Notes)
- [Spring Boot 2.2 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.2-Release-Notes)
- [Gradle Release Notes](https://docs.gradle.org/5.6.4/release-notes.html)
