---
    title: KDB 튜토리얼 - 변수 할당 및 테이블 생성
    date: 2020-03-05 12:00
    categories: [개발 이야기]
    tags: [KDB, Q]
---

1. [KDB 튜토리얼 - 설치 및 접속](/archives/kdb-tutorial/install-and-connection)
2. **KDB 튜토리얼 - 변수 할당 및 테이블 생성**
3. [KDB 튜토리얼 - Q-SQL](/archives/kdb-tutorial/q-sql)
4. [KDB 튜토리얼 - 그룹핑과 집계](/archives/kdb-tutorial/grouping-and-aggregation)
5. [KDB 튜토리얼 - 파일 다루기](/archives/kdb-tutorial/file)
6. [KDB 튜토리얼 - 네임스페이스](/archives/kdb-tutorial/namespace)
7. [KDB 튜토리얼 - 함수](/archives/kdb-tutorial/function)

## 들어가며
KDB+는 일반적인 데이터베이스와는 약간 다릅니다. 그것은 [데이터 유형](https://code.kx.com/q/basics/datatypes/)에서도 확인할 수 있습니다. 

|N|Name|Literal|Java|
|---|---|---|---|
|0|list|||
|1|boolean|0b|Boolean|
|2|guid||UUID|
|4|byte|0x00|Byte|
|5|short|0h|Short|
|6|int|0i|Integer|
|7|long|0j|Long|
|8|real|0e|Float|
|9|float|0f|Double|
|10|char|" "|Character|
|11|symbol|`|String|
|12|timestamp|dateDtimespan|Timestamp|
|13|month|2000.01m||
|14|date|2000.01.01|Date|
|15|datetime|dateTtime|Timestamp|
|16|timespan|00:00:00.000000000|Timespan|
|17|minute|00:00||
|18|second|00:00:00||
|19|time|00:00:00.000|Time|
|98|table|||
|99|dictionary|||
|100|lambda|||
|101|unary primitive|||

### 심볼
심볼은 백틱으로 시작하는 문자열이며 스트링과는 다릅니다.
> 스트링은 데이터 유형이 아닙니다.
```q
`symbol ~ "symbol"
0b
```
그리고 빈 심볼은 백틱으로만 표현됩니다.
```q
null `
1b
```

## 변수 및 테이블

### 변수 할당
현재 컨텍스트의 변수에 데이터를 할당하는 것은 `:`를 이용합니다.

```q
str:"string"
sym:`symbol
tab:([] x:1 2 3; y:2 4 6)
```

### 테이블 생성
사실 앞서 변수에 데이터를 할당하는 예제에서 테이블을 할당했었습니다. 바로 tab이라는 변수입니다.

**테이블 정의 문법**
테이블을 생성하는 구문은 다음과 같습니다.
```q
([] *c1*:*L1*; ...; *cn*:*Ln*)

t:([] name:`Dent`Beeblebrox`Prefect; iq:98 42 126)

flip `name`iq!(`Dent`Beeblebrox`Prefect;98 42 126)
    
name       iq 
--------------
Dent       98 
Beeblebrox 42 
Prefect    126
```

위 구문에서 [] 안에는 테이블의 키를 표현하여 키 테이블로 구성할 수 있습니다.

> 일반 테이블과 키 테이블은 다릅니다!

#### 빈 테이블 스키마
위 예제에서는 테이블을 생성하는 동시에 데이터를 추가했음을 확인할 수 있습니다. 그러면 데이터가 없는 빈 테이블은 어떻게 만들 수 있을까요?

```q
t:([] name:(); iq:())

name iq
-------
```

그리고 테이블 컬럼에 데이터 유형을 지정하는 것이 좋습니다.

```q
t:([] name:`symbol$(); iq:`int$())
```

#### 레코드 출력
테이블의 레코드를 확인하는 방법은 여러가지가 있습니다.

```q
t
select from t

name       iq 
--------------
Dent       98 
Beeblebrox 42 
Prefect    126
```

> 혹시 이상한 부분 눈치채셨나요?

일반적인 SQL의 SELECT 구문은 다음과 같습니다.

```sql
SELECT * FROM table
```

그런데 KDB+에서 사용하는 SQL 구문에서 와일드카드(*)는 표현하지 않습니다.

### 키 테이블
앞서 일반적인 테이블과 키 테이블은 다르다고 했습니다. 뭐가 다른걸까요?

키 테이블의 데이터 유형을 확인해보면 테이블이 아니라 사전입니다.

간단한 예제를 살펴보도록 하겠습니다. 다음과 같이 사전으로 키 테이블을 구성할 수 있습니다.
```q
v:flip `name`iq!(`Dent`Beeblebrox`Prefect;98 42 126)
k:flip (enlist `eid)!enlist 1001 1002 1003
kv: k!v

eid | name       iq 
----| --------------
1001| Dent       98 
1002| Beeblebrox 42 
1003| Prefect    126
```

#### 키 테이블 정의 문법
테이블 정의 문법에 []안에 키를 넣어 키 테이블을 만들수 있습니다.
```q
kv:([eid:`int$()] `symbol$name:(); iq:`int$())

eid| name iq
---| -------
```

또한, `xkey`를 활용해서 일반 테이블 컬럼중에서 기본 키를 지정하여 키 테이블을 만들 수 있습니다.

```q
t:([] eid:1001 1002 1003; name:`Dent`Beeblebrox`Prefect; iq:98 42 126)
kv: `eid xkey t

eid | name       iq 
----| --------------
1001| Dent       98 
1002| Beeblebrox 42 
1003| Prefect    126
```

그러면 반대로 키 테이블을 일반 테이블로 변환하려면 어떻게 할까요? 바로 `xkey`를 역으로 이용하면 됩니다.

```q
kv:([eid:1001 1002 1003] name:`Dent`Beeblebrox`Prefect; iq:98 42 126)
() xkey kv

eid  name       iq 
-------------------
1001 Dent       98 
1002 Beeblebrox 42 
1003 Prefect    126
```

그리고 이를 다시 쉽게 하는 방법도 있습니다.

```q
1!t

eid | name       iq 
----| --------------
1001| Dent       98 
1002| Beeblebrox 42 
1003| Prefect    126

0!kv

eid  name       iq 
-------------------
1001 Dent       98 
1002 Beeblebrox 42 
1003 Prefect    126
```

우리는 변수를 할당하는 방법과 테이블을 구성하는 방법도 알게되었습니다.

다음 시간에는 q-sql 이라는 q 언어에서 사용할 수 있는 SQL 구문에 대해서 알아보면서 테이블에 레코드를 저장하고 수정, 삭제하는 것을 살펴보겠습니다.


## 참고

- [Kdb+ and q documentation]()
- [Q for Mortals - Tables](https://code.kx.com/q4m3/8_Tables/)
