---
title: Jenkins
date: 2018-10-19 00:00:00
categories: [DevOps, CI, Jenkins]
tags:
---

## CI(Continuous Integration) : 지속적 통합  
AWS는 지속적 통합에 대해서 다음과 같이 설명하고 있습니다.  
> CI는 자동화된 빌드 및 테스트가 수행된 후, 개발자가 코드 변경 사항을 중앙 리포지토리에 정기적으로 병합하는 DevOps 소프트웨어 개발방식이다.  
> CI는 소프트웨어 릴리즈 프로세스 중 빌드 또는 통합단계를 주로 가리키며 이 지속적 통합의 핵심 목표는 버그를 신속하게 찾아 해결하고, 소프트웨어 품질을 개선하며 검증 및 릴리즈하는 데 걸리는 시간을 단축하는 것이다.  
> 참조 : [aws-devops-continuous-integration](https://aws.amazon.com/ko/devops/continuous-integration/)  

## Jenkins with Github    
젠킨스는 CI를 위한 MIT 라이센스를 가지는 오픈소스 자동화 서버입니다. 빌드부터 테스트, 배포까지를 자동화해주는 도구라고 할 수 있습니다. 이 포스트에서는 젠킨스와 함께 Github의 리포지토리 서비스로 연동하여 CI를 수행하는 절차에 대해 알아보고자 합니다.  

> 개발자가 깃허브 리포지토리에 변경사항을 푸시하게 되면 젠킨스가 이를 감지하여 해당 변경사항을 풀을 받아서 빌드 프로세스를 시작합니다.  

- [깃허브와 젠킨스 연결하기](http://bcho.tistory.com/1237)  
- [도커를 이용한 지속적 통합 구축 연습하기](https://jojoldu.tistory.com/139)  
