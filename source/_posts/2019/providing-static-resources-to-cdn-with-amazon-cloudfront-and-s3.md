---
title: 아마존 CloudFront와 S3로 정적파일을 CDN으로 제공하기
categories: [개발 이야기]
date: 2019-05-15
banner:
    url: https://static.knackforge.in/sites/default/files/2017-06/Amazon-Cloudfront_0.png
---

![](https://static.knackforge.in/sites/default/files/2017-06/Amazon-Cloudfront_0.png)

애플리케이션 서버에서 정적파일을 배포하다보면 서버와 클라이언트의 거리로 인하여 지연시간이 생길때가 발생한다. 현재 배포중인 애플리케이션 서버는 한국에 있는데 태국에서 접속할때 페이지 로딩에 대한 이슈가 있어 이를 보완해달라는 요구사항이 생겼다.

## Amazon CloudFront

아마존 웹 서비스의 [CloudFront](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)는 정적 및 동적 컨텐츠를 사용자에게 더욱 빠르게 배포하도록 지원하는 서비스이다. `CloudFront`는 `Edge Location`이라고 하는 전세계 데이터 센터 네트워크를 통해 컨텐츠를 제공한다.

만약, 애플리케이션 서버가 한국에 있다고 가정할 때 CloudFront는 한국 리전의 엣지 로케이션으로 사용자에게 컨텐츠를 배포하고 태국에 있다고 가정할 때는 가까운 싱가포르 리전의 엣지 로케이션에서 컨텐츠를 배포하여 한국에서 컨텐츠를 배포하는 것보다 더 빠른 네트워크 속도를 제공할 수 있다.

### Create Distribution

CloudFront의 CDN 서비스를 이용하기 위해서 CloudFront가 분산하여 처리할 수 있도록 정보를 생성하자.

잠만보는 웹 컨텐츠 배포방식을 선택하였다.

이제 Origin Domain Name을 설정해보도록 한다.

#### S3 버킷 생성

만약, Origin Domain Name에서 선택할 S3 버킷이 존재하지 않는다면 S3 콘솔에서 CloudFront용 버킷을 생성하고 오자.

### S3 CORS Policy

로컬호스트 환경에서 컨텐츠를 가져오기 위해서는 CORS 정책을 설정하여야 한다. 기본적으로는 CORS 설정이 안되어있기 때문에 오리진에 Access-Control-Allow-Origin 헤더를 넣는다해도 제한된다.

해당 S3 버킷의 권한 탭으로 이동하여 CORS 구성을 설정하자.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

잠만보의 경우 정적 컨텐츠를 제공하기만 할 것이므로 GET 메소드만 허용하였으며 모든 오리진을 허용했다.
