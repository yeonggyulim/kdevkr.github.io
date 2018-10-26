---
title: Java KeyStore
date: 2018-08-17 00:00:00
categories: [Java, KeyStore]
tags:
---

## KeyStore  
> Encryption/Decryption 및 Digital Signature에 사용되는 Private Key, Public Key와 Certificate를 추상화한 인터페이스  

이 KeyStore를 구현한 Provider에 따라서 키와 인증서를 가져올 수 잇으며 데이터 암복호화, 전자서명을 수행할 수 있다.  

### KeyPairGenerator  
> KeyPairGenerator는 공개키(비대칭키) 암호화의 공개키 및 개인키를 생성하는 유틸 클래스

* 공개키 암호화 알고리즘에 대해서 모른다면

```Java
public static KeyPair generateRSAKeyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        return kpg.genKeyPair();
    }
```
