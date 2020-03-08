---
    title: KDB 튜토리얼 - 자바 클라이언트
    date: 2020-03-08
    categories: [개발 이야기]
    tags: [KDB, Q]
---

1. [KDB 튜토리얼 - 설치 및 접속](/archives/kdb-tutorial/install-and-connection)
2. [KDB 튜토리얼 - 변수 할당 및 테이블 생성](/archives/kdb-tutorial/assign-variables-and-tables)
3. [KDB 튜토리얼 - Q-SQL](/archives/kdb-tutorial/q-sql)
4. [KDB 튜토리얼 - 그룹핑과 집계](/archives/kdb-tutorial/grouping-and-aggregation)
5. [KDB 튜토리얼 - 파일 다루기](/archives/kdb-tutorial/file)
6. [KDB 튜토리얼 - 네임스페이스](/archives/kdb-tutorial/namespace)
7. [KDB 튜토리얼 - 함수](/archives/kdb-tutorial/function)
8. **KDB 튜토리얼 - 자바 클라이언트**

## 들어가며
우리는 KDB+에 직접 접근하여 변수 할당, 테이블 생성, 함수 생성, 데이터 저장등을 해왔습니다. 자바 애플리케이션에서 일반적인 데이터베이스로 접근할 때 데이터소스를 이용하는 것처럼 다양한 애플리케이션에서 사용할 수 있는 클라이언트 API를 제공합니다.

이번 시간에는 자바 애플리케이션에서 KDB+에 접근하여 함수를 호출하거나 응답을 받을 수 있는 [javakdb](https://github.com/KxSystems/javakdb) 클라이언트를 사용해보고자 합니다.

## c.java
`c.java`는 TCP/IP로 kdb+와 Java 간의 통신을 위한 드라이버입니다.

이 드라이버는 다음과 같은 기능을 제공합니다.
- kdb+ 쿼리
- kdb+ 퍼블리셔 구독
- kdb+ 컨슈머로 퍼블리싱

그 중에서 우리는 kdb+ 쿼리 기능을 사용할 것입니다.

### Connection
`c` 생성자는 새로운 커넥션 인스턴스를 만듭니다.

```java
c c = new c("localhost",5600,"kdev:kdev");
```

### 메시지 보내기
`c.k` 또는 `c.ks` 함수를 통해 `c` 클라이언트가 KDB+로 메시지를 보내고 응답을 받을 수 있습니다.

- c.k() : 동기 메시지
- c.ks() : 비동기 메시지

```java
c.ks("-1\"Hello World\"");

// in log
Hello World
```

### 메시지 응답 가져오기
`.Q.w[]` 메시지를 보내어 현재 메모리 사용량 통계 정보를 응답받아 표시해보겠습니다.
```java
Object k = c.k(".Q.w[]");
if(k instanceof kx.c.Dict) {
    kx.c.Dict dict = (kx.c.Dict) k;

    String[] keys = (String[]) dict.x;
    long[] values = (long[]) dict.y;

    for(int i = 0; i < keys.length; i++) {
        String key = keys[i];
        long value = values[i];
        System.out.println(key + ":" + value);
    }
}

// system console
used:775792
heap:67108864
peak:67108864
wmax:0
mmap:0
mphy:2085904384
syms:799
symw:29324
```

`.Q.w[]` 결과는 사전이므로 `kx.c.Dict` 오브젝트로 키와 값을 구분하여 가져올 수 있습니다.

#### JSON 응답
메시지 응답이 문자열인 경우 char[] 오브젝트를 결과로 받습니다. char[]를 String으로 변환하면 JSON String으로 가져올 수 있습니다.

```java
Object k = c.k(".j.j select from patient where sex = `female, state = `deceased");
String r = new String((char[]) k);
System.out.println(r);
```

_System Console_

```json
[{"id":38,"sex":"female","birth_year":1963,"country":"Korea","region":"Daegu","group":"","infection_reason":"","infection_order":null,"infected_by":null,"contact_number":null,"confirmed_date":"2020-02-18","released_date":"","deceased_date":"2020-02-23","state":"deceased"},{"id":205,"sex":"female","birth_year":1965,"country":"Korea","region":"Gyeongsangbuk-do","group":"Cheongdo Daenam Hospital","infection_reason":"","infection_order":null,"infected_by":null,"contact_number":null,"confirmed_date":"2020-02-22","released_date":"","deceased_date":"2020-02-21","state":"deceased"},{"id":925,"sex":"female","birth_year":1951,"country":"Korea","region":"Gyeongsangbuk-do","group":"Shincheonji Church","infection_reason":"contact with patient","infection_order":null,"infected_by":null,"contact_number":null,"confirmed_date":"2020-02-25","released_date":"","deceased_date":"2020-02-24","state":"deceased"},{"id":2614,"sex":"female","birth_year":1943,"country":"Korea","region":"Daegu","group":"","infection_reason":"","infection_order":null,"infected_by":null,"contact_number":null,"confirmed_date":"2020-02-29","released_date":"","deceased_date":"2020-03-01","state":"deceased"},{"id":2769,"sex":"female","birth_year":1934,"country":"Korea","region":"Daegu","group":"","infection_reason":"","infection_order":null,"infected_by":null,"contact_number":null,"confirmed_date":"2020-02-29","released_date":"","deceased_date":"2020-03-02","state":"deceased"},{"id":4046,"sex":"female","birth_year":1962,"country":"Korea","region":"Daegu","group":"","infection_reason":"","infection_order":null,"infected_by":null,"contact_number":null,"confirmed_date":"2020-03-01","released_date":"","deceased_date":"2020-03-01","state":"deceased"}]
```

#### Table 응답
메시지 응답이 테이블일 경우에는 `kx.c.Flip` 오브젝트로 컬럼과 값을 구분하여 가져올 수 있습니다.

```java
Object k = c.k("select from time");
kx.c.Flip r = (kx.c.Flip) k;
String[] x = r.x;
Object[] y = r.y;
```

> 왠만하면 JSON 으로 변환해서 응답받고 이를 자바 빈 오브젝트로 변환하는게 좋을 것 같습니다.

이제 우리는 자바 애플리케이션에서도 메시지를 호출하여 함수를 실행할수도 있고 응답을 받을 수도 있습니다.

이상으로 KDB 튜토리얼을 마칩니다.

## 참고 

- [Using Java with kdb+](https://code.kx.com/v2/interfaces/java-client-for-q/)