---
title: 스프링 부트 애플리케이션 액츄에이터 호출하기
date: 2029-10-03
categories: [스프링, 액츄에이터]
---

# Actuator

## Actuator란 무엇인가?
`spring-boot-actuator` 모듈은 스프링 부트 애플리케이션이 프로덕션 환경일때 유용한 기능을 제공해준다. 예를 들어, 서버의 사용량을 모니터링하거나 서버 환경 정보를 알고 싶을때 실제로 서버에 접근하지 않아도 액츄에이터가 제공해주는 엔드포인트로 가져올 수 있게 해준다.

### Dependencies
```groovy
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```
### Actuator Endpoints
Actuator를 적용할 경우 다음과 같이 n개의 엔드포인트가 제공되는 것을 로그로 확인할 수 있다.

```java
INFO 7932 --- [  restartedMain] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 2 endpoint(s) beneath base path '/actuator'
```

위 경우에는 2개의 엔드포인트가 적용되었으며 /actuator 경로로 접근하면 다음과 같은 응답을 받는다.

```json
{
  "_links": {
    "self": {
      "href": "http://localhost:8080/actuator",
      "templated": false
    },
    "health-component": {
      "href": "http://localhost:8080/actuator/health/{component}",
      "templated": true
    },
    "health-component-instance": {
      "href": "http://localhost:8080/actuator/health/{component}/{instance}",
      "templated": true
    },
    "health": {
      "href": "http://localhost:8080/actuator/health",
      "templated": false
    },
    "info": {
      "href": "http://localhost:8080/actuator/info",
      "templated": false
    }
  }
}
```

[production-ready-endpoints](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints)에 따르면 액츄에이터 모듈에 의해 제공되는 엔드포인트는 더 많은데 우리가 확인할 수 있는 것은 2개 뿐이었을까?

그것은 우리가 Http를 이용해 엔드포인트로 접근했기 때문이다. 각 엔드포인트는 성격에 따라 기본적으로 외부로 노출되지 않도록 설정되어있다.

#### Exposing Endpoints
만약, Http를 이용해 접근할 수 있는 엔드포인트를 설정하고 싶다면 `management.endpoints.web.exposure.include` 프로퍼티를 이용하면 된다.

예를 들어, 다음과 같이 애플리케이션 프로퍼티 설정에 management.endpoints.web.exposure.include=*를 적용하면 15개의 엔드포인트가 노출되게 된다.

::: danger
각 엔드포인트를 노출하였을때는 보안에 취약할 수 있으므로 주의해야하며 엔드포인트에 따라 인증된 사용자가 접근하는 것을 `Spring Security`로 보완할 수 있다.
:::

#### Enabling Endpoints

#### Securing HTTP Endpoints

#### Configuring Endpoints

## Actuator Endpoints with Spring Security
액츄에이터 엔드포인트는 스프링 시큐리티 모듈이 있다면 기본적으로 스프링 시큐리티의 Conent-Negotiation 전략에 의해 보호된다.

우리는 HTTP 엔드포인트에 대해서 개별적인 보안 설정을 해보도록 하자.

### Security Configuration

### CORS Support

## Implementing Custom Endpoints
엑츄에이터 모듈에는 사용자 정의 엔드포인트를 구성할 수 있도록 `@Endpoint`, `@WebEndpoint`, `@JmxEndpoint`, `@EndpointWebExtension`등을 제공합니다.

### Controller Endpoints
`@ControllerEndpoint`와 `@RestControllerEndpoint`를 사용하면 컨트롤러 방식의 엔드포인트를 구성할 수 있도록 도와줍니다. 다만, 이 어노테이션들에 의해 만들어지는 엔드포인트는 스프링 웹 프레임워크에 의해 노출되기 때문에 JMX와 같은 방식으로는 접근이 불가능합니다.

## Endpoints Information

### Health
구동중인 애플리케이션의 상태를 체크할 수 있는 정보를 제공합니다.

Health 정보들은 HealthIndicatorRegistry에 의해 수집되는데 기본적으로 애플리케이션에 정의된 모든 HealthIndicator 인스턴스들입니다. 

스프링 부트에서 자동 구성으로 제공하는 HealthIndicator들은 다음과 같습니다.

