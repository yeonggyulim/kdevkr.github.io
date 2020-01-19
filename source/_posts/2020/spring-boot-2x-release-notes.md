---
    title: 스프링 부트 2.X 릴리즈 노트
    date: 2021-01-19
    categories: [개발 이야기]
---

[스프링 부트 1.5.4에서 2.0으로 마이그레이션 하기](https://github.com/)에 이어서 번외편으로 스프링 부트 2.X의 릴리즈 노트와 함께 가이드 문서를 확인해보고자 합니다.

### 2.0
리액티브 스택을 통한 비동기 및 논-블로킹 API를 지원하며 액추에이터와 관련된 부분이 많이 변경되었습니다.

- [리액티브 스택](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html) 지원 (WebFlux)
- WebFlux를 위한 Embedded Netty Server
- [HTTP/2](https://developers.google.com/web/fundamentals/performance/http2?hl=ko) 지원 (JDK 8 제외) - Undertow 1.4.0+ 또는 Tomcat 9+ with JDK9
- 새로운 `Binder` API 지원 및 프로퍼티 바인딩 매커니즘 수정
- Gradle 플러그인 개선
- 액추에이터 앤드포인트 개선
    - Spring REST Docs를 이용한 [액추에이터 API](https://docs.spring.io/spring-boot/docs/2.0.x/actuator-api/html/) 문서 지원
    - 자체 Metrics API가 아닌 [micrometer.io](https://micrometer.io/) 사용
    - `sessions` 액추에이터 앤드포인트에서 세션을 찾고 삭제할 수 있음
    - `loggers` 액추에이터 앤드포인트로 로거 레벨 초기화 지원
    - `scheduledtasks` 액추에이터 앤드포인트로 예약 작업 리뷰 가능
    - 
- 기본 데이터베이스 폴링 기술을 Tomcat Pool에서 HikariCP로 변경
- 임베디드 컨테이너 사용 시 HTTP 포트와 함께 컨텍스트 패스를 로그로 제공
- JSON 지원을 위한 `spring-boot-starter-json` 스타터 제공
- 쿼츠 스케줄러 자동 구성을 위한 `spring-boot-starter-quartz` 스타터 제공
    - https://docs.spring.io/spring-boot/docs/2.0.x/reference/htmlsingle/#boot-features-quartz
- @ConditionalOnBean의 논리 충족 조건이 `OR`에서 `AND`로 변경
- 움직이는 ASCII 아트 지원 (ex. animated GIF banners)
  ![](https://github.com/spring-projects/spring-boot/wiki/images/animated-ascii-art.gif)


#### 릴리즈 노트
https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.1-Release-Notes
- 스프링 프레임워크 5.1
- 빈 오버라이딩 방지
- 자동 구성 제외
- 액추에이터 앤드포인트 보안
- HttpPutFormContentFilter 제외
- json-simple의 의존성 관리 제거
- Lombok 1.18
- 내장 웹 서버의 일관된 HTTP 헤더 사이즈 (8kB)
- Java 11 지원
- 향상된 프로파일 표현
- ThreadPoolTaskExecutor 자동 구성 지원
- 태스크 스케줄을 위한 ThreadPoolTaskScheduler 자동 구성
- 로그 그룹 지원
```
# define the group
logging.group.tomcat=org.apache.catalina, org.apache.coyote, org.apache.tomcat

# use the group (possibly in a different configuration file)
logging.level.tomcat=TRACE
```
- Spring Data JDBC 지원
- 

### 

### 2.1

### 2.2