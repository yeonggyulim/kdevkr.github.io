---
title: 비밀번호 암호화 하기
categories: [개발 이야기]
date: 2021-03-20
banner:
    url: https://javatutorial.net/wp-content/uploads/2017/12/spring-featured-image.png
---

![](https://javatutorial.net/wp-content/uploads/2017/12/spring-featured-image.png#center)

자바에서 비밀번호 암호화를 구현하기 위해서는 [개인정보보호법과 JAVA를 이용한 암호화 구현(SHA256, AES256)](http://github.kindler.io/java-encrypt) 또는 [Hashing Passwords in Java with BCrypt](https://www.stubbornjava.com/posts/hashing-passwords-in-java-with-bcrypt)와 같이 바이트 연산을 하는 코드를 작성해야 한다.

## 스프링 시큐리티
스프링 프레임워크의 시큐리티 모듈은 보안 관련된 기능을 제공해준다. 

시큐리티 모듈이 제공하는 `org.springframework.security.crypto.password.PasswordEncoder `인터페이스를 통해 쉽게 비밀번호를 암호화하는 방법을 알아보자.

> 스프링 시큐리티 설정을 사용하지 않기 때문에 관련 정보를 몰라도 상관 없다.

스프링 프레임워크는 PlainText, SHA, SHA256, MD4, MD5, SCrypt, BCrypt와 같은 다양한 암호화 방식을 제공한다.

- org.springframework.security.crypto.password.StandardPasswordEncoder
- org.springframework.security.crypto.password.Pbkdf2PasswordEncoder
- org.springframework.security.crypto.password.NoOpPasswordEncoder
- org.springframework.security.crypto.scrypt.SCryptPasswordEncoder
- org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
- org.springframework.security.authentication.encoding.Md4PasswordEncoder
- org.springframework.security.authentication.encoding.Md5PasswordEncoder
- org.springframework.security.authentication.encoding.PlaintextPasswordEncoder
- org.springframework.security.authentication.encoding.ShaPasswordEncoder
- org.springframework.security.authentication.encoding.LdapShaPasswordEncoder

스프링 시큐리티의 PasswordEncoder 인터페이스는 복호화 함수를 제공하지 않는다.

비밀번호라는게 외부에 공개되어야 하는 정보가 아닐 뿐더러 개발자 뿐만 아니라 관리자도 알게 해서는 안된다.

> 네이버 개발자 블로그의 [안전한 패스워드 저장](https://d2.naver.com/helloworld/318732)을 살펴보자.

### Bcrypt 비밀번호 암호화
많은 암호화 방식 중에서 스프링 프레임워크 개발자들이 선호하는 BCryptPasswordEncoder 구현체를 사용하자.

#### PasswordEncoder 빈 등록
BCryptPasswordEncoder 구현체를 PasswordEncoder 빈으로 등록하자.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}
```

#### 암호화
비밀번호를 암호화하는 것은 쉽다. 

암호화되지 않은 비밀번호만 넘겨주면 알아서 내부적으로 해시를 만들어 암호화된 비밀번호를 반환한다.

```java
String encode(CharSequence rawPassword);
```

우리는 회원가입 또는 비밀번호 수정 시에 PasswordEncoder의 위 함수를 통해 암호화된 비밀번호를 저장해주면 된다.

#### 암호화된 비밀번호 비교
스프링 시큐리티의 PasswordEncoder가 추구하는 것은 단방향 암호화이다. 

그러므로 다시 암호화된 비밀번호를 복호화해서 비교하는 것이 아닌 암호화되지 않은 비밀번호를 다른 해시로 암호화해서 같은 값을 가지는지 비교한다.

```java
boolean matches(CharSequence rawPassword, String encodedPassword);
```

우리는 로그인 시에 위 함수를 통해 비밀번호와 암호화된 비밀번호를 비교해서 처리하면 된다.

> 스프링 시큐리티 5는 다양한 암호화 방식을 전환할 수 있도록 DelegatingPasswordEncoder도 제공한다.

## 참고
- [개인정보보호법과 JAVA를 이용한 암호화 구현(SHA256, AES256)](http://github.kindler.io/java-encrypt)
- [Hashing Passwords in Java with BCrypt](https://www.stubbornjava.com/posts/hashing-passwords-in-java-with-bcrypt)
- [BCryptPasswordEncoder : 암호 해시](http://www.devkuma.com/books/pages/1124)