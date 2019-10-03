---
title: 스프링 부트 애플리케이션 멀티파트 업로드
date: 2019-07-14
categories: [스프링, 멀티파트]
---

애플리케이션은 멀티파트 요청을 처리할 수 있어야 한다.

### Multipart
기본적인 클라이언트라고 할수 있는 웹 브라우저에서는 파일을 포함된 요청을 `multipart/form-data`유형으로 서버 애플리케이션으로 보낸다. 그러면 우리는 애플리케이션이 multipart/form-data로 요청되는 것을 확인하여 멀티파트 요청으로 처리해야 한다.

## MultipartResolver
스프링의 멀티파트 리졸버는 위에서 언급한 멀티파트 요청을 처리할 수 있는 추상화이며 스프링은 이미 두가지 멀티파트 리졸버를 구현하여 제공하고 있다.

- StandardServletMultipartResolver
- CommonsMultipartResolver

#### CommonsMultipartResolver
만약, Apache Commons FileUpload 라이브러리를 통해 멀티파트를 처리하고 싶다면 CommonsMultipartResolver를 사용하면 된다.

스프링 부트 애플리케이션은 기본 멀티파트 리졸버로 StandardServletMultipartResolver를 사용하는데 CommonsMultipartResolver를 적용하고 싶다면 멀티파트 자동설정을 제외하고 리졸버를 등록해야 한다.

그렇지 않으면 각 리졸버가 충돌되어 컨트롤러가 받는 멀티파트에 바인딩이 안되는 문제를 가져갈 수 있다.

```java
@EnableAutoConfiguration(exclude = {MultipartAutoConfiguration.class})
@Configuration
public class MultipartConfig {

    @Bean(name = DispatcherServlet.MULTIPART_RESOLVER_BEAN_NAME)
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        return multipartResolver;
    }

    @Bean
    @Order(0)
    public MultipartFilter multipartFilter() {
        MultipartFilter multipartFilter = new MultipartFilter();
        multipartFilter.setMultipartResolverBeanName(DispatcherServlet.MULTIPART_RESOLVER_BEAN_NAME);
        return multipartFilter;
    }
}
```

### 컨트롤러 멀티파트 바인딩


#### RequestParam
```java
/**
 * Binding single multipart file.
 * @param file
 * @return originalFileName
 */
@PostMapping("/file")
public ResponseEntity<Object> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
    return ResponseEntity.ok(file.getOriginalFilename());
}

/**
 * Binding multipart files.
 * @param files
 * @return List of originalFileName
 */
@PostMapping("/files")
public ResponseEntity<Object> uploadFiles(@RequestParam("files") MultipartFile[] files) {
    List<String> filenames = Arrays.asList(files).stream().map(MultipartFile::getOriginalFilename).collect(Collectors.toList());
    return ResponseEntity.ok(filenames);
}
```

#### ModelAttribute
빈 클래스가 MultipartFile을 포함하고 있어도 리졸버가 바인딩 처리한다.
다만, 빈 클래스의 프로퍼티 이름과 매치하기 때문에 멀티파트는 따로 RequestParam으로 바인딩시키는 것이 좋을 것 같다.

```java
@Data
public class FileBean {
    private String beanId = UUID.randomUUID().toString();

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private MultipartFile[] files;
}

/**
 * Bean contains multipart files.
 * @param fileBean
 * @return FileBean
 */
@PostMapping("/fileBean/files")
public ResponseEntity<Object> uploadFilesWithBean(@ModelAttribute FileBean fileBean) {
    return ResponseEntity.ok(fileBean);
}
```

#### RequestPart
```java
/**
 * Binding multipart files.
 * @param files
 * @return List of originalFileName
 */
@PostMapping("/parts")
public ResponseEntity<Object> uploadFilesWithPart(@RequestPart MultipartFile[] files) {
    List<String> filenames = Arrays.asList(files).stream().map(MultipartFile::getOriginalFilename).collect(Collectors.toList());
    return ResponseEntity.ok(filenames);
}
```


## 참고
- [Recommend using containers' default multipart upload support rather than CommonsMultipartResolver](https://github.com/spring-projects/spring-boot/issues/2958#issuecomment-103009500)