---
    title: 젠킨스에서 정적 분석 적용하기
    categories: [개발 이야기]
    date: 2021-01-04
---

## Static Analytics
PMD, Findbugs, Checkstyle, JaCoCo, Report Info, Static Analysis Utilities, Static Analysis Collector, Analysis Model API를 활용하면 젠킨스에서 정적 분석 결과를 리포팅할 수 있다.

최근에는 위에서 언급한 플러그인들을 Deprecated되고 Warnings Next Generation 플러그인으로 통합하여 제공하고 있다.


### Warnings Next Generation Plugin
젠킨스의 Next Generation Warnings 플러그인은 컴파일러 경고 또는 정적 분석 도구에 의해 리포트된 이슈를 모아 결과를 다양한 리포트 형식으로 지원한다.

[리포트 결과 보기](https://ci.jenkins.io/job/Plugins/job/warnings-ng-plugin/job/master/lastStableBuild/)

#### Install Plugin
![플러그인 설치 화면 1]()

![플러그인 설치 화면 2]()


### Apply Java Complier


### Apply FindBugs

#### Invoke Findbugs task using Gradle
그레이들을 이용하여 Findbugs 태스크를 수행하여 정적 분석 결과 파일을 만들자.

##### Configuaring findbugs task
그레이들에 Findbugs 태스크를 수정하여 플러그인에서 읽을 수 있도록 해야한다.

```groovy
```


이 수행 결과로 build/reports/findbugs/findbugsXml.xml 파일이 생성된다.

#### Generation report using Warnings Next Genration
빌드 후 조치 추가 옵션을 통해 `Record complier warnings and static anlaysis results`을 선택하고 도구에 `FindBugs`를 선택하자.

기본 Report File Pattern은 "**/findbugsXml.xml" 이기 때문에 기재하지 않아도 된다.

> 만약 FindBugs 대신에 SpotBugs를 사용한다면 "**/spotbugsXml.xml"이다.
> Checkstyle를 선택하면 "**/target/checkstyle-results.xml"

### Apply Checkstyle




