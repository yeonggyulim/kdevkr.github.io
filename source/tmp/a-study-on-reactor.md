---
    title: Reactor에 대해서 알아보기
    date: 2020-01-24
    categories: [개발 이야기]
    tags: [Reactor, Reactive, Non-Blocking, JVM]
---

## 들어가며

스프링 5에서 리액티브 스택을 지원할 때 사용하는 [Reactor](https://projectreactor.io/)에 대해서 알아보도록 하겠습니다.

사실 리액티브 프로그래밍이 나온지는 오래됬으나 스프링 MVC 기반의 애플리케이션만 개발해왔고 서블릿이 논-블로킹 IO를 지원하긴 하지만 JDBC가 블로킹 IO 작업이기 때문에 리액티브 스택을 사용하기에는 어려움이 있었습니다. 스프링 데이터 프로젝트 중에서 `spring-data-r2dbc`는 리액티브 스택에서 PostgreSQL과 같은 데이터베이스를 사용할 수 있도록 지원하기 위해 시작되었으며 어느정도 작업이 진행되었습니다. 그래서 NoSQL을 사용하지 않아도 리액티브 스택으로 전환할 수 있는 가능성이 있을 것 같습니다.

> [`r2dbc`](https://r2dbc.io/)는 SQL 데이터베이스의 리액티브 프로그래밍 API를 지원하는 기술로써 [`r2dbc-postgres`](https://github.com/r2dbc/r2dbc-postgresql)와 같은 드라이버 구현체를 제공합니다.
> 서블릿 스택에서 사용하는 것이 블로킹 기반의 JDBC라면 리액티브 스택에서 사용할 수 있는 논-블로킹 기반의 R2DBC가 있다라고 기억하시면 됩니다.

## Reactor

### Overview
Reactor는 [리액티브 스트림 스펙](https://github.com/reactive-streams/reactive-streams-jvm)에 기반한 JVM에서 동작하는 논-블로킹 애플리케이션을 만들기위한 리액티브 라이브러리 입니다. 자바 Functional API, Completable Future, Stream 그리고 Duration에 직접 상호작용합니다.

[Reactive Extensions](http://reactivex.io/)를 광범위하게 구현한 Flux와 Mono 두가지 리액티브 Composable API를 제공합니다.

논-블로킹 IO으로써 마이크로서비스 아키텍처에 적합하며 HTTP, TCP 그리고 UDP를 위해 backpressure-ready 네트워크 엔진을 제공합니다.

<script async class="speakerdeck-embed" data-id="fa5195b61d9e4d7bb85c84fc53740b89" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

### 리액티브 유형
리액티브 유형에는 두 가지 Flux와 Mono가 있습니다. 이 두 개의 유형 모두 Reactive Streams의 Publisher를 구현합니다.

```java
package org.reactivestreams;
public interface Publisher<T> {
    public void subscribe(Subscriber<? super T> s);
}
```

> Reactor에서 Publisher를 구현하여 Flux와 Mono를 제공하기 때문에 직접 구현하지 않아도 됩니다만, 몇가지 규칙을 알고 싶다면 [여기](https://github.com/reactive-streams/reactive-streams-jvm/blob/master/README.md#1-publisher-code)를 참고하세요

#### Flux
Flux는 Java 8의 Stream과 비슷한 0..N개의 결과값을 제공합니다.

```java
public abstract class Flux<T> implements CorePublisher<T> {}
```

![](https://raw.githubusercontent.com/reactor/reactor-core/v3.0.7.RELEASE/src/docs/marble/flux.png)

#### Mono
Mono는 Java 8의 CompletableFuture와 비슷한 0..1개의 결과값을 제공합니다.

```java
public abstract class Mono<T> implements CorePublisher<T> {}
```

![](https://raw.githubusercontent.com/reactor/reactor-core/v3.0.7.RELEASE/src/docs/marble/mono.png)

Flux와 Mono는 Publisher이기 때문에 데이터를 발행할 수 있는 채널을 만든 것이고 Subscriber가 이 채널을 Subscribe 해야만 Publisher가 데이터를 제공하는 개념입니다.

그래서 Publisher가 만들어졌다해도 내부적으로 어떠한 것도 실행되지 않습니다.

**_연습 하기_**
Flux와 Mono를 만들 수 있는 간단한 방법은 팩토리 메소드를 사용하는 것입니다. [Simple Ways to Create a Flux or Mono and Subscribe to It](https://projectreactor.io/docs/core/release/reference/#_simple_ways_to_create_a_flux_or_mono_and_subscribe_to_it)를 참고하여 연습해보겠습니다.

```java
@Test
public void TEST_formIterable() {
    Flux<String> fluxOfPlayers = Flux.fromIterable(players);
    BaseSubscriber<String> baseSubscriber = new BaseSubscriber<String>() {
        @Override
        protected void hookOnNext(String value) {
            System.out.println("- " + value);
        }
    };

    fluxOfPlayers.subscribe(baseSubscriber);
    String lastPlayer = fluxOfPlayers.blockLast();
    System.out.println("The last player is " + lastPlayer);
}

------------------------------------------
3 requests after onSubscribe!
- Sergio Kun Aguero
- David Silva
- Kevin De Bruyne
The last player is Kevin De Bruyne
```

위 예제에서는 Flux.fromIterable 정적 팩토리 메소드를 사용했습니다. 이때 List는 Iterable을 확장한 것이므로 파라미터로 그대로 사용할 수 있습니다.

이외에도 아래와 같이 많은 것을 제공합니다.

```java
// using empty
Flux<String> empty = Flux.empty();

// using never
Flux<String> empty = Flux.never();

// using range
Flux<Integer> range = Flux.range(1, 10);

// using fromStream
Stream<String> stream = players.stream();
Flux<String> fromStream = Flux.fromStream(stream);
```

### Subscriber
Reactive Streams의 Subscriber는 다음과 같습니다.
Subscriber 구현에 있어 몇가지 규칙은 [여기](https://github.com/reactive-streams/reactive-streams-jvm/blob/master/README.md#2-subscriber-code)에서 알아보세요

```java
public interface Subscriber<T> {
    public void onSubscribe(Subscription s);
    public void onNext(T t);
    public void onError(Throwable t);
    public void onComplete();
}
```

#### Subscribe
Subscriber는 onSubscribe의 Subscription을 통해 Publisher가 제공하는 데이터 스트림에 데이터를 요청해야합니다.

```java
public interface Subscription {
    public void request(long n);
    public void cancel();
}
```

Subscription.request로 요청받을 데이터의 개수를 알려주면 Publisher가 데이터를 제공하고 onNext로 데이터를 받게됩니다.

> 만약에 Subscription.request(5)이면 onNext(T)가 5번 호출됩니다.

Publisher의 데이터 제공이 끝났거나 그 과정에서 오류가 발생하면 onComplete와 onError가 호출됩니다.

### Processor
Reactive Streams에는 Publisher와 Subscriber를 확장한 Processor 개념이 있습니다. 

> 대부분의 경우 올바르게 사용하기 어려워서 사용하지 않는 것이 좋다고 합니다.

```java
public interface Processor<T, R> extends Subscriber<T>, Publisher<R> {
}
```

Reactor에서는 Processor 구현체로 FluxProcessor를 가지며 이를 확장한 몇가지 Processor를 제공합니다.

```java
public abstract class FluxProcessor<IN, OUT> extends Flux<OUT>
		implements Processor<IN, OUT>, CoreSubscriber<IN>, Scannable, Disposable {
}
```

#### DirectProcessor
DirectProcessor는 Subscriber들에게 신호를 디스패치할 수 있습니다. 다만 성격 상 백프레셔 처리에는 제한이 있습니다. 만약 Subscriber들에게 N개의 데이터를 보내는데 하나 이상의 Subscriber가 N개 보다 적게 요청할 경우 IllegalStateException을 보냅니다.

#### UnicastProcessor
UnicastProcessor는 내부 버퍼를 사용해서 백프레셔를 처리할 수 있습니다. 대신에 하나의 Subscriber하고만 거래할 수 있습니다.

#### EmitterProcessor
EmitterProcessor는 각 Subscriber의 백프레셔를 존중하면서 몇몇의 Subscriber들에게 방출할 수 있습니다. 또한 Publisher를 subscribe하고 동기적으로 릴레이할 수 있습니다.

초기에 Subscriber가 없는 경우에도 bufferSize를 설정하여 데이터를 푸시할 수 있습니다. 데이터를 푸시한 이후에도 데이터를 소비할 Subscriber가 없으면 onNext가 블록됩니다.

그러므로 첫번째 Subscriber가 subscribe하는 경우 bufferSize 만큼의 데이터를 받게됩니다.

기본적으로 모든 Subscriber가 취소되면 내부 버퍼를 지우고 새로운 Subscriber 수락을 중단합니다. 이 옵션은 정적 팩토리 메소드에서 autoCancel로 조정할 수 있습니다.

#### ReplayProcessor
ReplayProcessor는 sink()를 통해 직접적으로 푸시된 데이터 또는 상위 스트림의 데이터를 캐시하여 늦은 Subscriber로 다시 전송합니다.

간단하게나마 Reactor에 대해서 알아보았으니 다음에는 Reactor를 사용하는 [Spring WebFlux](https://kdevkr.github.io/archives/2020/a-study-on-spring-webflux/)에 대해서 알아보도록 하겠습니다.

## 참고
- [Introducing Reactor](https://projectreactor.io/docs/core/release/reference/#getting-started-introducing-reactor)
- [Introduction to Reactive Programming](https://tech.io/playgrounds/929/reactive-programming-with-reactor-3/Intro)
- [Understanding Reactive types](https://spring.io/blog/2016/04/19/understanding-reactive-types)