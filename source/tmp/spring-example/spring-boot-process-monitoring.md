---
title: 스프링 부트 애플리케이션 프로세스 모니터링
date: 2019-07-14
categories: [스프링, 모니터링]
---

`spring-boot` 모듈에는 프로세스 모니터링에 유용한 파일을 만들어주는 클래스가 있다.

## ApplicationPidFileWriter
`ApplicationPidFileWriter`는 애플리케이션 프로세스 아이디를 포함하는 파일을 만들어주는 역할을 한다.

### Enable applicationPidFileWriter
기본적으로 applicationPidFileWriter는 활성화되어있지 않기 때문에 개별적으로 추가시켜야 한다.

```java
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(DemoApplication.class);
        application.addListeners(new ApplicationPidFileWriter());
        application.run(DemoApplication.class, args);
    }

}
```

`SpringApplication.addListener`s 함수를 사용해서 ApplicationPidFileWriter를 등록하게 되면 기본적으로 `application.pid`라는 파일을 만들어준다.

```properties
spring.pid.file=application.pid
```
이제 특정 포트를 사용하는 프로세스를 찾는 명령어를 수행하지 않아도 해당 파일 내용만 확인해도 `현재 동작중인 프로세스 아이디`를 확인할 수 있다.

## 프로세스 확인 명령어
기존 특정 포트를 사용하는 프로세스를 확인하던 명령어는 다음과 같다.

```sh
#linux
netstat -pltn | grep :8080

#window
netstat -aon | findstr :8080
TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING       1776
TCP    [::]:8080              [::]:0                 LISTENING       1776

java.exe                      1776 Console                    1    237,892 K
```

## 참고
- [Process Monitoring](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-process-monitoring.html)