---
    title: KDB 튜토리얼 - 파일 다루기
    date: 2020-03-06
    categories: [개발 이야기]
    tags: [KDB, Q]
---

1. [KDB 튜토리얼 - 설치 및 접속](/archives/kdb-tutorial/install-and-connection)
2. [KDB 튜토리얼 - 변수 할당 및 테이블 생성](/archives/kdb-tutorial/assign-variables-and-tables)
3. [KDB 튜토리얼 - Q-SQL](/archives/kdb-tutorial/q-sql)
4. [KDB 튜토리얼 - 그룹핑과 집계](/archives/kdb-tutorial/grouping-and-aggregation)
5. **KDB 튜토리얼 - 파일 다루기**
6. [KDB 튜토리얼 - 네임스페이스](/archives/kdb-tutorial/namespace)
7. [KDB 튜토리얼 - 함수](/archives/kdb-tutorial/function)
8. [KDB 튜토리얼 - 자바 클라이언트](/archives/kdb-tutorial/java-client)

## 들어가며
KDB+에서 파일을 다루는 방법에 대해서 알아봅니다. 메모리(RDB)에 존재하는 데이터를 디스크(HDB)에 저장하거나 반대로 디스크에 존재하는 데이터를 메모리에 불러올 수 있습니다. 

자 그럼 파일을 다루는 법을 배우러 가보실까요?

## 파일 다루기
아래는 파일 관련 키워드입니다.

```q
0 console     read0  0: File Text      read/write chars¹
1 stdout      read1  1: File Binary    read/write bytes¹
2 stderr             2: Dynamic Load   load shared object
                     ?  Enum Extend

get set       read/write or memory-map a data file¹

hopen hclose  open/close a file¹

hcount        file size
hdel          delete a file or folder
hsym          symbol/s to file symbol/s¹

save   load   a table
rsave  rload  a splayed table
dsave         tables
```

우리는 이 키워드들을 활용해서 파일을 다루게 됩니다.

### 텍스트 저장 및 읽기
`0:`는 텍스트를 파일에 저장하고 `read0`은 파일에 저장된 텍스트를 불러올 수 있습니다.

먼저, `0:`으로 텍스트를 파일에 저장합니다.
```q
/ file_symbol 0: strings
`:data/hello.txt 0: enlist "Hello World"
```

그리고 다시 `read0`으로 파일에 저장된 텍스트를 읽을 수 있습니다.
```q
read0 `:data/hello.txt
"Hello World"

read0 `:data/dataset/patient.csv
"id,sex,birth_year,country,region,group,infection_reason,infection_order,infected_by,contact_number,confirmed_date,released_date,deceased_date,state"
"1,female,1984,China,filtered at airport,,visit to Wuhan,1,,45,2020-01-20,2020-02-06,,released"
"2,male,1964,Korea,filtered at airport,,visit to Wuhan,1,,75,2020-01-24,2020-02-05,,released"
"3,male,1966,Korea,capital area,,visit to Wuhan,1,,16,2020-01-26,2020-02-12,,released"
```

#### CSV로 저장하고 불러오기
KDB+는 쉽게 테이블을 CSV 형식의 텍스트로 만들수 있습니다. 그리고 `0:`을 통해 CSV 파일로 저장할 수 있게 됩니다.

먼저, 테이블을 CSV 형식의 텍스트로 만듭니다.
```q
csv 0: patient

"id,sex,birth_year,country,region,group,infection_reason,infection_order,infected_by,contact_number,confirmed_date,released_date,deceased_date,state"
"1,female,1984,China,filtered at airport,,visit to Wuhan,1,,45,2020-01-20,2020-02-06,,released"
"2,male,1964,Korea,filtered at airport,,visit to Wuhan,1,,75,2020-01-24,2020-02-05,,released"
"3,male,1966,Korea,capital area,,visit to Wuhan,1,,16,2020-01-26,2020-02-12,,released"
```

그리고 CSV 형식의 텍스트를 `0:`으로 파일로 저장합니다.

```q
`:data/patient.csv 0: csv 0: patient
```

