---
    title: KDB 튜토리얼 - CSV to Table
    date: 2020-03-05 15:00
    categories: [개발 이야기]
    tags: [KDB, Q]
---

1. [KDB 튜토리얼 - 설치 및 접속](/archives/kdb-tutorial/install-and-connection)
2. [KDB 튜토리얼 - 변수 할당 및 테이블 생성](/archives/kdb-tutorial/assign-variables-and-tables)
3. **KDB 튜토리얼 - CSV to Table**
4. [KDB 튜토리얼 - Q-SQL](/archives/kdb-tutorial/q-sql)
5. [KDB 튜토리얼 - 그룹핑과 집계](/archives/kdb-tutorial/grouping-and-aggregation)
6. [KDB 튜토리얼 - 함수](/archives/kdb-tutorial/function)
7. [KDB 튜토리얼 - 파일 다루기](/archives/kdb-tutorial/file)
8. [KDB 튜토리얼 - 네임스페이스](/archives/kdb-tutorial/namespace)

## 들어가며
이번 시간에는 q-sql를 다루기전 CSV 파일 데이터를 테이블로 구성하는 것을 다루겠습니다.

현재 국내에 COVID-19 확산으로 인해 발생한 정보를 CSV로 구성한 [Coronavirus-Dataset](https://github.com/jihoo-kim/Coronavirus-Dataset)이 있어 이를 활용합니다.

## CSV and Tables
`q`는 CSV 파일의 내용을 불러와서 쉽게 테이블로 구성할 수 있습니다.

### CSV to Table
CSV 파일을 로드하여 문자열을 가져와 테이블로 변환할 수 있습니다.

```q
/ (datatypes;delimiter) 0: list_of_strings
patient: ("isissssiiiddds";enlist",") 0: `:data/dataset/patient.csv
route: ("idsssff";enlist",") 0: `:data/dataset/route.csv
time: ("diiiiiiiiii";enlist",") 0: `:data/dataset/time.csv
```

> 각 컬럼별 데이터 유형을 확인하세요

### Table to CSV
테이블을 CSV로 변환하기 위해서 구분자로 표현된 문자열로 변환해야합니다.
그리고 구분자로 표현된 문자열을 파일로 저장할 수 있습니다.

```q
/ delimiter 0: table
patient_csv: csv 0: patient
`:data/patient.csv 0: patient_csv

route_csv: csv 0: route
`:data/route.csv 0: route_csv

time_csv: csv 0: time
`:data/time.csv 0: time_csv
```

다음 시간에는 이 데이터를 활용해서 q-sql의 여러가지 SQL 문법을 다뤄보겠습니다.

## 참고

- [Reference - File Text](https://code.kx.com/q/ref/file-text)