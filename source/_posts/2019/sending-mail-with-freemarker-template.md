---
title: 프리마커 템플릿으로 이메일 발송하기
date: 2019-03-19
categories: [개발 이야기]
banner:
    url: https://javatutorial.net/wp-content/uploads/2017/12/spring-featured-image.png
---

![](https://javatutorial.net/wp-content/uploads/2017/12/spring-featured-image.png#center)

### 스프링 프레임워크의 이메일 지원
스프링 프레임워크에서는 이메일을 발송할 수 있도록 `org.springframework.mail` 패키지를 제공한다. 

`MailSender` 인터페이스는 메일 발송 기능을 가지는 최상위 인터페이스이며 스프링 프레임워크는 이 보다 더 좋은 기능을 제공하도록 확장한 `JavaMailSender` 인터페이스를 포함한다.

#### Dependencies
스프링 프레임워크에서 메일을 발송할 때 사용되는 의존성은 다음과 같다.
```groovy
compile('org.springframework:spring-context-support:4.3.7.RELEASE')
compile('javax.mail:mail:1.4.7')
```

##### JavaMailSenderImpl
스프링 프레임워크는 `JavaMailSender` 인터페이스의 구현체인 `JavaMailSenderImpl` 클래스를 제공하며 

우리는 굳이 JavaMailSender 구현체를 만들지 않아도 이 JavaMailSenderImpl를 사용하여 메일을 발송하는 기능을 만들 수 있다.

##### MimeMessageHelper
스프링 프레임워크는 `javax.mail.internet.MimeMessage` 클래스에 각종 설정들(제목이나 첨부파일 등)을 쉽게 지정할 수 있도록 헬퍼 클래스를 제공한다. 

### 이메일 발송을 위한 SMTP 서버
이메일을 송수신하는 서버를 SMTP(Simple Mail Transfer Protocol) 서버라고 한다.

그러나, 스프링 프레임워크가 자체적으로 SMTP 서버를 제공해주지는 않기 때문에 실제로 이메일을 발송하기 위해서는 SMTP 서버를 구축해야만 한다.

SMTP 메일 서버를 구축하는 것 대신에 우리가 많이 사용하는 구글이나 네이버 이메일 계정으로 SMTP 메일 서버를 이용할 수 있다.

본 포스트 에서는 구글 이메일 계정으로 SMTP 메일 서버를 이용해보겠다.

> https://github.com/ChangemakerStudios/Papercut와 같은 개발용 SMTP 서버도 있다.

#### 구글 SMTP 활성화
구글 SMTP 서버를 이용하기 위해서는 구글 이메일 계정의 [`보안 수준이 낮은 앱의 액세스`](https://myaccount.google.com/lesssecureapps)를 허용해야 한다.

![](/images/2019/google-less-secure-apps.png)

이후 [SMTP 서버 이용시 필요한 정보](https://support.google.com/mail/answer/7126229?visit_id=636885550269950209-1570087438&rd=1)는 다음과 같다.

- SMTP Host : smtp.gmail.com
- SMTP Username : $email
- SMTP Password : $password
- SMTP Post : 465
- SSL Enable : true

### 이메일 발송 기능 구현
구글 SMTP 서버를 이용할 수 있도록 설정을 완료하였으니 이메일 발송 기능을 구현하도록 하자.

#### JavaMailSender 빈 등록
우리가 가장 먼저 해야할 일은 JavaMailSender 인터페이스 구현체를 빈으로 등록하는 것이다.

간단하게 앞서 소개한 JavaMailSenderImpl을 구현체로 사용하고 프로퍼티에 존재하는 정보를 불러와 값을 설정한다.

```java
@Bean
public JavaMailSender javaMailSender(ApplicationContext applicationContext) throws IOException {
    final JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setHost(env.getProperty("spring.mail.host"));
    mailSender.setPort(Integer.valueOf(env.getProperty("spring.mail.port")));
    mailSender.setProtocol(env.getProperty("spring.mail.protocol"));
    mailSender.setUsername(env.getProperty("spring.mail.username"));
    mailSender.setPassword(env.getProperty("spring.mail.password"));

    final Properties javaMailProperties = new Properties();
    javaMailProperties.load(applicationContext.getResource("classpath:mail.properties").getInputStream());
    mailSender.setJavaMailProperties(javaMailProperties);
    return mailSender;
}
```

> JavaMailProperties를 프로퍼티에서 불러와 직접 값을 넣어주거나 ApplicationContext 대신에 ClassPathResource를 사용해도 무방하다.

##### 메일 발송 프로퍼티
위 JavaMailSender에서 사용된 프로퍼티 값을 설정한다.

```sh
spring.mail.host=smtp.gmail.com
spring.mail.port=465
spring.mail.username=
spring.mail.password=

# mail.properties
mail.smtp.ssl.enable=true
mail.smtp.auth=true
```

### 프리마커 이메일 템플릿
본 포스트의 목표는 단순 이메일 발송이 아닌 프리마커 템플릿을 활용해서 이메일 내용을 구성해서 발송하는 것이다.

많은 템플릿 중에서 프리마커를 사용하려는 이유는 가장 설정이 쉽고 이메일 내용을 구성할 때 편리하다는 개인적인 판단 때문이다.

> 대부분은 Thymeleaf를 사용하는 것으로 예제를 소개하고 있다.

```groovy
compile('org.freemarker:freemarker:2.3.28')
```

의존성을 추가하였다면 `freemarker.template.Configuration` 클래스를 빈으로 등록한다.

```java
@Bean
public freemarker.template.Configuration freeMarkerConfiguration() throws IOException, TemplateException {
    FreeMarkerConfigurationFactory freeMarkerConfigurationFactory = new FreeMarkerConfigurationFactory();
    freeMarkerConfigurationFactory.setTemplateLoaderPath("classpath:/templates/mails");
    return freeMarkerConfigurationFactory.createConfiguration();
}
```

설정은 끝났다(응?)

메일 본문을 넣는 코드에서 다음과 같이 템플릿으로 가져오면 된다.

```java
private final freemarker.template.Configuration engine;
// ...
Template template = engine.getTemplate(mailBuilder.getTemplate().getContentPath(), locale);
helper.setText(FreeMarkerTemplateUtils.processTemplateIntoString(template, context), true);
```

> 프리마커 템플릿으로 내용을 구성하는 방법은 본 포스트의 목적이 아니므로 생략한다.

## 참고

- [다른 이메일 클라이언트에서 Gmail을 확인할 수 있도록 IMAP 사용](https://support.google.com/mail/answer/7126229?visit_id=636885550269950209-1570087438&rd=1)
- [Introduction to Using FreeMarker in Spring MVC](https://www.baeldung.com/freemarker-in-spring-mvc-tutorial)