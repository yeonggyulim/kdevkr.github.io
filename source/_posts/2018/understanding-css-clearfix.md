---
title: CSS 이해하기 - Clearfix
date: 2018-06-26 22:21:18
categories: [이해하기, CSS]
banner:
  url: https://cdn-images-1.medium.com/max/1200/1*OFsc0SD55jhi8cjo7aCA4w.jpeg
---

## Clearfix  
> [`Clearfix`](http://cssmojo.com/the-very-latest-clearfix-reloaded/)는 CSS Hack으로써 Float된 엘리먼트 때문에 `레이아웃이 뭉개지는 현상을 해결`하기 위한 방법입니다.  

```css
.clearfix:before, .clearfix:after {
  content: " ";
  display: table;
}
.clearfix:after {
  clear:both;
}
/* IE 6 ~ 7 */
.clearfix {
  *zoom:1;
}
```

## Bootstrap Clearfix  
> Bootstrap에서는 `Clearfix`에 대해서 다음과 같이 제공합니다.  
> 부트스트랩은 IE 10+을 지원하므로 위에서 알아본 IE 6+에서의 clearfix를 굳이 지원하지 않습니다.

```css
.clearfix:after {
  content: "";
  display: block;
  clear:both;
}
```

## 참고  
- [CSS Hacks](http://www.webdevout.net/css-hacks)  
- [Bootstrap Clearfix](http://bootstrap4.kr/docs/4.0/utilities/clearfix/)  
