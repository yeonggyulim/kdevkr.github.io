---
title: JAXBContext 인스턴스를 매번 만들지 말아야하는 이유
date: 2019-10-30
categories: [개발 이야기, 이슈]
tags: [Marshaller, JAXBContext]
---

## XML Marshaller
자바 오브젝트를 XML로 구성(Marshal)하거나 XML으로 구성된 데이터를 자바 오브젝트화(Unmarshal)하는 것을 도와주는 클래스를 마샬러라고 합니다.

자바에서 사용할 수 있는 마샬러를 검색하면 [JAXB](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/Marshaller.html), [Castor](https://castor-data-binding.github.io/castor/reference-guide/reference/xml/xml-framework.html), [JiBX](http://jibx.sourceforge.net/), [XStream](https://x-stream.github.io/)등이 있습니다.

### JAXB
여러 마샬러들 중에서 가장 많이 사용되고 예제가 많은 것이 JAXB(Java Architecture for XML Binding)인데 다른 마샬러와 달리 자바 패키지에 포함되어 있으면서도 사용하기가 편리합니다.

#### XML unmarshalling benchmark
> XML unmarshalling benchmark in Java: JAXB vs STax vs Woodstox
> https://dzone.com/articles/xml-unmarshalling-benchmark

위 글의 결론을 보면 속도면에서는 JAXB가 월등하며 메모리 사용량에서는 STax가 우세하다고 설명합니다.

### JAXBContext
이 글의 주된 내용은 JAXBContext의 인스턴스에 대한 것입니다.

진행중인 전력관련 프로젝트에서 OpenADR 프로토콜을 이용하여 통신함에 따라 XML Marshaller를 사용해야 했습니다. 허나 XML 데이터의 크기가 커짐에 따라 서버의 마샬링 및 언마샬링 속도가 느려짐을 확인되었고 먼저 JAXB 성능에 의심을 하였으나 벤치마크 글을 확인한 후 방향을 틀어 현재 코드에서 문제가 있는곳을 찾아야 했습니다.

그래서 JAXB의 퍼포먼스에 대해서 검색하였고 스택오버플로우에서 다음과 같은 질문을 찾았습니다.
> How do I improve performance of application that uses the JAXBContext.newInstance operation?
> https://stackoverflow.com/questions/6043956/how-do-i-improve-performance-of-application-that-uses-the-jaxbcontext-newinstanc

답변에 내용은 JAXBContext의 인스턴스를 만드는 것에 대한 오버헤드를 피하라는 것이었고 프로젝트 내 JAXBContext를 사용하는 코드들을 찾았습니다.

```java
public static Marshaller getMarshaller(Object payload) {
    return new JAXBManager().createMarshaller();
}

public class JAXBManager {
    public static final String DEFAULT_JAXB_CONTEXT_PATH = "";
    JAXBContext jaxbContext;
    OADR2NamespacePrefixMapper nsMapper;

    public JAXBManager() throws JAXBException {
        this("");
    }

    public JAXBManager(String jaxbContextPath) throws JAXBException {
        this.jaxbContext = JAXBContext.newInstance(jaxbContextPath);
        this.nsMapper = this.createPrefixMapper();
    }

    public JAXBContext getContext() {
        return this.jaxbContext;
    }

    protected OADR2NamespacePrefixMapper createPrefixMapper() {
        return new OADR2NamespacePrefixMapper();
    }

    public Marshaller createMarshaller() throws JAXBException {
        Marshaller marshaller = this.jaxbContext.createMarshaller();
        this.nsMapper.addTo(marshaller);
        marshaller.setProperty("jaxb.fragment", Boolean.TRUE);
        return marshaller;
    }
}
```

모든 오브젝트를 XML String으로 마샬링을 할 때 새로운 JAXBManager 인스턴스를 만듬에 따라 JAXBContext 인스턴스 또한 매번 만들어지는 코드였습니다.

```xml
<oadrPayload
	xmlns="http://openadr.org/oadr-2.0b/2012/07"
	xmlns:ei="http://docs.oasis-open.org/ns/energyinterop/201110"
	xmlns:gml="http://www.opengis.net/gml/3.2"
	xmlns:dsig11="http://www.w3.org/2009/xmldsig11#"
	xmlns:scale="http://docs.oasis-open.org/ns/emix/2011/06/siscale"
	xmlns:strm="urn:ietf:params:xml:ns:icalendar-2.0:stream"
	xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:clm5ISO42173A="urn:un:unece:uncefact:codelist:standard:5:ISO42173A:2010-04-07"
	xmlns:ical="urn:ietf:params:xml:ns:icalendar-2.0"
	xmlns:pyld="http://docs.oasis-open.org/ns/energyinterop/201110/payloads"
	xmlns:emix="http://docs.oasis-open.org/ns/emix/2011/06"
	xmlns:power="http://docs.oasis-open.org/ns/emix/2011/06/power"
	xmlns:gb="http://naesb.org/espi"
	xmlns:atom="http://www.w3.org/2005/Atom">
	<oadrSignedObject>
		<oadrUpdateReport ei:schemaVersion="2.0b">
			<pyld:requestID>5db7fe19762ac9e75e1fd897</pyld:requestID>
			<oadrReport>
				<ical:dtstart>
					<ical:date-time>2019-10-29T08:53:30Z</ical:date-time>
				</ical:dtstart>
				<strm:intervals>
					<ei:interval>
						<ical:dtstart>
							<ical:date-time>2019-10-29T08:53:30Z</ical:date-time>
						</ical:dtstart>
						<ical:duration>
							<ical:duration>PT0M</ical:duration>
						</ical:duration>
						<ical:uid>
							<ical:text>0</ical:text>
						</ical:uid>
						<oadrReportPayload>
							<ei:rID>COMM_ERROR_YN</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>0.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>CYCLE_ACTIVE_ENERGY</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>500.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>CYCLE_REVERSE_ACTIVE_ENERGY</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>0.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>ACTIVE_POWER</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>223.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>TOTAL_ACTIVE_ENERGY</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>24700.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>REVERSE_ACTIVE_POWER</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>0.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>TOTAL_REVERSE_ACTIVE_ENERGY</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>0.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>VOLTAGE_R</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>3745.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>VOLTAGE_S</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>3732.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>VOLTAGE_T</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>117.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>CURRENT_R</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>66.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>CURRENT_S</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>89.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>CURRENT_T</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>93.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>FREQUENCY</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>600.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>REACTIVE_POWER</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>0.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
						<oadrReportPayload>
							<ei:rID>POWER_FACTOR</ei:rID>
							<ei:confidence>100</ei:confidence>
							<ei:accuracy>0.0</ei:accuracy>
							<ei:payloadFloat>
								<ei:value>0.0</ei:value>
							</ei:payloadFloat>
							<oadrDataQuality>Quality Good - Non Specific</oadrDataQuality>
						</oadrReportPayload>
					</ei:interval>
				</strm:intervals>
				<ei:eiReportID>eiRep_5db7fe19762ac9e75e1fd898</ei:eiReportID>
				<ei:reportRequestID>5db673e9762ae7a133ef7841</ei:reportRequestID>
				<ei:reportSpecifierID></ei:reportSpecifierID>
				<ei:reportName>TELEMETRY_USAGE</ei:reportName>
				<ei:createdDateTime>2019-10-29T08:53:45Z</ei:createdDateTime>
			</oadrReport>
			<ei:venID></ei:venID>
		</oadrUpdateReport>
	</oadrSignedObject>
</oadrPayload>
```

위 OpenADR 페이로드에 대해서 처리되는 시간이 새로운 인스턴스를 만들 경우에는 약 8초 ~ 20초가 걸렸으며 인스턴스를 한번만 만들어 사용한 경우 약 0.3 ~ 1초로 줄었습니다.

이는 JAXBContext가 인스턴스화 하는 과정에서 클래스를 로드할때 메모리 및 GC 부하가 많은 것 같아보입니다.

## 결론  
클래스 그룹별로 JAXBContext 인스턴스를 애플리케이션이 로드될 때 생성하여 사용하도록 합시다.


## 참고
- [A Guide to XML in Java](https://www.baeldung.com/java-xml)
- [JAXB creating context and marshallers cost](https://stackoverflow.com/questions/7400422/jaxb-creating-context-and-marshallers-cost)
- [JAXB-잘-사용하기](https://knight76.tistory.com/entry/JAXB-%EC%9E%98-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)