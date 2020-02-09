---
    title: 도커
    description: 
    comments: false
---

![](/images/logo/docker.png)

데브-옵스의 지속적인 배포를 위한 가상화 이미지 컨테이너인 도커를 배워보는 시간을 가지겠습니다.

> [What is a Container?](https://www.docker.com/resources/what-container)

### 도커 배우기  
도커를 왜 배워야할까요? 

4분 코딩의 [왜 도커를 사용해야 할까요?](https://youtu.be/3FcFL2C3ME8)를 보겠습니다. 이처럼 유연하게 서버 환경을 구성할 수 있습니다.

도커를 배우는데 

> [초보를 위한 도커 안내서](https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html)  
> [도커 튜토리얼 : 깐 김에 배포까지](https://www.44bits.io/ko/post/easy-deploy-with-docker)  
> [도커 Docker 기초 확실히 다지기](https://futurecreator.github.io/2018/11/16/docker-container-basics/)  

#### 컨테이너 이미지 다운로드  
도커도 깃허브처럼 컨테이너 이미지를 공유할 수 있는 [Docker Hub](https://hub.docker.com/)을 제공합니다. 
저는 이미 도커 허브에 등록되어있는 공식 컨테이너 이미지를 다운로드 해보겠습니다.

```sh
# docker image pull name:version
docker image pull nginx:1.17.8
docker image pull jenkins:2.60.3
```

##### 다운받은 이미지 확인하기
공식 이미지인 nginx와 jenkins을 다운받아보겠습니다.

```sh
docker image ls
docker images

REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nginx               latest              2073e0bcb60e        5 days ago          127MB
jenkins             2.60.3              cd14cecfdb3a        18 months ago       696MB
```

##### 잘못받은 이미지 삭제하기
컨테이너 이미지 중 nginx의 버전을 명시하지 않아 latest로 다운받아졌습니다. 이 이미지를 지우고 다시 받아보겠습니다.

```sh
docker image rm nginx

REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nginx               1.17.8              2073e0bcb60e        5 days ago          127MB
jenkins             2.60.3              cd14cecfdb3a        18 months ago       696MB
```

#### 도커 컨테이너 실행하기
앞서 다운받았던 컨테이너 이미지를 통해 컨테이너를 실행해보도록 하겠습니다.

```sh
# docker run [options] [image:verison]

docker run --detach --publish 80:80 --name nginx nginx:1.17.8
```

- \-\-detach : 도커 컨테이너를 백그라운드에서 실행합니다.
- \-\-publish : 호스트와 컨테이너 포트를 연결합니다.
- \-\-name : 도커 컨테이너에 이름을 지정합니다.

##### 도커 컨테이너 확인하기  
과연 nginx 컨테이너가 실행되었을까요? 확인해보겠습니다.

```sh
docker ps

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
334d6b81dcd3        nginx               "nginx -g 'daemon of…"   3 seconds ago       Up 2 seconds        0.0.0.0:80->80/tcp                  nginx
```

##### 도커 컨테이너 프로세스 확인하기
컨테이너 내에서 동작하는 프로세스를 확인해보겠습니다.

```sh
# docker top [container] [ps options]
docker top nginx
```

#### 도커 이미지 만들기
일반적으로 애플리케이션을 구동하기 위한 서버 환경을 구성하기 위해서는 사람들이 만들어놓은 이미지를 다운받아서 사용하거나 직접 컨테이너를 구성하는 이미지를 만들어야합니다.

##### Dockerfile  
간단하게 OpenJDK 11을 기반으로 하는 컨테이너를 설정하고 구동해보겠습니다.

먼저 기존 명령어 방식으로 
```sh
docker run --name openjdk openjdk:11 "java" "-version"
openjdk version "11.0.6" 2020-01-14
OpenJDK Runtime Environment 18.9 (build 11.0.6+10)
OpenJDK 64-Bit Server VM 18.9 (build 11.0.6+10, mixed mode)
```

> CMD 명령을 사용하지 않으면 컨테이너는 바로 종료됩니다.

위 작업을 Dockerfile로 변경하면 다음과 같습니다.
```groovy Dockerfile
FROM openjdk:11
CMD ["java", "-version"]
```

도커는 Dockerfile을 한줄 단위로 읽어서 컨테이너를 구성하는 이미지를 만듭니다.
```sh
docker build -t kdevkr/default .
Sending build context to Docker daemon  2.048kB
Step 1/2 : FROM openjdk:11
 ---> a548e8a50190
Step 2/2 : CMD ["java", "-version"]
 ---> Running in 7ebdda012051
Removing intermediate container 7ebdda012051
 ---> 3440656b232c
Successfully built 3440656b232c
Successfully tagged kdevkr/default:latest
```

### 도커 활용하기

#### 호스트 디렉토리 마운트하기  
도커는 컨테이너의 디렉토리를 마운트할 수 있는 방법을 제공합니다. 
이를 이용해서 호스트 디렉토리를 컨테이너에서 접근할 수 있습니다.

![볼륨 마운트 유형](https://docs.docker.com/storage/images/types-of-mounts-volume.png)

```sh
docker volume create nginx-volume
docker run --detach --publish 80:80 --mount source=nginx-volume,destination=/usr/share/nginx/html --name nginx nginx:1.17.8
```

#### 트래픽 로드 밸런싱하기  

준비중

#### 컨테이너 스케일아웃하기  

준비중



