---
title:      "Oh My Zsh"
subtitle:   "Shell"
date:       2017-04-30 12:00:00
categories: [끄적끄적, OS]
banner:
  url: http://ohmyz.sh/img/themes/nebirhos.jpg
---

## [Zsh](http://www.zsh.org/)  

- Ubuntu  

```bash
# zsh 최신버전 설치
sudo apt-get install zsh

# zsh를 기본 쉘로 설정
# which zsh
chsh -s /usr/bin/zsh
```

- Mac OS X  

```bash
# brew 설치
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install wget

# zsh 버전 확인 및 최신버전 설치
zsh --version
brew install zsh

# zsh를 기본 쉘로 설정
chsh -s /usr/local/bin/zsh
```

## [Oh My Zsh](http://ohmyz.sh/)  
zsh을 그대로 사용하기 보다는 oh my zsh을 추가적으로 설치해서 사용합니다.

> 추가적인 기능을 지원하며 다양한 테마도 적용할 수 있습니다.

```bash
# oh-my-zsh 설치
curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | sh

wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O - | sh

sudo sh ./install.sh
```

## [Themes](https://zshthem.es/all/)  
zsh에는 많은 스타일 테마가 존재합니다. 개인적으로 깔끔하다고 생각되는 테마들의 목록입니다.  
- robbyrussell  

```bash
sudo vim ~/.zshrc
ZSH_THEME="robbyrussell"
```

- skaro  

```bash
sudo vim ~/.zshrc
ZSH_THEME="skaro"
```
- [agnoster](https://github.com/agnoster/agnoster-zsh-theme)  

```bash
cd ~/.oh-my-zsh/themes
sudo git clone https://gist.github.com/3712874.git
sudo mv 3712874/agnoster.zsh-theme .
sudo rm -rf 3712874

# ~/.zshrc  
sudo vim ~/.zshrc
ZSH_THEME="agnoster"  
```

- [Bullet Train](https://github.com/caiogondim/bullet-train.zsh)  

```bash
cd ~/.oh-my-zsh/themes
sudo wget https://raw.githubusercontent.com/caiogondim/bullet-train.zsh/master/bullet-train.zsh-theme  

# ~/.zshrc  
sudo vim ~/.zshrc
ZSH_THEME="bullet-train"  
```

- [Gitster](https://github.com/shashankmehta/dotfiles/blob/master/thesetup/zsh/.oh-my-zsh/custom/themes/gitster.zsh-theme)  

```bash
cd ~/.oh-my-zsh/themes
sudo wget https://raw.githubusercontent.com/shashankmehta/dotfiles/master/thesetup/zsh/.oh-my-zsh/custom/themes/gitster.zsh-theme

# ~/.zshrc  
sudo vim ~/.zshrc
ZSH_THEME="gister"  
```

## [Powerline Fonts](https://github.com/powerline/fonts)  
oh my zsh의 테마 중에는 Powerline류의 폰트를 사용해야하는 것들이 있습니다. 대표적으로 agnoster 또는 powerlevel9k 입니다. 해당 테마를 설정하면 글자가 깨지는 것을 확인할 수 있습니다.  

```bash
# fonts download
git clone http://github.com/powerline/fonts.git
cd fonts

# fonts install
./install.sh

# fonts delete
cd ..
rm -rf fonts
```

`터미널 - 편집 - 프로파일 기본 설정 - 일반 - 사용자 지정 글꼴`  
> Roboto Mono for Powerline Regular  
> Liberation Mono for Powerline Regular  


## 함께 보면 좋은 글들을 소개합니다  
- [Mac OS 터미널에 ZSH 설치하기](http://thdev.tech/mac/2016/05/01/Mac-ZSH-Install.html)  
- [Installing ZSH](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH)  
- [zsh 와 oh my zsh 를 이용해 셸 꾸미기(대신 bash 버리기)](https://youngbin.xyz/blog//2015/05/17/using-zsh-and-oh-my-zsh-instead-of-bash-for-shell-customizing.html)  
- [터미널 초보의 필수품인 Oh My ZSH!를 사용하자 ](https://nolboo.kim/blog/2015/08/21/oh-my-zsh/)  
