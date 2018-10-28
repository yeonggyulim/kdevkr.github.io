---
title:      "Webpack"
date:       2017-04-22 12:00:00
categories: [끄적끄적, Webpack]
banner:
 url: https://d81pi4yofp37g.cloudfront.net/wp-content/uploads/webpack2.png
---

## [Webpack 2](https://webpack.js.org/)  
Webpack은 assets이라고 불리는 자바스크립트, 이미지, CSS, 폰트들을 하나로 합쳐주는 자바스크립트 모듈러 또는 번들러라고 합니다. 보통은 프론트엔드에서 복잡하게 얽혀있는 스크립트나 CSS 파일들을 개별적으로 불러오는 것으로 하드코딩하였을 것입니다.  

각 파일들을 개별적으로 불러오는 행위들은 결국에는 각 HTTP 요청에 의한 데이터 낭비, 로딩의 지연이라는 나쁜 결과물을 만들어내기도 합니다. 그래서 [구글 페이지 인사이트 도구](https://developers.google.com/speed/pagespeed/insights/?hl=ko)를 통해서 OKKY를 분석해보면 HTML 축소로 다운로드 및 파싱속도를 높일 수 있다고 분석해주기도 합니다.  

> 위와 같이 개별적으로 불러오는 스크립트나 CSS들을 하나로 묶어서 사용할 수 있도록 Webpack같은 번들러 도구가 탄생하게 된것입니다.  

[Webpack2 가이드 문서](https://webpack.js.org/guides/get-started/)

Webpack은 NodeJS로 만들어진 애플리케이션입니다. 따라서 Webpack을 이용하기 위해서는 NPM과 NodeJS를 설치해야만 합니다.  

[npm으로 package.json 생성하기](https://blog.outsider.ne.kr/674)  

```bash
# https://nodejs.org/en/

mkdir projectfolder
cd projectfolder

npm init -y
npm install -g webpack
```

> 가이드에서 Webpack을 글로벌로 설치하는 것은 추천하지 않습니다만, 저는 글로벌로 사용하겠습니다. 이후 알아보는 webpack.config.js를 만들어놓고 webpack 이라는 명령어만 실행하더라도 webpack으로 빌드를 할 수 있게됩니다.  

## webpack.config.js 만들기    
앞서 이야기한대로 webpack.config.js로 설정파일을 구성할 수 있게됩니다.

```javascript
const path = require('path')

module.exports = {
	entry: {
		app: path.resolve('./src/main/resources/static/entry.js')
	},
	output: {
		path: path.resolve('./src/main/resources/static/dist'),
		filename: '[name].bundle.js'
	}
}
```
아직까지는 간단하게 구성하겠습니다. 엔트리에 등록된 스크립트 파일별로 내부에서 사용하는 스크립트나 CSS등을 하나의 파일로 만들어주는 방식입니다.  

```bash
webpack

# 엔트리 파일 변경시 자동 리빌드
webpack --watch
```

> 그러면 매번 위 처럼 우리가 만드는 스크립트를 엔트리에 직접 추가시켜야 하는가?라고 의문이 들기도 합니다. 특정 폴더에 위치한 스크립트 파일의 목록을 가져와 엔트리에 추가시키는 방식으로 변경해보겠습니다.  

```javascript
const path = require('path');
const fs = require('fs');

const jsDir = './src/main/resources/static/js';
// fs 모듈을 통해서 해당 폴더의 파일들을 가져옵니다.
const jsFiles = fs.readdirSync(jsDir);

var entry = {};
// 각 파일들 중에서 .js를 확장자로 가지는 파일들을 엔트리 목록에 추가합니다.
jsFiles.forEach(function (file) {
		var pos = file.indexOf('.js');
		if (pos > -1) {
				let fileName = file.substr(0, pos);
				entry[fileName] = path.resolve(`./src/main/resources/static/js/${file}`);
				console.log(`Webpack Javascript Enrty add ${fileName} ==> ${file}`);
		}
});

module.exports = {
	entry: entry, // 엔트리 목록을 적용합니다.
	output: {
		path: path.resolve('./src/main/resources/static/dist'),
		filename: '[name].bundle.js'
	}
}
```

> 이로써 우리는 js폴더 내에 엔트리 목록에 추가하고 싶은 스크립트 파일만 만들면 됩니다.  

## 개발 및 배포 전용 빌드로 나누기  
개발용과 배포용으로 webpack.config.js를 나누어 빌드할 수 있는 방법을 설명하겠습니다.

```javascript  
// webpack.config.js
module.exports = function (env) {
	env = env || 'dev';
	return require(`./webpack.${env}.config.js`);
};

// webpack.dev.config.js
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');

const jsDir = './src/main/resources/static/js';
const jsFiles = fs.readdirSync(jsDir);

var entry = {};
jsFiles.forEach(function (file) {
		var pos = file.indexOf('.js');
		if (pos > -1) {
				let fileName = file.substr(0, pos);
				entry[fileName] = path.resolve(`./src/main/resources/static/js/${file}`);
				console.log(`Webpack Javascript Enrty ${fileName} ==> ${file}`);
		}
});

var plugins = [
	new ExtractTextPlugin({
		filename: '[name].css',
		allChunks: true
	})
];

module.exports = {
	entry: entry,
	output: {
		path: path.resolve('./src/main/resources/static/dist'),
		filename: '[name].bundle.js'
	}

// webpack.prod.config.js
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');

const jsDir = './src/main/resources/static/js';
const jsFiles = fs.readdirSync(jsDir);

var entry = {};
jsFiles.forEach(function (file) {
		var pos = file.indexOf('.js');
		if (pos > -1) {
				let fileName = file.substr(0, pos);
				entry[fileName] = path.resolve(`./src/main/resources/static/js/${file}`);
				console.log(`Webpack Javascript Enrty ${fileName} ==> ${file}`);
		}
});

var plugins = [
	new ExtractTextPlugin({
		filename: '[name].css',
		allChunks: true
	}),
	new HtmlWebpackPlugin(),
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.optimize.UglifyJsPlugin({
		compressor: {
			warnings: false
		}
	})
];

module.exports = {
	entry: entry,
	output: {
		path: path.resolve('./src/main/resources/static/dist'),
		filename: '[name].bundle.js'
	}
```

> 개발용과 배포용의 차이점은 플러그인에 있습니다. UglifyJsPlugin을 통해서 번들로 만들어지는 스크립트 파일을 압축할 수 있게 됩니다.  

```bash
# 개발용으로 빌드
webpack
webpack --env=dev

# 배포용으로 빌드
webpack --env=prod
```

## 로더  추가하기  
CSS 또는 폰트도 적용할 수 있는 로더를 추가할 수 있습니다. webpack1은 loaders 이지만 webpack2에서는 rules라는 이름의 속성을 사용합니다.  

```javascript
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');

const jsDir = './src/main/resources/static/js';
const jsFiles = fs.readdirSync(jsDir);

var entry = {};
jsFiles.forEach(function (file) {
		var pos = file.indexOf('.js');
		if (pos > -1) {
				let fileName = file.substr(0, pos);
				entry[fileName] = path.resolve(`./src/main/resources/static/js/${file}`);
				console.log(`Webpack Javascript Enrty ${fileName} ==> ${file}`);
		}
});

var plugins = [
	new ExtractTextPlugin({
		filename: '[name].css',
		allChunks: true
	})
];

module.exports = {
	entry: entry,
	output: {
		path: path.resolve('./src/main/resources/static/dist'),
		filename: '[name].bundle.js'
	},
	resolve: {
		extensions: ['.js', '.css'],
		alias: {
			vue: 'vue/dist/vue.js'
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: [
					{
						loader: 'vue-loader',
						options: {
							loaders: {
							}
							// other vue-loader options go here
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: {
						loader: 'css-loader',
						options: {
							importsLoader: 1,
							sourceMap: true
						}
					}
				})
			},
			{
				test: /\.(scss|sass)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
			}
		]
	},
	plugins: plugins
	};
```

> 갑자기 많은 로더들이 추가되어서 당황하실 수 있겠습니다만 test에 정규식으로 표현된 파일들에 대해서 해당 로더들을 적용하는 것 뿐입니다.  

Webpack의 활용은 여기서 끝이 아닙니다. 팀 단위로 개발을 할 때 누구는 탭을 쓰고 누구는 스페이스를 쓰고 누구는 쌍따옴표를, 누구는 따옴표를 쓰는 등 자기가 원하는 대로 코딩을 하기도 합니다. 그래서 정적분석도구라는 것을 통해서 하나의 규격을 만들어놓고 그것에 맞춰 개발할 수 있도록 할 수 있습니다.  

## [ESLint](http://eslint.org/)  
> Webpack은 Linter도 지원합니다. 그 중 ESLint 라는 정적 분석 도구를 적용해보겠습니다.  

[http://eslint.org/docs/user-guide/getting-started](http://eslint.org/docs/user-guide/getting-started)  

```bash
npm install -g eslint
eslint --init
# eslint --init 명령 후 .eslintrc 파일에 규칙을 지정할 수 있습니다.
```

```javascript
// .eslintrc  
module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": "standard",
	"plugins": ["vue","html"],
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module",
		"impliedStrict": true
	},
	"rules": {
		"indent": [
			"off",
			"tab"
		],
		"linebreak-style": [
			"warn",
			"unix"
		],
		"quotes": [
			"warn",
			"single"
		],
		"semi": [
			"error",
			"always"
		]
	}
};

// webpack.config.js - rules  
{
	enforce: 'pre',
	test: /\.js$/,
	exclude: /(node_modules|bower_components)/,
	use: [
		{
			loader: 'eslint-loader',
			options: {
				formatter: require('eslint-friendly-formatter'),
				fix: true
			}
		}
	]
},
```

> eslint-loader 까지 추가했으므로 엔트리 목록에 있는 스크립트 파일을 분석해서 .eslintrc의 규칙에 맞게 분석하고 맞지 않다면 이유까지 알려주게 됩니다. options의 fix라는 속성은 쌍따옴표 같은 것들에 대해서 자동으로 규칙에 맞게 변경해주는 기능입니다.  

`eslint를 적용해놓고 개발하다보면 온갖 규칙에 어긋난다는 메시지를 볼 수 있게 됩니다!`

## 예제 보기  
그럼 빌드의 결과물을 어떻게 사용하는가를 알아보아야겠죠? 제가 공부중인 구글 애널리틱스 임베디드 API 테스트.html 입니다. head 태그에는 하나의 css 파일과 body에는 하나의 js 파일이 있습니다.

```javascript
// ga.js
import 'bootstrap/dist/css/bootstrap.min.css'; // ga.css 파일에 포함됩니다.
import $ from 'jquery';
import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';

import gaMain from '../component/ga/gaMain.vue';
import gaStep1 from '../component/ga/gaStep1.vue';
import gaStep2 from '../component/ga/gaStep2.vue';
import gaStep3 from '../component/ga/gaStep3.vue';
import gaStep4 from '../component/ga/gaStep4.vue';

window.$ = $;
window.jQuery = $;
window.Vue = Vue;

Vue.prototype.$http = axios;
Vue.use(VueRouter);
// 이하 생략
```

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="dist/ga.css">
	</head>
<body>
	<div id="app" class="row">
		<div class="col-xs-12 text-right">
			<div id="view-selector-container"></div>
			<div id="embed-api-auth-container"></div>
			<button type="button" class="btn btn-default btn-lg" v-on:click="login" v-if="!isLogin">구글 애널리틱스 로그인</button>
			<button type="button" class="btn btn-default btn-lg" v-on:click="logout" v-if="isLogin">로그아웃</button>
		</div>
		<div class="col-xs-12 col-sm-3 col-md-3">
			<ul class="list-group">
				<li class="list-group-item">
					<h4 class="text-center"><router-link to="/">Index</router-link></h4>
				</li>
				<li class="list-group-item">
					<h4 class="text-center"><router-link to="/step1">Report Step1</router-link></h4>
				</li>
				<li class="list-group-item">
					<h4 class="text-center"><router-link to="/step2">Report Step2</router-link></h4>
				</li>
				<li class="list-group-item">
					<h4 class="text-center"><router-link to="/step3">Report Step3</router-link></h4>
				</li>
				<li class="list-group-item">
					<h4 class="text-center"><router-link to="/step4">Report Step4</router-link></h4>
				</li>
			</ul>
		</div>
		<div class="col-xs-12 col-sm-9 col-md-9">
			<router-view :report-id="reportId"></router-view>
		</div>
	</div>
	<script src="dist/ga.bundle.js"></script>
	</body>
</html>
```

## 함께 보면 좋은 관련 글들을 소개합니다!  
- [Webpack 적용기 1 : 왜 필요한가?](https://hjlog.me/post/117)  
- [Webpack 적용기 2 : 어떻게 사용하는 가?](https://hjlog.me/post/118)
- [Webpack2 입문 가이드](http://hyunseob.github.io/2017/03/21/webpack2-beginners-guide/)  
- [자바스크립트 모듈화 도구, Webpack](http://d2.naver.com/helloworld/0239818)  
- [linter를 이용한 코딩스타일과 에러 체크하기](https://subicura.com/2016/07/11/coding-convention.html)  
- [javascript ESLint - Zerocho](https://www.zerocho.com/category/Javascript/post/583231719a87ec001834a0f2)  
- [이해하기 쉬운 Webpack 가이드](http://haviyj.tistory.com/17)  
- [NPM + Webpack 프론트엔드 모듈 관리전략](https://ironhee.com/2015/11/28/npm-webpack-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EB%AA%A8%EB%93%88-%EA%B4%80%EB%A6%AC%EC%A0%84%EB%9E%B5/)  
- [The Next Generation JavaScript Linter](https://github.com/nhnent/fe.javascript/wiki/Issue-252-%E2%80%94-October-2,-2015:-ESLint:-The-Next-Generation-JavaScript-Linter)  
