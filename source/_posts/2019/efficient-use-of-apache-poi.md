---
title: 초보 개발자가 알려주는 Apache POI 효율적으로 사용하기
categories: [개발 이야기]
date: 2019-05-29
banner:
    url: https://poi.apache.org/images/group-logo.png
---

![](https://poi.apache.org/images/group-logo.png#center)

엑셀 파일 출력을 위해 Apahce POI를 활용하면서 생긴 이슈와 처리방안을 정리하려 합니다.

## 액셀 생성 방식

POI 라이브러리를 활용해 만들 수 있는 엑셀 유형은 다음과 같다.

-   HSSF : 엑셀 97 - 2004 (.xls)
-   XSSF : 엑셀 2007 ~ (.xlsx)
-   SXSSF : XSSF의 성능 보완 버전

일반적으로 XSSF 파일 형식은 XML 방식으로 저장되기 때문에 워크북 생성시 메모리 사용량이 HSSF보다 두배 이상이 될 수 있다.

따라서, 보편적으로는 HSSF를 사용하는 것이 좋을 것 같다.

## 엑셀 폰트 및 스타일

POI를 사용해서 엑셀을 생성하는 예제를 검색하면 대부분 다음과 같이 설명한다.

```java
public void example() {
    HSSFWorkbook workbook = new HSSFWorkbook();
    
    workbook.createFont()
    workbook.createCellStyle()
}
```

해당 함수들을 사용해야하는 것은 맞다. 하지만, 여기서 중요한 사실이 있다. 

해당 함수들을 호출할 때마다 워크북에 새로운 폰트 정보와 셀 스타일 정보가 저장된다.

대부분의 경우에는 문제가 되지 않을 수 있지만 만약에 각 셀마다 폰트와 스타일이 제각각이거나 셀 스타일을 지정할 때마다 같은 스타일을 매번 생성한다면 어떻게 될까?

내가 겪었던 문제는 다음과 같다.

1.  엑셀 파일 실행시 글꼴 수가 많다는 경고창이 뜬다. (폰트 관련)
2.  엑셀 출력시 특정 셀부터 스타일 지정이 안된다. (스타일 관련)

### 워크북 생성시 폰트와 스타일을 저장하여 사용하자

위에서 언급한 문제를 해결할 수 있는 방법은 다음과 같다. 

1.  워크북에서 사용하는 폰트 및 스타일을 미리 생성해놓는 방법
2.  워크북에서 사용하는 폰트 및 스타일을 저장하여 사용하는 방법

1번의 경우에는 미리 생성된 스타일만 사용하도록 제한되기 때문에 2번의 경우가 더 효율적이라고 생각한다.

#### 구현 예시

워크북을 생성할 수 있는 유틸 클래스를 만들고 내부적으로 폰트와 스타일을 Map에 담아 저장하도록 구현했다.

```java
public class Workbook {
	
	private HSSFWorkbook workbook = null;
	private HSSFSheet sheet = null;
	private HSSFCell firstCell = null;
	
	private Map<Integer, HSSFFont> fontMap = new HashMap<>(); // 폰트
	private FontStyle defaultFontStyle = null;
	
	private Map<Integer, HSSFCellStyle> styleMap = new HashMap<>(); // 스타일
```

## 열 너비 및 행 높이

열 너비와 행 높이 조절에 대한 문제를 알아보자.

### 열 너비 자동 조절

POI 라이브러리는 열 너비에 대한 자동 조정을 위해 [autoSizeColumn()](http://poi.apache.org/components/spreadsheet/quick-guide.html#Autofit)을 제공하는데 이 함수는 내부적으로 모든 행에 대한 해당 열의 레코드를 비교하여 열 너비를 맞게 조절한다.

만약에 이 함수를 써서 열 너비를 자동 조절해야한다면 무분별한 호출이 아닌 워크북을 파일로 출력하기 이전에 수행하는 것이 좋다.

또, autoSizeColumn를 사용하지 않고 특정 열에 대한 데이터 길이에 따라 ColumnWidth의 최대값을 저장하여 처리하는 방안도 있다.

### 행 높이 자동 조절

행 높이는 HSSFRow.setHeight로 조절할 수 있다. 만약에 행 높이를 자동으로 조절하고 싶다면 setHeight 함수의 파라미터 값에 -1을 주면 엑셀 프로그램에서 자동으로 계산한다.

단, 해당 행에 병합된 셀이 존재한다면 엑셀 프로그램에서 자동으로 계산하는 행 높이가 올바르지 않는 문제가 있다.

따라서, 데이터 크기에 따라 행 높이를 자동 조절하는 함수를 따로 만들어 사용하는 것도 나쁘지 않다.

## 참고

-   [POI-HSSF and POI-XSSF/SXSSF](https://poi.apache.org/components/spreadsheet/)
-   [POI를 이용하여 엑셀파일 생성하기](https://showbang.github.io/typistShow/2017/01/25/%EC%83%9D%EC%84%B1/)
-   [POI 열너비 행높이](https://blog.naver.com/titan79th/140037818261)
-   [Apache POI Speed Optimizations](https://www.waltercedric.com/index.php?option=com_content&view=article&id=2096:&catid=102&Itemid=332)
-   [apache poi 엑셀 병합된 셀 자동 높이 조절하기](https://goni9071.tistory.com/entry/apache-poi-%EC%97%91%EC%85%80-%EB%B3%91%ED%95%A9%EB%90%9C-%EC%85%80-%EC%9E%90%EB%8F%99-%EB%86%92%EC%9D%B4-%EC%A1%B0%EC%A0%88%ED%95%98%EA%B8%B0)
