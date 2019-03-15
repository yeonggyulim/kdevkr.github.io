---
title: 아파치 톰캣으로 TLS 프로토콜을 사용하여 웹 애플리케이션 배포하기
date: 2019-03-15
categories: [개발 이야기, Tomcat]
banner:
  url: http://www.apache.org/img/asf_logo.png
---

![](http://www.apache.org/img/asf_logo.png#center)

> 본 포스트에서는 인증서 파일을 생성하는 것을 기록해두지 않습니다.
> 인증서 파일을 생성하는 방법은 따로 검색해주시기 바랍니다.

## Apache Tomcat 설치

[Apache Tomcat 8.5.38 다운로드](https://tomcat.apache.org/download-80.cgi)에서 `운영체제에 맞는 인스톨러를 다운받아 설치`하자.

나는 `tar.gz`을 다운받아 압축 해제하여 사용하였다.

```sh
# gzip & tar 압축해제
tar -xvzf apache-tomcat-8.5.38.tar.gz
```

## 웹 애플리케이션 패키징
웹 애플리케이션을 아파치 톰캣이 배포할 수 있도록 `.war` 파일로 패키징하자.

만약, 스프링 부트를 사용하고 있다면 `:bootRepackage 태스크`로 실행가능한 war와 배포가능한 war를 만들어줄 것이다.

### Executable War
스프링 부트는 자체 내장 톰캣을 가지고 있기 때문에 java -jar 명령을 통해 직접 실행할 수 있다.

```sh
java -jar [filename].war
```

### Original War
우리는 톰캣으로 배포해야하기에 배포가능한 .war를 `[tomcat]/webapps` 폴더로 이동시키자.

그리고 기본 ROOT 폴더를 지우고 war를 압축해제 하자.

> 기본 ROOT 폴더가 남아있다면 war를 배포하지 않는다.

```sh
unzip [filename].war -d [filename]
```

## Apache Tomcat 설정
이제 웹 애플리케이션을 배포할 수 있도록 아파치 톰캣을 설정해보자.

### conf/server.xml

#### Host 및 Context
아파치 톰캣은 기본적으로 `webapp/ROOT 폴더`를 `루트 컨텍스트 패스`로 잡아 배포한다. 

만약, webapps 폴더 안에 .war 파일이 있다면 배포되는 경로는 `/[filename]`이 되어버린다.

이를 방지하여 루트 컨텍스트 패스로 배포하기 위해서 다음과 같이 설정하자.

```xml
<Host name="localhost" appBase="webapps" unpackWARs="false" autoDeploy="false" deployOnStartup="false">
    <Context path="" docBase="filename" />
</Host>
```

> 루트 컨텍스트 패스로 배포하기 위하여 ROOT.war로 이름을 바꾸어놓고 unpackWARs 옵션을 true로 주어도 된다.

#### TLS 활성화
배포하려는 웹 애플리케이션이 SSL 통신을 사용하도록 Connector를 추가하자.

이때, SSL 구현체로 `JSSE`를 사용하여 간단하게 설정하자.

> https://stackoverflow.com/questions/3078810/what-is-the-difference-between-apr-implementation-of-ssl-and-jsse-implementation

```xml
<Connector port="9080" protocol="org.apache.coyote.http11.Http11NioProtocol" maxThreads="150" 
    SSLEnabled="true" sslProtocol="TLS" schema="https" secure="true"
    keystoreFile="[KEYSTORE-FILE]" keystorePass="[KEYSTORE-PASSWORD]"
/>
```

## Apache Tomcat Run and Monitoring
아파치 톰캣을 실행하여 웹 애플리케이션이 정상적으로 배포되었는지 확인하자.

`https://localhost:9080/` 으로 접근이 가능해야 한다.

```sh
# 톰캣 시작
${tomcat.home}/bin/startup.sh

# 톰캣 종료
${tomcat.home}/bin/shutdown.sh

# 톰캣 실시간 실행 로그
tail -f ${tomcat.home}/logs/catalina.out
```

## 참고
- [keytool 명령어를 이용한 Tomcat HTTPS 설정 (JKS 포맷)](https://dimdim.tistory.com/entry/%EC%82%AC%EC%84%A4-%EC%9D%B8%EC%A6%9D%EC%84%9C%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-Tomcat-HTTPS-%EC%84%A4%EC%A0%95)
- [TLS / SSL 소개 및 Tomcat 에 HTTPS 적용하는 방법](https://joshuajangblog.wordpress.com/2016/09/02/tls-ssl-intro-and-tomcat-configuration/)
- [tomcat 7 의 ROOT context 를 임의의 webapp 로 변경하기](https://www.lesstif.com/pages/viewpage.action?pageId=14745616)
- [Tomcat 8에 ROOT로 게시하기](https://ohjongsung.io/2017/06/24/tomcat-8%EC%97%90-root%EB%A1%9C-%EA%B2%8C%EC%8B%9C%ED%95%98%EA%B8%B0)