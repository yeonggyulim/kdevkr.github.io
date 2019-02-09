---
title: Let's get the fastest rising searches on google trends.
subtitle:   Crawling
date:       2017-11-25 12:00:00
banner:
 url: https://tribwgnam.files.wordpress.com/2018/12/trends.png
---

## 구글 인기검색어 피드

[Google Trends](https://trends.google.com/trends/hottrends)에서 제공하는 인기 급상승 검색어 목록을 가져오는 기능을 구현해보고자 합니다.

#### Dependencies

-   Java 8+
-   Apache HttpClient
-   Jsoup
-   Guava

#### Google hot searches page analyze

인기 급상승 검색어 데이터를 가져오기 위해서는 구글 인기 급상승 검색어 페이지가 어떤식으로 구성되어있는지를 파악할 필요가 있습니다.

```bash
// 한국, pn=p23
https://trends.google.com/trends/hottrends#pn=p23
// 일본, pn=p4
https://trends.google.com/trends/hottrends#pn=p4
// 미국, pn=p1
https://trends.google.com/trends/hottrends#pn=p1
```

위 처럼 pn이라는 파라미터값으로 나라를 구분해서 제공하고 있습니다. 그런데 날짜를 기준으로는 못가져오나보네요?... 특정 날짜에 대한 데이터를 가져올 수 있다면 좋았을텐데 말이에요 (네이버 데이터 랩은 대한민국의 데이터만 제공)

HTML을 파싱하는 것 보다는 아톰 피드로 제공하는 XML을 분석하도록 하겠습니다.

-   <https://trends.google.com/trends/hottrends/atom/feed>

```java
CloseableHttpClient httpClient = HttpClientBuilder.create().build();
URIBuilder uriBuilder = new URIBuilder("https://trends.google.com/trends/hottrends/atom/feed");
uriBuilder.setParameter("pn", pn);

HttpGet httpGet = new HttpGet(uriBuilder.build());

Document doc;
doc = Jsoup.parse(httpClient.execute(httpGet, responseHandler));

List<Map<String, Object>> list = new LinkedList<>();
Elements nodes = doc.select("item");

Iterator<Element> itr = nodes.iterator();
while(itr.hasNext()) {
	Element node = itr.next();
	String title = node.child(0).text();
	String traffic = node.child(1).text().replaceAll("([+,])", "");
	List<String> news = new ArrayList<>();

	Elements newsItemUrls = node.select("ht|news_item_url");
	ListIterator<Element> lItr = newsItemUrls.listIterator();

	while(lItr.hasNext()) {
		Element newsItemUrl = lItr.next();
		news.add(newsItemUrl.text());
	}

	DateFormat formatter = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.ENGLISH);
	Date date = (Date)formatter.parse(node.child(4).text());

	DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	LocalDateTime ldt = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());

	Map<String, Object> hotSearch = Maps.newHashMap();
	hotSearch.put("title", title);
	hotSearch.put("traffic", Integer.parseInt(traffic));
	hotSearch.put("date", ldt.format(dtf));
	hotSearch.put("news", news);
	list.add(hotSearch);
}



// 날짜별 인기 검색어 그룹핑
Map<Object, List<Map<String, Object>>> groupList = list.stream()
		.collect(Collectors.groupingBy(item -> ((Map<String, Object>)item).get("date")));
```

#### Google Hot Searchs Data

분석된 데이터는 다음과 같이 추출되었습니다.

```json
{
    "2017-11-21": [
        {
            "date": "2017-11-21",
            "news": [
                "http://www.huffingtonpost.kr/2017/11/21/story_n_18615336.html",
                "http://news.chosun.com/site/data/html_dir/2017/11/22/2017112202881.html"
            ],
            "title": "부산 편의점",
            "traffic": 20000
        },
        {
            "date": "2017-11-21",
            "news": [
                "http://www.huffingtonpost.kr/2017/11/20/story_n_18605848.html",
                "http://news.khan.co.kr/kh_news/khan_art_view.html?artid=201711202109001"
            ],
            "title": "호주 워마드",
            "traffic": 5000
        },
        {
            "date": "2017-11-21",
            "news": [
                "http://www.hankookilbo.com/v/0b093f4dd84447bfba65acd9990aff95",
                "http://www.zdnet.co.kr/ArticleView.asp?artice_id=20171121114621"
            ],
            "title": "페이트 그랜드 오더",
            "traffic": 5000
        }
    ],
    "2017-11-22": [
        {
            "date": "2017-11-22",
            "news": [
                "http://news.chosun.com/site/data/html_dir/2017/11/23/2017112301272.html",
                "http://www.huffingtonpost.kr/2017/11/23/story_n_18627434.html"
            ],
            "title": "이국종",
            "traffic": 20000
        },
        {
            "date": "2017-11-22",
            "news": [
                "http://news20.busan.com/controller/newsController.jsp?newsId=20171122000035",
                "http://veritas.kr/articles/27679/20171123/tbs-%EA%B5%90%ED%86%B5%EB%B0%A9%EC%86%A1-%EC%B6%9C%EC%97%B0%ED%95%9C-%EA%B9%80%EC%9A%A9%EC%98%A5-%EB%94%B8-%EA%B9%80%EB%AF%B8%EB%A3%A8-%EC%9D%B8%EC%A6%9D%EC%83%B7.htm"
            ],
            "title": "김미루",
            "traffic": 10000
        },
        {
            "date": "2017-11-22",
            "news": [
                "http://news.chosun.com/site/data/html_dir/2017/11/22/2017112201975.html",
                "http://www.koreatimes.com/article/20171121/1088899"
            ],
            "title": "제니퍼 로렌스",
            "traffic": 5000
        },
        {
            "date": "2017-11-22",
            "news": [
                "http://www.hani.co.kr/arti/society/schooling/820394.html"
            ],
            "title": "처음학교로",
            "traffic": 5000
        },
        {
            "date": "2017-11-22",
            "news": [
                "http://news.joins.com/article/22142710"
            ],
            "title": "조이",
            "traffic": 2000
        },
        {
            "date": "2017-11-22",
            "news": [
                "http://www.huffingtonpost.kr/2017/11/22/story_n_18615334.html",
                "http://news.chosun.com/site/data/html_dir/2017/11/22/2017112200912.html"
            ],
            "title": "방예담",
            "traffic": 2000
        }
    ],
    "2017-11-23": [
        {
            "date": "2017-11-23",
            "news": [
                "http://www.hani.co.kr/arti/society/labor/820555.html"
            ],
            "title": "수능",
            "traffic": 10000
        },
        {
            "date": "2017-11-23",
            "news": [
                "http://www.huffingtonpost.kr/2017/11/23/story_n_18627738.html",
                "http://www.yonhapnews.co.kr/bulletin/2017/11/24/0200000000AKR20171124071300005.HTML"
            ],
            "title": "슬기로운 감빵 생활",
            "traffic": 5000
        },
        {
            "date": "2017-11-23",
            "news": [
                "http://news.khan.co.kr/kh_news/khan_art_view.html?artid=201711241140001&code=940401"
            ],
            "title": "평가원",
            "traffic": 5000
        },
        {
            "date": "2017-11-23",
            "news": [
                "http://www.yonhapnews.co.kr/bulletin/2017/11/23/0200000000AKR20171123063200005.HTML"
            ],
            "title": "방앗간",
            "traffic": 2000
        },
        {
            "date": "2017-11-23",
            "news": [
                "http://www.huffingtonpost.kr/2017/11/23/story_n_18630788.html"
            ],
            "title": "한국교육과정평가원",
            "traffic": 2000
        },
        {
            "date": "2017-11-23",
            "news": [
                "http://www.yonhapnews.co.kr/bulletin/2017/11/23/0200000000AKR20171123034900005.HTML",
                "http://www.entermedia.co.kr/news/news_view.html?idx=7312&bc=&mc="
            ],
            "title": "이판사판",
            "traffic": 2000
        },
        {
            "date": "2017-11-23",
            "news": [
                "http://news.chosun.com/site/data/html_dir/2017/11/24/2017112402208.html",
                "http://news.joins.com/article/22144241"
            ],
            "title": "2018 수능",
            "traffic": 2000
        },
        {
            "date": "2017-11-23",
            "news": [
                "http://news.chosun.com/site/data/html_dir/2017/11/23/2017112300543.html",
                "http://www.huffingtonpost.kr/2017/11/23/story_n_18627196.html"
            ],
            "title": "김부선",
            "traffic": 2000
        }
    ],
    "2017-11-24": [
        {
            "date": "2017-11-24",
            "news": [
                "http://www.huffingtonpost.kr/2017/11/24/story_n_18637488.html",
                "http://news.chosun.com/site/data/html_dir/2017/11/24/2017112400942.html"
            ],
            "title": "박한별",
            "traffic": 10000
        },
        {
            "date": "2017-11-24",
            "news": [
                "http://news.joins.com/article/22144692",
                "http://www.yonhapnews.co.kr/bulletin/2017/11/24/0200000000AKR20171124044051004.HTML"
            ],
            "title": "수능 등급컷",
            "traffic": 2000
        },
        {
            "date": "2017-11-24",
            "news": [
                "http://www.yonhapnews.co.kr/bulletin/2017/11/24/0200000000AKR20171124027800008.HTML",
                "http://news.jtbc.joins.com/html/906/NB11553906.html"
            ],
            "title": "검은사막 모바일",
            "traffic": 2000
        }
    ]
}
```

## 마치며

본 포스트는 네이버 데이터 랩의 급상승 검색어 데이터를 구글 인기 급상승 검색어 데이터로 대체하기 위해서 작성하였습니다.
