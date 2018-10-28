---
title:      "Ubuntu 16.0.4 LTS"
date:       2017-01-26 12:00:00
categories: [기타, OS]
banner:
 url: https://i.ebayimg.com/images/g/HyQAAOSw14xWO7sx/s-l300.jpg
---

## [Ubuntu 16.0.4 LTS](https://www.ubuntu.com/download/desktop)
> 레드햇 계열의 CentOS와 별개로 데비안 계열의 Ubuntu는 서버보다는 데스크탑 위주로 많이 사용됩니다. 회사에서는 엔터프라이즈 환경에 적합한 CentOS를 많이 사용하는데 개인 노트북에 설치해서 사용할 것이므로 Ubuntu 16.0.4 LTS에 대해서 정리해보고자 합니다.  

## 한영 전환이 제대로 되지 않으신가요?  
> 한영키로 한글 및 영어의 전환이 제대로 되지 않을 경우 다음과 같이 처리합니다.  

`시스템 설정 - 키보드 - 바로가기 - 자판입력 - 구성키 - 오른쪽 Alt 선택`  
`시스템 설정 - 키보드 - 바로가기 - 자판입력 - 다음 입력 소스 전환 - 한영키 누르기`

> 한영키를 누르면 Multi_key로 표시됩니다.   

- 참조 : [http://flog.kr/6940](http://flog.kr/6940)  

## 무선 네트워크의 인터넷 속도가 굉장히 느리신가요?  
> 우분투를 설치하고나서 무선 네트워크가 상당하게 느린현상이 있을 수 있습니다. DNS가 공유기를 거쳐가면서 발생하는 것같은데 KT에서 제공하는 DNS 주소를 직접적으로 설정해주면 네트워크 속도를 상당하게 높일 수 있게 됩니다.  

```bash
sudo vim /etc/dhcp/dhclient.conf

# dhclient.conf
prepend domain-name-servers 168.126.63.1, 168.126.63.2;
```

- 참조 : [http://egloos.zum.com/opensea/v/4027421](http://egloos.zum.com/opensea/v/4027421)  

## 패키지가 아닌 압축 파일을 풀어봅시다  
일반적으로는 명령어를 통해서 패키지를 통해서 원하는 소프트웨어를 설치하는데 알려진 소프트웨어가 아닌 경우 또는 압축 파일로 제공하는 경우가 있습니다. 그래서 우리는 .tar 또는 .tar.gz 와 같은 압축파일을 해제하는 방법을 숙지하고 있어야 합니다.  

```sh
sudo apt-get install tar

# .tar  
tar xvf Filename.tar

# .tag.gz  
tar xvzf Filename.tar.gz
```

- 참조 : [http://nota.tistory.com/53](http://nota.tistory.com/53)  

## JDK를 설치해볼까요?  
> 우분투에서는 기본적으로 Openjdk로 설치되기 때문에 오라클이 제공해주는 JDK로 설치하기 위해서는 다음과 같이 리파지토리를 추가해야 합니다.  

```bash
# 리파지토리 추가 및 적용
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update

# JDK 1.8 설치
sudo apt-get install oracle-java8-installer

java -version

java version "1.8.0_121"
Java(TM) SE Runtime Environment (build 1.8.0_121-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.121-b13, mixed mode)
```

- 참조 : [http://sseungshin.tistory.com/68](http://sseungshin.tistory.com/68)  

## Tomcat 8 설치하기  
Ubuntu에서 톰캣을 설치하기 위해서는 다음과 같이 한다. 최신 버전을 설치하려면 공식 홈페이지에서 tar.gz를 다운받도록 한다.

```sh
sudo apt-get install tomcat8
```

> 위에서 알아본 .tar.gz를 압축 해제하는 방법을 사용하면 되겠네요!

#### Tomcat Configuration  

- server.xml  
```sh
cd /etc/tomcat8
sudo vim server.xml
sudo service tomcat8 restart
```

- war 배포  
/home/kdev/webapps 디렉토리안에 배포할 errorsys.war 파일을 넣고 다음과 같이 Context를 설정하면 자동으로 배포 하면 됩니다.  

```xml
<Host name="localhost"  appBase="/home/kdev/webapps"
			unpackWARs="true" autoDeploy="true">
	<Context path="/" docBase="errorsys" reloadable="true"></Context>
  </Host>
```

## Nginx 설치하기  
```sh
sudo apt-get install python-software-properties
sudo add-apt-repository ppa:nginx/stable
sudo apt-get update
sudo apt-get install nginx
```

#### Nginx Configuration
nginx.conf를 통해서 설정을 할텐데 root권한으로 접근해야 수정할 수 있습니다. 수정 후 nginx에 설정을 적용하기 위해서 nginx -s reload 명령을 실행하면 됩니다.

- nginx.conf  
```sh
cd /etc/nginx
sudo vim nginx.conf
sudo nginx -s reload
```

- location  
```sh
location /errorsys {
	proxy_pass http://localhost:8080/errorsys;
	proxy_set_header   X-Real-IP $remote_addr;
	proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header   Host $http_host;
}
```

## 리눅스 명령어에 대해서 좀더 알아볼까요?
실제로 서버를 운영할 때에는

- 현재 디렉토리 경로

```bash
pwd
```

- 현재 경로의 디렉토리 및 파일 목록

```bash
dir
ls
ls -a
```

- 디렉토리 생성 및 변경  
```bash
mkdir [디렉토리명]

cd
cd ..
cd [디렉토리명 또는 경로]
```

- 파일 이동 및 복사  
```bash
cp [파일명] [복사할 경로]
mv [파일명] [이동할 경로]

mv [파일명] [바꿀 이름]
```

- 파일 삭제
```bash  
rm [파일명]
rm -r [디렉토리명] //디렉토리 전체 삭제
```

- 파일 소유자 및 사용자 권한 변경  
r : 읽기 허용, w : 쓰기 허용, x : 실행 허용  
```bash
chmod (000 ~ 777) [파일명]

chown
```

- 파일 생성, 편집, 출력  
```bash
touch [파일명] // 빈파일
cat > [파일명] // 생성 후 vi 편집기

vi [파일명]
vim [파일명]

cat [파일명]
head -n [파일명]
tail -n [파일명]
```

- 압축 관련  
```bash
tar cvzf [파일명.tar] // 압축
tar xvzf [파일명.tar] // 압축풀기

gzip [파일명.gz] // 압축
gunzip [파일명.gz] // 압축풀기

gzip -cd [파일명.tar.gz] // 압축풀기
```

- 루트 관리자 권한  
```bash
sudo su

sudo passwd root // su 명령어를 사용하기 위해서는 암호를 설정해야 한다.

su
su 사용자
```

- 리눅스 환경변수
```bash
env
```

- 포트 확인 및 방화벽  
```sh
netstat
sudo ufw status
```

## Heroku PaaS
스프링 부트로 만들어진 애플리케이션을 Heroku 클라우드 서비스를 이용해서 배포하는 것을 해보았습니다.
- 참조 : *[Deploying-spring-boot-apps-to-heroku](https://devcenter.heroku.com/articles/deploying-spring-boot-apps-to-heroku)*

```bash
sudo add-apt-repository "deb https://cli-assets.heroku.com/branches/stable/apt ./"
curl -L https://cli-assets.heroku.com/apt/release.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install heroku

heroku login

.... 로그인 후

cd 프로젝트 폴더 저장소

heroku git:remote -a kdevkr
git push heroku master
```
