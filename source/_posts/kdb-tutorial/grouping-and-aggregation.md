---
    title: KDB 튜토리얼 - 그룹핑과 집계
    date: 2020-03-04
    categories: [개발 이야기]
    tags: [KDB, Q]
---

1. [KDB 튜토리얼 - 설치 및 접속](/archives/kdb-tutorial/install-and-connection)
2. [KDB 튜토리얼 - 변수 할당 및 테이블 생성](/archives/kdb-tutorial/assign-variables-and-tables)
3. [KDB 튜토리얼 - Q-SQL](/archives/kdb-tutorial/q-sql)
4. **KDB 튜토리얼 - 그룹핑과 집계**
5. [KDB 튜토리얼 - 파일 다루기](/archives/kdb-tutorial/file)
6. [KDB 튜토리얼 - 네임스페이스](/archives/kdb-tutorial/namespace)
7. [KDB 튜토리얼 - 함수](/archives/kdb-tutorial/function)
8. [KDB 튜토리얼 - 자바 클라이언트](/archives/kdb-tutorial/java-client)

## 들어가며
이전 시간에 Q-SQL의 SELECT와 WHERE, ORDER BY에 대해서 다루었습니다. 이번에는 그룹핑과 집계를 알아봅니다.

## 그룹핑과 집계
SQL과 달리 KDB+의 그룹핑과 집계는 독립적으로 동작합니다.

### Group By

`by` 키워드로 그룹핑할 수 있습니다.

예를 들어, 일자별 검사 현황(time)를 월별 신규 검사 현황으로 그룹핑한다면 다음과 같습니다.
```q
select sum new_test, sum new_negative, sum new_confirmed, sum new_released, sum new_deceased by date.month from time

month  | new_test new_negative new_confirmed new_released new_deceased
-------| -------------------------------------------------------------
2020.01| 312      245          11            0            0           
2020.02| 93743    55478        3139          28           17          
2020.03| 52486    63242        2616          60           18          

```

### Aggregation

