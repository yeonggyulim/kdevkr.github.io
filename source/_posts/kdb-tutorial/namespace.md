---
    title: KDB 튜토리얼 - 네임스페이스
    date: 2020-03-06
    categories: [개발 이야기]
    tags: [KDB, Q]
---

1. [KDB 튜토리얼 - 설치 및 접속](/archives/kdb-tutorial/install-and-connection)
2. [KDB 튜토리얼 - 변수 할당 및 테이블 생성](/archives/kdb-tutorial/assign-variables-and-tables)
3. [KDB 튜토리얼 - Q-SQL](/archives/kdb-tutorial/q-sql)
4. [KDB 튜토리얼 - 그룹핑과 집계](/archives/kdb-tutorial/grouping-and-aggregation)
5. [KDB 튜토리얼 - 파일 다루기](/archives/kdb-tutorial/file)
6. **KDB 튜토리얼 - 네임스페이스**
7. [KDB 튜토리얼 - 함수](/archives/kdb-tutorial/function)
8. [KDB 튜토리얼 - 자바 클라이언트](/archives/kdb-tutorial/java-client)

## 들어가며
KDB+를 다루면서 변수 또는 테이블, 함수를 현재 컨텍스트에 할당하였습니다. 그런데 말입니다. 만약, 여러 스크립트에서 똑같은 변수 이름을 사용한다면 어떻게 될까요? A.q라는 스크립트가 먼저 수행되고 B.q가 스크립트가 나중에 수행되는데 충돌된 이름이 있다면 A.q 스크립트에서 할당한 변수는 덮어쓰여지고 맙니다.

KDB+에는 이러한 변수 이름이 충돌되는 문제를 해결하기 위하여 네임스페이스라는 특별한 공간을 제공합니다.

> 자바에서 패키지라고 볼 수 있겟네요

## 네임스페이스
네임스페이스는 `.`를 사용하여 구분하며 q에서는 컨텍스트라고 부릅니다. 예를 들어, `.jaxb.x`라는 변수는 사실 `.jaxb` 컨텍스트에 존재하는 `x` 입니다.

### 컨텍스트
q의 네임스페이스는 사전으로 구현되어있습니다. 각 컨텍스트는 키가 네임스페이스의 심볼릭 이름의 사전입니다.

다음과 같이 `.variables` 컨텍스트에 변수를 할당하였다고 할때 `.variables`를 확인해봅시다.
```q
.variables.DATE_UNIT:`YEAR`MONTH`DAY
.variables.TIME_UNIT:`HOUR`MINUTE_30`MINUTE_15`MINUTE_5`MINUTE
.variables.DATETIME_UNIT:.variables.DATE_UNIT,.variables.TIME_UNIT

.variables

                      | ::
DATE_UNIT             | `YEAR`MONTH`DAY
TIME_UNIT             | `HOUR`MINUTE_30`MINUTE_15`MINUTE_5`MINUTE
DATETIME_UNIT         | `YEAR`MONTH`DAY`HOUR`MINUTE_30`MINUTE_15`MINUTE_5`MINUTE
```

> 물론 컨텍스트 안에 컨텍스트로 구분할 수 있습니다.
> 대신에 어떠한 값이 할당되어있으면 안됩니다.

### 컨텍스트 내 할당된 이름 목록
컨텍스트에 대하여 `key` 키워드를 사용하면 할당된 모든 이름을 나열할 수 있습니다.

```q
/ key context
key `.
select from `.
get `.

/ 중첩된 컨텍스트
key `.util
`convert`validate
```

### 컨텍스트 내 할당된 이름 삭제
컨텍스트는 사전이기 때문에 할당된 이름을 제거할 수 있습니다.

```q
get `.

