---
    title: KDB 튜토리얼 - 함수
    date: 2020-03-07
    categories: [개발 이야기]
    tags: [KDB, Q]
---

1. [KDB 튜토리얼 - 설치 및 접속](/archives/kdb-tutorial/install-and-connection)
2. [KDB 튜토리얼 - 변수 할당 및 테이블 생성](/archives/kdb-tutorial/assign-variables-and-tables)
3. [KDB 튜토리얼 - Q-SQL](/archives/kdb-tutorial/q-sql)
4. [KDB 튜토리얼 - 그룹핑과 집계](/archives/kdb-tutorial/grouping-and-aggregation)
5. [KDB 튜토리얼 - 파일 다루기](/archives/kdb-tutorial/file)
6. [KDB 튜토리얼 - 네임스페이스](/archives/kdb-tutorial/namespace)
7. **KDB 튜토리얼 - 함수**
8. [KDB 튜토리얼 - 자바 클라이언트](/archives/kdb-tutorial/java-client)

## 들어가며
이번 시간에는 일반적인 데이터베이스의 Function을 만드는 것 처럼 KDB+에 함수를 만들고 호출하는 것을 알아봅니다. 

## 함수
함수 또한 변수와 테이블처럼 컨택스트에 할당할 수 있습니다.

### 함수 정의하기
함수 정의는 중괄호와 매개변수로 이루어진 표현식입니다.

{[p1;...;pn] e1; ...; em}

다음은 라디안 함수를 정의한 것입니다.
```q
PI: acos -1 
radian:{x * PI % 180.0}
```

> 매개변수 `[]`는 생략할 수 있습니다.

#### 함수로 데이터 추가하기
함수 안에서 테이블에 데이터를 추가하려면 `table,:data`를 이용해야합니다.

```q
.fn.insert.patient:{patient,:x 1b}
```

### 함수 사용하기
함수를 사용할때 매개변수는 대괄호에 표현합니다.

```q
radian[37.547889]
0.6553343

radian 37.547889
```

> 매개변수가 하나일 경우 대괄호를 생략할 수 있어요

## 참고
- [Q Mortals - Functions](https://code.kx.com/q4m3/6_Functions/)