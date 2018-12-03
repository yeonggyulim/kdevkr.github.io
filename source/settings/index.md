---
  title: 맥 개발환경 세팅
---

## 키보드 및 마우스 설정

#### 키보드 한영키
[Karabiner](https://pqrs.org/osx/karabiner/) 설치 후 아래 그림에 따라 설정하기
![](images/settings/karabiner-1.png)
![](images/settings/karabiner-2.png)

#### 마우스 스크롤
시스템 환경설정 - 마우스 - 스크롤 방향: 자연스럽게 체크 해제

---

## 터미널 설정

#### zsh 설치
```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install zsh
zsh --version
```

#### oh-my-zsh 설치
```sh
curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | sh

cd ~/.oh-my-zsh/themes
sudo wget https://raw.githubusercontent.com/shashankmehta/dotfiles/master/thesetup/zsh/.oh-my-zsh/custom/themes/gitster.zsh-theme

sudo vim ~/.zshrc
# ZSH_THEME="gister"

```

#### Powerline Fonts 설치
```sh
git clone http://github.com/powerline/fonts.git
./fonts/install.sh
rm -rf fonts
```

#### 기본 MacOS 터미널 ANSI 색상 변경
- 배경색 : #222A32
- 검은색 : #323C48, #746457
- 빨간색 : #d6304c, #E50000
- 파란색 : #efe1d3, #D6304C
- 초록색 : #2ba492
- 노란색 : #FFB90C
- 사이안색 : #558BA0, #446F80
- 마젠타색 : #746457, #EFE1D3
- 커서 : #efe1d3
- 텍스트 : #DEDEDE
- 볼드 텍스트 : #558BA0
- 선택 부분 : #746457

####

## 에디터 설정

#### IntelliJ
회사에서 구매한 라이센스 코드 적용

그레이들 JVM 옵션이 없다면 [자바 JDK 설치](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

롬복 플러그인 설치


#### Atom
아톰 설치 후 sync-settings 패키지로 설정 복구하기
참고 : [atom-sync settings 개발환경 공유](https://devhak.com/2017/03/23/atom-sync-settings-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EA%B3%B5%EC%9C%A0/)
