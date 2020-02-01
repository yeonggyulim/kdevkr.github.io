---
    title: 스프링
    description: 스프링과 관련된 글 모음
    comments: false
---

## [How Fast is Spring?](https://spring.io/blog/2018/12/12/how-fast-is-spring) 

![](https://docs.google.com/spreadsheets/d/e/2PACX-1vQpSEfx0Y1W9aD3XVyn91-S0jtUp2DRCQSy_W_LMGyMR91YLAQ1mL7MiR1BRd8VzshvtuxzL6WAnlxf/pubchart?oid=336485057&format=image)

**TL;DR How do I make my app go faster?**

(Copied from here.) You are mostly going to have to drop features, so not all of these suggestions will be possible for all apps. Some are not so painful, and actually pretty natural in a container, e.g. if you are building a docker image it’s better to unpack the jar and put application classes in a different filesystem layer anyway.

## [Spring Boot 공식 지원 내장 WAS인 Undertow를 씁시다.](https://zepinos.tistory.com/35?category=797552)  

![](https://www.nxter.org/wp-content/plugins/bb-plugin/img/no-image.png)  

톰캣의 단점으로 인해 내장된 임베디드 톰캣보다는 언더토우 사용을 권장하고 있다.