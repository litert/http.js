# LiteRT/HTTP.js 快速上手

> [上一节：概述](./00-overview.md) | [返回目录](./index.md)

## 基本概念

LiteRT/HTTP.js 包含以下几个基本元素：

### 1. 服务器

服务器是一个用来监听 HTTP(S) 请求的对象，它把所有来自客户端的请求，全部分发到各个
处理器。

### 2. 路由器

路由器是一个规则集合体，它负责根据请求的 URL 指定由哪个处理器来处理这个请求，同时它还
负责分配中间件。

### 3. 处理器

处理器就是用来处理来自前端请求的一个函数。

### 4. 中间件

中间件是指在调用处理器之前进行预处理，或者在调用处理器之后进行收尾工作的函数。

## Demo I: 第一个 HTTP 服务器

```ts
// File: demo-01-simple-http.ts
import * as http from "@litert/http";

/**
 * 创建路由器对象
 */
let router = http.createRouter();

/**
 * 添加一个处理器，对 URL == "/" 的请求进行处理。
 */
router.get("/", async function(context) {

    context.response.send("Hello world");

}).notFound(async function(context) {

    /**
     * 添加一个处理器，对所有未注册的请求进行处理。
     */

    // 设置 HTTP 状态码为 404 NOT FOUND
    context.response.writeHead(
        http.HTTPStatus.NOT_FOUND,
        "NOT FOUND"
    );

    // 输出 NOT FOUND
    context.response.send("NOT FOUND");
});

/**
 * 创建一个监听 0.0.0.0:8080 端口的 HTTP 服务器，并指定使用 router 对象作为路由器。
 */
let server = http.createServer({
    "port": 8080,
    "router": router
});

// 启动服务器
server.start().then(() => {

    console.log("服务器成功启动");

}).catch((e) => {

    console.error(e);

});

```

运行以上脚本，如果看到提示“服务器成功启动”则表示服务器已经顺利启动了，下面可以试试通过
浏览器访问 http://127.0.0.1:8080/ 看看显示什么？

## Demo II: 使用中间件

前面说了，中间件可以用于在调用请求处理器之前进行预处理工作，或者在调用处理器结束后进行
收尾工作。那么现在我们就来试试，在 Demo I 的基础上添加一个中间件：

```ts
// File: demo-02-middleware.ts
import * as http from "@litert/http";

/**
 * 创建路由器对象
 */
let router = http.createRouter();

/**
 * 添加一个中间件，用于记录每一条请求。
 */
router.use(async function(context, next) {

    const req = context.request;

    // 记录每条访问记录开始时间。
    console.log(`${req.method} ${req.path} started at ${new Date(req.time)}`);

    /**
     * 因为是异步的，因此需要调用一个 next 回调，使之继续执行下一个
     * 中间件或者处理器。
     */
    await next();

    /**
     * 执行到这里，后面的中间件和处理器中已经执行完毕了。
     * 
     * 因此 next 回调最大的用途是可以确保下级中间件和处理器都执行完了
     * 之后，还能再次回到这个中间件，从而进行请求结束的收尾工作。
     */

    // 记录每条访问记录结束时间。
    console.log(`${req.method} ${req.path} ended at ${new Date(req.time)}`);

}).get("/", async function(context) {

    /**
     * 添加一个处理器，对 URL == "/" 的请求进行处理。
     */

    // 只输出一句 "Hello world"
    context.response.send("Hello world");

}).notFound(async function(context) {

    /**
     * 添加一个处理器，对所有未注册的请求进行处理。
     */

    // 设置 HTTP 状态码为 404 NOT FOUND
    context.response.writeHead(
        http.HTTPStatus.NOT_FOUND,
        "NOT FOUND"
    );

    // 输出 "NOT FOUND"
    context.response.send("NOT FOUND");
});

/**
 * 创建一个监听 0.0.0.0:8080 端口的 HTTP 服务器，并指定使用 router 对象作为路由器。
 */
let server = http.createServer({
    "port": 8080,
    "router": router
});

// 启动服务器
server.start().then(() => {

    console.log("服务器成功启动");

}).catch((e) => {

    console.error(e);

});

```

编译并执行，然后在浏览器里一次打开下面三个链接，看看调试控制台显示什么？

- http://127.0.0.1/
- http://127.0.0.1/hello
- http://127.0.0.1/world/

## Demo III: 创建 HTTPS 服务器

创建 HTTPS 服务器也非常简单，直接在 Demo I 的基础上，往 createServer 方法的 `ssl`
选项里指定两个字段：

- `key` SSL 私钥内容
- `certificate` SSL 证书内容

> 如果私钥是加密的，那么可以通过字段 `passphrase` 指定私钥的密码。

```ts
// File: demo-02-https-server.ts
import * as http from "@litert/http";
import fs = require("fs");

/**
 * 创建路由器对象
 */
let router = http.createRouter();

/**
 * 添加一个处理器，对 URL == "/" 的请求进行处理。
 */
router.get("/", async function(context) {

    context.response.send("Hello world");

}).notFound(async function(context) {

    /**
     * 添加一个处理器，对所有未注册的请求进行处理。
     */

    // 设置 HTTP 状态码为 404 NOT FOUND
    context.response.writeHead(
        http.HTTPStatus.NOT_FOUND,
        "NOT FOUND"
    );

    // 输出 NOT FOUND
    context.response.send("NOT FOUND");
});

/**
 * 创建一个监听 0.0.0.0:8080 端口的 HTTPS 服务器，并指定使用 router 对象作为路由器。
 */
let server = http.createServer({
    "port": 8080,
    "router": router,
    "ssl": {
        // "passphrase": "password", // 指定 SSL 私钥的密码
        "key": fs.readFileSync("/path/to/private-key.pem"),
        "certificate": fs.readFileSync("/path/to/cert.pem")
    }
});

// 启动服务器
server.start().then(() => {

    console.log("服务器成功启动");

}).catch((e) => {

    console.error(e);

});
```

> [下一节：使用路由器](./02-router.md) | [返回目录](./index.md)
