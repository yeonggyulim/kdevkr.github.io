---
title: 엘라스틱서치 7.X를 알아보자
date: 2019-10-16
categories: [개발 이야기, Elasticsearch]
---

## Feature

### Full-Text Search Engine
엘라스틱서치는 검색엔진 애플리케이션으로 `루씬`이라는 라이브러리를 사용합니다. 따라서, 루씬이 기본적으로 가지는 `역색인(Inverted Index)`구조로 데이터가 저장되어 `전문 검색`이 가능합니다.

다만, 내부적으로는 역색인 구조로 데이터가 저장되지만 사용자가 저장하거나 받는 것은 `JSON 형식`입니다.

### RESTful API
엘라스틱서치는 데이터의 저장, 수정, 삭제를 위한 API를 제공합니다. 

앞서 사용자가 전달받는 데이터는 JSON형식이라고 했는데 엘라스틱서치 API에서 사용되는 질의 뿐만 아니라 쿼리 결과도 JSON 형식입니다.

### Multitenancy
엘라스틱서치는 데이터를 `인덱스(index)`라는 단위로 저장하게 됩니다. 이 인덱스는 하나 이상의 `샤드(Shard)`로 구성되는데 샤드 수에 따라 엘라스틱서치가 데이터를 클러스터 내에 분산하여 저장합니다.

> 인덱스에 대한 샤드 수가 많아지게되면 데이터가 재배치될 때 또는 클러스터 복구시 많은 디스크 I/O를 야기할 수 있다고 합니다.

### Clustering
엘라스틱서치는 데이터 증가에 따라 스케일 아웃 및 데이터 무결성을 유지하기 위하여 클러스터링을 기본으로 지원합니다.

## Getting Started
이제 본격적으로 엘라스틱서치에 대해서 알아보겠습니다.

### Index and Shards
엘라스틱서치에서 데이터를 `도큐먼트(Document)`라고 하는 단위로 부르는데 이 도큐먼트의 집합을 인덱스라 지칭합니다.

인덱스는 다시 샤드라는 단위로 분리되어 각 클러스터 노드에 `분산`되어 저장됩니다.

#### Primary Shard and Replica
기본적으로 프라이머리 샤드는 인덱스 별 1개로 구성되며 복제본을 생성되지 않습니다. 만약, 샤드가 1개 이상인 경우 샤드에 대한 복제본이 만들어집니다.

각 샤드와 복제본은 클러스터 노드에 분산되어 저장되고 반드시 샤드와 복제본은 동일한 클러스터 노드에 저장되지 않습니다.

> 엘라스틱서치는 프라이머리 샤드와 복제본으로써 클러스터 노드에 문제가 발생해도 데이터 유실이 없도록 지원합니다.

#### Number of Shards
인덱스에 대한 프라이머리 샤드 개수는 인덱스를 처음 생성할 때 지정해야합니다.

> 인덱스를 `재색인`하지 않는 이상 바꿀 수 없습니다.

```json
// [PUT] /sample
{
    "settings": {
        "number_of_shards": 3,
        "number_of_replicas": 1
    }
}
```

#### Number of Replicas
인덱스에 대한 복제본 수는 인덱스를 생성할 때 지정할 수 있으며 나중에도 변경이 가능합니다.

```json
// [PUT] /sample/_settings
{
    "number_of_replicas": 0
}
```

### REST API
엘락스틱서치는 REST API를 제공하기 때문에 `포스트맨(Postman)`과 같은 REST Client를 사용하거나 `키바나(Kibana)`를 사용중인 경우 `Dev Tools`라는 도구를 사용해도 됩니다.

> 저는 포스트맨을 사용하겠습니다.

인덱스의 기본 도큐먼트 타입은 _doc입니다. 아직까지는 도큐먼트 타입을 다른 이름으로 사용할 수 있지만 8.X 부터는 타입 지정하는 것을 제공하지 않는다고 하니 참고하시기 바랍니다.

> Elasticsearch 8.x
> Specifying types in requests is no longer supported.
> The include_type_name parameter is removed.

#### 인덱스 조회
인덱스에 대한 정보를 조회할 수 있습니다.

```json
/{index}
```

#### 도큐먼트 조회
인덱스에 저장되는 데이터 단위는 도큐먼트라고 했습니다. 저장된 도큐먼트의 아이디(_id)로 조회할 수 있습니다.

```json
/{index}/_doc/{_id}
```

#### 검색
엘라스틱서치는 쿼리를 이용해 검색할 수 있는 `_search` API를 지원합니다.

```json
/{index}/_search
```

##### URI
간단한 쿼리-스트링으로 검색할 수 있습니다.
```json
/{index}/_search?q=value
```

##### Request Body
URI 검색이 간단하지만 JSON 형식의 `QueryDSL`으로 복잡한 검색을 지원합니다.

```json
/{index}/_search

{
    "query": {
        "match_all": {}
    }
}
```

## QueryDSL
QueryDSL에 대해서 더 자세히 알아봅시다.

엘라스틱서치는 `텀(Term)`이라는 단위로 데이터를 형태소 분석하여 저장합니다. 텀을 이용해 전문 검색을 지원하는 것이죠

엘라스틱서치가 지원하는 쿼리는 종류가 여러가지가 있습니다. 대표적으로 `match_all`, `match`, `term`등이 있습니다.

### Full-Text Queries

#### match
가장 기본적인 match 쿼리는 필드(Field)에 값(value)가 포함되어 있는 모든 도큐먼트를 검색합니다.

```json
{
    "query": {
        "match": {
            "address": "서울 대전"
        }
    }
}
```

