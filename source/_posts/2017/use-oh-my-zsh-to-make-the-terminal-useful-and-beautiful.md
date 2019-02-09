---
title:      Oh My Zsh을 사용해서 터미널을 유용하고 이쁘게 만들어보자
date:       2017-04-30
categories: [개발 환경, Shell]
banner:
  url: https://www.planetargon.com/assets/open-source/logo-ohmyzsh-ce68f7c0711473bb619d23b1ce1e3a6e53895cd7cc56eb8af57d8076d1928759.png
---

기본 터미널 쉘은 너무 너무 딱딱하다. 이쁘고 좀더 유용한 터미널 쉘인 `Oh My Zsh`을 사용하도록 하자.

## Zsh 설치하기

Oh My Zsh을 사용하기 위해서는 Zsh을 설치해야 한다.

#### Homebrew 설치하기

Zsh을 설치하기 위해서 macOS용 패키지 관리자인 [Homebrew](https://brew.sh/index_ko)를 설치해야 한다.

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

맥에는 기본적으로 zsh이 설치되어 있지만 최신버전을 이용하기 위해서는 Homebrew를 이용해서 설치해야 한다.

```bash
zsh --version
brew install zsh
```

#### 기본 터미널 쉘을 Zsh로 바꾸기

터미널 앱을 열었을 때 기본 쉘을 Bash에서 Zsh로 바꾸어 놓는 것이 좋다.

```bash
chsh -s $(which zsh)
```

## Oh My Zsh 설치하기

Zsh의 설치와 기본 터미널 쉘 지정이 완료되었다면, Oh My Zsh을 설치해서 더 유용하고 이쁘게 꾸며보자.

```bash
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

#### 테마 변경하기

Oh My Zsh의 기본 테마는 [robbyrussell](https://github.com/robbyrussell/oh-my-zsh/wiki/themes)이다.

![](https://cloud.githubusercontent.com/assets/2618447/6316876/710cbb8c-ba03-11e4-90b3-0315d72f270c.jpg)

물론, [Zsh를 위한 많은 테마](https://zshthem.es/all/)가 있으니 걱정하지 말자.
이 중에서 몇가지 테마를 소개하고자 한다.

##### [agnoster](https://github.com/agnoster/agnoster-zsh-theme)

국내 많은 개발자들이 쓰는 agnoster 테마는 이쁜 비비드 컬러로 구성되어 있다.
다만, 컬러 스키마와 Powerline 폰트에 대한 설정이 추가적으로 필요하다.

![](https://cloud.githubusercontent.com/assets/2618447/6316862/70f58fb6-ba03-11e4-82c9-c083bf9a6574.png)

```bash
cd ~/.oh-my-zsh/themes
sudo git clone https://gist.github.com/3712874.git
sudo mv 3712874/agnoster.zsh-theme .
sudo rm -rf 3712874

# ~/.zshrc
sudo vim ~/.zshrc
ZSH_THEME="agnoster"
```

##### [Bullet Train](https://github.com/caiogondim/bullet-train.zsh)

Bullet Train 테마도 Powerline Vim Plugin 기반으로 되어있다.

![](https://camo.githubusercontent.com/c5b0c78df1c3ca27bb2c5577114a92018bbdbee0/687474703a2f2f7261772e6769746875622e636f6d2f6361696f676f6e64696d2f62756c6c65742d747261696e2d6f682d6d792d7a73682d7468656d652f6d61737465722f696d672f707265766965772e676966)

```bash
cd ~/.oh-my-zsh/themes
sudo wget https://raw.githubusercontent.com/caiogondim/bullet-train.zsh/master/bullet-train.zsh-theme

# ~/.zshrc
sudo vim ~/.zshrc
ZSH_THEME="bullet-train"
```

##### [Powerlevel9k](https://github.com/bhilburn/powerlevel9k)

Powerlevel9k 테마도 Powerline 폰트를 사용하는 테마이다.

![](https://camo.githubusercontent.com/31da002de611cfef95f6daaa8b1baedef4079703/687474703a2f2f6268696c6275726e2e6f72672f636f6e74656e742f696d616765732f323031352f30312f706c396b2d696d70726f7665642e706e67)

```bash
git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/themes/powerlevel9k

sudo vim ~/.zshrc
ZSH_THEME="powerlevel9k/powerlevel9k"
```

#### Powerline 폰트 설치하기

위에 언급한 Powerline Vim Plugin 기반의 테마들을 적용하면 아이콘이나 폰트 표현이 적절하지 않아 예상했던 모습과는 사뭇 다르게 된 것을 보게 될 것이다.

그러니 Powerline 폰트를 설치해보자.

##### 폰트 다운로드

[Powerline Git Repository](https://github.com/powerline/fonts)를 통해 폰트 파일을 다운로드 할 수 있다.

```bash
git clone http://github.com/powerline/fonts.git
cd fonts

# fonts install
./install.sh

# fonts delete
cd ..
rm -rf fonts
```

#### 폰트 변경

Powerline 폰트를 설치했다면 터미널 앱에 들어가서 해당 폰트를 적용해야 한다.

##### 일반 터미널 설정

기본적인 터미널 앱은 `프로파일 - 텍스트`에서 폰트를 변경할 수 있다.

::: tip 추천 폰트
개인적으로 추천하는 폰트는 아래와 같다.
Roboto Mono for Powerline Regular\\
Liberation Mono for Powerline Regular\\
:::

### 참조

-   [Installing ZSH](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH)
-   [Zsh - macOS Setup Guide](https://sourabhbajaj.com/mac-setup/iTerm/zsh.html)
-   [zsh 와 oh my zsh 를 이용해 셸 꾸미기(대신 bash 버리기)](https://youngbin.xyz/blog//2015/05/17/using-zsh-and-oh-my-zsh-instead-of-bash-for-shell-customizing.html)
-   [터미널 초보의 필수품인 Oh My ZSH!를 사용하자 ](https://nolboo.kim/blog/2015/08/21/oh-my-zsh/)
-   [Mac OS 터미널에 ZSH 설치하기](http://thdev.tech/mac/2016/05/01/Mac-ZSH-Install.html)
