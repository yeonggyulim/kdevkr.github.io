---
    title: 스프링 테스트 코드 작성하기
    date: 2021-01-09
    categories: [개발 이야기]
    tags: [Test, JUnit, Mockito, REST-Assured, Spock]
---

나에게 2019년은 테스트 코드를 작성하지 않은 해였다. 테스트 코드를 작성하는 것이 좋다고는 알고 있지만 테스트 코드를 작성하는데 할애하는 시간이 너무 아까웠다. (ㅜㅜ)

2020년에는 다양한 기술을 사용해서 테스트 코드를 작성해보고자 한다.

스프링에서 테스트 코드를 작성할 때 사용하는 라이브러리들을 보면 다음과 같다.

## Dependencies
JUnit, AssertJ, Mockito, DBUnit, REST Assured, Spock을 사용하자.

```groovy
// https://joel-costigliola.github.io/assertj/
testCompile group: 'org.assertj', name: 'assertj-core', version: '3.14.0'
// https://junit.org/junit5/
testCompile group: 'org.junit.jupiter', name: 'junit-jupiter-api', version: '5.5.2'
// https://site.mockito.org/
testCompile group: 'org.mockito', name: 'mockito-junit-jupiter', version: '3.2.4'
// http://dbunit.sourceforge.net/
testCompile group: 'org.dbunit', name: 'dbunit', version: '2.6.0'
// http://rest-assured.io/
testCompile group: 'io.rest-assured', name: 'spring-mock-mvc', version: '4.1.2'
// https://github.com/spockframework/spock
testCompile group: 'org.spockframework', name: 'spock-spring', version: '1.3-groovy-2.5'
```

## Tests

### Bean Validation Test

### Repository DAO Test

### Mock Service Test

### REST API Test
서비스 계층까지 테스트를 했으므로 이번에는 REST Assured를 이용한 API 테스트 방법을 알아보자

### Response Data Validation Test
API 응답 데이터가 XML 또는 JSON일 때 JsonPath를 이용해서 데이터 구조 검증을 해보자


## 참고
- [Spring Boot Testing best practices](https://pivotal.io/application-modernization-recipes/testing/spring-boot-testing-best-practices)
- [스프링부트에서 DbUnit 을 이용하여 DB 테스트 해보기](http://woowabros.github.io/experience/2019/11/06/db-unit.html)
- [Hamcrest vs. AssertJ](https://dzone.com/articles/hamcrest-vs-assertj-assertion-frameworks-which-one)
- [Optimizing Spring Integration Tests](https://www.baeldung.com/spring-tests)
- [Spring Boot Test](https://meetup.toast.com/posts/124)
- [Testing Best Practices for Java + Spring Apps](https://medium.com/personal-capital-tech-blog/testing-best-practices-for-java-spring-apps-762e9fde39ec)
- [Service Layer Testing in Spring Boot (feat. Mockito)](https://velog.io/@dpudpu/3)
- [Introduction to JsonPath](https://www.baeldung.com/guide-to-jayway-jsonpath)
- [REST-assured Support for Spring MockMvc](https://www.baeldung.com/spring-mock-mvc-rest-assured)