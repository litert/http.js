# LiteRT/HTTP.js 快速上手

> [上一节：概述](./00-overview.md) | [返回目录](../index.md)

## 基本概念

LiteRT/HTTP.js 包含以下几个基本元素：

### 1. 服务器

服务器是一个用来监听 HTTP(S) 请求的对象，它把所有来自客户端的请求，全部分发到各个
处理器。

### 2. 路由器

路由器是一个规则集合体，它负责根据请求的 URL 指定由哪个处理器来处理这个请求，同时它还
负责分配中间件。

### 3. 处理器函数

处理器函数是用来处理来自前端请求的一个函数。

### 4. 中间件

中间件是指在调用处理器之前进行预处理，或者在调用处理器之后进行收尾工作的函数。

## Demo I: 第一个 HTTP 服务器

```ts
// File: demo-01-simple-http.ts
import * as http from "@litert/http";

/**
 * 创建路由器对象
 */
let router = http.createStandardRouter();

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
    "port": 8080, // 可选参数，默认 80
    "host": "0.0.0.0", // 可选参数，默认 0.0.0.0
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
let router = http.createStandardRouter();

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

编译并执行，然后在浏览器里依次打开下面三个链接，看看调试控制台显示什么？

- http://127.0.0.1:8080/
- http://127.0.0.1:8080/hello
- http://127.0.0.1:8080/world/

## Demo III: 创建 HTTPS 服务器

创建 HTTPS 服务器也非常简单，直接在 Demo I 的基础上，往 createServer 方法的 `ssl`
选项里指定两个字段：

- `key` SSL 私钥内容
- `certificate` SSL 证书内容

> 如果私钥是加密的，那么可以通过字段 `passphrase` 指定私钥的密码。

```ts
// File: demo-03-https-server.ts
import * as http from "@litert/http";
import fs = require("fs");

/**
 * 创建路由器对象
 */
let router = http.createStandardRouter();

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
        "key": fs.readFileSync("/path/to/private-key.pem"), // 从文件读取私钥
        "certificate": fs.readFileSync("/path/to/cert.pem") // 从文件读取证书
    }
});

// 启动服务器
server.start().then(() => {

    console.log("服务器成功启动");

}).catch((e) => {

    console.error(e);

});
```

现在可以访问 https://127.0.0.1:8080/ 看看效果了。

> 如果你的证书是自签名证书，那么浏览器可能会报警，选择“仍然访问”即可。

## Demo IV: 使用 Cookies

LiteRT/HTTP.js 内置了 Cookies 编解码器，使用方式很简单。

```ts
// File: demo-04-cookies.ts
import * as http from "@litert/http";

/**
 * 创建路由器对象
 */
let router = http.createStandardRouter();

/**
 * 添加一个中间件，用于记录每一条请求。
 */
router.use(async function(context, next) {

    const req = context.request;

    // 读取 Cookies
    req.loadCookies();

    // 将 Cookies 打印出来。
    console.log(req.cookies);

    await next();

}).get("/", async function(context) {

    /**
     * 写入一个 age=32 的 Cookie。
     */
    context.response.setCookie({
        "name": "age",
        "value": "32"
    });

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
 * 创建一个标准 HTTP Cookies 编解码器对象。
 */
let cookies = http.createStandardCookiesEncoder();

/**
 * 创建一个监听 0.0.0.0:8080 端口的 HTTP 服务器，并指定使用 router 对象作为路由器。
 */
let server = http.createServer({
    "port": 8080,
    "router": router,
    "plugins": {

        "parser:cookies": cookies // 将 Cookies 编解码器对象注入到服务器。
    }
});

// 启动服务器
server.start().then(() => {

    console.log("服务器成功启动");

}).catch((e) => {

    console.error(e);

});

```

编译并执行，然后在浏览器里打开，看看调试控制台显示什么？

## Demo V: 使用挂载点

举个例子，我们希望有一个 HTTP 站点，有如下需求：

- 默认请求由子系统 A 处理
- 凡是 URI 以 `/admin` 开头的由子系统 B 处理
- 凡是 URI 以 `/statics` 开头的由子系统 C 处理

这个时候，我们可以用服务器的挂载点功能。

> 挂载点是指将某个“虚拟目录”下的请求全部交给另一个服务器对象去处理，而这个“虚拟目录”
> 就叫挂载点。

```ts
// File: demo-05-mount-points.ts
import * as http from "@litert/http";

/**
 * 创建路由器对象 A
 */
let routerA = http.createStandardRouter();

routerA.get("/", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system A ${req.realPath}. (Request Path: ${req.path})`);

}).get("/a", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system A ${req.realPath}. (Request Path: ${req.path})`);
});

/**
 * 创建路由器对象 B，虽然真实 URI 是以 /admin 开头，但是作为挂载点，前缀会被自动
 * 去除。因此 /admin 前缀不需要在路由中填写。
 */
let routerB = http.createStandardRouter();

routerB.get("/", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system B ${req.realPath}. (Request Path: ${req.path})`);

}).get("/a", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system B ${req.realPath}. (Request Path: ${req.path})`);
});

/**
 * 创建路由器对象 C，虽然真实 URI 是以 /statics 开头，但是作为挂载点，前缀会被自动
 * 去除。因此 /statics 前缀不需要在路由中填写。
 */
let routerC = http.createStandardRouter();

routerC.get("/", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system C ${req.realPath}. (Request Path: ${req.path})`);

}).get("/a", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system C ${req.realPath}. (Request Path: ${req.path})`);
});

let serverC = http.createMountableServer({
    "router": routerC
});

let serverB = http.createMountableServer({
    "router": routerB
});

/**
 * 创建一个监听 0.0.0.0:8080 端口的 HTTP 服务器，并指定使用 router 对象作为路由器。
 */
let serverA = http.createMountableServer({
    "port": 8080,
    "router": routerA,
    "mounts": {
        "/admin": serverB,
        "/statics": serverC
    }
});

// 启动服务器
serverA.start().then(() => {

    console.log("服务器成功启动");

}).catch((e) => {

    console.error(e);
});
```

编译并执行，然后在浏览器里访问如下链接，看看效果如何？

- http://127.0.0.1:8080/
- http://127.0.0.1:8080/a
- http://127.0.0.1:8080/admin
- http://127.0.0.1:8080/admin/a
- http://127.0.0.1:8080/statics
- http://127.0.0.1:8080/statics/a

> [下一节：使用路由器](./02-router.md) | [返回目录](../index.md)
