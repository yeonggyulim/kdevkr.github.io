---
    title: 자바 애플리케이션에 HotSwap 적용하기
    date: 2020-02-09
    categories:
        - 개발 이야기
    tags:
        - Java
        - Spring
        - HotSwapAgent
---

![](/images/2020/hot-swap.png)

## 들어가며
자바 애플리케이션 개발 시 클래스에 대한 변경을 바로 적용시키기 위해서는 핫-스왑이라는 기술이 적용되어야합니다. 유료로 전환된지 오래된 [JRebel](https://www.jrebel.com/products/jrebel)이 대표적인 도구입니다.

이와 비슷한 기능을 하는 오픈 소스로 [HotSwapAgent](https://github.com/HotswapProjects/HotswapAgent) 프로젝트가 있습니다. HotSwapAgent를 자바 애플리케이션 구동시 적용하는 방법을 알아보겠습니다.

## Java 8 Application with HotSwap  
핫-스왑 기술을 적용하기 위해서는 DCEVM으로 빌드된 JDK와 HotSwapAgent를 사용해야합니다.

### Dynamic Code Evolution VM(DCEVM)  
DCEVM은 OpenJDK 7/8에 대한 클래스 재정의 기능을 향상시키는 프로젝트입니다.

#### Trava DCEVM 8
[TravaOpenJDK](https://github.com/TravaOpenJDK/trava-jdk-8-dcevm)에서 AdoptOpenJDK를 기반으로 DCEVM 빌드된 JDK를 제공합니다.

다만, 윈도우즈를 위한 빌드는 실패한 상태이며 리눅스와 맥 OS는 제공합니다.

#### DCEVM Installer
[OpenJDK](https://github.com/ojdkbuild/ojdkbuild) 8를 다운받은 상태에서 [DCEVM 인스톨러](https://github.com/dcevm/dcevm/releases)를 이용하면 DCEVM 으로 패치할 수 있도록 지원합니다.

```sh
sudo java -jar DCEVM-8u181-installer-build2.jar
```

![](/images/2020/dcevm-8u181-installer-build2.png)

### HotSwapAgent  

[HotSwapAgent](https://github.com/HotswapProjects/HotswapAgent/releases/tag/RELEASE-1.4.0)를 다운받습니다.

### Run and Debug  
이제 애플리케이션 실행 시 DCEVM으로 패치된 JDK를 지정하고 HotSwapAgent를 VM 옵션에 추가하면 됩니다.

**VM Options**
```sh
-javaagent:C:\java\hotswap-agent-1.4.0.jar
```

**Console**
```sh
Connected to the target VM, address: '127.0.0.1:6327', transport: 'socket'
HOTSWAP AGENT: 23:20:30.859 INFO (org.hotswap.agent.HotswapAgent) - Loading Hotswap agent {1.4.0} - unlimited runtime class redefinition.
HOTSWAP AGENT: 23:20:31.278 INFO (org.hotswap.agent.config.PluginRegistry) - Discovered plugins: [JdkPlugin, Hotswapper, WatchResources, ClassInitPlugin, AnonymousClassPatch, Hibernate, Hibernate3JPA, Hibernate3, Spring, Jersey1, Jersey2, Jetty, Tomcat, ZK, Logback, Log4j2, MyFaces, Mojarra, Omnifaces, ELResolver, WildFlyELResolver, OsgiEquinox, Owb, Proxy, WebObjects, Weld, JBossModules, ResteasyRegistry, Deltaspike, GlassFish, Vaadin, Wicket, CxfJAXRS, FreeMarker, Undertow, MyBatis]
```

## Java 11 Application with HotSwap
JDK 11는 [TravaOpenJDK](https://github.com/TravaOpenJDK/trava-jdk-11-dcevm/releases)에서 DCEVM으로 빌드된 바이너리를 받으면 됩니다.

### Run and Debug
이 바이너리에는 DCEVM과 HotSwapAgent가 포함되어있으니 자바 애플리케이션 구동 시 JDK를 선택하고 실행하면 됩니다.

**Console**
```sh
Connected to the target VM, address: '127.0.0.1:7066', transport: 'socket'
HOTSWAP AGENT: 23:37:13.680 INFO (org.hotswap.agent.HotswapAgent) - Loading Hotswap agent {1.4.0} - unlimited runtime class redefinition.
HOTSWAP AGENT: 23:37:13.882 INFO (org.hotswap.agent.config.PluginRegistry) - Discovered plugins: [JdkPlugin, Hotswapper, WatchResources, ClassInitPlugin, AnonymousClassPatch, Hibernate, Hibernate3JPA, Hibernate3, Spring, Jersey1, Jersey2, Jetty, Tomcat, ZK, Logback, Log4j2, MyFaces, Mojarra, Omnifaces, ELResolver, WildFlyELResolver, OsgiEquinox, Owb, Proxy, WebObjects, Weld, JBossModules, ResteasyRegistry, Deltaspike, GlassFish, Vaadin, Wicket, CxfJAXRS, FreeMarker, Undertow, MyBatis]
Starting HotswapAgent 'C:\java\java11-openjdk-dcevm-windows\dcevm-11.0.5+5\lib\hotswap\hotswap-agent.jar'
```

## 참고  
- [DCEVM](https://github.com/dcevm/dcevm)  
- [Trava JDK 11 DCEVM](https://github.com/TravaOpenJDK/trava-jdk-11-dcevm)  
- [HotswapAgent](https://github.com/HotswapProjects/HotswapAgent)  