---
title: 잠만보가 사용하는 VSCode 설정
---

![](https://res.cloudinary.com/practicaldev/image/fetch/s--gJFmhmuB--/c_imagga_scale,f_auto,fl_progressive,h_500,q_auto,w_1000/https://john-dugan.com/wp-content/uploads/2015/11/vs-code-logo.png)

2018년은 `아톰` 이라는 에디터를 사용해왔다.

개인적으로 `아톰`이 유저 인터페이스도 직관적이고 프로젝트 폴더 관리가 유용하다고 생각한다.

하지만, 개발 시 유용한 다양한 플러그인을 추가하다보면 `점점 느려지는 아주 커다란 문제점`을 가지고 있다.

![](http://file3.instiz.net/data/file3/2018/02/18/f/d/e/fde303bd0daaa5179ed12b3dc8e78ae1.jpg)
![](http://file3.instiz.net/data/file3/2018/02/18/a/c/0/ac074da6aad5516c56381431fd6950de.jpg)

## 아톰을 쓰다보면 점점 느려진다

2018년 1월 10일에 아톰 공식 블로그에도 성능에 관한 포스트인 [The State of Atom's Performance](https://blog.atom.io/2018/01/10/the-state-of-atoms-performance.html)이 작성되었다.

그러나 많은 업데이트에도 불구하고 플러그인이 충돌되는 현상과 느려지는 문제점은 개선되지 않았다.

그래서 2019년에는 `VSCode`를 써보고자 한다.

기존 아톰에서 사용했던 설정을 `최대한 그대로 사용할 것`이다.

## 유저 인터페이스 꾸미기

### 테마

잠만보가 사용했던 테마 조합은 아톰의 기본값인 `One Dark`였다.

-   Atom One Dark Theme
-   One Dark Pro ⭐

VSCode의 확장 플러그인 중에서 비슷하고 깔끔한 [`One Dark Pro`](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)를 사용한다.

![](https://ws2.sinaimg.cn/large/006tNbRwgy1fvwkrv2rorj31kw16odhw.jpg)

### 아이콘

[`file-icons`](https://marketplace.visualstudio.com/items?itemName=file-icons.file-icons)도 있지만 [`vscode-icons`](https://marketplace.visualstudio.com/items?itemName=robertohuertasm.vscode-icons)를 사용한다.

![](https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/images/screenshot.gif)

## 개발 환경 구성하기

개발 시 활용되는 패키지를 구성하고 관련된 설정을 해보자.

#### 아톰 단축키 적용

Atom에서 사용하던 단축키를 VSCode에서 사용할 수 있도록 지원하는 [`Atom Keymap`](https://marketplace.visualstudio.com/items?itemName=ms-vscode.atom-keybindings)을 설치하자.

### 구문 하이라이팅

#### Vue

Vue를 위한 구문 하이라이팅 확장 플러그인으로 [`Vetur`](https://marketplace.visualstudio.com/items?itemName=octref.vetur)를 설치한다.

구문 하이라이팅 뿐만 아니라 다양한 기능(스니핏, 구문 분석)을 제공한다.

### Formatting

포맷을 위한 확장 플러그인으로 [`prettier`](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)를 선택했다.

구문 하이라이팅을 위해 설치한 `Vetur`에서 [Formatter](https://vuejs.github.io/vetur/formatting.html#formatters)로 `prettier`를 사용할 수 있다.

### 코드 분석

코드 분석을 위해 [`ESLint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 확장 플러그인을 설치한다.

구문 하이라이팅을 위해 설치한 `Vetur`에서 [Linter](https://vuejs.github.io/vetur/linting-error.html#linting)로 `ESLint`를 사용할 수 있다.

### 유용하게 사용할 수 있는 확장 플러그인

VSCode를 좀더 유용하게 사용할 수 있는 확장 플러그인을 추천한다.

#### Auto Close Tag & Auto Rename Tag

[`Auto Close Tag`](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)와 [`Auto Rename Tag`](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)는 HTML이나 XML 태그 작성 시 유용하다.

![](https://github.com/formulahendry/vscode-auto-close-tag/raw/master/images/usage.gif)
![](https://github.com/formulahendry/vscode-auto-rename-tag/raw/master/images/usage.gif)

#### Bracket Pair Colorizer

[`Bracket Pair Colorizer`](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)은 브라켓이 중첩될 때 색깔별로 표시하여주는 확장 플러그인이다.

![](https://github.com/CoenraadS/Bracket-Pair-Colorizer-2/raw/develop/images/example.png)

#### IntelliSense for CSS class names in HTML

[`IntelliSense for CSS class names in HTML`](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)는 워크스페이스에 존재하는 CSS 클래스를 찾아 알려준다.

![](https://i.imgur.com/5crMfTj.gif)

#### npm Intellisense

[`npm Intellisense`](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)는 Import 구문 시 노드 패키지 모듈을 추천해준다.

![](https://github.com/ChristianKohler/NpmIntellisense/raw/master/images/auto_complete.gif)

#### Path Intellisense

[`Path Intellisense`](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)는 경로 기반으로 파일 이름을 찾아 추천해준다.

![](http://i.giphy.com/iaHeUiDeTUZuo.gif)

#### SCSS IntelliSense

[`SCSS IntelliSense`](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss)는 SCSS 관련 변수 또는 믹스인 등을 추천해준다.

#### vscode-pigments

[`vscode-pigments`](https://marketplace.visualstudio.com/items?itemName=jaspernorth.vscode-pigments)는 색상 `코드값을 컬러`로 표현해준다.

![](https://github.com/DeMoorJasper/vscode-pigments/raw/master/preview.jpg)

#### Debugger for Chrome

[`Debugger for Chrome`](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)는 크롬 브라우저에서의 `디버깅`을 VSCode에서 할 수 있게 해준다.

![](https://github.com/Microsoft/vscode-chrome-debug/blob/master/images/demo.gif?raw=true)

#### VSCode Browser Sync

[`VSCode Browser Sync`](https://marketplace.visualstudio.com/items?itemName=jasonlhy.vscode-browser-sync)는 `Browser Sync` 기능을 통한 실시간 리로딩을 제공한다.

![](https://github.com/Jasonlhy/VSCode-Browser-Sync/raw/master/img/no_folder_html_browser.gif)

#### 실시간 페어 프로그래밍

[`VS Live Share`](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)은 워크스페이스를 팀원끼리 공유할 수 있게 한다.

## VSCode 동기화 하기

아톰에 [`sync-settings`](https://atom.io/packages/sync-settings)이 있다면 VSCode에서도 [`Settings Sync`](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)로 설정을 동기화 할 수 있다.

![](https://media.giphy.com/media/xT9Iglsi3CS9noE8tW/source.gif)

## 참조

-   [\[Editor 소개\] Visual Studio Code](https://huny.ghost.io/2017/11/05/visual-studio-code-sogae/)
-   [VSCode 추천 익스텐션과 세팅](https://www.vobour.com/vscode-%EC%B6%94%EC%B2%9C-%EC%9D%B5%EC%8A%A4%ED%85%90%EC%85%98%EA%B3%BC-%EC%84%B8%ED%8C%85-vscode-recommended-e)
-   [VSCODE 에디터 설치 및 세팅](https://bbol-world.tistory.com/43)
-   [2019년 자바스크립트 개발은 VSCODE로](http://sculove.github.io/blog/2018/11/28/to-vscode-in-2019/)
