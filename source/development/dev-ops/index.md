---
    title: DevOps
    description:
---

## 데브-옵스란 무엇일까?

![출처 : 와탭 블로그
](https://www.whatap.io/ko/blog/img/4/NoOps_1.webp)

데브-옵스는 개발과 운영을 통합하는 개념으로 애자일 소프트웨어 개발 방법론을 넘어 개발팀과 운영팀이 협력하여 진행하는 소프트웨어 개발 방법론입니다. 

데브-옵스 개념에는 CI(Continuouse Integration)와 CD(Continuous Deployment)가 있습니다. 지속적인 통합과 배포를 통해 애자일의 스프린트 단위 개발과 같이 짧은 주기로 기능을 만들고 서비스를 제공합니다.  

### CI(Continuouse Integration)  
지속적인 통합은 개발, 빌드, 테스트의 단계를 통합하는 것을 말하며 이를 위한 도구로 다음과 같은 것들이 있습니다.

 - 소스 코드 관리를 위한 Git
 - 빌드를 위한 Gradle
 - 테스트를 위한 JUnit
 - 지속적인 통합 프로세스를 관리하기 위한 Jenkins

### CD(Continuous Deployment)  
지속적인 배포는 배포와 운영을 통합하는 것을 말하며 이를 위한 도구로 다음과 같은 것들이 있습니다.

 - 서버 구성에 대한 이미지화를 위한 [Docker](docker/)  
 - 이미지 컨테이너 운영을 위한 Kubernetes  

