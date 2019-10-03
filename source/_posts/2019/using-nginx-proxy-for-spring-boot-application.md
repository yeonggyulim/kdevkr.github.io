---
title: Nginx를 이용한 스프링 부트 애플리케이션 프록시
date: 2019-07-12
categories: [스프링, 프록시]
---

리눅스에서 80이나 443같은 잘알려진 포트들은 루트 사용자 권한이 있어야 사용할 수 있다. 만약, 스프링 부트 애플리케이션의 내장 톰캣이 이러한 포트를 사용하고 싶다면 실행시 sudo 명령이 포함되어야 한다.

하지만, 루트 사용자 권한을 부여하는 것보다는 `iptables`를 이용한 포트포워딩이나 `Proxy` 서버를 두는 것이 더 좋다.

## 목표
1. 웹서버(Nginx) 구동
2. SSL 인증서 생성
3. Nginx SSL 설정
4. Nginx Proxy 설정

### 1. Nginx
Redirect HTTP requests to HTTPS
```sh
sudo systemctl stop nginx
# /etc/nginx/config.d/default.conf
server {
    listen       80;
    server_name  localhost;
    return 301 https://$host$request_uri;
}
```

### 2. SSL Certificate
자체 인증서 발급 예제 참고
- [리눅스 자체서명 SSL 인증서 생성](https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_%EC%9E%90%EC%B2%B4%EC%84%9C%EB%AA%85_SSL_%EC%9D%B8%EC%A6%9D%EC%84%9C_%EC%83%9D%EC%84%B1)
- [Convert Certificate Format](https://www.securesign.kr/guides/SSL-Certificate-Convert-Format)
- [CONVERT PRIVATE SSL KEY FROM JKS TO PEM FORMAT](https://cinhtau.net/2016/08/09/convert-private-ssl-key-from-jks-to-pem-format/)

### 3. Nginx SSL Config

```sh
# /etc/nginx/config.d/default.conf
server {
    listen       443    ssl;
    server_name  localhost;
 
    ssl_certificate         /etc/nginx/cert/ca.pem;
    ssl_certificate_key     /etc/nginx/cert/ca-private.key;
    ssl_protocols           TLSv1 TSLv1.1 TLSv1.2;
}
```

### 4. Nginx Proxy Config
```sh
server {
    listen       443     ssl;
    server_name  localhost;
 
    location / {
        proxy_pass         https://127.0.0.1:8080;
 
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
sudo systemctl start nginx
#sudo systemctl restart nginx
sudo systemctl status nginx
```

## 참고
- [Redirect all HTTP requests to HTTPS with Nginx](https://bjornjohansen.no/redirect-to-https-with-nginx)
- [Using Apache as a Reverse Proxy for Spring Boot Embedded Tomcat](https://medium.com/@codebyamir/using-apache-as-a-reverse-proxy-for-spring-boot-embedded-tomcat-f704da73e7c8) 