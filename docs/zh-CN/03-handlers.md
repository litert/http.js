# 处理器函数

> [上一节：使用路由器](./02-router.md) | [返回目录](./index.md)

处理器函数是用于处理 HTTP 请求的一个函数，它的签名如下：

```ts
type RequestHandler = (
    context: RequestContext
) => Promise<void>;
```

> 可以看出它是一个 ES2017 规范里的 async function。

每一个 HTTP 请求都必须对应一个处理器函数，如果不想处理某个请求，也必须在路由器里面
指定一个 NOT FOUND 规则来处理这些不想处理的请求。否则服务器将不知道如何处理这个请求。

从签名可以看到，这个处理器函数有一个参数，叫 context，它是一个 http.RequestContext
类型的对象。整个处理器就是通过控制 context 对象来操作这个请求，并输出数据给请求的。

本节将通过几个例子来介绍处理器函数的基本用途。

## 1. 读取 HTTP Body 数据

通过 context.request.getBody 方法，即可读取 HTTP 请求的 Body 数据。如果希望读取并
解析 JSON，则使用 context.request.getBodyAsJSON 方法。

### 1.1. 示例代码

```ts
router.post("/users/{id:uint}", async function(ctx) {

    try {

        await ctx.request.getBody();

        ctx.response.send("OK");
    }
    catch (e) {

        ctx.response.writeHead(
            http.HTTPStatus.BAD_REQUEST
        );

        ctx.response.send(e.message);
    }
});
```

### 1.2. 参考

- HTTP.ServerRequest.getBody
- HTTP.ServerRequest.getBodyAsJSON

-------------------------------------------------------------------------------

## 2. 设置 HTTP 响应 Header

通过 context.response.setHeader 即可设置响应头。也可以通过 writeHead 方法设置
并发送响应头。

### 2.1. 示例代码

```ts
router.get("/users/{id:uint}", async function(ctx) {

    ctx.response.statusCode = http.HTTPStatus.OK;
    ctx.response.statusMessage = "OK";
    ctx.response.setHeader("Content-Type", "text/plain");

    ctx.response.send("OK");
});
```

### 2.2. 参考

- HTTP.ServerResponse.setHeader
- HTTP.ServerResponse.writeHead

-------------------------------------------------------------------------------

## 3. 获取请求基本信息

主要是用过 context.request 对象的各个字段获取请求的信息：

| 字段                            | 用途                                   |
|---------------------------------|---------------------------------------|
| `context.request.host`          | 请求的域名（与端口）                    |
| `context.request.https`         | 是否 HTTPS 请求                        |
| `context.request.url`           | 请求的 URL（不包含 origin）             |
| `context.request.time`          | 服务器收到请求的时间（时间戳）           |
| `context.request.path`          | 请求的路径（不包含 QueryString）        |
| `context.request.query`         | QueryString 解码后的对象，是个哈希表    |
| `context.request.queryString`   | 请求的 QueryString                     |
| `context.request.server`        | 处理当前请求的服务器对象                |
| `context.request.aborted`       | 链接是否已经被中断                      |
| `context.request.closed`        | 链接是否已经被关闭                      |
| `context.request.ip`            | 获取客户端 IP 地址                     |

### 3.1. 示例代码

```ts
router.get("/client", async function(ctx) {

    ctx.response.statusCode = http.HTTPStatus.OK;
    ctx.response.statusMessage = "OK";
    ctx.response.setHeader("Content-Type", "text/plain");
    let content = `
IP Address:     ${ctx.request.ip}
HTTPS:          ${ctx.request.https ? "Yes" : "No"}
Request Host:   ${ctx.request.host}
Request URL:    ${ctx.request.url}
Request Path:   ${ctx.request.path}
Request Search: ${ctx.request.queryString}
Request Time:   ${new Date(ctx.request.time)}
Request Query:  ${JSON.stringify(ctx.request.query)}
`;

    ctx.response.send(content);
});
```

### 3.2. 参考

- HTTP.ServerResponse

> [下一节：中间件](./04-middlewares.md) | [返回目录](./index.md)
