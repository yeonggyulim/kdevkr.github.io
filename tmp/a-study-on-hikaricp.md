---
    title: HikariCP에 대해서 알아보기
    date: 2020-01-23
    categories: [개발 이야기]
    tags: [Connection Pool, HikariCP]
---

> HikariCP is a "zero-overhead" production ready JDBC connection pool. 

## HikariCP
HikariCP는 Spring Boot 2에서 기본 커넥션 풀 의존성을 Tomcat-JDBC에서 변경한 커넥션 풀입니다. HikariCP가 강조하는 부분은 빠르고, 간단하고, 안정성있고 오버헤드가 적은 것입니다.

![](https://raw.githubusercontent.com/wiki/brettwooldridge/HikariCP/HikariCP-bench-2.6.0.png)

위 벤치마크 결과때문에 [스프링 부트 2.0의 default DBCP, hikariCP가 그렇게 빠르다던데?](https://jeong-pro.tistory.com/162)와 같은 글에서 빠르다는 것만 강조해서 오해가 있을 수 있는데 HikariCP에서 강조하는 중요점은 안정성입니다.

### 정확성과 신뢰성
HikariCP는 [정확성과 신뢰성에 대한 몇가지 사항](https://github.com/brettwooldridge/HikariCP/wiki/%22My-benchmark-doesn't-show-a-difference.%22#what-does-correctness-and-reliability-mean)을 통해 안정성을 추구합니다.

- 응답 시간 보증
- 카탈로그 재설정
- 읽기 전용 재설정
- 자동 커밋 재설정
- 트랜잭션 격리 재설정
- 롤백 시 리턴
- 일회성 프록시
- 열린 Statement 추적/닫기
- SQLException 상태 스캔
- SQL 경고 초기화

#### Tomcat DBCP와의 차이점
위 사항들을 종합해보면 Tomcat DBCP에는 여러가지 옵션을 통해 안정성을 가져올 수 있으나 그에 대한 비용이 발생한다고 이해할 수 있습니다.

```java
public TomcatDbcpProperties {
    private int initialSize = 0;
    private int maxActive = 8;
    private int maxIdle = 8;
    private int minIdle = 0;
    private String validationQuery;
    private boolean testOnBorrow = true;
    private boolean testWhileIdle = false;
    private int timeBetweenEvictionRunsMillis = -1;
    private int minEvictableIdleTimeMillis = MINUTES.toMillis(30);
    private boolean defaultAutoCommit;
}

public HikariCpProperties {
    private int maximumPoolSize = 10;
    private int minimumIdle = maximumPoolSize;
    private int connectionTimeout = SECONDS.toMillis(30);
    private int validationTimeout = SECONDS.toMillis(5);
    private int idleTimeout = MINUTES.toMillis(10);
    private int maxLifetime = MINUTES.toMillis(30);
    private boolean autoCommit = true;
    private String connectionTestQuery;
}
```

#### HikariCP.connectionTestQuery
HikariCP도 커넥션 유효성을 확인하기 위해 실행될 SQL 쿼리를 설정할 수 있습니다. 
> 다만, 데이터베이스가 JDBC4 `Connection.isValid()`를 사용하여 유효성을 확인하는 것을 추천합니다.


#### Statement Cache
[HikariCP-세팅시-옵션-설명](https://effectivesquid.tistory.com/entry/HikariCP-%EC%84%B8%ED%8C%85%EC%8B%9C-%EC%98%B5%EC%85%98-%EC%84%A4%EB%AA%85)이란 글에서 언급된 부분인데 이와 [관련된 이슈에 대한 HikariCP 개발자의 댓글](https://github.com/brettwooldridge/HikariCP/issues/488#issuecomment-154285114)이 있습니다.

Tomcat DBCP 또는 DBCP2와 같은 커넥션 풀은 PreparedStatement에 대한 캐시를 지원하지만 HikariCP는 PostgreSQL와 같은 데이터베이스 JDBC 드라이버처럼 자체적인 캐싱을 지원하는게 더 효율적이라고 생각한다고 합니다.

### 읽어보면 좋은 HikariCP 관련 글
- [ConnectionPool 성능 측정 (Updated)](https://debop.tumblr.com/post/99653590666/connectionpool-%EC%84%B1%EB%8A%A5-%EC%B8%A1%EC%A0%95-updated)
- [Monitoring HikariCP Log on Spring Boot](https://blog.jungbin.kim/notes/2019-05-19-springboot-hikaricp-log/)
- [HikariCP는 test-while-idle과 같은 커넥션 갱신 기능이 없을까?](https://pkgonan.github.io/2018/04/HikariCP-test-while-idle).


### 릴리즈 
https://github.com/brettwooldridge/HikariCP/releases

2020년 1월 10일에 HikariCP 3.4.1 릴리즈되었습니다.

```groovy
dependencies {
    implementation('com.zaxxer:HikariCP:3.4.1')
}
```

## 참고
- [My benchmark doesn't show a difference - HikariCP Wiki](https://github.com/brettwooldridge/HikariCP/wiki/%22My-benchmark-doesn't-show-a-difference.%22)
