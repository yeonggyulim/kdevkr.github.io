---
    title: YamlPropertiesFactoryBean으로 YAML 프로퍼티 만들기
    date: 2020-01-25
    categories: [개발 이야기]
    tags: [Spring, Yaml, Properties]
---

## 들어가며
스프링은 Properties 뿐만 아니라 Yaml 형식으로 애플리케이션 프로퍼티 설정을 할 수 있습니다. 그렇다면 스프링은 어떻게 Yaml 파일을 불러와 프로퍼티로 만드는 것일까요?

## YamlPropertiesFactoryBean
YamlPropertiesFactoryBean은 YamlProcessor를 확장한 클래스로 YamlProcessor의 `콜백 패턴`을 통해 처리된 Properties를 모아서 하나의 Properties로 만들어주는 팩토리 메소드를 제공합니다.

### Dependencies
`spring-beans` 모듈에는 `SnakeYaml` 라이브러리를 활용해서 `Yaml`을 처리할 수 있는 클래스를 보유하고 있습니다.

```groovy
implementation("org.yaml:snakeyaml:1.25")
implementation("org.springframework:spring-beans:5.2.3.RELEASE")
```

### Example
YAML 파일을 리소스로 불러오기만 하면 쉽게 프로퍼티로 변환할 수 있습니다.

```java
YamlPropertiesFactoryBean yamlPropertiesFactoryBean = new YamlPropertiesFactoryBean();
yamlPropertiesFactoryBean.setResources(new ClassPathResource("application-test.yml"));
Properties properties = yamlPropertiesFactoryBean.getObject();
```

## YamlPropertySourceLoader
[YamlPropertySourceLoader](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/env/YamlPropertySourceLoader.java)는 스프링 부트에서 제공하는 로더 클래스로써 `.yml` 또는 `.yaml`로 끝나는 파일을 PropertySource로 넣어주는 역할을 합니다.

### Dependencies
YamlPropertySourceLoader는 org.springframework.boot.env 패키지에 포함되어있습니다.

```groovy
implementation("org.springframework.boot:spring-boot:2.2.4.RELEASE")
```

### Example
YamlPropertySourceLoader를 통해 리소스로부터 PropertySource 리스트를 받은 뒤 각 PropertySource의 Object를 받아 Properties로 병합할 수 있습니다.
```java
YamlPropertySourceLoader yamlPropertySourceLoader = new YamlPropertySourceLoader();
List<PropertySource<?>> propertySources = yamlPropertySourceLoader.load("application-test", new ClassPathResource("application-test.yml"));
Properties properties = new Properties();
for(PropertySource propertySource : propertySources) {
    Object source = propertySource.getSource();
    properties.putAll((Map) source);
}
```
