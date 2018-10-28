---
title:      "Atom"
subtitle:   "Integrated Development Environment"
date:       2017-07-08 12:00:00
categories: [ETC]
---

> [`Atom`](https://atom.io/)은 깃허브에서 만들어가는 오픈소스 텍스트 에디터입니다. 누군가 어떤 에디터를 추천한다고 해서 반드시 자기에게 적합할 수는 없을 것이지만 [`Brackets`](http://brackets.io/)이나 [`VS-Code`](https://code.visualstudio.com/)  에 뒤지지 않을 에디터라고 할 수 있습니다.  

저는 깃허브 페이지를 위해서 사용하기 시작했는데 나름대로 괜찮은 에디터인듯 느껴지고 있습니다.  

## 단축키   
> 어떤 에디터를 사용하든지 가장 중요한 것은 환경설정입니다.
> 아톰의 설정창을 열기 위해서는 `File > Settings` 또는 `Ctrl + ,`를 누르면 됩니다.
> 단축키 설정을 `keymap.cson`로 변경하는 것도 지원하고 있습니다.  

##### 1. 설정창 열기 `Ctrl + ,`  

##### 2. 커맨드창 열기 `Ctrl + Shift + P`  
해당 명령이 단축키로 설정되어있는지도 보여주기 때문에 나중에 단축키로도 활용할 수 있습니다.  

##### 3. 검색해서 파일열기 `Ctrl + P`  

##### 4. 한줄 삭제 `Ctrl + Shift + K`  

##### 5. 해당 라인넘버로 이동 `Ctrl + G, [Number]`  

##### 6. 마크다운 파일에서 이미지 삽입하기 `Ctrl + Shift + I`  
이 단축키는 markdown-preview-enhanced 패키지를 설치해야만 지원합니다.

## 확장 플러그인  
> 이클립스 뿐만 아니라 서브라임 텍스트, 브라켓, VS-Code까지도 확장 플러그인을 제공합니다. 아톰 에디터라고 지원하지 않을 수는 없겠죠 패키지를 설치하기 위해서는 `Settings > Install` 에서 원하는 기능을 가지는 패키지를 검색하면 됩니다.  
> [`공식 홈페이지 > 패키지`](https://atom.io/packages) 에서도 인기항목을 보시거나 검색하실 수 있습니다.  

#### emmet  
![emmet](/images/atom/atom_package_emmet.PNG)  

Emmet을 아톰에서도 활용할 수 있도록 만들어진 패키지입니다.  

#### beautify  
![beautify](/images/atom/atom_package_beautify.PNG)  

보고자 하는 파일의 내용이 무분별하게 정렬되어 있는 것을 깔끔하게 정렬해서 보여줍니다. 다시 말해서 들여쓰기가 자동으로 맞춰진다는 이야기입니다.

#### file-icons  
![file-icons](/images/atom/atom_package_file-icons.PNG)  

트리 뷰 또는 탭에 아이콘을 표시해줌으로써 좀더 내가 어떠한 종류의 파일을 보고있는가를 쉽게 파악할 수 있게 해줍니다. 아이콘도 꽤 이쁘장하게 생겼습니다.  

#### linter  
![linter](/images/atom/atom_package_linter.PNG)  

Linter는 내가 작성하는 코드의 규칙을 일정한 기준에 맞도록 체크해주는 정적 분석 도구입니다.
아톰에서는 이 패키지를 기반으로 하여 `linter-jshint`, `linter-eslint`와 같은 관련 패키지를 추가해서 사용합니다.  

자세한 내용은 [아톰에서 Linter를 사용해보자](http://gnujoow.github.io/dev/2016/09/22/Dev4-lets-use-linter/)에서 확인 합시다  

#### pigments  
![pigments](/images/atom/atom_package_pigments.PNG)  

프로젝트 또는 파일에서 사용중인 컬러값을 색상으로 보여주는 패키지입니다. 인터넷에 해당 컬러값을 찾지않아도 대략적으로 어떠한 색인지 인지할 수 있습니다.  

#### tabs-to-spaces  
![tabs-to-spaces](/images/atom/atom_package_tabs-to-spaces.PNG)  

탭을 공백으로 공백을 탭으로 바꾸는 것을 도와주는 패키지입니다. 만약 ESLint에 의해서 탭과 공백을 혼용해서 사용하지 않는 조건이 있다면 하나로 변환할 수 있게 도와줍니다.  

#### trailing-spaces  
![trailing-spaces](/images/atom/atom_package_trailing-spaces.PNG)  

라인의 끝에 공백이 생길 경우 색상으로 표현해주는 패키지입니다. 현재 커서가 위치한 라인은 색상이 아닌 기존의 공백 표시로 나타내주기 때문에 활용한다면 좋은 기능이 될 수 있습니다. 저는 이 패키지를 마크다운 개행을 위해 사용하고 있습니다.  

#### markdown-preview-enhanced  
![markdown-preview-enhanced](/images/atom/atom_package_markdown-preview-enhanced.PNG)  

이 패키지는 마크다운에 대해서 좀더 확장된 기능을 제공해줍니다. 아톰은 기본적으로 마크다운에 대해서 프리뷰를 제공해줍니다만 수정되는 마크다운을 실시간으로 어떤 위치를 수정하고 있는지 어떻게 수정됬는지를 확인하기 어렵습니다. 이 패키지를 활용하면 내가 수정하는 위치에 따라 프리뷰의 위치도 따라서 보여주기 때문에 굉장히 편리합니다.  

#### Terminal  
[`PlatformIO-Atome-IDE-Terminal`](https://github.com/platformio/platformio-atom-ide-terminal)
A terminal package for Atom, complete with themes, API and more for PlatformIO IDE. A fork of [`jeremyramin/terminal-plus`](https://github.com/jeremyramin/terminal-plus)

![preview](/images/atom/platformio-atom-ide-terminal-01.png)

###### config.cson
```json
{
  "platformio-ide-terminal":
      ansiColors:
        normal:
          black: "#2c363f"
          blue: "#efe1d3"
          cyan: "#558ba0"
          green: "#2ba492"
          magenta: "#746457"
          red: "#d6304c"
          white: "#f5f4f5"
          yellow: "#ffb90c"
        zBright:
          brightCyan: "#558ba0"
          brightGreen: "#2ba492"
          brightMagenta: "#efe1d3"
          brightRed: "#e46c82"
          brightYellow: "#ffc733"
      style:
        fontFamily: "Roboto Mono for Powerline"
        theme: "solarized-dark"
}
```

## 테마   
> 아톰 에디터를 설치하면 기본적으로 여러가지 테마를 지원해주기는 합니다. Settings > Themes를 살펴보면 됩니다.  
추가적인 테마를 적용하고 싶다면 `Install > Themes`를 통해서 원하는 테마를 검색하고 설치하면 됩니다.  

#### material ui  
![material ui](/images/atom/atom_themes_material-ui.PNG)  

#### seti ui  
![seti ui](/images/atom/atom_themes_seti-ui.PNG)  

## 참고    
- [텍스트 에디터 아톰의 설치와 기본설정](http://dovetail.tistory.com/62)  
- [아톰 적응기](https://only2sea.wordpress.com/2016/02/11/%EC%95%84%ED%86%B0-%EC%A0%81%EC%9D%91%EA%B8%B0-1%EC%9D%BC%EC%B0%A8-%EB%AC%B8%EC%A0%9C%EC%A0%90-%EB%A7%8E%EC%9D%80-%ED%8E%B8%EC%A7%91%EA%B8%B0/)  
- [생활코딩 - 아톰](https://opentutorials.org/module/1579)  
- [아톰 에디터 플러그인 정리](http://blog.jeonghwan.net/atom-%EC%97%90%EB%94%94%ED%84%B0-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EC%A0%95%EB%A6%AC/)  
- [아톰에서 Linter를 사용해보자](http://gnujoow.github.io/dev/2016/09/22/Dev4-lets-use-linter/)  
- [무료 텍스트 에디터 추천](http://blog.gaerae.com/2015/05/sublimetext-brackets-atom-visualstudiocode.html)  
- [아톰 필수 플러그인 리스트](https://joshuajangblog.wordpress.com/tag/%EC%95%84%ED%86%B0-%ED%95%84%EC%88%98-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8/)  