다시 CSV 파일에 저장된 데이터를 기반으로 테이블로 구성할 수 있습니다.
```q
/ (types;delimiter) 0: file_symbol
patient: `id xkey ("isissssiiiddds";enlist",") 0: `:data/dataset/patient.csv
route: ("idsssff";enlist",") 0: `:data/dataset/route.csv
time: ("diiiiiiiiii";enlist",") 0: `:data/dataset/time.csv
```

#### 특정 포맷으로 불러오기
파일에 저장된 텍스트에 대하여 특정 포맷 형식으로 변환하여 불러올 수 있습니다.

다음은 처음 8자리는 date 형식이고 나머지 9자리는 time 형식으로 구분한 것입니다.
```q
/ (types; widths) 0: file_descriptor or list_of_strings
flip `date`time!("DT";8 9) 0: ("20200201000000000";"20200301235959000")

date       time        
-----------------------
2020.02.01 00:00:00.000
2020.03.01 23:59:59.000
```

### 데이터 설정 및 가져오기
키워드 `get` 그리고 `set`은 텍스트 파일이 아닌 바이너리 파일로 저장하고 불러올 수 있습니다.

따라서, KDB+가 읽을 수 있는 데이터 파일이 아닌 경우 오류가 발생합니다.

다음은 간단한 텍스트를 데이터 파일로 저장하고 불러오는 예제입니다.
```q
`:data/hello set "Hello World"
get `:data/hello

/ 데이터 파일이 아닌 경우
get `:data/dataset/patient.csv
error: `data/dataset/patient.csv
```

> CSV 파일은 불러오지 못했죠?

### 테이블 저장 및 불러오기
키워드 `save`와 `load`를 이용하여 테이블 데이터를 저장하고 불러올 수 있습니다.

```q
/ save x
save `patient
`:patient

/ 현재 컨텍스트의 patient를 삭제합니다.
delete patient from `. 

/ 현재 컨텍스트에 patient 테이블이 없습니다.
patient
error: `patient

/ load x
load `patient
`patient

/ 다시 불러온 patient 테이블을 확인합니다.
patient

id| sex    birth_year country region              group                    infection_reason                  infection_order infected_by contact_number confirmed_date released_date deceased_date state   
--| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1 | female 1984       China   filtered at airport                          visit to Wuhan                    1                           45             2020.01.20     2020.02.06                  released
2 | male   1964       Korea   filtered at airport                          visit to Wuhan                    1                           75             2020.01.24     2020.02.05                  released
3 | male   1966       Korea   capital area                                 visit to Wuhan                    1                           16             2020.01.26     2020.02.12                  released
4 | male   1964       Korea   capital area                                 visit to Wuhan                    1                           95             2020.01.27     2020.02.09                  released
```

#### 특정 파일 포맷으로 저장
KDB+는 바이너리 뿐만 아니라 `csv`, `txt`, `xls`, `xml`형식으로 저장할 수 있습니다.


```q
(none)   binary
 csv     comma-separated values
 txt     plain text
 xls     Excel spreadsheet
 xml     Extensible Markup Language (XML)
 
/ save x.extension
save `:data/patient.csv
save `:data/patient.txt

save `:data/patient.xls
read0 `:data/patient.xls
```

### 재생 테이블 저장 및 불러오기
키워드 `rsave`와 `rload`로 키가 없는 일반 테이블에 대하여 컬럼별로 저장되는 재생 테이블로 저장하고 불러올 수 있습니다.

```q
/ rsave x
rsave `:data/time

/ 키 테이블을 저장하려는 경우
rsave `:data/patient
error: `type

/ reload x
rload `:data/time
date       acc_test acc_negative acc_confirmed acc_released acc_deceased new_test new_negative new_confirmed new_released new_deceased
--------------------------------------------------------------------------------------------------------------------------------------
2020.01.20 1        0            1             0            0            1        0            1             0            0           
2020.01.21 1        0            1             0            0            0        0            0             0            0           
2020.01.22 4        3            1             0            0            3        3            0             0            0           
```

재생 테이블로 저장하는 경우 테이블 이름이 폴더 이름이 되며 각 컬럼이 파일로 구분되어 저장됨을 확인할 수 있습니다.

![](/images/2020/kdb-rsave.PNG)

### 기타 명령어

#### 파일 사이즈 확인하기
키워드 `hcount`는 파일의 바이트 단위 크기를 가져옵니다.

