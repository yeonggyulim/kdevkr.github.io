---
title: btree_gist를 이용한 타임스탬프 범위 조건 체크하기
date: 2019-12-23
categories: [데이터베이스, Postgres]
---

## 개념

### 타임스탬프를 위한 범위 유형
타임스탬프의 범위를 표현하기 위한 유형에는 tsrange(timestamp without time zone)와 tstzrange(timestamp with time zone)이 있습니다.

#### 포함 그리고 비포함 경계점
범위는 하한과 상한의 경계점을 가지고 있습니다. 포함 경계점(Inclusive bounds)은 경계점도 범위에 포함되는 것을 의미하고 비포함 경계점(Exclusive bounds)은 경계점이 범위에 포함되지 않습니다.

포함되는 경계점은 "["와 "]"로 표현되며, 포함하지 않는 경계점은 "("와 ")"로 표현됩니다. ([Section 8.17.5](https://www.postgresql.org/docs/9.3/rangetypes.html#RANGETYPES-IO))

#### 범위 생성자
각 범위 유형은 같은 이름의 생성자 함수를 가집니다. 생성자 함수를 이용하면 경계점에 대한 표현이 더 유연해집니다. 기본은 하한은 포함되고 상한은 포함되지 않는 "[ )"입니다.

```sql
SELECT tsrange(start_date, end_date);
SELECT tsrange(start_date, end_date, '[)');
```

### 범위에 대한 인덱스
GiST 와 SP-GiST는 범위 유형 컬럼에 인덱스를 만들 수 있습니다. 

```sql
CREATE INDEX reservation_idx ON reservation USING gist (during);
```

#### btree_gist
btree_gist는 timestamp with time zone, timestamp without time zone, varchar, text등과 같은 데이터 유형에 대해서 인덱스 연산자를 제공합니다.

만약 btree_gist가 Postgres 확장에 존재하지 않을 경우 다음과 같은 오류가 발생할 수 있습니다.
```sql
[42704] ERROR: data type character varying has no default operator class for access method "gist"
Hint: You must specify an operator class for the index or define a default operator class for the data type.

-- SUPERUSER 권한이 있는 계정으로 만들어야 합니다.
CREATE EXTENSION btree_gist;

-- 설치할 수 있는 확장 목록
SELECT * FROM pg_available_extensions;

-- 설치된 확장 목록
SELECT * FROM pg_extension;
```

### 범위에 대한 제약조건
UNIQUE는 스칼라 값에 대한 제약조건이지만 범위 유형에 대해서는 적합하지 않습니다. 대신에, EXCLUDE 제약조건이 더 적절한 경우가 많습니다. 제외 제약조건을 사용하면 범위 유형에 대해서 "non-overlapping"과 같은 제약조건을 지정할 수 있습니다.

예를 들어, 다음과 같이 && 연산자로 겹치는 시간이 포함되지 않도록 지정할 수 있습니다.
```sql
-- EXCLUDE [ USING index_method ] ( exclude_element WITH operator [, ... ] ) index_parameters [ WHERE ( predicate ) ]

CREATE TABLE overlap_times
(
    first_name INTEGER NOT NULL,
    last_name  VARCHAR NOT NULL,
    date_range TSRANGE NOT NULL,
    EXCLUDE USING gist (first_name WITH =, last_name WITH =, date_range WITH &&)
);
```

이처럼 제외 제약조건은 인덱스를 사용하여 구현되기 때문에 지정 연산자와 적절한 연산자 클래스가 연결되어야 합니다. 또한, amgettuple에 대한 액세스 방법을 지원해야하므로 [GIN](https://www.postgresql.org/docs/current/gin-intro.html)은 사용할 수 없습니다.



## Example

이 테이블은 프로그램 참여그룹에 속하는 참여고객을 표현하는 관계형 테이블입니다.
하나의 참여고객이 프로그램 참여고객에 속하는 경우 속해있던 기간이 중복되거나 겹치면 안되는 조건이 있어야합니다.
```sql
CREATE TABLE program_party_rel
(
    party_id       VARCHAR(12)                 NOT NULL,
    ven_u_id       VARCHAR(12)                 NOT NULL,
    start_date     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_date       TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    base_rate      FLOAT,
    incentive_rate FLOAT,
    penalty_rate   FLOAT,
    CONSTRAINT program_party_rel_pk PRIMARY KEY (party_id, ven_u_id, start_date),
    CONSTRAINT program_party_rel_party_id_fk FOREIGN KEY (party_id) REFERENCES program_party (party_id),
    CONSTRAINT program_party_rel_ven_u_id_fk FOREIGN KEY (ven_u_id) REFERENCES ven (ven_u_id),
    CHECK ( start_date < end_date )
);
```

기간을 표현할 수 있는 start_date, end_date 컬럼이 존재하므로 앞서 알아본 EXCLUDE 절을 이용해 제외 제약조건을 만들도록 하겠습니다.

```sql
-- index_method : GiST
-- exclude_element : tsrange
-- operator : &&
ALTER TABLE program_party_rel 
ADD CONSTRAINT program_party_rel_non_overlapping_period
EXCLUDE USING GIST (tsrange(start_date, end_date) WITH &&)
```

여기에 참여고객 그룹별 참여고객에 대해 제약조건을 체크해야하므로 이에 대한 조건이 추가되어야 합니다.


```sql
-- exclude_element : party_id, ven_u_id, tsrange
-- operator : =, &&
ALTER TABLE program_party_rel 
ADD CONSTRAINT program_party_rel_non_overlapping_period
EXCLUDE USING GIST (party_id WITH =, ven_u_id WITH =, tsrange(start_date, end_date) WITH &&)

[42704] ERROR: data type character varying has no default operator class for access method "gist"
Hint: You must specify an operator class for the index or define a default operator class for the data type.
```

VARCHAR형에 대해 적절한 연산자 클래스가 없어 GiST 인덱스를 만들수 없다고 하므로 btree_gist 확장을 설치하여 연산자 및 클래스를 추가합니다.

```sql
CREATE EXTENSION btree_gist;
```




```sql
ALTER TABLE program_party_rel 
ADD CONSTRAINT program_party_rel_non_overlapping_period 
EXCLUDE USING GIST (
    party_id WITH =,
    ven_u_id WITH =,
    TSRANGE(start_date, end_date, '[)') WITH &&
)
```



## 참고
- [Postgres - Range Types](https://www.postgresql.org/docs/9.6/rangetypes.html)
- [Postgres - btree_gist](https://www.postgresql.org/docs/9.6/btree-gist.html)
- [Postgres constraint for unique datetime range](https://stackoverflow.com/questions/26735955/postgres-constraint-for-unique-datetime-range)
- [No overlapping timestamp with condition](https://dba.stackexchange.com/questions/206828/no-overlapping-timestamp-with-condition)