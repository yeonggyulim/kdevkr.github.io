---
title: PKIX path building failed for HttpClient
date: 2019-10-24
categories: [개발 이야기, 인증서]
---

> Caused by: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target

## Check Trust Certificates of Access Server

### 

```sh
openssl s_client -showcerts -connect {HOSTNAME}:{PORT} x509 -outform PEM > trust-Server.pem
```

### check your self-signed trust-store

```sh
keytool -list -keystore trust-keystore.jks -v -storepass password

키 저장소 유형: jks
키 저장소 제공자: SUN

키 저장소에 1개의 항목이 포함되어 있습니다.

별칭 이름: ca
생성 날짜: Jul 5, 2018
항목 유형: trustedCertEntry

소유자: C=KR, CN=ROOT
발행자: C=KR, CN=ROOT
일련 번호: 16467ee4f2b
적합한 시작 날짜: Thu Jul 05 09:53:48 KST 2018 종료 날짜: Fri Jul 05 00:00:00 KST 2019
인증서 지문:
         MD5:  FD:01:D4:03:C9:B0:B3:FC:FE:96:CF:BE:A1:01:30:AC
         SHA1: 33:20:36:E9:92:69:BE:44:3D:BE:8B:BE:1F:F8:41:0A:78:D9:26:C7
         SHA256: C8:4A:30:8E:6A:73:FA:5E:D8:6E:09:D5:B0:1A:A5:C0:89:EB:29:DC:DC:15:FA:CC:85:95:FC:2A:AC:C0:32:88
서명 알고리즘 이름: SHA256withRSA
주체 공용 키 알고리즘: 2048비트 RSA 키
버전: 3

확장: 

#1: ObjectId: 2.5.29.19 Criticality=true
BasicConstraints:[
  CA:true
  PathLen:0
]

#2: ObjectId: 2.5.29.15 Criticality=true
KeyUsage [
  DigitalSignature
  Key_CertSign
  Crl_Sign
]
```

### export certificate in trust-keystore
```sh
keytool -export -alias ca -keystore trust-keystore.jks -storepass password -file trust-server.cer
```

### import certificate in cacerts
```sh
# jvm cacerts default password: changeit 
keytool -import -keystore /Library/Java/JavaVirtualMachines/jdk1.8.0_192.jdk/Contents/Home/jre/lib/security/cacerts -storepass changeit -alias ca -file trust-server.cer
```

## Keytool
먼저 사용하고 있는 JDK 위치를 알아야한다. 잠만보가 사용하고 있는 맥에 설치된 JDK 경로는 다음과 같다.

/Library/Java/JavaVirtualMachines/jdk1.8.0_192.jdk/Contents/Home

### lookup for alias in keystore

default password : `changeit`
```sh
# 

keytool -list -keystore /Library/Java/JavaVirtualMachines/jdk1.8.0_192.jdk/Contents/Home/jre/lib/security/cacerts -alias ca -storepass changeit

keytool -list -keystore /Library/Java/JavaVirtualMachines/jdk1.8.0_192.jdk/Contents/Home/jre/lib/security/cacerts -alias ca -storepass changeit -v
```

### import certificate to keystore

```sh
keytool -import -keystore /Library/Java/JavaVirtualMachines/jdk1.8.0_192.jdk/Contents/Home/jre/lib/security/cacerts -alias ca -file ./truststore.pem
```

### delete certificate for alias in keystore
```sh
keytool -delete -alias ca -keystore /Library/Java/JavaVirtualMachines/jdk1.8.0_192.jdk/Contents/Home/jre/lib/security/cacerts -storepass changeit

# https://docs.oracle.com/cd/E19159-01/820-4605/ablre/index.html
```

## 참고
- [How to resolve “unable to find valid certification path to requested target” error?](https://jfrog.com/knowledge-base/how-to-resolve-unable-to-find-valid-certification-path-to-requested-target-error/)