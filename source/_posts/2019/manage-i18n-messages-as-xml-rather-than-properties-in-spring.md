---
    title: 스프링에서 다국어 메시지를 XML로 관리하자
    date: 2019-01-26
    categories: [끄적끄적, 스프링]
    banner:
        url: https://javatutorial.net/wp-content/uploads/2017/12/spring-featured-image.png
---

![](https://javatutorial.net/wp-content/uploads/2017/12/spring-featured-image.png)

## 개요

스프링이나 스프링 부트에서 다국어 메시지를 적용하기 위해서 Properties를 기본으로 사용했다.
그러나, `messages-en.properties`와 `messages-ko.properties`와 같이 언어별로 프로퍼티 파일을 구분하고 키별로 메시지를 관리해야한다.

위와 같이 프로퍼티 파일로 메시지를 관리하다보면 해당 언어에서 특정 메시지 키를 사용하는지 파악하는게 어렵다. 만약, 잠만보처럼 회사 내 프로젝트를 진행하면서 메시지 키에 대한 정의 문서가 없는 경우 개발자가 메시지 키를 관리해야하므로 매번 검색해서 있는지 파악해야만 한다.

## 기존 방식의 대안을 알아보자

#### YAML

YML 파일을 사용해서 다국어를 설정하는 방법은 [이 블로그](https://jmlim.github.io/spring/2018/11/28/spring-boot-Internationalization/)를 통해 확인할 수 있다. 하지만, Properties와 표기 방식만 다를 뿐 언어별로 파일을 관리하는 것은 똑같다.

#### XML

그래서 잠만보가 다니는 회사에서는 프로젝트의 다국어 메시지를 프로퍼티 파일이 아닌 XML 파일로 관리하도록 했다.

다음은 XML 구성의 간단한 예시이다.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<messages>
    <entry key="menu.console">
        <ko_KR><![CDATA[콘솔]]></ko_KR>
        <en_US><![CDATA[Console]]></en_US>
    </entry>
</messages>
```

## 커스텀 리소스 번들을 만들자

일반적으로 `ResourceBundle`의 `getBundle`함수로 XML파일을 읽어 리소스 번들 인스턴스로 만들 수 있다.

#### Resource Bundle

`ResourceBundle`로 메시지 소스를 만드는 구조는 [XML 기반의 Resource Bundle, PropertyPlaceHolder 사용하기](https://firstboos.tistory.com/entry/XML-%EA%B8%B0%EB%B0%98%EC%9D%98-Resource-Bundle-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)에서 확인할 수 있다.

다음과 같이 기존의 `프로퍼티 구조`를 그대로 사용해야 한다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">

<properties>
    <entry key="menu.console"><![CDATA[콘솔]]></entry>
</properties>
```

##### Don't use Properties.loadFromXML()

`XmlResourceBundle`에서 `Properties.loadFromXML()`으로 XML을 프로퍼티 기준으로 읽어드리면 안된다.

위에서 만든 XML 구성에 따라 XML파일을 읽어들여서 메시지 정보를 만들자

```java
public class XmlResourceBundle extends ResourceBundle {

    private Map<String, Map<String, String>> messages;
    private Locale i18n;

    public XmlResourceBundle(InputStream is, Locale i18n) throws IOException, ParserConfigurationException, SAXException {
        this.i18n = i18n;
        messages = new HashMap<>();

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(is);
        doc.getDocumentElement().normalize();

        NodeList entries = doc.getElementsByTagName("entry");

        for (int i = 0; i < entries.getLength(); i++) {
            Element entry = (Element) entries.item(i);
            String key = entry.getAttribute("key");
            NodeList childNodes = entry.getChildNodes();
            for (int j = 0; j < childNodes.getLength(); j++) {
                Node n = childNodes.item(j);
                if (n.getNodeType() == Node.ELEMENT_NODE) {
                    String locale = n.getNodeName();
                    String message = n.getTextContent();

                    if (!messages.containsKey(locale)) {
                        messages.put(locale, new HashMap<>());
                    }

                    messages.get(locale).put(key, message);
                }
            }
        }
        IOUtils.closeQuietly(is);
    }

    @Override
    protected Object handleGetObject(String key) {
        return messages.get(i18n).get(key);
    }

    @Override
    public Enumeration<String> getKeys() {
        Set<String> handleKeys = messages.keySet();
        return Collections.enumeration(handleKeys);
    }

    public void setLocale(Locale locale) {
        this.i18n = locale;
    }

    public  Map<String, Map<String, String>> getMessages() {
        return messages;
    }

    public  Map<String, String> getMessages(Locale locale) {
        return messages.get(locale.toString());
    }
}
```

기존의 `.handleGetObject()`는 키 파라미터만 받으므로 메시지를 가져올때 언어를 지정할 수 없기에 `생성자에서 스트림과 언어를 받을 수 있게` 하였다.
그리고 읽어드린 메시지 맵 인스턴스를 다시 받아 사용할 수 있도록 Getter 함수를 추가했다.

#### XmlResourceBundleLoader

`XmlResourceBundleLoader`는 [이 포스트](http://www.java2s.com/Tutorial/Java/0220__I18N/XMLresourcebundle.htm)에서 작성한 코드를 그대로 사용했다.

```java
public class XmlResourceBundleLoader extends ResourceBundle.Control {

    private static final List<String> formats = Collections.singletonList("xml");

    @Override
    public List<String> getFormats(String baseName) {
        return formats;
    }

    @Override
    public ResourceBundle newBundle(String baseName, Locale locale, String format, ClassLoader loader, boolean reload) throws IllegalAccessException, InstantiationException, IOException {
        ResourceBundle resourceBundle = null;

        String bundleName = toBundleName(baseName, locale);
        String resourceName = toResourceName(bundleName, format);

        URL url = loader.getResource(resourceName);
        if (url == null) {
            return null;
        }

        URLConnection connection = url.openConnection();
        if (connection == null) {
            return null;
        }
        if (reload) {
            connection.setUseCaches(false);
        }
        InputStream stream = connection.getInputStream();
        if (stream == null) {
            return null;
        }
        try(BufferedInputStream bis = new BufferedInputStream(stream)) {
            if(locale == Locale.ROOT) {
                locale = Locale.getDefault();
            }
            resourceBundle = new XmlResourceBundle(bis, locale);
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        }

        return resourceBundle;
    }
}
```

#### Usage

위에서 만든 `XmlResourceBundle`과 `XmlResourceBundleLoader`를 이용해서 다음과 같이 메시지를 가져올 수 있게 된다.

```java
@Test
public void test() {
    ResourceBundle bundle = ResourceBundle.getBundle("messages", new Locale("en", "US"), new XmlResourceBundleLoader());
    String message = bundle.getString("menu.console");
    LOG.info("message: {}", message);
}
```

## 리소스 번들을 메시지 소스에서 사용하기

그러면 스프링 메시지 소스에서 이 리소스 번들을 사용하려면 어떻게 해야하는지 알아보겠다. 일단 메시지가 필요할 때마다 리소스 번들을 만드는 것은 효율적이지 못하다. 리소스 번들은 한번만 만들어 메시지 소스에 적용하자.

#### AbstractMessageSource

사용자 정의 메시지 소스를 만들려면 `AbstractMessageSource`를 확장하면 된다. CustomMessageSource가 생성될 때 리소스 번들을 로드시키자.

```java
@Repository
public class CustomMessageSource extends AbstractMessageSource {

    private Logger LOG = LoggerFactory.getLogger(CustomMessageSource.class);

    private Map<String, Map<String, String>> messages = Maps.newHashMap();
    private final Map<String, Map<String, MessageFormat>> formats = Maps.newHashMap();

    @Getter
    private static CustomMessageSource instance;

    @Autowired
    public CustomMessageSource() {
        instance = this;
        try {
            load();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void load() throws IllegalAccessException, IOException, InstantiationException {
        ResourceBundle resourceBundle = ResourceBundle.getBundle("messages", Locale.ROOT, new XmlResourceBundleLoader());

        XmlResourceBundle xmlResourceBundle = (XmlResourceBundle) resourceBundle;
        this.messages = xmlResourceBundle.getMessages();
    }

    // 메시지 소스에서 지원하는 언어 목록
    public List<String> getLocales() {
        return Lists.newArrayList(messages.keySet());
    }

    @Override
    protected MessageFormat resolveCode(String code, Locale locale) {
        synchronized (formats) {
            // 언어 포맷이 없을 경우 메시지 포맷을 새로 생성
            if (!formats.containsKey(locale.toString())) {
                formats.put(locale.toString(), new HashMap<String, MessageFormat>());
            }

            Map<String, MessageFormat> map = formats.get(locale.toString());

            // 언어 포맷에 메시지 코드가 없으면 메시지 정보를 통해 포맷을 저장
            if (!map.containsKey(code)) {
                if (!messages.containsKey(locale.toString())) {
                    locale = Locale.getDefault();
                }
                Map<String, String> msgs = messages.get(locale.toString());
                map.put(code, new MessageFormat(msgs.containsKey(code) ? msgs.get(code) : code, locale));
            }
            return map.get(code);
        }
    }

    public String getMessage(String code) {
        try {
            return getMessage(code, new Object[0], getLocale());
        } catch (NoSuchMessageException e) {
            return code;
        }
    }

    public String getMessage(String code, Object[] args) {
        try {
            return getMessage(code, args, getLocale());
        } catch (NoSuchMessageException e) {
            return code;
        }
    }

    public String getMessage(String code, Object[] args, String defaultMessage) {
        try {
            return getMessage(code, args, defaultMessage, getLocale());
        } catch (NoSuchMessageException e) {
            return code;
        }
    }

    public String getMessage(String code, Locale locale) {
        try {
            return getMessage(code, new Object[0], locale);
        } catch (NoSuchMessageException e) {
            return code;
        }
    }
}
```

#### Reload ResourceBundle For Development

애플리케이션을 개발하는 도중에는 메시지 소스가 계속 변경되어야하는 문제점이 있다. 물론 스프링 부트를 사용하고 있다면 `spring-boot-devtool`로 애플리케이션을 다시 실행할 수 있다.

하지만, 메시지 소스의 변경이 애플리케이션 동작에 특별한 영향을 끼치지 않으므로 다시 실행될 필요성은 없다. 애플리케이션을 다시 실행하지 않고 `메시지 XML 파일에 대한 변경을 감시`하여 다시 로드할 수 있도록 해보자.

```java
@Repository
public class CustomMessageSource extends AbstractMessageSource {

    @Autowired
    public CustomMessageSource(Environment environment) {
        instance = this;
        try {
            load();
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (!ArrayUtils.contains(environment.getActiveProfiles(), "production")) {
            reload();
        }
    }

    public void reload() throws IOException {

        new Thread(() -> {
            try {
                File file = new ClassPathResource("i18n/messages.xml").getFile();
                long lastModified = -1;
                while (true) {
                    try {
                        if (lastModified < file.lastModified()) {
                            load();
                            LOG.info("Reload MessageSource - {}", System.currentTimeMillis());
                            lastModified = file.lastModified();
                        }
                    } catch (Exception e) {

                    }
                    Thread.sleep(5000);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

굳이, 파일의 수정일을 비교하지 않아도 Java 7의 `WatchService`를 이용해도 [이 포스트](https://www.baeldung.com/java-nio2-watchservice)처럼 폴더를 감시할 수 있다.

## 참조

-   [Installing a Custom Resource Bundle as an Extension](https://docs.oracle.com/javase/tutorial/i18n/serviceproviders/resourcebundlecontrolprovider.html)
-   [XML resource bundle](http://www.java2s.com/Tutorial/Java/0220__I18N/XMLresourcebundle.htm)
-   [XML 기반의 Resource Bundle, PropertyPlaceHolder 사용하기](https://firstboos.tistory.com/entry/XML-%EA%B8%B0%EB%B0%98%EC%9D%98-Resource-Bundle-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)
-   [\[자바\] XML 파싱 예제 - DocumentBuilder](http://www.fun25.co.kr/blog/java-xml-parser-example-documentbuilder)