[Auto-configured HealthIndicators](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#_auto_configured_healthindicators)

간략하게 `DiskSpace`, `DataSource`, `Mail`등이 있습니다.

#### Custom HealthIndicator
Health 정보에 커스텀 정보를 추가하고 싶다면 `HeathIndicator` 인터페이스를 구현한 Bean을 등록하면 됩니다.

다음은 스프링 부트 레퍼런스에서 제공되는 샘플 예제입니다.
```java
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class MyHealthIndicator implements HealthIndicator {

	@Override
	public Health health() {
		int errorCode = check(); // perform some specific health check
		if (errorCode != 0) {
			return Health.down().withDetail("Error Code", errorCode).build();
		}
		return Health.up().build();
	}

}
```

이때, Health 정보에 포함되는 엔트리의 이름은 MyHealthIndicator에서 HealthIndicator 부분이 제외된 `my`가 되는 것을 알려드립니다.

### Information
애플리케이션 정보는 애플리케이션 컨텍스트에 등록된 모든 `InfoContributor` 빈들로 부터 수집됩니다. 

스프링 부트에서 자동 구성으로 제공하는 InfoContributor들은 다음과 같습니다.

[Auto-configured InfoContributors](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-application-info-autoconfigure)

#### Custom Information
애플리케이션 프로퍼티에서 `info`로 시작되는 것들은 Info 정보에 추가됩니다.

#### Build Information
애플리케이션 컨텍스트에 `BuildProperties` 빈이 등록되있으면, Info 정보에 빌드에 대한 정보가 포함됩니다.

클래스패스에 `META-INF/build-info.properties`가 존재하면 BuildProperties가 빈으로 자동으로 등록됩니다.

##### Generate Build Information
[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/docs/2.1.9.RELEASE/gradle-plugin/reference/html/#integrating-with-actuator-build-info)으로 `build-info.properties`를 만들 수 있습니다.

###### build.gradle
```groovy
springBoot {
    buildInfo()
}
```

만약, IntelliJ에 의해 애플리케이션을 구동할 경우에는 `buildInfo` 태스크가 구동되지 않기 때문에 개별적인 설정을 해주어야 합니다.

```groovy
// Copy build-info.properties for intelliJ
def cleanBootBuildInfo = task(type: Delete, 'cleanBootBuildInfo') {
    delete new File(buildDir, 'resources/main/META-INF/build-info.properties')
}
bootBuildInfo.mustRunAfter processResources
tasks.find { it.name == 'bootBuildInfo' }.dependsOn(cleanBootBuildInfo)
```

IntelliJ가 `processResources` 태스크를 수행하기 전에 `bootBuildInfo` 태스크를 수행하도록 하면됩니다.

#### Custom InfoContributors
Info 정보도 `InfoContributor` 인터페이스를 구현한 빈을 등록해서 추가할 수 있습니다. 

```java
import java.util.Collections;

import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

@Component
public class ExampleInfoContributor implements InfoContributor {

	@Override
	public void contribute(Info.Builder builder) {
		builder.withDetail("example",
				Collections.singletonMap("key", "value"));
	}

}
```

### Loggers
스프링 부트 액츄에이터는 런타임시에 애플리케이션 로그 정보들을 확인하고 구성할 수 있는 기능을 제공합니다.

`Loggers` 엔드포인트를 확인하고 해당 URI에 대한 `POST` 요청으로 로그 레벨을 설정할 수 있습니다.

```json
{
    "configuredLevel": "DEBUG"
}
```

만약, 설정된 로그 레벨을 초기화하고 싶은 경우 configuredLevel에 `null`값을 지정하면 됩니다.


### Metrics
스프링 부트 액츄에이터는 의존성 관리 및 [Micrometer](https://micrometer.io/)에 의한 자동 구성을 제공합니다. 다양한 애플리케이션 매트릭 정보가 포함됩니다.

### HTTP Tracing
모든 HTTP 요청에 대해서 자동으로 트레이스가 적용됩니다. `httptrace` 엔드포인트에 수집된 마지막 100개의 요청-응답 교환정보를 가져올 수 있습니다.

#### Custom HTTP tracing
`management.trace.http.include` 프로퍼티로 수집해야하는 HTTP 정보를 설정할 수 있습니다.

더 많은 커스터마이징이 필요한 경우 `HttpExchangeTracer` 구현체를 등록하는 것을 고려하시기 바랍니다.

기본적인 InMemoryHttpTraceRepository는 100개의 요청-응답 교환정보를 저장하도록 설계되어있기 때문에 이 용량을 확장하고 싶다면 `HttpTraceRepository` 인스턴스 빈을 정의해야합니다. 

## Monitoring and Management over HTTP

### Customizing the Management Server

```properties
// Customizing the Management Endpoint Paths
management.endpoints.web.base-path=/manage

// Customizing the Management Server Port
management.server.port=8081
```

### Configuring Management-specific SSL
```properties
server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:store.jks
server.ssl.key-password=secret
management.server.port=8080
management.server.ssl.enabled=false
```

### Disabling HTTP Endpoints
HTTP 엔드포인트를 사용하고 싶지 않다면 `management.port`를 `-1`로 설정하면 됩니다.

```properties
management.server.port=-1
```

## Monitoring and Management over JMX
Java Management Extensions (JMX)는 애플리케이션을 모니터링하거나 관리하기 위한 표준 매커니즘을 제공합니다. 기본적으로 스프링 부트는 `org.springframework.boot` 도메인 아래에 JMX MBean들로써 관리 엔드포인트들을 노출합니다.

### Using Jolokia for JMX over HTTP
Jolokia는 JMX-HTTP 브릿지로써 JMX MBean들에 대한 액세스 함수를 대체할 수 있도록 제공합니다.

```groovy
implementation 'org.jolokia:jolokia-core'
```

#### Disabling Jolokia
`management.endpoint.jolokia.enabled` 프로퍼티로 Jolokia를 사용하지 않도록 설정할 수 있습니다.

```properties
management.endpoint.jolokia.enabled=false
```

### Disabling JMX Endpoints
JMX 엔드포인트를 노출하고 싶지 않다면 다음과 같이 프로퍼티를 설정하시기 바랍니다.
```properties
management.endpoints.jmx.exposure.exclude=*
```

## Supported monitoring systems
본 글에서 다루지 않는 부분이므로 [Supported monitoring systems](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-metrics-export)를 참고하시기 바랍니다.


## 참고
- https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready
- https://docs.spring.io/spring-boot/docs/2.1.9.RELEASE/actuator-api/html/
- 