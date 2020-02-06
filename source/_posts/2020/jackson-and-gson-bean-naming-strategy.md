---
    title: Jackson and Gson의 빈 네이밍 전략
    date: 2021-02-04
    categories:
        - 개발 이야기
        - 이슈
    tags:
        - Jackson
        - Gson
---

## 들어가며
자바에서 필드에 대한 Getter는 `getXXX()` 그리고 Setter는 `setXXX()` 형태를 갖도록 통용되는 네이밍 컨벤션 규칙이 있습니다.

### Object  
빈 클래스는 다음과 같습니다.

```java
@Getter
@Setter
@ToString
public class Document {
    private String dId;
    private String documentId;
}
```

> 필드명은 카멜-케이스를 따른다.
> 풀 네이밍 필드와 축약된 네이밍 필드를 가진다.

## Jackson  

### 네이밍 전략
Jackson의 기본 네이밍 전략은 PropertyNamingStrategy.LOWER_CAMEL_CASE입니다.

```java
PropertyNamingStrategy.LOWER_CAMEL_CASE : {"documentId":"documentId","did":"dId"}
PropertyNamingStrategy.SNAKE_CASE : {"document_id":"documentId","did":"dId"}
```

#### 문제점  
위 결과를 살펴보면 dId 필드가 예상하는 형태로 변경되지 않았습니다. 이유가 무엇일까요? 제가 확인해본대로라면 Getter의 이름과 관련된 것 같습니다.

Lombok의 @Getter에 의해 만들어지는 Getter는 아래와 같이 `getDId()`가 됩니다.

```java
public class Document {
    private String dId;
    
    public String getDId() {
        return this.dId;
    }
}
```

getDId()를 `getdId()`로 바꾸어보면 어떻게 될까요?

아래와 같이 원하는 형태로 변경되는 것을 확인할 수 있습니다.

```java
PropertyNamingStrategy.LOWER_CAMEL_CASE : {"dId":"dId","documentId":"documentId"}
PropertyNamingStrategy.SNAKE_CASE : {"d_id":"dId","document_id":"documentId"}
```

위와 같은 결과가 나오는 이유는 [Why does Jackson 2 not recognize the first capital letter if the leading camel case word is only a single letter long?](https://stackoverflow.com/questions/30205006/why-does-jackson-2-not-recognize-the-first-capital-letter-if-the-leading-camel-c)에 따르면 Jackson이 필드명에 대해 처음 두글자가 대문자 인 경우 다르게 파악하는 문제점이 있다고 합니다.

> 따라서, Lombok에서 만들어주는 Getter 형태를 사용하고 싶으면 @JsonProperty를 사용해서 명시하라고 합니다.

### 사용자 정의  
앞서 알아본 문제를 해결하는 다른 방법이 있습니다. 바로 `MapperFeature.USE_STD_BEAN_NAMING` 옵션을 허용하고 별도의 네이밍 전략을 세우는 겁니다.  

MapperFeature.USE_STD_BEAN_NAMING을 적용하면 다음과 같이 필드명을 갖습니다.

```java
PropertyNamingStrategy.LOWER_CAMEL_CASE : {"documentId":"documentId","DId":"dId"}
PropertyNamingStrategy.SNAKE_CASE : {"document_id":"documentId","did":"dId"}
```

PropertyNamingStrategy.LOWER_CAMEL_CASE에 대해서는 제대로 필드명을 변경하고 있습니다. 그러나, 여전히 PropertyNamingStrategy.SNAKE_CASE는 did로 나옵니다.

만약, getdId()를 사용할 경우에는 어떻게 될까요?  

```java
PropertyNamingStrategy.LOWER_CAMEL_CASE : {"dId":"dId","documentId":"documentId"}
PropertyNamingStrategy.SNAKE_CASE : {"d_id":"dId","document_id":"documentId"}
```

역시나 Getter 함수명이 문제였습니다. 

#### CaseFormat  

guava의 CaseFormat을 이용하면 SNAKE_CASE를 LOWER_CAMEL로 변환할 수 있습니다.

그래서 PropertyNamingStrategy.PropertyNamingStrategyBase를 확장하여 별도의 CustomBeanNamingStrategy를 만들겠습니다.

```java
public class CustomBeanNamingStrategy extends PropertyNamingStrategy.PropertyNamingStrategyBase {
    private static final Pattern REGEX = Pattern.compile("[A-Z]");

    @Override
    public String translate(String input) {
        if (input == null)
            return input;

        if (!input.isEmpty() && Character.isUpperCase(input.charAt(0)))
            input = input.substring(0, 1).toLowerCase() + input.substring(1);

        return CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, REGEX.matcher(input).replaceAll("_$0").toLowerCase());
    }
}
```

그러면 결과를 확인해봐야겠죠

```java
CUSTOM_CASE : {"documentId":"documentId","dId":"dId"}
```

## Gson  

### 네이밍 전략
Gson의 기본 네이밍 전략은 FieldNamingPolicy.IDENTITY입니다.

```java
FieldNamingPolicy.IDENTITY : {"dId":"dId","documentId":"documentId"}
FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES : {"d_id":"dId","document_id":"documentId"}
```

#### 문제점  
Gson의 경우 딱히 문제가 되지 않을 수 있습니다. 다만, Map 또는 JSONObject와 같은 Key-Value 형식의 오브젝트인 경우 FieldNamingPolicy.IDENTITY에 의해 필드명 그대로 사용하므로 문제가 발생합니다.

```java
Map<String, Object> documentMap = Maps.newHashMap();
documentMap.put("d_id", "dId");
documentMap.put("document_id", "documentId");

FieldNamingPolicy.IDENTITY : {"d_id":"dId","document_id":"documentId"}
```
