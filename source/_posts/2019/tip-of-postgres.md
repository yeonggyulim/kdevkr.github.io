---
    title: 초보 개발자가 알려주는 포스트그레스 팁
    date: 2019-06-23
    categories: [개발 이야기, Postgres]
    banner:
        url: https://t1.daumcdn.net/cfile/tistory/99AE574A5C49905F20
---

## Aggregation Query based Timestamp

```sql
select
  date_trunc('minute', created_at), -- or hour, day, week, month, year
  count(1)
from users
group by 1
```

### Convert TimeZone of Timestamp
```sql
select created_at at time zone 'utc' at time zone 'Asia/Seoul'
from users;
```

### Generate timeseries for group by time
```sql
select generate_series(
  date_trunc('hour', now()) - '1 day'::interval, -- start at one day ago, rounded to the hour
  date_trunc('hour', now()), -- stop at now, rounded to the hour
  '1 hour'::interval -- one hour intervals
) as hour
```

###
```sql
with data as (
  select
    date_trunc('day', created_at) as day,
    count(1)
  from users
  group by 1
)

select
  day,
  sum(count) over (order by day asc rows between unbounded preceding and current row)
from data
```





## 참고
- [How to Group by Time in PostgreSQL](https://popsql.com/learn-sql/postgresql/how-to-group-by-time-in-postgresql/)
- [How to Use generate_series to Avoid Gaps In Data in PostgreSQL](https://popsql.com/learn-sql/postgresql/how-to-use-generate-series-to-avoid-gaps-in-data-in-postgresql/)