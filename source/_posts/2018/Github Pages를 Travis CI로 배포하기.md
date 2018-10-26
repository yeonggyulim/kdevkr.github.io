---
title: Github Pages를 Travis CI로 배포하기
categories: [ETC, Github Pages, Travis CI]
---

> [Travis CI를 이용한 Github Pages + Hexo 블로그 자동 배포하기](https://medium.com/@changjoopark/travis-ci%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-github-pages-hexo-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EC%9E%90%EB%8F%99-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-6a222a2013e6)에서 처럼 Hexo는 괜찮은 정적 사이트 도구입니다만 배포를 위해서 매번 명령어를 날려주어야 합니다.  
> 위 글과 함께 Travis CI에서 제공하는 Github Pages Deployment 문서를 참고하였습니다.

## Github Pages Deployment  

`Travis CI`를 통해 `Github Pages`로 정적 파일들을 배포하기 위해서는 `personal access token`과 `.travis.yml`를 통해 배포 설정을 해야합니다.  

아래의 .travis.yml를 참고하시기 바랍니다.  
Github Pages Deployment의 설정은 기본값으로 제공되는 jekyll을 위한 설정 방법입니다.  
```yml
# .travis.yml  
language: node_js

node_js:
  - "lts/*"

branches:
  only:
  - local

before_install:
- npm install -g hexo-cli

install:
- npm install

before_script:
- git config --global user.name kdevkr
- git config --global user.email kdevkr@gmail.com
- sed -i "s/__GITHUB_TOKEN__/${__GITHUB_TOKEN__}/" _config.yml

script:
- npm run p
```

```yml
# _config.yml  

deploy:
  type: git
  repo: https://__GITHUB_TOKEN__@github.com/kdevkr/kdevkr.github.io.git
  branch: master
```

#### Setting the GitHub token  
`public_repo`또는 `repo` 스코프를 가지는 `personal access token`을 만들어야 합니다. 다음의 과정을 따라 Travis CI에서 사용할 액세스 토큰을 만들어봅시다.  

> 액세스 토큰은 공개되면 안되기 때문에 Travis CI의 [리포지토리 설정](https://docs.travis-ci.com/user/environment-variables#defining-variables-in-repository-settings)에서 관리하거나 `.travis.yml`의 [암호화된 변수](https://docs.travis-ci.com/user/environment-variables#defining-encrypted-variables-in-travisyml)를 사용하시기 바랍니다.  



## 참고  
- [GitHub Pages Deployment](https://docs.travis-ci.com/user/deployment/pages/)  
- [Travis CI를 이용한 Github Pages + Hexo 블로그 자동 배포하기](https://medium.com/@changjoopark/travis-ci%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-github-pages-hexo-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EC%9E%90%EB%8F%99-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-6a222a2013e6)  
- [travis ci를 이용한 hexo 자동 배포 구현하기](https://rkaehdaos.github.io/2018/10/07/autodeploy-hexo-github/)  
- [Auto Deploy Hexo.io to Github Pages With Travis CI](http://kflu.github.io/2017/01/03/2017-01-03-hexo-travis/)
