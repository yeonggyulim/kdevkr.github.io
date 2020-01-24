---
title: 스프링 부트 애플리케이션 파일 액세스
date: 2019-07-14
categories: [스프링, 파일 액세스]
---

### 목표
- 클래스패스를 기준으로 파일을 읽을 수 있다.
- 스프링이 제공하는 다양한 리소스 클래스를 알수 있다.

#### Classpath

`클래스패스`란 자바 컴파일러가 애플리케이션을 위해 읽어야할 클래스들이 위치하게 되는 기준이라 할 수 있다.

예를 들어, 스프링 부트 애플리케이션은 다음과 같은 구조로 클래스패스를 지정한다.
```
src
  ┗ main
     ┗ java => /classes
     ┗ resources => /resources
```

::: tip 프로젝트 클래스패스
리소스 접근을 하기전에 자신의 프로젝트가 어떤경로로 클래스패스가 지정되어있는지 알아야 한다.
:::

## Resources
스프링 프로젝트에서 사용되는 클래스패스에 있는 파일들을 `리소스`라고 하며 이러한 로우-레벨의 리소스 접근을 위해 `Resource`라는 추상화를 제공한다.

```java
public interface Resource extends InputStreamSource {

    boolean exists();

    boolean isOpen();

    URL getURL() throws IOException;

    File getFile() throws IOException;

    Resource createRelative(String relativePath) throws IOException;

    String getFilename();

    String getDescription();

}
```

그리고 Resource 구현체인 `UrlResource`, `ClassPathResource`, `FileSystemResource`, `ServletContextResource`, `InputStreamSource`, `ByteArrayResource`를 제공한다.

### 리소스 액세스

#### 리소스로더 사용하기
모든 애플리케이션 컨텍스트는 `ResourceLoader.getResource`라는 리소스를 가져오는 함수를 구현하기 때문에 컨텍스트로부터 다양한 리소스 구현체를 가져올 수 있다.

```java
// ClassPathResource
Resource template = ctx.getResource("some/resource/path/myTemplate.txt");

// regardless of the application context type, by specifying the special classpath: prefix
Resource template = ctx.getResource("classpath:some/resource/path/myTemplate.txt");

// FileSystemResource
Resource template = ctx.getResource("file:///some/resource/path/myTemplate.txt");

// UrlResource
Resource template = ctx.getResource("https://myhost.com/resource/path/myTemplate.txt");
```

기본적으로 prefix가 없다면 애플리케이션 컨텍스트 유형에 따라 리소스가 결정된다.

#### 리소스 구현체 사용하기
물론 직접 구현체를 사용해서 리소스를 가져올 수도 있다.

```java
Resource resource = new ClassPathResource("messages.xml", getClass().getClassLoader());
```

### 리소스 데이터 가져오기
리소스를 가져오는데 성공하였다면 이제는 리소스의 실제 데이터를 가져와야 한다.

`Resource.getFile` 또는 `InputStreamSource.getInputStream`와 같은 함수를 제공하는데 약간의 주의사항이 있다.

::: warning Resource.getFile의 문제점
Resource.getFile은 파일 시스템을 이용해서 가져오기 때문에 jar와 같은 패키징된 파일에 존재하는 리소스들은 가져올 수 없다.
ResourceUtils.getFile도 내부적으로 Resource.getFile을 사용하기 때문에 동일하다.

관련 링크 :  https://stackoverflow.com/a/25873705
:::

#### 스트림으로 데이터 추출하기
클래스 패스에 위치한 `messages.json`파일의 스트림으로부터 JSON 문자열을 가져와보도록 하자.

```java
String content = null;
try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(resource.getInputStream()), 1024)) {
    content = bufferedReader.lines().collect(Collectors.joining(System.lineSeparator()));
}
```

스프링 프레임워크는 StreamUtils 또는 FileCopyUtils와 같은 유틸 클래스를 제공하며 일반적으로 사용하는 Commons IO의 IOUtils도 있다.
단, 스트림으로부터 한번에 읽어드리는 블럭 사이즈는 `4096 bytes`로 고정되어있음을 확인하자.

- [Spring Framework - StreamUtils](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/util/StreamUtils.html)
```java
// All copy methods use a block size of 4096 bytes.
String content = StreamUtils.copyToString(new ClassPathResource("messages.json").getInputStream(), StandardCharsets.UTF_8);
```

- [Spring Framework - FileCopyUtils](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/util/FileCopyUtils.html)
```java
// All copy methods use a block size of 4096 bytes, and close all affected streams when done.
byte[] byteArr = FileCopyUtils.copyToByteArray(new ClassPathResource("messages.json").getInputStream());
String content = new String(byteArr, StandardCharsets.UTF_8);
```

- [Commons IO - IOUtils](https://commons.apache.org/proper/commons-io/javadocs/api-2.5/org/apache/commons/io/IOUtils.html)
```java
String content = IOUtils.toString(new ClassPathResource("messages.json").getInputStream(), StandardCharsets.UTF_8);
```


## 참고
- [Spring Framework Reference - Resources](https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/resources.html)
- [Access a File from the Classpath in a Spring Application](https://www.baeldung.com/spring-classpath-file-access)