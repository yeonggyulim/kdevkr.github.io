---
    title: Understanding HikariCP's Connection Pooling behaviour
    date: 2018-11-02
    categories: [북마크]
    tags: [HikariCP]
---

## [Understanding HikariCP’s Connection Pooling behaviour](https://medium.com/@rajchandak1993/understanding-hikaricps-connection-pooling-behaviour-467c5a1a1506)


In the era of high traffic load, improving the system’s performance is a crucial thing. When we talk about the performance of the system, it’s never about one thing. Performance degrade could happen at any layer in your architecture e.g web server is a bottleneck to handle multiple concurrent user requests, message bus is a bottleneck due to too many consumers(e.g AWS kinesis) or it could be your database which is a bottleneck to handle too many requests or concurrent transactions.

While interacting with databases, connections play a predominant role in overall performance and robustness of the system. One of the trivial technique used by many engineers is a connection pooling to avoid the overhead of creating a new connection every time for running database queries. There are multiple libraries available which manage pool out of the box.

> HikariCP is one of the open source, fast, JDBC connection pooling library available to achieve production ready pooling strategy.
Before jumping into HikariCP, Let’s try to understand why of connection pooling in brief.

### Why connection Pooling:

Database connections are precious resources and managing them effectively will help to build robust applications.

### Downsides of creating new connections every time:

> Creating new connection costs us significant memory allocation. Each newly created connection consumes around 6MB to10 MB of memory. This memory is different from the memory required by database to run memory intensive queries i.e dedicated 6MB to 10MB for connection.With growing number of requests it’s hard to manage memory by creating new connections each time.
> Creating new connection requires username, password, TSL specifications in order to authenticate with database and it becomes overhead with growing number of connections.

### The behaviour of HikariCP when a database is down:

A couple of days back, I faced wired issue while dealing with downtime of PostgreSQL (due to hardware failure). I was looking at the application’s failure logs and came across exceptions around new connection attempts. (There were 3 to 4 same exceptions back to back as below), followed by HikariCP’s exception log message stating no connection available

So, an order of logs in ascending timestamp was like this

```sh
[PostgreSQL]:connection attempt failed…
[PostgreSQL]:connection attempt failed…
[PostgreSQL]:connection attempt failed…
[HikariCP]: connection not available, request timed out after <elapsed timeout> ms
```

Even though the number of requests were less than connection pool size during this downtime, the connection pool was trying to create a new connection. If we have connection pool then why are we trying/attempting to create a new connection? Did pool run out of connections and hence it’s creating a new one? Out of curiosity, I jumped into HikariCP’s code (which you can find it here ) to figure out its behaviour when the database is down.

Here is a small attempt to draw an activity diagram as soon as request goes to HikariCP Pool

![](https://miro.medium.com/max/671/1*05onc5deIDLtFifTpyy8dg.png)

In nutshell, every request goes to HikariCP to obtain a connection from a pool in order to run a query. HikariCP picks up the random connection from its available pool (they call it as a Concurrent Connection Bag) and checks if the picked up connection is still alive by firing the sample query on the database (we can also explicitly provide sample query).In case if a database is not responding (i.e connection is no more valid) then HikariCP closes this connection and removes it from the pool.

Refilling the pool after closing and removing of dead connection is an important step taken by HikariCP when pool state is normal (i.e it’s not shut down or suspended).In the process of refilling, HikariCP tries to create new connections asynchronously which might end up getting connection attempt failed if the database is still not up. The whole process repeats till timeout set in HikariCP’s configuration is not over.

A connection timeout is a contract between application and the pool; your application should get a connection within the specified time or get an exception. In the end, HikariCP throws connection not available if it times out.

### Behaviour when the connection pool is exhausted:

When all connections from the pool are busy in running queries or performing database operation and a new request comes in, then HikariCP will create a new connection and it will add it to its concurrent connection bag. Offering connection to concurrent requests has been handled in thread safely way.

To conclude, Connection pooling has it’s own pros and cons and thus one should use it wisely. Along with HikariCP, there are multiple alternatives available for pooling purpose e.g Tomcat, C3P0, Vibur

## References:
- https://github.com/brettwooldridge/HikariCP/wiki/Bad-Behavior:-Handling-Database-Down
- https://github.com/brettwooldridge/HikariCP
- http://brettwooldridge.github.io/HikariCP/
