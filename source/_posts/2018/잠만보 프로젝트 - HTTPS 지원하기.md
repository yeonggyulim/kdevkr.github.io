---
title: 잠만보 프로젝트 - HTTPS 지원하기
date: 2018-11-10
categories: [프로젝트, 잠만보]
---

## HTTPS  
`HTTPS`는 기존 HTTP 프로토콜로 통신하는 과정에서 `SSL/TLS` 암호화를 한번 더 거치게 됩니다. 암호화를 적용한다고해서 서버으로 데이터를 보내기전에 데이터가 해커에 의해 탈취가 어렵다는 보장이 없습니다. 암호화는 통신이 수립되는 과정에서 진행됩니다.  

하지만, HTTPS는 기존 HTTP가 가지는 보안 문제를 어느정도 해결해주고 있으므로 반드시 적용하는 것이 올바른 행위이지 않을까 합니다.

HTTPS로 통신하기 위해서는 인증서라는 것이 필요합니다. 네이버처럼 [신뢰할 수 있는 기관](https://www.comodo.com/about/comodo-agreements.php)에서 발급받은 인증서를 사용하거나 [`letsencrypt`]라는 무료 인증서도 존재합니다.  

이와 더불어 우리는 자바 애플리케이션을 서버로 활용하고 있으므로 JDK에 포함된 `keytool`을 이용하여 자기 서명된 인증서 파일을 생성할 수 있습니다.  

> http://keystore-explorer.org  
> GUI로 인증서 파일을 만들 수 있도록 지원합니다.  

현재 이 포스트를 작성하는 환경은 윈도우이기 때문에 관리자 권한으로 명령 프롬프트를 실행하겠습니다. 그렇지 않으면 keystore에 접근할 수 있는 권한이 없어 인증서를 생성할 수 없습니다.  
```sh
# C:\Program Files\Java\jdk_______\bin>
keytool -genkeypair -alias tomcat -keyalg RSA -storetype pkcs12
keytool -list
# 키 저장소 비밀번호 입력:
# 키 저장소 유형: jks
# 키 저장소 제공자: SUN
#
# 키 저장소에 1개의 항목이 포함되어 있습니다.
#
# tomcat, 2018. 11. 10, PrivateKeyEntry,
# 인증서 지문(SHA1): 56:AF:E6:A5:51:AA:9A:3E:4D:F8:59:6A:0A:B3:07:D7:9F:3A:B2:3F

keytool -export -alias tomcat -rfc -file C:\Users\K\server.cer
# 키 저장소 비밀번호 입력:
# 인증서가 <C:\Users\K\server.cer> 파일에 저장되었습니다.

keytool -import -alias tomcat -file C:\Users\K\server.cer -keystore C:\Users\K\trust.jks
# 인증서가 키 저장소에 추가되었습니다.
```

만들어지는 각 파일은 다음과 같습니다.
 - .keystore : 키 저장소  
 - server.cer : 인증서
 - trust.jks : 신뢰받은 키 저장소

이제 애플리케이션의 SSL 프로퍼티 옵션을 지정하고 애플리케이션을 다시 실행시켜봅니다.  
```properties
# application.properties
server.ssl.enabled=true
server.ssl.key-store=C:/Users/K/.keystore
server.ssl.key-store-password=
server.ssl.key-alias=tomcat
server.ssl.key-password=
server.ssl.trust-store=C:/Users/K/trust.jks
server.ssl.trust-store-password=
```

![](/images/spring/spring-boot-keystore.png)  

![](/images/spring/spring-boot-https-nohttp.png)  

그런데 기존의 HTTP로 접근하니 이 호스트와 포트는 TLS가 요구된다고 표시하고 있습니다. 스프링 부트는 SSL을 활성화 할 경우 기존의 HTTP는 사용할 수 없습니다. HTTP도 허용하고 싶다면 프로퍼티를 사용하지 않고 개별적으로 설정해야합니다.  

```properties
server.port=8443
server.http.port=8080
server.http.redirect.https=false
```  

```java
@Configuration
public class TomcatConfiguration {

    @Value("${server.port}")
    int port;

    @Value("${server.http.port}")
    int httpPort;

    @Value("${server.http.redirect.https}")
    boolean httpToHttps;

    @Bean
    public TomcatServletWebServerFactory tomcatServletWebServerFactory() {
        TomcatServletWebServerFactory tswsf = new TomcatServletWebServerFactory();

        tswsf.addContextCustomizers((TomcatContextCustomizer) context -> {
            SecurityConstraint securityConstraint = new SecurityConstraint();
            securityConstraint.setUserConstraint("CONFIDENTIAL");

            if(httpToHttps) {
                SecurityCollection securityCollection = new SecurityCollection();
                securityCollection.addPattern("/*");
                securityConstraint.addCollection(securityCollection);
            }
            context.addConstraint(securityConstraint);
        });


        Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
        connector.setScheme("http");
        connector.setSecure(false);
        connector.setPort(httpPort);
        if(httpToHttps) {
            connector.setRedirectPort(port);
        }
        tswsf.addAdditionalTomcatConnectors(connector);
        return tswsf;
    }
}
```

이제 HTTP와 HTTPS를 위한 두개의 내장 톰캣이 실행되어 http://localhost:8080으로 접근하면 https://localhost:8443으로 리다이렉트 되어지게 됩니다.  



## 참고  
- [spring-boot-howto-configure-ssl](https://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#howto-configure-ssl)  
- [Enable HTTPS in Spring Boot](https://www.drissamri.be/blog/java/enable-https-in-spring-boot/)  
- [Spring Boot에서 HTTPS 적용하기](https://elfinlas.github.io/2017/11/29/springboot-https/)  
- [java keytool 사용법 - Keystore 생성, 키쌍 생성, 인증서 등록 및 관리](https://www.lesstif.com/pages/viewpage.action?pageId=20775436)  
- [Http를 Https로 전환/리다이렉트 시키기](http://annajinee.tistory.com/25)
