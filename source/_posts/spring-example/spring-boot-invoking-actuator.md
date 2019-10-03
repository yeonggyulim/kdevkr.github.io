---
title: 스프링 부트 애플리케이션 액츄에이터 호출하기
date: 2019-10-05
categories: [스프링, 액츄에이터]
---

# Actuator

## Actuator란 무엇인가?
`spring-boot-actuator` 모듈은 스프링 부트 애플리케이션이 프로덕션 환경일때 유용한 기능을 제공해준다. 예를 들어, 서버의 사용량을 모니터링하거나 서버 환경 정보를 알고 싶을때 실제로 서버에 접근하지 않아도 액츄에이터가 제공해주는 엔드포인트로 가져올 수 있게 해준다.

### Dependencies
```gradle
compile("org.springframework.boot:spring-boot-starter-actuator")
```
#### 4
##### 5
###### 6