---
    title: 사용하면서 알게 된 Reactor, 예제 코드로 살펴보기
    date: 2018-05-29
    categories: [북마크]
    tags: [리액티브, Reactor]
---

Reactor는 Pivotal의 오픈소스 프로젝트로, JVM 위에서 동작하는 논블럭킹 애플리케이션을 만들기 위한 리액티브 라이브러리입니다. Reactor는 RxJava 2와 함께 Reactive Stream의 구현체이기도 하고, Spring Framework 5부터 리액티브 프로그래밍을 위해 지원되는 라이브러리입니다. RxJava에 익숙한 필자가 Reactor를 사용하면서 느낀 것은 RxJava와 많은 공통점이 있으며 큰 차이점이 있다면 Reactor는 최소 Java8에서 동작하며 Java8의 피쳐를 잘 지원한다는 점입니다. 
본문에서는 필자가 스프링 프레임워크 WebFlux환경에서 개발을 할 때 Reactor에 대해서 알게 된 점을 공유하고자 합니다. 쉬운 이해를 위해 간단한 자바 애플리케이션 예제 코드를 통해 소개하도록 하겠습니다. 본 예제에서 사용된 자바 버전은 Java8이며, Reactor 버전은 3.1.7 임을 알려드립니다.

- [사용하면서 알게 된 Reactor, 예제 코드로 살펴보기](https://tech.kakao.com/2018/05/29/reactor-programming/)