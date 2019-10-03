---
title: 스프링 부트 애플리케이션 AJAX 요청
date: 2019-07-15
categories: [스프링, AJAX]
---

> https://github.com/kdevkr/spring-demo-ajax 를 기반으로 작성되었습니다.

### JQuery.ajax

### Axios
Axios는 잠만보가 최근에 VueJS로 개발하고 있어 JQuery.ajax 대신 사용하고 있는 HTTP 클라이언트이다. 

#### Axios.post
```js
const $data = new FormData();
$data.append('files', $file);
$data.append('files', $file);

// Send a POST request
axios({
  method: 'post',
  url: $url,
  data: $data,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Request method aliases
axios.post($url, $data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
})
```

## 참고
- [Spring-Demo-JQuery-Ajax](https://github.com/kdevkr/spring-demo-ajax)
- [How to post a file from a form with Axios](https://stackoverflow.com/a/43014086)