```q
hcount `:data/dataset/patient.csv
254898
```

#### 파일 삭제하기
키워드 `hdel`로 파일을 삭제할 수 있습니다.

```q
/ hdel file_symbol
hdel `:data/time.csv
`:data/time.csv

hdel `:data/dataset
error: `data/dataset. OS reports: Directory not empty
```

> `hdel`은 폴더가 비어있어야 삭제할 수 있습니다.

### .Q 네임스페이스
다음에 알아볼 네임스페이스 중 `.Q`에는 테이블을 저장하고 불러오는 프로세스를 처리할 수 있는 함수를 포함하고 있습니다.

- `.Q.dpft` : 테이블 저장
- `.Q.v` : 테이블 불러오기

```q
/ save table
/ .Q.dpft[filpath;partition;fields;table]
.Q.dpft[`:data;`;`id;`route]

/ load splayed table
.Q.v `:data/time

/ load splayed table to dict
.Q.v `:data/time

date         | 2020.01.20 2020.01.21 2020.01.22 2020.01.23 2020.01.24 2020.01.25 2020.01.26 2020.01.27 2020.01.28 2020.01.29 2020.01.30 2020.01.31 2020.02.01 2020.02.02 2020.02.03 2020.02.04 2020.02.05 2020.02.06 2020.02.07 2020.02.08 2020.02.09 2020.02.10 2020.02.11 2020.02.12 2020.02.13 2020.02.14 2020.02.15 2020.02.16 2020.02.17 2020.02.18 2020.02.19 2020.02.20 2020.02.21 2020.02.22 2020.02.23 2020.02.24 2020.02.25 2020.02.26 2020.02.27 2020.02.28 2020.02.29 2020.03.01 2020.03.02 2020.03.03 2020.03.04
acc_test     | 1          1          4          22         27         27         51         61         116        187        246        312        371        429        490        607        714        885        1352       2097       2598       3110       4325       5624       6511       7242       7734       8161       8718       9772       11173      13202      16400      21586      26179      32756      40304      53553      66652      81167      94055      109591     125851     136707     146541    
acc_negative | 0          0          3          21         25         25         47         56         97         155        199        245        289        327        414        462        522        693        1001       1134       1683       2552       3535       4811       5921       6679       7148       7647       7980       8923       9973       11238      13016      15116      17520      20292      25447      31576      39318      48593      55723      71580      85484      102965     118965    
acc_confirmed| 1          1          1          1          2          2          3          4          4          4          6          11         12         15         15         16         18         23         24         24         27         27         28         28         28         28         28         29         30         31         51         104        204        433        602        833        977        1261       1766       2337       3150       4212       4812       5328       5766      
acc_released | 0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          1          2          2          2          3          4          4          7          7          7          9          9          10         12         16         16         17         18         18         24         24         24         27         27         28         31         34         41         88        
acc_deceased | 0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          1          2          2          6          8          12         12         13         16         17         22         28         32         35        
new_test     | 1          0          3          18         5          0          24         10         55         71         59         66         59         58         61         117        107        171        467        745        501        512        1215       1299       887        731        492        427        557        1054       1401       2029       3198       5186       4593       6577       7548       13249      13099      14515      12888      15536      16260      10856      9834      
new_negative | 0          0          3          18         4          0          22         9          41         58         44         46         44         38         87         48         60         171        308        133        549        869        983        1276       1110       758        469        499        333        943        1050       1265       1778       2100       2404       2772       5155       6129       7742       9275       7130       15857      13904      17481      16000     
new_confirmed| 1          0          0          0          1          0          1          1          0          0          2          5          1          3          0          1          2          5          1          0          3          0          1          0          0          0          0          1          1          1          20         53         100        229        169        231        144        284        505        571        813        1062       600        516        438       
new_released | 0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          1          1          0          0          1          1          0          3          0          0          2          0          1          2          4          0          1          1          0          6          0          0          3          0          1          3          3          7          47        
new_deceased | 0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0          0 
```

이번에는 파일을 저장하고 불러오며 파일을 다루는 방법에 대해서 알아보았습니다. 이제 다른 시스템(자바 애플리케이션 등)에서 필요한 데이터를 추출하여 파일로 저장하여 사용할 수 있게 되었습니다.

## 참고
- [Reference - File system](https://code.kx.com/q/basics/files/)