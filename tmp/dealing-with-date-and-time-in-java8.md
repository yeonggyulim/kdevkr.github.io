---
    title: 자바 8 에서 날짜와 시간 다루기
    description: 
    date: 2021-02-04
---

## 들어가며
자바 8은 기존의 [java.util.Date와 java.util.Calendar의 문제점](https://d2.naver.com/helloworld/645609)을 개선하고자 새로운 java.time 패키지를 제공합니다. 이번 시간에는 이 [java.time](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html) 패키지에서 제공하는 여러가지 클래스로 날짜와 시간을 다뤄보도록 하겠습니다.

## DateTime  

### Instant  
Instant 클래스는 UTC 시간대의 1970-01-01T00:00:00Z를 기준으로 경과된 시간을 표현합니다. 

```java java.time.Instant
Instant instant = Instant.EPOCH;
// 1970-01-01T00:00:00Z
```

### Duration  
Duration 클래스는 `34.5 seconds`와 같은 [ISO 8601 Duration 표현식](https://www.digi.com/resources/documentation/digidocs/90001437-13/reference/r_iso_8601_duration_format.htm)으로 시간을 나타낼 수 있습니다.  

```java java.time.Duration
Duration duration = Duration.ofSeconds(34);
Duration duration = Duration.parse("PT34S");
```

그러면 이 Duration 클래스를 사용하는 이점은 무엇일까요? 

예를 들어, 하루를 초로 환산해서 표현하면 86400s 입니다. 그렇다면 이 86400란 값을 어떻게 계산할까요

```
1분 = 60s
1시간 = 60분 = 60 * 60s = 3600s
1일 = 24시간 = 24 * 60 * 60s = 86400s
```

이것을 Duration의 ISO 8601 Duration 표현식을 이용하면 간단하게 86400s란 값을 가져올 수 있습니다.

```java
Duration duration = Duration.parse("P1D");
long seconds = duration.getSeconds();
```

### LocalDateTime  
LocalDateTime는 로컬 시스템의 캘린더 시스템을 이용하는 날짜 관련 클래스로 TimeZone을 설정할 수 없습니다.

```java java.time.LocalDateTime  
LocalDateTime localDateTime = LocalDateTime.now();
// 2020-02-02T18:40:02.021

TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
LocalDateTime localDateTime = LocalDateTime.now();
// 2020-02-02T09:41:43.448
```

다만, 두번째 경우처럼 시스템의 기본 TimeZone을 변경하면 해당 TimeZone으로 LocalDateTime의 캘린더가 동작합니다.

> 시스템의 TimeZone이 변경되므로 주의해야합니다.

### ZonedDateTime  
ZonedDateTime은 LocalDateTime에 TimeZone의 Offset을 적용한 클래스로 로컬 시스템의 시간대가 아닌 특정 시간대로 날짜와 시간을 다룰 수 있습니다.

```java java.time.ZonedDateTime
ZonedDateTime zonedDateTime = ZonedDateTime.now();
// 2020-02-02T19:15:22.586+09:00[Asia/Seoul]

ZonedDateTime zonedDateTime = ZonedDateTime.now(TimeZone.getTimeZone("UTC").toZoneId());
// 2020-02-02T10:19:50.930Z[UTC]
```

#### withZoneSameInstant  
ZonedDateTime.withZoneSameInstant 함수를 이용하면 다른 시간대로 변경할 수 있습니다.

```java
ZonedDateTime zonedDateTime = ZonedDateTime.now();
// 2020-02-02T19:34:15.894+09:00[Asia/Seoul]
zonedDateTime = zonedDateTime.withZoneSameInstant(TimeZone.getTimeZone("UTC").toZoneId());
// 2020-02-02T10:34:15.894Z[UTC]
```

### DateTimeFormatter  
DateTimeFormatter 클래스는 LocalDateTime 또는 ZonedDateTime을 특정 형식의 문자열로 포맷팅을 지원합니다.

```java java.time.format.DateTimeFormatter  
DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("YYYY-MM-DD HH:mm:ss");
ZonedDateTime zonedDateTime = ZonedDateTime.now();
zonedDateTime.format(dateTimeFormatter);
// 2020-02-33 19:39:49
```

## 참고  

- [Java 8 - New Date/Time API](https://www.tutorialspoint.com/java8/java8_datetime_api.htm)  
- [Introduction to the Java 8 Date/Time API](https://www.baeldung.com/java-8-date-time-intro)  
- [New Date-Time API in Java 8](https://www.geeksforgeeks.org/new-date-time-api-java8/)  