---
    title: 스프링 부트 애플리케이션과 VueJS 통합하기
    date: 2020-03-08
    categories: [개발 이야기]
    tags:
        - Spring Boot
        - Vue.js
---

## 스프링 부트 애플리케이션과 VueJS 통합하기

본 프로젝트는 스프링 부트 애플리케이션과 Webpack과 같은 번들러와 함께 개발할 경우에 어떻게 수시로 번들링되는 파일을 스프링 부트 애플리케이션에서 배포할 수 있는지를 알아보는 예제입니다.

### 스프링 애플리케이션의 배포
먼저, 스프링 애플리케이션이 어떻게 정적 파일을 배포하는지를 이해해야 합니다. 스프링 애플리케이션은 톰캣과 같은 WAS와 함께 동작합니다. 클래스패스에 있는 정적 파일을 빌드 과정에서 포함되어 톰캣이 정적 파일로 배포할 수 있습니다.

> 현재 프로젝트 경로에 존재하는 파일이 톰캣이 배포할 수 있는 파일과 다를 수 있다는 말입니다. 이해하셨나요?

#### Update clasess and resources
첫번째 방법은 스프링 부트 애플리케이션에 포함된 내장 톰캣이 배포하는 정적 파일을 갱신하는 것입니다.

![](src/main/resources/static/images/configuration-update-classes-and-resources.PNG)

Webpack에서 만드는 번들링 파일을 현재 프로젝트의 클래스패스에 생성되게 하면 됩니다. 그러면 현재 클래스패스의 리소스가 변경되었다고 감지하여 애플리케이션을 업데이트하게 됩니다.

그런데 단점이 있습니다. 클래스패스의 리소스가 변경되는 것을 감지하고 다시 리소스를 업데이트하기 까지의 시간이 걸립니다.

### Webpack 프록시 서버
톰캣이 배포하는 리소스를 변경하는 것은 하나의 방법이지만 수시로 번들링되는 것을 빠른 시간안에 적용하여 확인하는 것에는 어려움이 있습니다. 그래서 다른 방법으로 이 번들링되는 파일들을 대신 처리하여 주는 프록시 서버를 만드는 것입니다.

프록시 서버를 구성하는 방법은 두가지가 있습니다.

- webpack + express + [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)
- [webpack-dev-server](https://github.com/webpack/webpack-dev-server)

하나는 Express 노드 서버를 구성하고 `webpack-dev-middleware`를 적용하는 것입니다.

두번째는 webpack 그룹이 제공하는 `webpack-dev-server`를 이용하는 것입니다.

> 어느 방법이든지 상관 없습니다. 행위는 똑같으니까요

#### webpack-dev-server
저는 기존에 사용하던 express 서버가 없으므로 간단하게 webpack-dev-server를 활용합니다.

```sh
npm i -D webpack-dev-server
```

webpack-dev-server 모듈을 설치하고 Webpack의 devServer 설정을 구성합니다.

> webpack-dev-server가 webpack.config.js의 devServer 설정에 따라 실행됩니다.

**webpack.config.js**
```js
module.exports = {
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'src/main/resources/dist'),
        publicPath: '/',
    },
    devServer: {
        inline: true,
        hot: true,
        contentBase: path.resolve(__dirname, 'src/main/resources/dist'),
        publicPath: '/dist/',
        filename: '[name].js',
        host:  'localhost',
        port: 8081,
        proxy: {
            '**': 'http://localhost:8080/'
        },
    }
}
```

기본 번들링 파일이 생성되는 위치는 `src/main/resources/dist`로 빌드시에도 번들링된 파일을 배포할 수 있도록 하였으며 `webpack-dev-server`는 `src/main/resources/dist`에 있는 정적 파일들을 `/dist/`를 기준으로 배포하게 합니다.

그리고 모든 경로에 대하여 애플리케이션 실행 주소를 바라보게 `proxy` 설정을 합니다.

**package.json**
```json
{
    "scripts": {
        "webpack": "webpack --config webpack.config.js",
        "dev": "webpack -d --config webpack.config.js --watch",
        "dev:server": "webpack-dev-server"
    },
}
```

webpack-dev-server를 구동할 수 있도록 NPM 스크립트를 만들고 실행합니다.

```sh
npm run dev:server

> webpack-dev-server

i ｢wds｣: Project is running at http://localhost:8081/
i ｢wds｣: webpack output is served from /dist/
i ｢wds｣: Content not from webpack is served from C:\Users\K\git\spring-demo-vuejs\src\main\resources\dist
```

#### 프록시 서버를 통해 개발하기
프록시 서버도 구동되었으니 브라우저에서 `8081` 포트로 접근하여 개발하면 됩니다.

네트워크 탭으로 확인해보면 프록시 서버가 `/dist/` 경로를 기준으로 번들링된 파일을 제공하는 것을 확인할 수 있습니다.

![](src/main/resources/static/images/webpack-dev-server-network.PNG)  

### 초기 데이터 적재
많은 분들이 궁금해하시는 부분일 것 같습니다. 애석하게도 번들링되는 파일에 애플리케이션의 데이터를 적재하는 것은 불가능 합니다. 그래서 번들링되는 스크립트에서 데이터를 불러올 수 있도록 몇가지 방법을 고려해봐야합니다.

#### Object.defineProperty 그리고 freeze
첫번째 방법은 스프링 애플리케이션이 제공하는 `.html` 파일에 스크립트 블록을 만들어 변경되지 않는 오브젝트를 만드는 것입니다.

- Object.defineProperty : 오브젝트의 새로운 속성을 정의합니다.
- Object.freeze : 오브젝트를 변경되지 않도록 동결시킵니다.

다음은 위 정적 함수들을 사용하여 변경되지 않는 데이터 속성을 만드는 예제입니다.

```html
<script type="text/javascript">
    Object.defineProperty(window, 'state', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: {
            id: "${state.id}",
            name: "${state.name}",
            origin: "${state.origin}"
            // ,${_csrf.parameterName}: "${_csrf.token}"
        }
    });
    Object.freeze(window.state);
</script>
```

`state`는 애플리케이션이 제공하는 모델 속성입니다.

> 본 예제에서는 프리마커 템플릿 엔진을 사용하고 있습니다.

#### 초기 데이터 API 호출
두번째는 스크립트 파일 로드시 초기 데이터를 받아오는 API를 호출하는 방법입니다. 

```js
export default {
    data() {
        this.getState()

        return {
            state: window.state
        }
    },
    methods: {
        getState() {
            async function state() {
                let response = await $http.get('/api/state')
                return response
            }

            state().then((res) => {
                this.state = res.data
            })
        }
    }
}
```

## 끝마치며
제가 설명하는 방법이 올바른 것은 아닙니다. 다만, 이런 방법이 있다는 것을 알고 도입을 고려하시기 바랍니다. 또한, 어떠한 경우든 사용자의 개인정보와 같은 보호가 필요한 데이터는 초기 데이터로 적재하지 않도록 하시기 바랍니다.

