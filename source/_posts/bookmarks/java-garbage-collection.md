---
    title: Java Garbage Collection
    date: 2011-12-21
    categories: [북마크, Java]
    banner:
        url: https://d2.naver.com/static/img/app/common/empty_img0.png
---

![](https://d2.naver.com/static/img/app/common/empty_img0.png)

지극히 개인적이고 주관적인 판단 기준을 먼저 밝힌다면, 가비지 컬렉션(Garbage Collection, 이하 GC)에 대해 잘 알고 있을수록 실력이 좋은 Java 개발자라고 생각합니다. GC 과정에 관심을 가질 정도라면 규모가 일정 이상인 애플리케이션을 제작해 본 경험이 있을 것입니다. 또, 어떤 GC 알고리즘을 선택할 것인지 고민할 정도면 스스로 제작한 애플리케이션의 특징을 정확히 이해하고 있다고 볼 수 있습니다. 이러한 판단 기준이 보편적이지는 않지만, GC에 대한 이해는 훌륭한 Java 개발자가 되기 위한 필수 조건이라는 데에는 별다른 이견이 없을 것입니다. 이 글에서는 GC 이론을 되도록 쉽게 소개하겠습니다. 피가 되고 살이 되는 글이 되기를 바랍니다.

[Java Garbage Collection](https://d2.naver.com/helloworld/1329)