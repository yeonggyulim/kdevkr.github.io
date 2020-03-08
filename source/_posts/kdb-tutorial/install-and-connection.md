---
    title: KDB 튜토리얼 - 설치 및 접속
    date: 2020-03-04
    categories: [개발 이야기]
    tags: [KDB, Q]
---

1. **KDB 튜토리얼 - 설치 및 접속**
2. [KDB 튜토리얼 - 변수 할당 및 테이블 생성](/archives/kdb-tutorial/assign-variables-and-tables)
3. [KDB 튜토리얼 - Q-SQL](/archives/kdb-tutorial/q-sql)
4. [KDB 튜토리얼 - 그룹핑과 집계](/archives/kdb-tutorial/grouping-and-aggregation)
5. [KDB 튜토리얼 - 파일 다루기](/archives/kdb-tutorial/file)
6. [KDB 튜토리얼 - 네임스페이스](/archives/kdb-tutorial/namespace)
7. [KDB 튜토리얼 - 함수](/archives/kdb-tutorial/function)

## 들어가며
KDB+는 KxSystems에서 만든 시계열 데이터베이스입니다.

- 고성능의 시계열 컬럼 데이터베이스
- 인-메모리 엔진
- 실시간 스트리밍 프로세서
- 표현 쿼리 및 프로그래밍 언어 `q`

> KDB+를 다루기 위해서 q라는 프로그래밍 언어에 대해서 배워야합니다.

### HDB 그리고 RDB
KDB+는 현재날짜의 이전 데이터는 HDB(Historical Database)으로 디스크에 저장하고 현재 데이터는 RDB(Reatime Database)으로 메모리에 저장합니다.

![](https://code.kx.com/q/img/wstree.png)  

> Kx 공식 레퍼런스에 따르면 RDB 머신이 최소 할당할 수 있는 메모리의 크기를 하루에 저장되는 데이터의 크기의 4배 이상으로 할당하는 것을 추천합니다.

## 설치 및 접속

Kx에서 [직접 다운로드](https://kx.com/connect-with-us/download/) 링크를 받거나 도커 이미지를 통해 설치할 수 있습니다. 저는 간단하게 도커를 이용하여 KDB+를 설치하고 실행해보도록 하겠습니다.

```sh
# kdb+ 이미지 다운로드
docker pull kysely/kdbq

# kdb+ 컨테이너 실행
docker run --name kdb -p 5000:5000 -v "c:\q/data":/root/data -e AUTH="kdev:kdev" -d kysely/kdbq
```

**Dockerfile**
위 이미지는 다음과 같이 구성되어 있습니다.

> https://github.com/kysely/kdbq-server/blob/master/Dockerfile
```dockerfile
# Dockerfile license: MIT, see LICENSE file
# kdb+ 32-bit Personal Edition license: see https://kx.com/download/

FROM debian:8.11-slim

LABEL "maintainer"="Radek Kysely <radek@kysely.org>"
LABEL "kdb+ license"="No Fee, Non-Commercial Use <https://kx.com/download/>"

ENV PORT=5000
ENV ON_STARTUP="-1\"Fresh startup\";"
ENV AUTH=""

RUN apt-get update && apt-get install -y \
    unzip=6.0* \
    lib32z1=1:1.2.8* \
    && rm -rf /var/lib/apt/lists/*

ADD https://kx.com/347_d0szre-fr8917_llrsT4Yle-5839sdX/3.6/linuxx86.zip \
    /root/kdbq.zip
RUN unzip /root/kdbq.zip -x q/q.q q/README.txt -d /root/ && rm /root/kdbq.zip

COPY docker-entrypoint.sh /usr/local/bin/

EXPOSE $PORT
ENTRYPOINT docker-entrypoint.sh "$PORT" "$ON_STARTUP" "$AUTH"
```

### 접속하기
KDB+로 접속하는 방법은 여러가지가 있습니다.

- [Kx Developer](https://code.kx.com/developer/)
- [Studio for kdb+](https://github.com/CharlesSkelton/studio)  
- [qStudio](http://www.timestored.com/qstudio/)  
- [KDB+ Studio plugin for IntelliJ IDEA](https://gitlab.com/shupakabras/kdb-intellij-plugin)  
- [connect-kdb-q for Atom](https://atom.io/packages/connect-kdb-q)  
- [Sublime-q](https://packagecontrol.io/packages/q%20KDB) ✅  

이 중에서 저는 서브라임 텍스트 에디터의 `Sublime-q` 패키지가 가장 사용하기 편리한 것 같습니다.

```sh
#host:port:user:password
#localhost:port
localhost:5600:kdev:kdev
```

> 컨테이너 실행 시 -e AUTH=":" 로 옵션을 지정하는 경우 사용자 및 비밀번호를 사용하지 않고 접속할 수 있습니다.

정상적으로 접속된 경우 서브라임 텍스트 하단에 다음과 같이 OK 로그가 출력됩니다.

![](/images/2020/kdb-connection-sublime-q.png)  

짝짝짝! 접속까지 성공하였습니다.

### 명령어 실행
간단한 몇가지 명령어를 실행해보도록 하겠습니다.

#### 시스템 명령어

[.z](https://code.kx.com/q/ref/#z) 네임스페이스에는 시스템 관련 변수가 있습니다.

```q
/ 포트 확인
\p

/ 현재 사용자
.z.u

/ OS
.z.o

/ 현재 시간
.z.

/ 프로세스 아이디
.z.i

/ 코어 수
.z.c
```

#### 유틸리티 명령어
몇가지의 유틸리티성 함수는 [.Q](https://code.kx.com/q/ref/dotq/) 네임스페이스로 제공됩니다.

```q
/ 가비지 컬렉션 호출
.Q.gc[]

/ 메모리 사용량 통계
.Q.w[]

/ 파일 또는 데이터 로드
.Q.l

/ 누락 HDB 테이블 저장
.Q.chk

/ 테이블 저장
.Q.dpft
```

다음에는 변수 할당 및 테이블 생성에 대해서 다루겠습니다.


## 참고

- [Kdb+ and q documentation](https://code.kx.com/)