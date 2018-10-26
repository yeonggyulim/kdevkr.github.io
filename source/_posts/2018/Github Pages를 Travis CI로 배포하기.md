---
title: Github Pages를 Travis CI로 배포하기
categories: [ETC, Github Pages, Travis CI]
date: 2018-10-26 00:00:00
---

> [Gitlab Pages를 Gitlab CI로 배포하기](https://kdevkr.gitlab.io/archives/2018/Gitlab%20Pages%EB%A5%BC%20Gitlab%20CI%EB%A1%9C%20%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0/)를 해보면서 Github에서도 자동으로 배포할 수 없을까 찾아보던 중 [Travis CI를 이용한 Github Pages + Hexo 블로그 자동 배포하기](https://medium.com/@changjoopark/travis-ci%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-github-pages-hexo-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EC%9E%90%EB%8F%99-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-6a222a2013e6)에서 처럼 Travis CI를 통해 자동으로 배포하는 것을 해보고자 합니다.  
> 위 글과 함께 Travis CI에서 제공하는 [Github Pages Deployment](https://docs.travis-ci.com/user/deployment/pages/) 문서를 참고하였습니다.

## Github Pages Deployment  

`Travis CI`를 통해 `Github Pages`로 정적 파일들을 배포하기 위해서는 `personal access token`과 `.travis.yml`를 통해 배포 설정을 해야합니다.  

Github Pages Deployment의 설정은 기본값으로 제공되는 jekyll을 위한 설정 방법이니 아래의 .travis.yml를 참고하시기 바랍니다.  
```yml
# .travis.yml  
language: node_js

node_js:
  - "lts/*" # 사용하고 싶은 node.js 버전을 지정합니다.  

branches:
  only:
  - local # 소스 파일이 존재하는 브랜치입니다. 참고 문서에서는 source이지만 저는 local를 사용해왔습니다.

before_install:
- npm install -g hexo-cli

install:
- npm install

before_script:
- git config --global user.name kdevkr
- git config --global user.email kdevkr@gmail.com
- sed -i "s/__GITHUB_TOKEN__/${__GITHUB_TOKEN__}/" _config.yml

script:
- git submodule init
- git submodule update
- npm run b # 저는 자체 테마를 gitsubmodule로 등록되어 있기에 테마 파일을 빌드 해주었습니다.
- npm run p # hexo clean && hexo depoly -g
```

```yml
# _config.yml  

deploy:
  type: git
  repo: https://__GITHUB_TOKEN__@github.com/kdevkr/kdevkr.github.io.git
  branch: master
```

repo의 URL은 `https://<TOKEN>@github.com/<user>/<repo>`와 같이 액세스 토큰을 통해 접근하는 경로입니다.  

#### Setting the GitHub token  
`public_repo`또는 `repo` 스코프를 가지는 `personal access token`을 만들어야 합니다. 다음의 과정을 따라 Travis CI에서 사용할 액세스 토큰을 만들어봅시다.  

> 액세스 토큰은 공개되면 안되기 때문에 Travis CI의 [리포지토리 설정](https://docs.travis-ci.com/user/environment-variables#defining-variables-in-repository-settings)에서 관리하거나 `.travis.yml`의 [암호화된 변수](https://docs.travis-ci.com/user/environment-variables#defining-encrypted-variables-in-travisyml)를 사용하시기 바랍니다.  

#### Install Travis CI for Github Apps
> [travis-ci](https://github.com/apps/travis-ci) 앱 페이지에서 설치할 수 있습니다.  

##### 1. Install 버튼을 통해 Github Apps에 Travis CI 설치를 시작합니다.  
![github-pages-travis-ci-01](/images/etc/github-pages-travis-ci-01.png)  

##### 2. Travis CI에 리포지토리를 추가합니다.  
![github-pages-travis-ci-02](/images/etc/github-pages-travis-ci-02.png)  

##### 3. Install 버튼을 통해 설치를 완료합니다.  
![github-pages-travis-ci-03](/images/etc/github-pages-travis-ci-03.png)  

##### 4. Travis CI 앱이 깃허브 계정에 접근할 수 있도록 권한 승인을 합니다.    
![github-pages-travis-ci-04](/images/etc/github-pages-travis-ci-04.png)  

##### 5. 잠시 후 Travis CI로 이동되며 앞서 추가한 리포지토리를 확인합니다.    
![github-pages-travis-ci-05](/images/etc/github-pages-travis-ci-05.png)  

Travis CI에서 리포지토리에 접근할 수 있는 액세스 토큰을 만들어 설정해보도록 하겠습니다.  

##### 1. Github Account > Settings > Developer settings로 들어갑니다.  
![github-pages-access-token-01](/images/etc/github-pages-access-token-01.png)  

##### 2. Personal access tokens 메뉴를 통해 새 토큰을 발행합니다.  
![github-pages-access-token-02](/images/etc/github-pages-access-token-02.png)  

##### 3. 스코프는 public_repo 또는 repo를 선택합니다.   
![github-pages-access-token-03](/images/etc/github-pages-access-token-03.png)  

##### 4. Travis CI의 리포지토리 설정에 들어갑니다.  
![github-pages-access-token-04](/images/etc/github-pages-access-token-04.png)  

##### 5. 발행한 액세스 토큰을 Travis CI의 환경 변수에 추가합니다.  
![github-pages-access-token-05](/images/etc/github-pages-access-token-05.png)  

이제 `__GITHUB_TOKEN__`는 travis script의 sed 명령을 통해 변수값이 대체됩니다.  
로컬 브랜치에 추가한 .travis.yml을 원격저장소에 푸시하면 이제 Travis CI가 .travis.yml파일에 따라 빌드를 시작할 것입니다.  
빌드 과정도 확인할 수 있으니 만약 실패했다면 원인을 찾아 해결하시면 됩니다.  

> 저는 다음과 같이 기존에 hexo-deployer-git이 만들어 놓은 .deploy_git으로 인해 빌드가 실패하였고 이를 삭제하였습니다.  
> fatal: No url found for submodule path '.deploy_git' in .gitmodules  

정상적으로 통과가 됬다면 다음과 같이 표시가 되고 master 브랜치에 배포되었을 것입니다.  

![github-pages-travis-ci-06](/images/etc/github-pages-travis-ci-06.png)  

## 참고  
- [GitHub Pages Deployment](https://docs.travis-ci.com/user/deployment/pages/)  
- [Travis CI를 이용한 Github Pages + Hexo 블로그 자동 배포하기](https://medium.com/@changjoopark/travis-ci%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-github-pages-hexo-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EC%9E%90%EB%8F%99-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-6a222a2013e6)  
- [travis ci를 이용한 hexo 자동 배포 구현하기](https://rkaehdaos.github.io/2018/10/07/autodeploy-hexo-github/)  
- [Auto Deploy Hexo.io to Github Pages With Travis CI](http://kflu.github.io/2017/01/03/2017-01-03-hexo-travis/)