v          | +`name`iq!(`Dent`Beeblebrox`Prefect;98 42 126)
k          | +(,`eid)!,1001 1002 1003
kv         | (+(,`eid)!,1001 1002 1003)!+`name`iq!(`Dent`Beeblebrox`Prefect;98 42 126)

delete v, k from `.
kv         | (+(,`eid)!,1001 1002 1003)!+`name`iq!(`Dent`Beeblebrox`Prefect;98 42 126)
```

> 삭제하는 행위임을 명심하십시오.

### 컨텍스트 저장 및 불러오기

```q
/ file_path set get context
`:data/variables set get `.

get `:data/variables

time   | +`date`acc_test`acc_negative`acc_confirmed`acc_released`acc_deceased`new_test`new_negative`new_confirmed`new_released`new_deceased!(2020.01.20 2020.01.21 2020.01.22 2020.01.23 2020.01.24 2..
patient| (+(,`id)!,1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 6..
route  | +`id`date`province`city`visit`latitude`longitude!(1 1 2 2 3 3 3 3 3 3 3 3 3 4 4 4 4 5 5 5 5 5 5 5 5 5 6 6 6 7 7 8 8 8 8 8 8 9 10 10 11 11 12 12 12 12 12 12 12 12 12 12 12 12 12 12 12 12 12..

```

반대로 파일에 저장된 컨텍스트 정보를 가져와 다시 덮어쓸수 있습니다.

```q
`.varibales set get `:data/varibales
```

## KDB+ 네임스페이스
KDB+가 기본으로 제공하는 네임스페이스는 다음과 같습니다.

### .j
이 네임스페이스에는 사전을 JSON으로 변환하는 함수를 포함하고 있습니다.

#### Serialize
테이블을 JSON으로 직렬화할 수 있습니다.

```q
/ .j.j x
.j.j select from patient where birth_year >= 1992

"[{\"id\":9,\"sex\":\"female\",\"birth_year\":1992,\"country\":\"Korea\",\"region\":\"capital area\",\"group\":\"\",\"infection_reason\":\"contact with patient\",\"infection_order\":2,\"infected_by..

`:data/patient.json 0: enlist .j.j select from patient where birth_year >= 1992
```

#### Deserialize
JSON으로 직렬화하여 저장한 것을 다시 역직렬화할 수 있습니다.

```q
/ json_string: read0 `:data/patient.json
/ json_flat: raze json_string

.j.k raze read0 `:data/patient.json
```

### .h
.h 네임스페이스는 문자열을 HTML로 마크업하거나 데이터를 다양한 형식으로 변환, HTTP 응답 내용을 만드는 함수를 포함합니다.

```q
/ .h.hu x
.h.hu "http://www.naver.com"

"http%3a%2f%2fwww.naver.com"

/ .h.hy
`:data/response.txt 0: enlist .h.hy[`json] .j.j .system.info

HTTP/1.1 200 OK
Content-Type: application/json
Connection: close
Content-Length: 180

{"operating_system":"l32","core":2,"proccess_id":7,"quiet_mode":true,"version":3.6,"init_script":"/root/_startup.q","host":"172.17.0.1","timestamp":"2020-03-07T03:25:45.029869000"}
```

#### 기본 웹 서버
KDB+는 기본적으로 웹 서버를 제공합니다. 브라우저로 http://localhost:5600/로 접속해보면 사용자 인증 후 간단하게 현재 컨텍스트 정보를 확인할 수 있는 페이지를 응답합니다.

![](/images/2020/kdb-web.PNG)

### .Q
.Q 네임스페이스는 유용한 유틸리티 함수가 포함되어있습니다.

다음은 메모리 사용량 통계를 보고 가비지 콜렉션을 수행하는 예제입니다.
```q
/ memory stats
.Q.w[]

used| 1315280
heap| 67108864
peak| 67108864
wmax| 0
mmap| 0
mphy| 2085904384
syms| 1328
symw| 47056

/ garbage collect
.Q.gc[]
```

### .z
.z 네임스페이스에는 시스템 정보 또는 통신 콜백 함수가 포함되어있습니다.

몇가지만 사용해보겠습니다.
```q
.system.host: .Q.host .z.a
.system.info: `operating_system`core`proccess_id`quiet_mode`version`init_script`host`timestamp!(.z.o;.z.c;.z.i;.z.q;.z.K;.z.f;.system.host;.z.p)

operating_system| `l32
core            | 2i
proccess_id     | 7i
quiet_mode      | 1b
version         | 3.6
init_script     | `/root/_startup.q
host            | `172.17.0.1
timestamp       | 2020.03.07D03:25:45.029869000
```

## 참고
- [Q Motals - Workspace Organization](https://code.kx.com/q4m3/12_Workspace_Organization/)  