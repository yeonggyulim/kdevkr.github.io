---
    title: KDB 튜토리얼 - Q-SQL
    date: 2020-03-05 15:00
    categories: [개발 이야기]
    tags: [KDB, Q]
---

1. [KDB 튜토리얼 - 설치 및 접속](/archives/kdb-tutorial/install-and-connection)
2. [KDB 튜토리얼 - 변수 할당 및 테이블 생성](/archives/kdb-tutorial/assign-variables-and-tables)
3. **KDB 튜토리얼 - Q-SQL**
4. [KDB 튜토리얼 - 그룹핑과 집계](/archives/kdb-tutorial/grouping-and-aggregation)
5. [KDB 튜토리얼 - 파일 다루기](/archives/kdb-tutorial/file)
6. [KDB 튜토리얼 - 네임스페이스](/archives/kdb-tutorial/namespace)
7. [KDB 튜토리얼 - 함수](/archives/kdb-tutorial/function)

## 들어가며
이번 글에서는 일반적인 데이터베이스에서 사용하는 SQL 구문을 사용할 수 있도록 KDB+가 지원하는 q-sql에 대해서 알아봅니다.

알아보기 전에 필요한 데이터를 준비하기 위하여 국내에 COVID-19 확산으로 인해 발생한 정보를 CSV로 구성한 [Coronavirus-Dataset](https://github.com/jihoo-kim/Coronavirus-Dataset)를 불러오도록 하겠습니다.

### 데이터 불러오기
CSV 파일에 저장된 데이터를 테이블로 불러오는 것은 파일을 다루는 챕터에서 알아볼 내용이지만 우선 데이터를 불러오도록 하겠습니다.

```q
patient: `id` xkey ("isissssiiiddds";enlist",") 0: `:data/dataset/patient.csv
route: `id xkey ("idsssff";enlist",") 0: `:data/dataset/route.csv
time: ("diiiiiiiiii";enlist",") 0: `:data/dataset/time.csv
```

네 데이터를 불러오는 것은 끝났습니다.

간단하게 설명하자면 `xkey`로 테이블에 대한 키를 지정하였고 isissssiiiddds와 같이 데이터의 형식을 지정하였으며 CSV로 구성되었기에 ,를 구분자로 사용했습니다.

이제 Q-SQL을 배우러 가보실까요?

## Q-SQL
Q-SQL 표현식은 종속절, `by`, `from` 그리고 `where`과 같은 고유 문법 규칙이 있습니다. 

컬럼에 대한 구분은 콤마(,)입니다. 

### SELECT
SELECT는 테이블의 컬럼을 선택할 수 있습니다.


```q
/ select [cols] [by groups] from t [where filters]
select from patient
```

> KDB+는 모든 컬럼을 선택할 때 와일드카드를 사용하지 않습니다.

```q


select sex, infection_order, infection_reason, confirmed_date, released_date, deceased_date from patient

sex    infection_order infection_reason                  confirmed_date released_date deceased_date
---------------------------------------------------------------------------------------------------
female 1               visit to Wuhan                    2020.01.20     2020.02.06                 
male   1               visit to Wuhan                    2020.01.24     2020.02.05                 
male   1               visit to Wuhan                    2020.01.26     2020.02.12                 
male   1               visit to Wuhan                    2020.01.27     2020.02.09                 
male   1               visit to Wuhan                    2020.01.30     2020.03.02                 
male   2               contact with patient              2020.01.30     2020.02.19                 
male   1               visit to Wuhan                    2020.01.30     2020.02.15                 
female 1               visit to Wuhan                    2020.01.31     2020.02.12                 
```

### WHERE
WHERE는 여러가지 조건절을 표현할 수 있습니다.

#### =
`=`는 가장 일반적인 비교입니다.

코로나 바이러스로 인해 사망한 여성을 구분하고자 하면 다음과 같습니다.
```q
select from patient where sex = `female, state = `deceased

id  | sex    birth_year country region           group                    infection_reason     infection_order infected_by contact_number confirmed_date released_date deceased_date state   
----| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
38  | female 1963       Korea   Daegu                                                                                                     2020.02.18                   2020.02.23    deceased
205 | female 1965       Korea   Gyeongsangbuk-do Cheongdo Daenam Hospital                                                                 2020.02.22                   2020.02.21    deceased
925 | female 1951       Korea   Gyeongsangbuk-do Shincheonji Church       contact with patient                                            2020.02.25                   2020.02.24    deceased
2614| female 1943       Korea   Daegu                                                                                                     2020.02.29                   2020.03.01    deceased
2769| female 1934       Korea   Daegu                                                                                                     2020.02.29                   2020.03.02    deceased
4046| female 1962       Korea   Daegu                                                                                                     2020.03.01                   2020.03.01    deceased
```

#### in
`in` 키워드는 컬럼의 데이터가 조건을 포함하는 것을 표현합니다.

국내 확진자 중 중국 국적인 사람을 찾고 싶다면 다음과 같이 사용합니다.
```q
select from patient where country in `China

id | sex    birth_year country region              group                         infection_reason              infection_order infected_by contact_number confirmed_date released_date deceased_date state   
---| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1  | female 1984       China   filtered at airport                               visit to Wuhan                1                           45             2020.01.20     2020.02.06                  released
12 | male   1971       China   capital area                                      contact with patient in Japan 2                           422            2020.02.01     2020.02.18                  released
14 | female 1980       China   capital area                                      contact with patient          3               12          3              2020.02.02     2020.02.18                  released
23 | female 1962       China   capital area                                      visit to Wuhan                1                           23             2020.02.06     2020.02.29                  released
27 | female 1982       China   capital area                                      visit to China                1                           40             2020.02.09                                 isolated
28 | female 1989       China   capital area                                      contact with patient          2               3           1              2020.02.10     2020.02.17                  released
755| male   1954       China   capital area        Eunpyeong St. Mary's Hospital                                                                          2020.02.24                                 isolated
924| female 1945       China   capital area                                      visit to China                                                           2020.02.25                                 isolated
```
> country는 심볼 데이터 유형입니다.

#### like
`like` 키워드는 패턴 매칭을 제공합니다.

```q
/ x like y
select from patient where infection_reason like "*Wuhan*"

id| sex    birth_year country region              group infection_reason   infection_order infected_by contact_number confirmed_date released_date deceased_date state   
--| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
1 | female 1984       China   filtered at airport       visit to Wuhan     1                           45             2020.01.20     2020.02.06                  released
2 | male   1964       Korea   filtered at airport       visit to Wuhan     1                           75             2020.01.24     2020.02.05                  released
3 | male   1966       Korea   capital area              visit to Wuhan     1                           16             2020.01.26     2020.02.12                  released
4 | male   1964       Korea   capital area              visit to Wuhan     1                           95             2020.01.27     2020.02.09                  released
5 | male   1987       Korea   capital area              visit to Wuhan     1                           31             2020.01.30     2020.03.02                  released
7 | male   1991       Korea   capital area              visit to Wuhan     1                           9              2020.01.30     2020.02.15                  released
8 | female 1957       Korea   Jeollabuk-do              visit to Wuhan     1                           113            2020.01.31     2020.02.12                  released
13| male   1992       Korea   filtered at airport       residence in Wuhan 1                           0              2020.02.02     2020.02.24                  released
23| female 1962       China   capital area              visit to Wuhan     1                           23             2020.02.06     2020.02.29                  released
24| male   1992       Korea   filtered at airport       residence in Wuhan 1                           0              2020.02.06     2020.02.27                  released
```

#### within
`within`은 범위에 포함되는 것을 표현합니다.

예를 들어, 2020년 1월 확진자 중에 2차 이후 감염자를 찾으려면 다음과 같습니다.

```q
select from patient where confirmed_date within (2020.01.01;2020.01.31), infection_order >= 2

id| sex    birth_year country region       group infection_reason     infection_order infected_by contact_number confirmed_date released_date deceased_date state   
--| ----------------------------------------------------------------------------------------------------------------------------------------------------------------
6 | male   1964       Korea   capital area       contact with patient 2               3           17             2020.01.30     2020.02.19                  released
9 | female 1992       Korea   capital area       contact with patient 2               5           2              2020.01.31     2020.02.24                  released
10| female 1966       Korea   capital area       contact with patient 3               6           43             2020.01.31     2020.02.19                  released
11| male   1995       Korea   capital area       contact with patient 3               6           0              2020.01.31     2020.02.10                  released
```

### ORDER BY
SELECT 결과를 정렬하기 위해서는 `xasc` 또는 `xdesc` 키워드를 사용합니다.

예를 들어, 접촉자 수(contact_number)가 많은 수로 정렬하면 다음과 같습니다.
```q
`contact_number xdesc select from patient

id  | sex    birth_year country region              group                    infection_reason                  infection_order infected_by contact_number confirmed_date released_date deceased_date state   
----| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
31  | female 1959       Korea   Daegu               Shincheonji Church                                                                     1160           2020.02.18                                 isolated
16  | female 1977       Korea   Gwangju                                      visit to Thailand                 1                           450            2020.02.04     2020.02.19                  released
12  | male   1971       China   capital area                                 contact with patient in Japan     2                           422            2020.02.01     2020.02.18                  released
17  | male   1982       Korea   capital area                                 contact with patient in Singapore 2                           290            2020.02.05     2020.02.12                  released
```

### DELETE
DELETE 키워드는 데이터 또는 항목을 제거합니다.

```q
delete from patient where released_date < 2020.03.01

id| sex  birth_year country region       group infection_reason     infection_order infected_by contact_number confirmed_date released_date deceased_date state   
--| --------------------------------------------------------------------------------------------------------------------------------------------------------------
5 | male 1987       Korea   capital area       visit to Wuhan       1                           31             2020.01.30     2020.03.02                  released
83| male 1944       Korea   capital area       contact with patient 3               6                          2020.02.20     2020.03.01                  released

delete birth_year from patient

id| sex    country region              group                    infection_reason                  infection_order infected_by contact_number confirmed_date released_date deceased_date state   
--| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1 | female China   filtered at airport                          visit to Wuhan                    1                           45             2020.01.20     2020.02.06                  released
2 | male   Korea   filtered at airport                          visit to Wuhan                    1                           75             2020.01.24     2020.02.05                  released

delete id from patient

sex    birth_year country region              group                    infection_reason                  infection_order infected_by contact_number confirmed_date released_date deceased_date state   
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
female 1984       China   filtered at airport                          visit to Wuhan                    1                           45             2020.01.20     2020.02.06                  released
male   1964       Korea   filtered at airport                          visit to Wuhan                    1                           75             2020.01.24     2020.02.05                  released

delete from patient

id| sex birth_year country region group infection_reason infection_order infected_by contact_number confirmed_date released_date deceased_date state
--| ------------------------------------------------------------------------------------------------------------------------------------------------
```

> patient 테이블에 결과를 할당해야 반영됩니다.

다음 시간에는 그룹핑과 집계에 대해 알아볼 것입니다.

## 참고

- [Reference - Q-SQL](https://code.kx.com/q/basics/qsql/)
- [Q Mortals - Queries](https://code.kx.com/q4m3/9_Queries_q-sql/#90-overview)