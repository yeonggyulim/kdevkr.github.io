---
    title: 왜 트랜잭션 격리 레벨이 다르지?
    date: 2020-02-08
    categories:
        - 개발 이야기
        - 이슈
    tags:
        - 스프링
        - 데이터베이스
        - 트랜잭션
---

## 들어가며
프로젝트 개발하던 도중 발생한 상황으로 클라이언트에서 프로미스를 통해 HTTP 요청을 순차적으로 연결하던 부분에서 서버 측으로부터 오류 응답을 받았습니다. 해당 API는 어떤 옵션을 설정하고 해제하는 것이었는데 특정 조건하에 그 옵션을 유일하게 설정해야하므로 옵션을 설정하기 전에 유일한지 체크하도록 되어있습니다.  

**_여기서 잠깐!_**
프로미스로 연결하여 서버에 순차적으로 요청한 이유는 다음과 같습니다. 해당 API는 옵션을 설정하고 해제할 수 있는데 이미 옵션을 사용하고 있는 것을 해제해야 다시 설정할 수 있기 때문입니다. 

그래서 프로미스로 연결하여 먼저 설정되어있는 옵션을 해제하도록 요청하였고 서버는 해당 요청에 의해 데이터가 변경되었다고 응답하였습니다.

> 이 과정에서는 오류가 없습니다.

그리고 옵션이 해제되었다는 응답에 대하여 다시한번 서버에 옵션을 설정하겠다고 요청했을 때 이미 설정된 옵션이 있다는 오류를 응답하였습니다.

이러한 오류를 응답했다는 것은 두번째 요청에서 진행되었던 트랜잭션 내에서 이전 요청에 의해 커밋된 내용이 반영되기 전의 데이터로 읽기 때문이라고 예상할 수 있습니다.

그러면 이제 우리는 트랜잭션 간의 격리 레벨을 확인해봐야합니다.

## 트랜잭션 격리 레벨  
맨 처음에는 옵션을 유일하게 설정할 수 있는지 체크하는 부분이 이상한지 확인했으나 그 부분은 정상이었습니다. 그 다음에 의심한 부분이 트랜잭션이었습니다.

### PostgreSQL
PostgreSQL이 제공하는 트랜잭션 격리 레벨은 다음과 같습니다.

- Read uncommitted
- Read committed
- Repeatable read
- Serializable

이 중에서 SQL 표준에서 Dirty Read가 가능한 레벨은 `Read uncommitted`입니다. 그래서 PostgreSQL의 기본 트랜잭션 격리 레벨이 무엇인지 찾아보았습니다. 

> Read Committed is the default isolation level in PostgreSQL.

포스트그레의 기본 트랜잭션 격리 레벨은 Read Committed.

> 그러면, Dirty Read가 안되야하는데?.. 뭐가 문제인거야...

잠깐만요, Read uncommitted에 Dirty Read 레벨에 _Allowed, but not in PG_ 라고 표시되어있습니다. 이 의미는 포스트그레 밖에서는 Dirty Read를 허용한다는 말입니다.

> 그러면 Postgre 앞단에서 Read uncommitted를 트랜잭션 격리 레벨로 사용하는 거잖아?

### HikariCP DataSource
HikariCP를 커넥션 풀로 사용하고 있어 기본 트랜잭션 격리 레벨이 무엇인지 살펴봅시다. 

> 🔠transactionIsolation
This property controls the default transaction isolation level of connections returned from the pool. If this property is not specified, the default transaction isolation level defined by the JDBC driver is used. Only use this property if you have specific isolation requirements that are common for all queries. The value of this property is the constant name from the Connection class such as TRANSACTION_READ_COMMITTED, TRANSACTION_REPEATABLE_READ, etc. Default: driver default

transactionIsolation 옵션을 설정하지 않으면 JDBC 드라이버의 기본 트랜잭션 격리 레벨을 사용한다고 합니다.

### @Transactional
애플리케이션이 스프링을 기반이기 때문에 트랜잭션 관리를 스프링에게 위임하였습니다. 

> The isolation level is ISOLATION_DEFAULT.

그러면 ISOLATION_DEFAULT은 뭘까요?

`spring-tx` 모듈의 TransactionDefinition 인터페이스를 살펴보면 ISOLATION_DEFAULT는 개별적인 DB 설정을 따르기 때문에 PostgreSQL를 사용하고 있으면 ISOLATION_READ_COMMITTED이 적용된다고 봐야합니다.

그래서 혹시나 하는 마음에 해당 리파지토리 함수에 @Transactional을 선언하고 Isolation.READ_COMMITTED을 명시해보았습니다.

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public Integer settleable(String peId, String rId) throws SQLException {
    return createStoredFunction("program_enroll$settleable")
            .addString(peId)
            .addString(rId)
            .execute(Integer.class);
}
```

결과는 오류가 나지 않았습니다. 이건 무슨 상황일까요?...

데이터베이스의 기본 트랜잭션 격리 레벨이 READ_COMMITTED,
HikariCP의 기본 트랜잭션 격리 레벨은 JDBC 드라이버의 기본값,
스프링 트랜잭션 매니저의 기본 트랜잭션 격리 레벨은 개별적인 DB를 따른다.

아 PostgreSQL JDBC 드라이버를 살펴보지 않았습니다.

### PgConnection  
다음은 PgConnection 클래스의 트랜잭션 격리 레벨을 가져오는 함수입니다.

```java
public int getTransactionIsolation() throws SQLException {
    checkClosed();

    String level = null;
    final ResultSet rs = execSQLQuery("SHOW TRANSACTION ISOLATION LEVEL"); // nb: no BEGIN triggered
    if (rs.next()) {
      level = rs.getString(1);
    }
    rs.close();

    // TODO revisit: throw exception instead of silently eating the error in unknown cases?
    if (level == null) {
      return Connection.TRANSACTION_READ_COMMITTED; // Best guess.
    }

    level = level.toUpperCase(Locale.US);
    if (level.equals("READ COMMITTED")) {
      return Connection.TRANSACTION_READ_COMMITTED;
    }
    if (level.equals("READ UNCOMMITTED")) {
      return Connection.TRANSACTION_READ_UNCOMMITTED;
    }
    if (level.equals("REPEATABLE READ")) {
      return Connection.TRANSACTION_REPEATABLE_READ;
    }
    if (level.equals("SERIALIZABLE")) {
      return Connection.TRANSACTION_SERIALIZABLE;
    }

    return Connection.TRANSACTION_READ_COMMITTED; // Best guess.
}
```

역시나 트랜잭션 레벨을 가져오지 못하면 TRANSACTION_READ_COMMITTED을 기본으로 사용합니다. 그러면 여기서 추측할 수 있습니다.  

1. 애플리케이션의 트랜잭션 격리 레벨이 READ_UNCOMMITTED으로 설정 되어있다.
2. Connection에서 트랜잭션 격리 레벨 확인 시 READ_UNCOMMITTED을 응답 받는다. 

> 우선은 OKKY에 [질문](https://okky.kr/article/677130) 하였습니다.
> 답변이 달리면 추가 작성하겠습니다.


## 참고

- [Postgres Transaction Isolation](https://www.postgresql.org/docs/9.6/transaction-iso.html)
- [HikariCP Configuration](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby)
- [Spring @Transactional](https://docs.spring.io/spring/docs/current/spring-framework-reference/data-access.html#transaction-declarative-attransactional-settings) 

