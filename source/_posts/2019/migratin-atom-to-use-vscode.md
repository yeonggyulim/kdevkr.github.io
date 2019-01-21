---
title: Migrating Atom to use VSCode
date: 2019-01-21
categories: [도구, IDE]
banner:
  url: https://res.cloudinary.com/practicaldev/image/fetch/s--gJFmhmuB--/c_imagga_scale,f_auto,fl_progressive,h_500,q_auto,w_1000/https://john-dugan.com/wp-content/uploads/2015/11/vs-code-logo.png
---

2018년은 `Atom` 이라는 에디터를 사용해왔다. 개인적으로 `Atom`이 UI도 직관적이고 프로젝트 폴더 관리가 유용하다고 생각한다. 하지만, 개발 시 유용한 다양한 플러그인을 추가하다보면 `점점 느려지는 아주 커다란 문제점`을 가지고 있다.  

![](http://file3.instiz.net/data/file3/2018/02/18/f/d/e/fde303bd0daaa5179ed12b3dc8e78ae1.jpg)
![](http://file3.instiz.net/data/file3/2018/02/18/a/c/0/ac074da6aad5516c56381431fd6950de.jpg)

## The problem of slowing Atom has not improved yet.
2018년 1월 10일에 아톰 공식 블로그에도 성능에 관한 포스트인 [The State of Atom's Performance](https://blog.atom.io/2018/01/10/the-state-of-atoms-performance.html)이 작성되었다. 그러나 많은 업데이트에도 불구하고 플러그인이 충돌되는 현상과 느려지는 문제점은 개선되지 않았다.

그래서 2019년에는 `VSCode`를 써보고자 한다. 

#### GitHub has no plans to discontinue Atom
마이크로소프트가 깃허브를 인수하여 아톰이 업데이트가 되지 않는 것은 아니다. 깃허브는 아톰을 버릴 계획이 없으며 계속 개발할 것이라고 한다. 물론 VSCode와 Atom이 Electron으로 개발되었기 때문에 서로 도움을 주지 않을까 생각해본다.

## Migrating from Atom
`Atom`에서 활용하던 것을 그대로 `VSCode`로 적용해보면서 새로운 IDE의 어색함을 줄이고자 한다. 

> 개인적으로 VSCode의 워크스페이스는 마음에 안든다...

#### Atom One Dark Pro 테마 적용하기
Atom의 [`One Dark`](https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark) 테마도 있지만 개인적으로 [`One Dark Pro`](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme) 테마가 더 깔끔한 것 같아서 적용한다.

![](https://ws2.sinaimg.cn/large/006tNbRwgy1fvwkrv2rorj31kw16odhw.jpg)

#### Atom Keymap 적용하기
Atom에서 사용하던 단축키를 VSCode에서 사용할 수 있도록 지원하는 [`Atom Keymap`](https://marketplace.visualstudio.com/items?itemName=ms-vscode.atom-keybindings)을 설치하자.

#### Settings Sync
아톰에 [`sync-settings`](https://atom.io/packages/sync-settings)이 있다면 VSCode에서도 [`Settings Sync`](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)로 설정을 동기화 할 수 있다.

![](https://media.giphy.com/media/xT9Iglsi3CS9noE8tW/source.gif)

::: warning Emmet in Visual Studio Code
VSCode는 [Emmet](https://code.visualstudio.com/docs/editor/emmet)을 내장하고 있어 확장 프로그램이 필요가 없다.
:::

#### 좀더 유용하게 만들자
VSCode를 좀더 유용하게 사용할 수 있는 확장 플러그인을 추천한다.

##### Auto Close Tag & Auto Rename Tag
##### Beautify
`Atom Beautify`를 대체할 수 있다.

##### Bracket Pair Colorizer
[Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)은 브라켓이 중첩될 때 색깔별로 표시하여주는 확장 플러그인이다.

##### IntelliSense for CSS class names in HTML
##### npm Intellisense
##### Path Intellisense
##### SCSS IntelliSense
##### Prettier - Code formatter
##### vscode-icons
##### vscode-pigments
##### Markdown All in One
##### Markdown Preview Enhanced
##### Debugger for Chrome
##### VSCode Browser Sync
##### VS Live Share

### 참조
- [[Editor 소개] Visual Studio Code](https://huny.ghost.io/2017/11/05/visual-studio-code-sogae/)
- [VSCode 추천 익스텐션과 세팅](https://www.vobour.com/vscode-%EC%B6%94%EC%B2%9C-%EC%9D%B5%EC%8A%A4%ED%85%90%EC%85%98%EA%B3%BC-%EC%84%B8%ED%8C%85-vscode-recommended-e)
- [VSCODE 에디터 설치 및 세팅](https://bbol-world.tistory.com/43)
- [2019년 자바스크립트 개발은 VSCODE로](http://sculove.github.io/blog/2018/11/28/to-vscode-in-2019/)