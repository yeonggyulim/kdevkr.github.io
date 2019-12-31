---
    title: 공식 문서로 이해하는 Webpack 이야기
    categories: [Webpack]
    date: 2019-12-31
---

## 개념

## 엔트리 포인트

## 결과

## 로더

## 플러그인

## 구성

## 모듈

## 의존성 그래프

## 타겟

## 매니페스트

## Hot Module Replacement
HMR은 애플리케이션이 동작하는 동안에 전체적인 새로고침없이 모듈을 추가, 제거 그리고 교환해줍니다. 이로써 몇 가지의 방법으로 개발 속도를 크게 향상시킬 수 있습니다.

- 전체 새로고침 동안 잃어버리는 애플리케이션 상태를 유지합니다.
- 오직 변경된 부분만 수정하여 개발 속도를 크게 향상시킵니다.
- 소스 코드를 수정하게 되면 브라우저에서 바로 업데이트가 됩니다.

HMR 동작을 정확히 이해하기 위해서 몇 가지 다른 관점에서 살펴보도록 하죠

### 응용 프로그램에서

1. 응용 프로그램이 HMR 런타임에게 변경사항이 있는지 확인해달라고 요청합니다
2. HMR 런타임은 비동기로 변경사항을 다운로드하고 응용 프로그램에게 알려줍니다
3. 그리고 나서 응용 프로그램은 HMR 런타임에 변경사항을 등록 요청합니다
4. HMR 런타임은 변경사항을 동기적으로 등록합니다

이 프로세스를 자동으로 수행하기 위해서 HMR을 설정할 수 있습니다. 또는 변경사항이 발생하도록 

### 컴파일러에서

일반 에셋이 추가되는 경우 컴파일러는 이전 버전에서 새로운 버전으로 업데이트할 수 있도록 "update"를 내보내야 합니다. 이 업데이트는 두 가지 파트로 구성됩니다.

1. 변경된 매니페스트(JSON)
2. 하나 이상의 변경된 청크(JavaScript)

이 매니페스트는 새로운 컴파일 해시와 변경된 모든 청크 목록을 가지고 있습니다. 각 청크는 변경된 모든 모듈에 대한 새로운 코드 또는 제거된 모듈인지 플래그를 가지고 있습니다.

컴파일러는 빌드 사이에 모듈 아이디와 청크 아이디를 일관되게 해주며 이러한 아이디들을 JSON 파일에 저장할 수 있으나 일반적으로는 메모리(webpack-dev-server와 같은)에 저장합니다.

### 모듈에서
> HMR is an opt-in feature that only affects modules containing HMR code. One example would be patching styling through the style-loader. In order for patching to work, the style-loader implements the HMR interface; when it receives an update through HMR, it replaces the old styles with the new ones.
> 
> Similarly, when implementing the HMR interface in a module, you can describe what should happen when the module is updated. However, in most cases, it's not mandatory to write HMR code in every module. If a module has no HMR handlers, the update bubbles up. This means that a single handler can update a complete module tree. If a single module from the tree is updated, the entire set of dependencies is reloaded.
> 
> See the HMR API page for details on the module.hot interface.

HMR은 HMR 인터페이스 코드가 구현된 모듈에만 영향을 주게되는 옵트 인 기능입니다. 만약 모듈에 HMR 인터페이스 코드가 없다면 업데이트는 버블처럼 번지게 됩니다. 이는 완전한 모듈 트리를 업데이트 할 수 있음을 의미하며 트리에서 하나의 모듈이 업데이트되면 전체 의존성 세트가 다시 로드됩니다.

### 런타임에서
> Here things get a bit more technical... if you're not interested in the internals, feel free to jump to the HMR API page or HMR guide.
>
>For the module system runtime, additional code is emitted to track module parents and children. On the management side, the runtime supports two methods: check and apply.
>
>A check makes an HTTP request to the update manifest. If this request fails, there is no update available. If it succeeds, the list of updated chunks is compared to the list of currently loaded chunks. For each loaded chunk, the corresponding update chunk is downloaded. All module updates are stored in the runtime. When all update chunks have been downloaded and are ready to be applied, the runtime switches into the ready state.
>
>The apply method flags all updated modules as invalid. For each invalid module, there needs to be an update handler in the module or in its parent(s). Otherwise, the invalid flag bubbles up and invalidates parent(s) as well. Each bubble continues until the app's entry point or a module with an update handler is reached (whichever comes first). If it bubbles up from an entry point, the process fails.
>
>Afterwards, all invalid modules are disposed (via the dispose handler) and unloaded. The current hash is then updated and all accept handlers are called. The runtime switches back to the idle state and everything continues as normal.

모듈 시스템 런타임의 경우 모듈의 상하위를 추적하기 위한 코드가 추가됩니다. 관리 측면에서 이 런타임은 `check`와 `apply` 함수를 지원합니다.

`check` 함수는 업데이트 매니페스트에 HTTP 요청을 만듭니다. 이 요청이 실패하면 수정된 것이 없는 것이며 성공했다면 현재 로드된 청크 목록과 변경된 청크 목록을 비교하고 각 로드된 청크마다 업데이트 청크를 다운로드합니다. 모든 모듈 변경사항은 이 런타임에 저장됩니다. 모든 업데이트 청크가 다운로드되고 반영 준비가 되었으면 런타임은 `ready` 상태로 전환합니다.

`apply` 함수는 변경된 모든 모듈이 올바르지 않은지 플래그화합니다. 각 유효하지 않은 모듈의 경우 모듈 또는 부모가 업데이트 핸들러를 가지고 있어야합니다. 그렇지 않으면 플래그가 부모까지 유효하지 않게 번집니다. 이 번지는 행위는 앱의 앤트리 포인트 또는 업데이트 핸들러를 가지는 모듈에 도달할 때까지 지속됩니다. 만약 앤트리 포인트에서 번지게 되면 이 프로세스는 실패가 됩니다.

그 후 모든 유효하지 않은 모듈은 폐기되고 로드되지 않습니다. 그런 다음 현재 해시가 변경되고 모든 `accept` 핸들로가 호출됩니다. 런타임은 `idle` 상태로 전환되고 모든 것이 정상적으로 지속됩니다.

