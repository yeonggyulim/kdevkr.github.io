---
    title: 스프링 부트 1.5.4에서 2.0으로 마이그레이션 하기
    date: 2020-01-21
    categories: [개발 이야기]
    tags: [스프링 부트, 마이그레이션, 삽질]
---

[Nashorn JavaScript Engine in JDK 9](https://www.oracle.com/corporate/features/nashorn-javascript-engine-jdk9.html)에서 확인할 수 있듯이 JDK 9부터 Nashorn 엔진이 ES6를 지원한다. 현재 개발중인 애플리케이션은 JDK 8인데 JVM에서 ES6 스크립트를 실행해야하는 요구사항이 있어 JDK 9 이상으로 버전을 올리려고 시도하고자 합니다.

> 좀 더 알아보니 OpenJDK에서는 Jashorn 엔진을 제외한다고 명시했습니다.
> \- https://openjdk.java.net/jeps/335
> 나중에는 [GraalVM의 GraalJS](https://github.com/graalvm/graaljs) 쪽으로 선회하는 방법이 좋겠습니다.

다만, 지금 시점에서 JDK 13까지 나왔으며 애플리케이션의 기반이 되는 스프링 부트 프레임워크의 버전별 JDK 호환성을 살펴보면 다음과 같습니다.

|Spring Boot Version|JDK|Compatible|
|---|---|---|
|1.5.9.RELEASE|Java 7|or Java 7|
|2.0.0.RELEASE|Java 8|or Java 9|
|2.1.1.RELEASE|Java 8|is compatible up to Java 11|
|2.1.7.RELEASE|Java 8|is compatible up to Java 12|
|2.2.0.RELEASE|Java 8|is compatible up to Java 13|

[GA 릴리즈](https://github.com/spring-projects/spring-boot/releases) 버전이 `2.1.12.RELEASE`와 `2.2.3.RELEASE`이 있으므로 이중에 선택하면 될것 같습니다.



## 애플리케이션
마이그레이션 대상인 현재 애플리케이션의 의존성 라이브러리 버전을 간략하게 살펴보도록 하겠습니다.

|이름|버전|비고|
|---|---|---|
|JDK|1.8|jdk8u232-b09|
|Gradle|3.5.1||
|Spring Boot|1.5.4||
|Spring|4.3.7||
|Embed Tomcat|8.5.47||
|org.springframework.boot:spring-boot-gradle-plugin|1.5.7.RELEASE|   |
|io.spring.gradle:dependency-management-plugin|0.5.2.RELEASE|   |

### 그래들 버전 업그레이드 ✅
Gradle Wrapper를 `3.5.1`로 사용하고 있었습니다. 그래서 먼저, 그래들 버전을 `5.6.4` 또는 1월 15일에 릴리즈된 `6.1`으로 올리고 애플리케이션 빌드에 문제가 없는지 확인합니다.

5.6.4 릴리즈 노트에 따르면 [그루비 컴파일 속도가 빨라](https://docs.gradle.org/5.6.4/release-notes.html)졌다고 하니 최소한 5.6 이상으로 사용합시다.

> 그루비 컴파일 속도 향상을 위해 두 가지 기능을 지원한다고 합니다.
> \- [Groovy compilation avoidance](https://docs.gradle.org/5.6.4/userguide/groovy_plugin.html#sec:groovy_compilation_avoidance)
> \- [Incremental Groovy compilation](https://docs.gradle.org/5.6.4/userguide/groovy_plugin.html#sec:incremental_groovy_compilation)
>
> [클래스패스 상의 ZIP 아카이브 처리 성능도 향상](https://docs.gradle.org/5.6.4/release-notes.html#improved-handling-of-zip-archives-on-classpaths)됬다고 합니다.
 
#### 인스톨
gradle 명령 또는 버전을 명시해서 버전을 업그레이드 할 수 있습니다.

gradlew
```sh
#gradle wrapper --gradle-version 5.6.4
gradlew wrapper --gradle-version 5.6.4
```

gradle-wrapper.properties
```properties
#distributionUrl=https\://services.gradle.org/distributions/gradle-3.5.1-all.zip
distributionUrl=https\://services.gradle.org/distributions/gradle-5.6.4-all.zip
#distributionUrl=https\://services.gradle.org/distributions/gradle-6.1-all.zip
```

#### 인텔리제이 Gradle 플러그인 충돌 ⚠️
인텔리제이 버전에서 Gradle Wrapper 버전을 올린 후 자체 Gradle 플러그인 버전과 충돌되는 문제가 있었습니다.
```sh
org.jetbrains.plugins.gradle.tooling.util.ModuleComponentIdentifierImpl.getModuleIdentifier()
```

[Intellij Platform SDK DevGuide / Build Number Ranges](http://www.jetbrains.org/intellij/sdk/docs/basics/getting_started/build_number_ranges.html)에서 192와 193 브랜치를 확인해보니 [192](https://github.com/JetBrains/intellij-community/blob/192/build/dependencies/gradle/wrapper/gradle-wrapper.properties)에서는 Gradle Wrapper가 4.10-all이고 [193](https://github.com/JetBrains/intellij-community/blob/193/build/dependencies/gradle/wrapper/gradle-wrapper.properties)에서 5.5-all로 변경되었습니다.

> 이로 인해, 인텔리제이 커뮤니티 버전을 사용하는 분들께는 버전 업그레이드를 권고해드렸습니다.

#### 빌드 태스크

##### Lombok Plugin
이제 빌드를 위해 `롬복` 플러그인을 사용하거나 `annotationProcessor`를 사용해야 합니다.

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

기존 프로젝트에 대해 Gradle 6.1로 빌드 및 구동까지 확인하였습니다. 이제는 JDK9+ 지원을 위해 스프링 부트 버전을 업그레이드할 차례입니다.

## 스프링 부트 마이그레이션

마이그레이션 시 [Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)를 참고하였습니다.

> 이런 것 까지 준비해주시는 스프링 개발자분들 존경합니다 ㅠㅡㅠ.

### 검토 및 사전 작업
스프링 부트 2.X는 1.5.X와 비교하여 서블릿 뿐만 아니라 `리액티브 스택`을 지원함에따라 패키지 구조와 구성을 위한 프로퍼티에 대한 변화가 많습니다.

#### 의존성 검토 ✅
스프링 부트에서 사용하는 여러가지 의존성의 버전이 업데이트되면서 사용자마다 사용하는 기술 스택에 대한 의존성 버전을 확인해야합니다.

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

#### 프로퍼티 마이그레이터 설정
스프링 부트 2.0에서 많은 설정 프로퍼티가 변경, 삭제되어서 이를 업데이트해야합니다. 스프링 부트에서는 이 작업을 도와주기 위하여 `spring-boot-properties-migrator` 모듈을 제공합니다.

```groovy
dependencies {
    runtime("org.springframework.boot:spring-boot-properties-migrator")
}

// Once you’re done with the migration, please make sure to remove this module from your project’s dependencies.
```

위와 같이 설정하면 런타임 시에 애플리케이션 환경을 분석해주고 임시적으로 변경된 프로퍼티로 바꿔줍니다.

> 변경된 프로퍼티가 존재하면 WARN 레벨의 로그로 출력되며, 삭제된 프로퍼티를 사용하는 경우 ERROR 레벨의 로그를 출력합니다.

### 스프링 부트 2.0.X 업그레이드

#### 변경사항 정리
업그레이드하기에 앞서 릴리즈 노트를 통해 간단하게 무엇이 바뀌었는지 확인했습니다.

- 리액티브 스택 지원으로 인한 의존성이 추가되었습니다.
    - 임베디드 컨테이터 패키지가 광범위하게 리팩토링되었습니다.
- 스프링 소셜에 대한 자동 구성이 제외되어 의존성 관리 목록에서 제거되었습니다.
- 액추에이터가 자체적인 매트릭 API이 아닌 Micrometer에 의존합니다.
- 기본 데이터베이스 커넥션 풀이 Tomcat-JDBC에서 HikariCP로 변경되었습니다.
- 레디스 드라이버로써 Jedis가 아닌 Lettuce를 사용합니다.
    - Jedis를 사용하려면 Lettuce를 제외하고 Jedis를 의존성에 추가해야합니다.
- 엘라스틱서치가 5.4+으로 업그레이드 되었습니다. 엘라스틱에서 임베디드 엘라스틱을 더이상 지원하지 않으므로 NodeClient에 대한 자동 구성이 제외되었습니다.
- TestPropertyValues와 비슷한 행동을 하는 EnvironmentTestUtils이 제외되었습니다.
- ConditionalOnBean이 OR이 아닌 논리적 AND를 사용합니다.
- Spring Boot Gradle Plugin의 많은 부분이 개선되었습니다.
    - 이제 의존성 관리 플러그인을 자동으로 적용하지 않으므로 이제 직접 명시해야 합니다.
    ```groovy
    apply plugin: 'org.springframework.boot'
    apply plugin: 'io.spring.dependency-management' 
    ```
    - `bootRepackage` 태스크가 `bootJar`와 `bootWar`로 대체되었습니다. 더이상 `jar`와 `war` 태스크가 관여하지 않습니다.
    - `BootRun`, `BootJar`, `BootWar` 태스크는 이제 메인 클래스 이름 설정을 위해 `mainClassName` 프로퍼티를 사용합니다.
- AOP 지원을 포함하여 기본적으로 CGLIB를 사용합니다. 만약, 인터페이스 기반의 프록시가 필요하다면 `spring.aop.proxy-target-class`를 `false`로 설정하세요
- 애플리케이션이 서비스 요청을 처리할 수 있도록 준비된 것을 인지할 수 있도록 `ApplicationStartedEvent`가 추가되었습니다.
- [완화된 바인딩과 관련하여 규칙이 강화](https://docs.spring.io/spring-boot/docs/2.0.9.RELEASE/reference/html/boot-features-external-config.html#boot-features-external-config-relaxed-binding)되었으며 새로운 구조로 대체되어 기존의 `org.springframework.boot.bind` 패키지를 더이상 이용할 수 없습니다.

> 자세한 내용은 [Spring boot 2.0 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Release-Notes)를 참고하세요

#### 업그레이드 후 문제점 수정

##### 임베디드 톰캣 커스터마이저 ⚠️
임베디드 컨테이너 패키지가 리팩토링되어 기존의 톰캣 커스터마이즈를 위한 클래스를 변경해야합니다.

|Before|After|
|---|---|
|EmbeddedServletContainer|WebServer|
|org.springframework.boot.context.embedded|org.springframework.boot.web.server|
|EmbeddedServletContainerCustomizer|WebServerFactoryCustomizer|
|TomcatEmbeddedServletContainerFactory|TomcatServletWebServerFactory|
|EmbeddedServletContainerCustomizer|WebServerFactoryCustomizer\<TomcatServletWebServerFactory\>|

### 스프링 부트 2.1.X 업그레이드 ✅

#### 변경사항 정리
이번에도 무엇이 바뀌었는지, 크게 바뀐 부분이 있는지 확인했습니다.

- 이제 Java 11을 지원합니다.
- 기본적으로 [빈 오버라이딩](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.1-Release-Notes#bean-overriding)을 허용하지 않도록 변경되었습니다.
- 자동 구성 제외에 대한 일관성을 제공합니다. `@EnableAutoConfiguration`, `@SpringBootApplication`, `@ImportAutoConfiguration` 또는 `spring.autoconfigure.exclude`로 정의합니다.
- 서블릿 패스 속성이 `server.servlet.path`에서 `spring.mvc.servlet.path`로 변경되었습니다.
- 웹 애플리케이션이 동작하는 동안의 디버그 로깅 출력이 개선되었습니다.
- `HttpPutFormContentFilter`이 제외되었으며 `FormContentFilter`를 사용합니다. 따라서, `spring.mvc.formcontent.putfilter.enabled`는 더이상 정의할 수 없으며 `spring.mvc.formcontent.filter.enabled`으로 변경해야합니다.
- `json-simple`에 대한 의존성 관리가 제공되지않으며 `JsonParser` 구현체가 제거되었습니다.
- Lombok이 1.18.x로 변경되어 더 이상 프라이빗 빈 생성자를 생성하지 않습니다.
- 임베디드 웹 서버가 일관된 최대 HTTP 헤더 크기를 갖습니다. (8kB, server.max-http-header-size)
- 컨택스트 ApplicationConversionService을 지원합니다.
- 프로파일 표현 형식 지원이 향상되었습니다.
- ThreadPoolTaskExecutor에 대한 자동 구성을 지원합니다.
- @EnableScheduling이 명시된 경우 ThreadPoolTaskScheduler에 대한 자동 구성을 지원합니다.
- 연관된 로거들을 하나의 그룹으로 정의하는 로거 그룹을 지원합니다.
- Spring Data가 JDBC에 대한 리파지토리를 지원합니다.
- RestClient와 RestHighLevelClient에 대한 자동 구성 및 spring.elasticsearch.rest.* 네임스페이스로 구성 옵션을 제공합니다.
- 액추에이터 앤드포인트 추가 및 개선되었습니다.
- Devtools를 사용할 때 오류 페이지에서 스택트레이스가 보여집니다.
- `spring.jackson.visiblity.*`를 사용하여 Jackson visibility를 설정할 수 있습니다.

> 자세한 내용은 [Spring boot 2.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.1-Release-Notes)를 참고하세요

### 스프링 부트 2.2.X 업그레이드

#### 변경사항 정리
- Java 13을 지원합니다.
- JMX가 기본적으로 활성화되어있지 않게 됩니다. 이 기능은 `spring.jmx.enabled=true`로 활성화할 수 있습니다.
- 가능한 경우 Java EE 의존성에서 Jakarta EE 의존성으로 변경됩니다. `com.sun.mail:javax.mail`는 `com.sun.mail:jakarta.mail`됩니다.
- `spring-boot-starter-test`가 기본적으로 JUnit5를 지원합니다.
- `Iterator`와 관련한 주요 API 변경사항을 포함하는 AssertJ 3.12가 사용됩니다.
- 데이터소스 헬스 인디케이터는 여분의 `validationQuery` 속성을 포함합니다.
- 액추에이터 HTTP 트레이스와 감시 기능이 기본적으로 활성화되지 않습니다.
- Gradle 4.10+가 요구됩니다.
- 프리마커 템플릿에 대한 기본 템플릿 확장자가 변경되었습니다.
- 톰캣 MBean 레지스트리가 기본적으로 비활성화되어 약 2MB의 힙이 절약됩니다.
- HttpHiddenMethodFilter가 기본적으로 비활성화됩니다. 다시 활성화하려면 spring.webflux.hiddenmethod.filter.enabled 또는 spring.mvc.hiddenmethod.filter.enabled를 true로 설정하세요
- 헬스 인디케이터 그룹 기능 구현을 위해 여러 클래스가 사용되지 않습니다.
- @Configuration 클래스에서 proxyBeanMethods = false를 사용하여 시작 시간과 메모리 사용량이 줄었습니다.
- Gradle에서 bootRun으로 개발시 응용 프로그램을 시작할 때 JVM에 `-Xverify:none`와 `-XX:TieredStopAtLevel=1` 플래그가 설정됩니다.
- Java 13으로 동작하는 경우 `-Xverify:none`은 지정되지 않습니다.
- 시작 시간 절약을 위해 `spring.main.lazy-initialization` 속성으로 전역 지연 초기화 활성화를 지원합니다.
    - Handling of HTTP requests may take longer while any deferred initialisation occurs
    - Failures that would normally occur at startup will now not occur until later
- ApplicationContextRunner 테스트 유틸리티로 인라인 빈 등록이 가능합니다.
- Hazelcast를 위한 헬스 인디케이터를 제공합니다.
- 유휴 JDBC 연결 매트릭을 추적하여 제공합니다.
- 스프링 세션의 플러쉬 모드를 지원합니다.
- Oracle’s JDBC driver에 대한 의존성 관리가 추가되었습니다.

> 자세한 내용은 [Spring boot 2.2 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.2-Release-Notes)를 참고하세요

#### 문제 및 해결

##### ⚠️ Cannot choose between the following variants of org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.3.3

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
> 제가 해봤는데 안되네요...
> 2020-01-20, [io.spring.dependency-management:1.0.9.RELEASE](https://github.com/spring-projects/spring-boot/issues/19783#issuecomment-576235568) 버전으로 업데이트되어 해결되었습니다.

## JDK
마지막으로 JDK 버전을 업그레이드 후 빌드 확인하겠습니다.

### OpenJDK 10 ✅

#### JDK9(Java SE 9) 이상에서 JAXB(javax.xml.bind) 클래스 못 찾음 문제 ⚠️
- https://blog.leocat.kr/notes/2019/02/12/java-cannot-find-jaxb-from-jdk9-and-above

### OpenJDK 11 for HotswapAgent ✅
프로젝트 개발 시 클래스 동적 로딩을 위해 `HotswapAgent`을 사용했는데 JDK8과 [JDK11](http://hotswapagent.org/mydoc_quickstart-jdk11.html)을 지원하여 [trava-jdk-11-dcevm](https://github.com/TravaOpenJDK/trava-jdk-11-dcevm)을 사용하여 빌드 및 구동 확인하였습니다.




