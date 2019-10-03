---
title: How Fast is Spring?
categories: [북마크]
date: 2018-12-12
banner:
  url: https://docs.google.com/spreadsheets/d/e/2PACX-1vQpSEfx0Y1W9aD3XVyn91-S0jtUp2DRCQSy_W_LMGyMR91YLAQ1mL7MiR1BRd8VzshvtuxzL6WAnlxf/pubchart?oid=336485057&format=image
---

## TL;DR How do I make my app go faster?
(Copied from here.) You are mostly going to have to drop features, so not all of these suggestions will be possible for all apps. Some are not so painful, and actually pretty natural in a container, e.g. if you are building a docker image it’s better to unpack the jar and put application classes in a different filesystem layer anyway.

[How Fast is Spring?](https://spring.io/blog/2018/12/12/how-fast-is-spring)

- https://github.com/dsyer/spring-boot-startup-bench
- https://github.com/dsyer/spring-boot-allocations