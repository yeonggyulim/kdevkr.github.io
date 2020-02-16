---
    title: Spring Data Redis의 Cron expression must consist of 6 fields (found 0 in "null") 오류
    date: 2020-02-15
    categories: [개발 이야기, 이슈]
---

> https://github.com/spring-projects/spring-session/issues/1581 

## 들어가며
Spring Session과 Redis를 결합하기 위하여 Spring Data Redis 모듈을 적용한 후 발생한 문제점입니다.

> Cron expression must consist of 6 fields (found 0 in "null")

오류에 대한 스택트레이스는 다음과 같습니다.

```sh
java.lang.IllegalArgumentException: Cron expression must consist of 6 fields (found 0 in "null")
	at org.springframework.scheduling.support.CronSequenceGenerator.parse(CronSequenceGenerator.java:273) ~[spring-context-5.2.3.RELEASE.jar:5.2.3.RELEASE]
	at org.springframework.scheduling.support.CronSequenceGenerator.<init>(CronSequenceGenerator.java:98) ~[spring-context-5.2.3.RELEASE.jar:5.2.3.RELEASE]
	at org.springframework.scheduling.support.CronSequenceGenerator.<init>(CronSequenceGenerator.java:85) ~[spring-context-5.2.3.RELEASE.jar:5.2.3.RELEASE]
	at org.springframework.scheduling.support.CronTrigger.<init>(CronTrigger.java:45) ~[spring-context-5.2.3.RELEASE.jar:5.2.3.RELEASE]
	at org.springframework.scheduling.config.CronTask.<init>(CronTask.java:42) ~[spring-context-5.2.3.RELEASE.jar:5.2.3.RELEASE]
	at org.springframework.scheduling.config.ScheduledTaskRegistrar.addCronTask(ScheduledTaskRegistrar.java:276) ~[spring-context-5.2.3.RELEASE.jar:5.2.3.RELEASE]
	at org.springframework.session.data.redis.config.annotation.web.http.RedisHttpSessionConfiguration$SessionCleanupConfiguration.configureTasks(RedisHttpSessionConfiguration.java:362) ~[spring-session-data-redis-2.2.0.RELEASE.jar:2.2.0.RELEASE]
```

RedisHttpSessionConfiguration 클래스의 내부 클래스인 SessionCleanupConfiguration에서 configureTasks 함수를 호출하면서 발생하였습니다.

### Dependencies
문제가 발생한 의존성 구조는 다음과 같습니다.

```java
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.session:spring-session-data-redis'
    implementation 'io.lettuce:lettuce-core'
}
```

## Autoconfigure
스프링 부트의 자동설정 정보를 파악하면서 원인을 찾아가겠습니다. 

### SessionAutoConfiguration
세션에 대한 자동 구성은 RedisAutoConfiguration의 자동 구성이 완료된 후 동작합니다.

```java
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties({ ServerProperties.class, SessionProperties.class })
@AutoConfigureAfter({RedisAutoConfiguration.class})
public class SessionAutoConfiguration {}
```

#### RedisAutoConfiguration
RedisAutoConfiguration는 RedisTemplate와 RedisProperties 그리고 LettuceConnectionConfiguration를 적용합니다.

```java
@EnableConfigurationProperties(RedisProperties.class)
@Import({ LettuceConnectionConfiguration.class, JedisConnectionConfiguration.class })
public class RedisAutoConfiguration {
    @Bean
	@ConditionalOnMissingBean(name = "redisTemplate")
	public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory)
			throws UnknownHostException {
		RedisTemplate<Object, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(redisConnectionFactory);
		return template;
	}
}
```

### RedisSessionConfiguration  
먼저, spring-autoconfigure-metadata.properties를 보면 RedisConnectionFactory 빈이 있으면 RedisSessionConfiguration가 적용됩니다.

```properties
org.springframework.boot.autoconfigure.session.RedisSessionConfiguration.ConditionalOnBean=org.springframework.data.redis.connection.RedisConnectionFactory
```

#### SpringBootRedisHttpSessionConfiguration
RedisSessionConfiguration가 등록되면 내부 클래스인 SpringBootRedisHttpSessionConfiguration가 포함되어 등록됩니다.

```java
@EnableConfigurationProperties(RedisSessionProperties.class)
class RedisSessionConfiguration {
    
    @Configuration
	public static class SpringBootRedisHttpSessionConfiguration extends RedisHttpSessionConfiguration {

		@Autowired
		public void customize(SessionProperties sessionProperties, RedisSessionProperties redisSessionProperties) {
			Duration timeout = sessionProperties.getTimeout();
			if (timeout != null) {
				setMaxInactiveIntervalInSeconds((int) timeout.getSeconds());
			}
			setRedisNamespace(redisSessionProperties.getNamespace());
			setFlushMode(redisSessionProperties.getFlushMode());
			setSaveMode(redisSessionProperties.getSaveMode());
			setCleanupCron(redisSessionProperties.getCleanupCron());
		}

	}
}
```

### @EnableRedisHttpSession
문제해결은 단순하게 이 어노테이션을 선언을 하는 것이었습니다.

