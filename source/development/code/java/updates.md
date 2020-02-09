---
    title: 자바
    description: 변경사항
---

## Updates

### Java 9

#### JEP 102: Process API Updates
OS 프로세스 제어 및 관리 API가 개선되었습니다.

ProcessHandle 클래스는 프로세스에 대한 네이티브 아이디, 매개변수, 명령어, 시작 시간, 가속화된 CPU 시간, 사용자, 부모 프로세스 정보를 제공합니다.

> http://openjdk.java.net/jeps/102

#### JEP 213: Milling Project Coin ⭐️  
언어적인 측면에서 몇가지 개선사항이 있습니다.

- [try-with-resources 개선](https://dzone.com/articles/try-with-resources-enhancement-in-java-9)
- [익명 클래스에 대한 다이아몬드 문법 지원](https://www.tutorialspoint.com/java9/java9_inner_class_diamond_operator.htm)
- [인터페이스의 private 메소드 지원](https://www.tutorialspoint.com/java9/java9_private_interface_methods.htm)

> https://openjdk.java.net/jeps/213

#### JEP 222: jshell: The Java Shell (Read-Eval-Print Loop) ⭐️
Read-Eval-Print Loop (REPL) 기능을 지원합니다. jshell 도구는 자바 프로그래밍 언어에 대한 대화식 명령행 인터페이스를 지원하여 즉각적인 결과와 피드백을 제공합니다.

jshell를 활용하면 Java 언어 또는 새로운 기능을 학습하는데 유용합니다.

> http://openjdk.java.net/jeps/222
> 
#### JEP 224: ~~HTML5 Javadoc~~  

#### JEP 226: UTF-8 Properties Files ⭐️
프로퍼티 파일들을 로드할 때 ISO-8859-1이 아닌 UTF-8 인코딩을 사용합니다.

> http://openjdk.java.net/jeps/226

#### JEP 229: Create PKCS12 Keystores by Default ⭐️  
기본 키 저장소 유형을 JKS에서 PKCS12로 변경합니다.

> http://openjdk.java.net/jeps/229

#### JEP 244: TLS Application-Layer Protocol Negotiation Extension ⭐️
TLS 연결에서 클라이언트와 서버의 ALPN을 허용합니다.

> http://openjdk.java.net/jeps/244

#### JEP 245: Validate JVM Command-Line Flag Arguments
JVM 명령어 플래그에 대한 유효성 검증 및 오류 메시지를 표시합니다.

> http://openjdk.java.net/jeps/245

#### JEP 247: Compile for Older Platform Versions
이전 버전의 플랫폼에서 동작하도록 프로그램을 컴파일할 수 있게 javac를 개선하였습니다.

> http://openjdk.java.net/jeps/247

#### ~~JEP 158: Unified JVM Logging~~

#### JEP 214: Remove GC Combinations Deprecated in JDK 8 💥
JDK 8에서 제외된 가비지 콜렉터 조합을 제거합니다.

> http://openjdk.java.net/jeps/214

#### JEP 236: Parser API for Nashorn
ECMAScript 코드 분석을 지원합니다.

> http://openjdk.java.net/jeps/236

#### JEP 248: Make G1 the Default Garbage Collector ⭐️
32 그리고 64 비트 서버 구성에서 Garbage-First (G1) 가비지 컬렉터를 기본으로 사용합니다.

> http://openjdk.java.net/jeps/248

#### ~~JEP 252: CLDR Locale Data Enabled by Default~~

#### JEP 254: Compact Strings

Adopts a more space-efficient internal representation for strings. Previously, the String class stored characters in a char array, using two bytes (16 bits) for each character. The new internal representation of the String class is a byte array plus an encoding-flag field.

> http://openjdk.java.net/jeps/254

#### ~~JEP 259: Stack-Walking API~~

#### JEP 266: More Concurrency Updates	
CompletableFuture API 개선과 Reactive Streams를 지원합니다.

> http://openjdk.java.net/jeps/266

#### JEP 267: Unicode 8.0
유니코드 8.0을 지원합니다.

> http://openjdk.java.net/jeps/267

#### JEP 269: Convenience Factory Methods for Collections
컬렉션에 대한 편리한 팩토리 메소드를 지원합니다.

> http://openjdk.java.net/jeps/269

#### JEP 277: Enhanced Deprecation
@deprecated로 추가적인 정보를 제공할 수 있도록 지원합니다.

> http://openjdk.java.net/jeps/277

#### JEP 291: Deprecate the Concurrent Mark Sweep (CMS) Garbage Collector  
Concurrent Mark Sweep (CMS) 가비지 컬렉터가 제외됩니다. G1 가비지 컬렉터가 대부분의 CMS 기능을 대체 합니다.

> http://openjdk.java.net/jeps/291

#### JEP 292: Implement Selected ECMAScript 6 Features in Nashorn ⭐️

Implements many new features introduced in the 6th edition of ECMA-262, also known as ECMAScript 6, or ES6 for short. Implemented features include the following:

- Template strings
- let, const, and block scope
- Iterators and for..of loops
- Map, Set, WeakMap, and WeakSet
- Symbols
- Binary and octal literals

> http://openjdk.java.net/jeps/292

### Java 10

자바 10에서의 변경사항 중 주요 내용은 다음과 같습니다.

 - 지역 변수에 대한 추론 문법 지원
 - 오라클 JDK의 기본 CA 목록 포함

> 관심없는 변경 및 개선사항은 취소선으로 표시하였습니다.

#### JEP 286: Local-Variable Type Inference ⭐️
지역 변수에 대한 타입 추론을 지원합니다. 기존에 엄격하게 변수에 대한 타입을 선언하였던과는 달리 `var`를 통해 컴파일러가 타입을 추론할 수 있게할 수 있습니다.

단, 지역 변수의 초기화 시점과 반복문에서의 지역 변수 선언할 때 가능합니다.

> http://openjdk.java.net/jeps/286

#### ~~JEP 296: Consolidate the JDK Forest into a Single Repository~~

#### ~~JEP 304: Garbage-Collector Interface~~

#### JEP 307: Parallel Full GC for G1
JDK 9에서 기본 가비지 컬렉터로 채택된 G1의 싱글 쓰레드 방식으로 mark-sweep-compact 알고리즘을 수행하던 것을 병렬로 수행할 수 있게하여 Full GC에 대한 지연 시간을 개선하였습니다.

```sh
-XX:ParallelGCThreads=<threads_count>
```

> http://openjdk.java.net/jeps/307

#### JEP 310: Application Class-Data Sharing  
애플리케이션 클래스 데이터를 공유 아카이브에 배치하여 서로 다른 자바 프로세스가 공유할 수 있도록 개선되었으며 구동 시간 및 메모리 사용량을 최적화합니다.

> http://openjdk.java.net/jeps/310

#### ~~JEP 312: Thread-Local Handshakes~~

#### ~~JEP 313: Remove the Native-Header Generation Tool (javah)~~

#### ~~JEP 314: Additional Unicode Language-Tag Extensions~~

#### JEP 316: Heap Allocation on Alternative Memory Devices
JVM Heap 영역을 NV-DIMM과 같은 대체 메모리에 할당할 수 있습니다.

```sh
-XX:AllocateHeapAt=<path>
```

> http://openjdk.java.net/jeps/316

#### ~~JEP 317: Experimental Java-Based JIT Compiler~~

#### JEP 319: Root Certificates ⭐️
SSL 또는 TLS 인증서를 발급해주는 인증기관(CA)에 대한 목록을 기존의 OpenJDK는 제공하지 않았지만 JDK 10에서는 오라클 JDK의 CA 목록이 기본으로 포함됩니다.

> http://openjdk.java.net/jeps/319

#### ~~JEP 322: Time-Based Release Versioning~~

###  Java 11
#### JEP 181: Nest-Based Access Control  
중첩 기반의 접근 제어가 가능합니다. 

- [Java 11 Nest Based Access Control - Baeldung](https://www.baeldung.com/java-nest-based-access-control)

> http://openjdk.java.net/jeps/181

#### JEP 309: Dynamic Class-File Constants
동적 클래스 파일 상수 지원

> http://openjdk.java.net/jeps/309

#### JEP 315: Improve Aarch64 Intrinsics

#### JEP 318: Epsilon: A No-Op Garbage Collector
메모리 교정 매커니즘을 구현하지 않은 가비지 컬렉터인 Epsilon을 제공합니다.

> http://openjdk.java.net/jeps/318

#### JEP 320: Remove the Java EE and CORBA Modules
Java SE 9에서 제외된 Java EE, CORBA 모듈을 제거합니다.

> http://openjdk.java.net/jeps/320

#### JEP 321: HTTP Client (Standard)
JDK 9에서 도입되었던 HTTP Client API를 표준화합니다.

> http://openjdk.java.net/jeps/321

#### JEP 323: Local-Variable Syntax for Lambda Parameters
Java 10에서 지역 변수에 대한 타입 추론을 지원했습니다. 
이제 람다 매개변수에 대해 지역 변수 문법을 제공합니다.

> http://openjdk.java.net/jeps/323

#### JEP 324: Key Agreement with Curve25519 and Curve448
#### JEP 327: Unicode 10
Java 10 에서는 유니코드 8.0을 지원했으며 유니코드 9.0은 7,500개의 문자와 6개의 새로운 스크립트가 추가되었고 유니코드 10.0.0은 8,518개의 문자와 4개의 새로운 스크립트가 추가되었습니다. 

따라서, 유니코드 10.0을 지원함에 따라 총 16,018개의 문자와 10개의 새로운 스크립트가 추가됩니다.

> http://openjdk.java.net/jeps/327

#### JEP 328: Flight Recorder


> http://openjdk.java.net/jeps/328

#### JEP 329: ChaCha20 and Poly1305 Cryptographic Algorithms
안전하지 않은 RC4 스트림 암호를 대신할 수 있는 새로운 스트림 암호인 ChaCha20을 지원합니다.

> http://openjdk.java.net/jeps/329

#### JEP 330: Launch Single-File Source-Code Programs
싱글 파일 소스 코드 프로그램 실행

> http://openjdk.java.net/jeps/330

#### JEP 331: Low-Overhead Heap Profiling

> http://openjdk.java.net/jeps/331

#### JEP 332: Transport Layer Security (TLS) 1.3
보안 및 성능이 향상된 TLS 1.3 버전을 지원합니다.

> http://openjdk.java.net/jeps/332

#### JEP 333: ZGC: A Scalable Low-Latency Garbage Collector (Experimental)

> http://openjdk.java.net/jeps/333

#### JEP 335: Deprecate the Nashorn JavaScript Engine
Java 8에서 추가된 Nashorn 자바스크립트 엔진은 ECMAScript-262 5.1 표준을 완벽하게 구현했으나 ECMAScript에 대한 변화가 빨라지면서 Nashorn이 유지 관리를 감당하기 어렵다고 판단하여 제외합니다.

> http://openjdk.java.net/jeps/335

#### JEP 336: Deprecate the Pack200 Tools and API
Pack200은 Java SE 5.0에 도입된 JAR 파일에 대한 압축 체계입니다. 그러나 최근에는 다운로드 속도도 향상되었으며 JDK 9에서 새로운 압축 체계를 도입하였으므로 JDK 9 이상에서는 Pack200에 의존하지 않습니다. 따라서, 더 이상 필요없는 Pack200을 제외합니다.

> http://openjdk.java.net/jeps/336

## 참고
- [OpenJDK - JDK 10](http://openjdk.java.net/projects/jdk/10/)
- [Java10 신규 기능(특징) 정리](https://itstory.tk/entry/Java-10-%EC%8B%A0%EA%B7%9C-%EA%B8%B0%EB%8A%A5%ED%8A%B9%EC%A7%95-%EC%A0%95%EB%A6%AC)
- [OpenJDK - JDK 11](http://openjdk.java.net/projects/jdk/11/)
- [새로운 기능 및 개선 사항 목록 - 자바11에서의 변화](https://blog.advenoh.pe.kr/java/%EC%83%88%EB%A1%9C%EC%9A%B4-%EA%B8%B0%EB%8A%A5-%EB%B0%8F-%EA%B0%9C%EC%84%A0-%EC%82%AC%ED%95%AD-%EB%AA%A9%EB%A1%9D-%EC%9E%90%EB%B0%9411%EC%97%90%EC%84%9C%EC%9D%98-%EB%B3%80%ED%99%94/)  
- [Java 11로 전환해야 하는 이유](https://docs.microsoft.com/ko-kr/azure/java/jdk/reasons-to-move-to-java-11)