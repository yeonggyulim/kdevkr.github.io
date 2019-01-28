# The snorlax
> The snorlax project is hexo-theme for kdevkr.github.io

## Build
#### Step.1 Download snorlax
```sh
# in your hexo server dir.
git clone https://github.com/kdevkr/snorlax.git themes/snorlax
```
and open `_config.yml` file

```yml
# in _config.yml
theme: snorlax
```

#### Step.2 Build CSS and JS files for Theme
```sh
# manual
cd themes/snorlax
npm install
npm run build

# use npm scripts
cd themes/snorlax && npm install && npm run build
```
#### Step.3 Customize config
```yml
# example

favicon: /images/hexo-logo.png
title:  Kdevkr Github Page
subtitle:
description: Github page for kdevkr
keywords:
author: Kdevkr
language: ko
timezone: Asia/Seoul

menu:
  Home: /
  Archives: /archives
  About: /about
```

#### Step.4 Run Hexo
```sh
hexo server
```

## Dependencies
#### [Webpack](https://webpack.js.org/)
webpack is a static module bundler for modern JavaScript applications.
`npm i -D webpack uglifyjs-webpack-plugin mini-css-extract-plugin optimize-css-assets-webpack-plugin`
`npm i -D style-loader css-loader sass-loader node-sass`

#### [PostCSS](https://postcss.org/)
`npm i -D postcss postcss-import postcss-preset-env cssnano postcss-loader`
- `cssnano` is a modular CSS minifier.
- `autoprefixer` adds vendor prefixes, using data from Can I Use.

#### [Babel](https://babeljs.io/docs/en/)
Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments.
`npm i -D @babel/core @babel/preset-env babel-loader`
`npm i @babel/polyfill`
> Because this is a polyfill (which will run before your source code), we need it to be a dependency, not a devDependency

- `postcss-preset-env` : PostCSS Preset Env lets you convert modern CSS into something most browsers can understand, determining the polyfills you need based on your targeted browsers or runtime environments.

#### [ESLint](https://eslint.org/)
ESLint is an open source project originally created by Nicholas C. Zakas in June 2013. Its goal is to provide a pluggable linting utility for JavaScript.
`npm i -D eslint eslint-loader`

#### [Normalize.css](https://necolas.github.io/normalize.css/)
Normalize.css makes browsers render all elements more consistently and in line with modern standards. It precisely targets only the styles that need normalizing.
`npm i normalize.css`

#### Fontawesome
`npm i @fortawesome/fontawesome-free`

#### Bootstrap
`npm i bootstrap jquery popper.js`