위 예제는 address 필드에 서울과 대전이 값으로 포함되어 있는 도큐먼트를 매치하는 쿼리입니다. match 쿼리는 기본적으로 여러 값에 대하여 OR 조건으로 매치함에 주의하시기 바랍니다.

OR 조건이 아닌 AND 조건으로 하고 싶다면 다음과 같이 `operator` 옵션을 지정합니다.

```json
{
    "query": {
        "match": {
            "address": "강남구 역삼동",
            "operator": "and"
        }
    }
}
```

이외에도 match_phrase, multi_match, query_string 등이 있습니다.

#### Relevancy
전문 검색엔진은 검색 결과가 얼마나 조건에 부합하는지를 계산하는 알고리즘을 제공하여 정확도 수치를 제공합니다.

엘라스틱서치 검색 결과의 도큐먼트 항목에는 _score 라는 점수 필드가 제공됩니다. 그리고 검색된 도큐먼트들 중 가장 높은 점수인 max_score도 포함합니다.

자세한 내용은 [김종민님이 알려주는 BM25 계산식](https://esbook.kimjmin.net/05-search/5.3-relevancy)을 참고하시기 바랍니다.

간단하게 말하자면 포함되는 텀의 수, 텀의 희소성, 텀을 포함하는 필드의 길이를 기반으로 점수를 매깁니다.

전문 검색은 이 정확도가 높은 순으로 결과를 가져옵니다.

### [Term-Level Queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html)
텀 레벨 쿼리는 전문 검색 쿼리와는 다르게 키워드 분석을 진행하지 않고 정확한 텀을 기준으로 검색합니다.

#### term
필드에 정확한 텀이 포함된 도큐먼트만 검색합니다.

::: warning
텍스트 필드에 term 쿼리를 사용하는 것을 피하십시오.

기본적으로 엘라스틱서치는 분석을 위해 텍스트 필드의 값을 변경하므로 텍스트 필드에 대한 정확한 매치가 어려울 수 있습니다.

텍스트 필드 값을 검색하려면 매치 쿼리를 대신 사용하세요.
:::

```json
GET /_search
{
    "query": {
        "term": {
            "user": {
                "value": "Kimchy",
                "boost": 1.0
            }
        }
    }
}
```

#### terms
필드에 하나 이상의 텀이 포함되는 도큐먼트를 검색합니다.

```json
GET /_search
{
    "query" : {
        "terms" : {
            "user" : ["kimchy", "elasticsearch"],
            "boost" : 1.0
        }
    }
}
```

이외에도 exists, fuzzy, range, regexp, wildcard 등이 있습니다.

### [Compound Queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/compound-queries.html)
복합 쿼리는 다른 복합 쿼리 또는 말단 쿼리를 결합하거나 필터 컨텍스트로 전환합니다.

#### bool
기본적인 bool 쿼리는 must, must_not, should 또는 filter 절로 결합하여 조건을 기준으로 검색합니다.

```json
POST _search
{
  "query": {
    "bool" : {
      "must" : {
        "term" : { "user" : "kimchy" }
      },
      "filter": {
        "term" : { "tag" : "tech" }
      },
      "must_not" : {
        "range" : {
          "age" : { "gte" : 10, "lte" : 20 }
        }
      },
      "should" : [
        { "term" : { "tag" : "wow" } },
        { "term" : { "tag" : "elasticsearch" } }
      ],
      "minimum_should_match" : 1,
      "boost" : 1.0
    }
  }
}
```

이외에도 boosting, constant_score, dis_max, function_score 등이 있습니다.

## Mapping
인덱스의 매핑 규칙을 정의할 수 있습니다.

### Properties
프로퍼티는 도큐먼트를 정의하는 메타 필드를 제외한 속성입니다.
인덱스를 생성할때나 이미 존재하는 인덱스에 프로퍼티에 대한 규칙을 정의할 수 있습니다.

```json
{
  "mappings": {
    "_doc": {
      "properties": {
        "type": {
          "type": "keyword"
        },
        "created": {
          "type": "long"
        }
      }
    }
  }
}
```

위 예제에서는 도큐먼트의 매핑 타입은 _doc(기본값)이며 도큐먼트 프로퍼티로 type이 `keyword` 데이터 속성을 가져야한다는 규칙을 매핑한 것입니다.

### Datatypes
엘라스틱서치에서 지원하는 [데이터 속성](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html)은 다음과 같습니다.

- text, keyword
- long, integer, short, byte, double, float, half_float, scaled_float
- date, date_nanos
- boolean
- binary
- integer_range, float_range, long_range, double_range, date_range
- object, nested
- geo_point, geo_shape
- ip, shape...

#### Keyword
문자열 데이터 속성 중 keyword 형식의 필드들은 스코어 점수를 고려하지 않기 때문에 정확한 값을 가지고 있는지를 확인합니다.

앞서, 매핑 규칙으로 type 필드가 keyword 속성을 가지고 있습니다.

인덱스의 도큐먼트들 중에서 type이 schedule, event 등이 있다고 가정할 때 match 쿼리에서 다음과 같이 질의하면 결과가 없습니다.

```json
{
    "query": {
        "match": {
            "type": "schedule event"
        }
    }
}
```

검색 엔진이 type 필드가 keyword 속성을 가지므로 값에 공백을 포함한 "schedule event"가 정확히 있어야 합니다.

> Keyword 속성을 가진 필드에 대해서 검색하기 위해서는 정확도 점수를 계산하지 않는 filter 구문을 이용해야 합니다.

## 참고
- [Elasticsearch 7.x Reference Guide](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/index.html)
- [Elastic 가이드 북](https://esbook.kimjmin.net/)
- [Elasticsearch로 로그 검색 시스템 만들기](https://d2.naver.com/helloworld/273788) 