---
    title: Smack API를 이용해서 XMPP 프로토콜 연결하기
    categories: [개발 이야기]
    date: 2021-01-04
---

에너지 관련 프로젝트를 진행하면서 OpenADR 통신 프로토콜을 다루는데 OpenADR의 지원해야하는 통신 규격을 보면 simpleHttp와 xmpp가 있다.

현재 SimpleHTPP 방식으로만 지원하고 있으니 추후에는 XMPP 규격도 지원해야만 한다.

## XMPP
XMPP(Extensible Messaging and Presence Protocol)은 XML 기반의 미들웨어 인터넷 통신 규약이며 통신하는 두 지점간의 상태와 확장 가능한 메시징을 위한 통신 규격을 정의한 것이다.

> 또한, 현 에너지 프로젝트에서는 MQTT를 이용한 메시지 발행 및 구독을 통해 전력 장비로 직접 메시징을 시도하고 있다.

### 아키텍처
![](http://www.dbguide.net/images/know/tech/091105_xmpp2.gif)

한국데이터산업진흥원의 XMPP 자료에 있는 아키텍처를 살펴보면 서버, 클라이언트, 게이트웨이로 구성되는 것을 확인할 수 있다.

> XMPP가 표준이 되기전에 Jabber라는 이름의 프로토콜은 게이트웨이는 존재하지 않았다고 한다.

### 통신 엔드포인트
XMPP에서의 통신 주소(JID: Jabber ID)는 다음과 같이 구성된다.

```plain
{username}@{domain} (optional)/{resource}
```

### XMPP 라이브러리
XMPP는 여러 언어를 위한 [라이브러리](https://xmpp.org/software/libraries.html)가 제공된다.

자바에서는 Smack이 있으며 스프링 프레임워크에서도 이 Smack 기반의 [XMPP과의 통합을 지원](https://docs.spring.io/spring-integration/docs/4.3.x/reference/html/xmpp.html)한다.

#### Smack
Smack은 오픈 소스 XMPP 클라이언트 라이브러리이다.

```java
// Create a connection to the jabber.org server on a specific port.
XMPPTCPConnectionConfiguration config = XMPPTCPConnectionConfiguration.builder()
  .setUsernameAndPassword("username", "password")
  .setXmppDomain("jabber.org")
  .setHost("earl.jabber.org")
  .setPort(8222)
  .build();
  
AbstractXMPPConnection connection = new XMPPTCPConnection(config);
connection.connect().login();
```

##### 인스턴스 메시지 보내기
Smack을 이용하여 메시지를 보내려면 `org.jivesoftware.smack.chat2.Chat` 클래스를 사용하면 된다.

```java
ChatManager chatManager = ChatManager.getInstanceFor(connection);
chatManager.addIncomingListener(new IncomingChatMessageListener() {
  @Override
  void newIncomingMessage(EntityBareJid from, Message message, Chat chat) {
    System.out.println("New message from " + from + ": " + message.getBody());
  }
});

EntityBareJid jid = JidCreate.entityBareFrom("jsmith@jivesoftware.com");
Chat chat = chatManager.chatWith(jid);
chat.send("Howdy!");
}
```

### 스프링프레임워크에서의 XMPP
스프링 통합 모듈은 XMPP Chat 서비스와 로스터에서의 엔트리 상태 변경을 지원하는 XMPP 어댑터를 지원한다.



## 참고
- [XMPP(Extensible Messaging and Presence Protocol) 소개](https://www.kdata.or.kr/info/info_04_view.html?field=&keyword=&type=techreport&page=133&dbnum=128509&mode=detail&type=techreport)
- [Spring - XMPP Support](https://docs.spring.io/spring-integration/docs/4.3.x/reference/html/xmpp.html)
- [Smack - Documentation](https://download.igniterealtime.org/smack/docs/latest/documentation/overview.html)