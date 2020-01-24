---
title: 스프링 부트 애플리케이션 JSON 처리
date: 2019-07-15
categories: [스프링, JSON]
---

스프링 부트 애플리케이션은 JSON 매핑 라이브러리로 Gson, Jackson, JSON-B와의 통합을 제공한다. 기본적으로 사용하는 라이브러리는 `Jackson`이다.

> JSON 라이브러리 벤치마킹 포스트를 살펴보면 대용량의 JSON 데이터 처리는 Jackson이 유용하며 경량의 JSON 데이터 처리는 Gson이 유용하다고 한다.

## How to customize the jackson ObjectMapper
https://docs.spring.io/spring-boot/docs/current/reference/html/howto-spring-mvc.html#howto-customize-the-jackson-objectmapper




## JSON Libraries

### JSON.simple
https://github.com/fangyidong/json-simple

### FasterXML.Jackson
https://github.com/FasterXML/jackson

### Google.Gson
https://github.com/google/gson

### Netplex.Json-smart
https://github.com/netplex/json-smart-v2

## 참고
- [The Ultimate JSON Library: JSON.simple vs GSON vs Jackson vs JSONP](https://blog.overops.com/the-ultimate-json-library-json-simple-vs-gson-vs-jackson-vs-json/?utm_content=buffer239cc&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer)