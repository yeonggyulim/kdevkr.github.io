---
title: Github Pages를 Jekyll에서 Hexo로 변경한 이유
date: 2018-05-27 12:00:00
categories: [끄적끄적]
banner:
  url: /images/hexo/hexo-logo.png
---

## Jekyll 블로그 시스템의 문제점

> 기존 Github Page는 기본으로 지원하는 [Jekyll](https://jekyllrb.com/)를 이용하였습니다. 하지만 Jekyll은 루비라는 언어를 기반으로 동작하여 로컬 환경에서 테스트를 하기 위해서는 Ruby & Development Kit을 설치해야 합니다. 하지만 저는 루비에 대해 관심이 없었으며 모르기 때문에 Github에 배포되는 것을 보고 글이 어떻게 작성되는지 확인하였습니다.  

## Hexo

> [`Hexo`](https://hexo.io/) is a fast, simple and powerful blog framework. You write posts in Markdown (or other languages) and Hexo generates static files with a beautiful theme in seconds.\
> Hexo는 cli를 제공하여 쉽게 Hexo를 구성하고 `hexo-server`를 통해 로컬 서버 환경을 구축할 수 있습니다.  

```bash
npm install hexo-cli -g

# hexo init [:dir]
hexo init kdevkr.github.io
cd kdevkr.github.io

npm install
hexo server
```

[Hexo](https://hexo.io/)는 NodeJS를 기반으로 동작하기 때문에 블로그를 구성하는 것을 이해할 수 있으며 로컬 서버 환경도 쉽게 제공하기 때문에 굳이 배포하지 않아도 글이 어떻게 작성되는지 확인할 수 있습니다.  

## 테마

> Hexo도 테마를 지원합니다. 기본적으로는 landscape라는 테마를 제공하지만 국내 프론트엔드 개발자인 HyunSeob님이 만든 [Overdose](https://github.com/HyunSeob/hexo-theme-overdose) 테마를 사용하고자 합니다.  

```bash
cd your/hexo/directory
git clone https://github.com/HyunSeob/hexo-theme-overdose.git themes/overdose
npm install --save hexo-renderer-jade # Don't use hexo-renderer-pug. It doesn't work.

# rename _config.example to _config in overdose theme folder
```

```yml
# _config.yml
theme: overdose
```

#### 이슈. 윈도우 환경에서 cat 명령 사용하기

> Overdose의 npm script 중 build-index는 `cat` 명령어를 사용하고 있습니다. 이는 유닉스 명령어 이기 때문에 윈도우 환경에서는 동작하지 않습니다. 윈도우 환경에서도 동작하기 위해서 `minicat`를 이용해도 됩니다.

```bash
npm install -D minicat
```

```json
# package.json
{
  "name": "hexo-theme-overdose",
  "scripts": {
    "build-index": "minicat ./source/js/dynamicMenu.min.js ./source/js/sharer.min.js > ./source/js/index.min.js",
  }
}
```

## RSS

> RSS는 웹 구독 시스템입니다. [`hexo-generator-feed`](https://github.com/hexojs/hexo-generator-feed)플러그인을 적용하면 RSS 파일을 만들어 블로그에 올려두어 이를 구독하게 할수 있습니다.

```bash
npm install hexo-generator-feed --save
```

```yml
# _config.yml
feed:
  type: atom
  path: atom.xml
  limit: false
  hub:
  content: true
```

## [배포하기](https://hexo.io/docs/deployment.html)

> 로컬에서 작성한 포스트들을 정적 파일로 생성하고 이를 깃허브에 배포해보겠습니다.

Hexo에서는 여러 시스템에 배포할 수 있는 플러그인이 있습니다만 우리는 깃허브에 배포할 것이므로 [`hexo-deployer-git`](https://github.com/hexojs/hexo-deployer-git)을 이용합니다.  

```bash
npm install hexo-deployer-git --save
```

```yml
# _config.yml
deploy:
  type: git
  repo: <repository url> # https://github.com/kdevkr/kdevkr.github.io.git
  branch: [branch] # master
```

이제 우리는 다음의 명령을 CLI에 입력함으로써 간단하게 배포할 수 있습니다.

```bash
hexo clean && hexo generate && hexo deploy
```

## 참고 문헌

-   [Hexo로 블로그 만들기](https://appear.github.io/2017/11/02/Etc/etc-02/)  
-   [Hexo 기반 블로그에 꿀기능 추가하기](https://juhojuho.github.io/2017/03/27/hexo-tip/)  
-   [Github pages와 Hexo를 이용하여 블로그 만들기](http://blog.lattecom.xyz/2016/06/28/hexo-blog-github-pages/)  
