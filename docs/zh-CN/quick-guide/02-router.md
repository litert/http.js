# 使用路由器

> [上一节：快速上手](./01-quick-start.md) | [返回目录](../index.md)

## 0. 简介

路由器是一个规则集合体，它负责根据请求的 URL 指定由哪个处理器来处理这个请求。

> 路由器也负责设置中间件，这将在下一节中讨论。

LireRT/HTTP 提供的路由机制支持 3 种类型的 URI 匹配规则，以及完整的 HTTP 方法支持。

> 注意：此处的 URI 是指 URI 的 Path 部分，不包含 Query String。

## 1. 通过字符串匹配

直接使用一个裸字符串作为 URI 匹配规则。

```ts
router.get("/", async function(ctx) {

    ctx.response.send("welcome to home page");
});
```

如上规则，可以适配一个 `GET /?a=xx&b=xx` 请求类似的请求，但是不能适配 `GET //?a=xx`
之类的请求。

字符串匹配是大小写敏感的，因此 `GET /a` 和 `GET /A` 不被当成同一个请求，须写成

```ts
router.get("/a", async function(ctx) {

    ctx.response.send("welcome to page a");

}).get("/A", async function(ctx) {

    ctx.response.send("welcome to page A");
});
```

> 注：对于 URI 尾部的反斜杠 "/"，路由会自动去除，因此在编写路由规则的时候不需要
> 填写尾部反斜杠，下同。
>
> **但是直接请求 `/` 除外。**

## 2. 通过正则表达式匹配

与字符串匹配类似，只需将字符串替换成正则表达式即可，例如：

```ts
router.get(/^\/\d+$/, async function(ctx) {

    ctx.response.send("You are visiting a number page.");
})
```

> 使用正则表达式需要注意转义特殊字符。

这个规则可以匹配任何 `GET /123` （123可替换为任何正整数）的请求。

考虑到在 JavaScript 的正则表达式里面，`/` 是作为正则定界符的，书写的时候需要转义，
因此建议使用 RegExp 构造式，上面的例子可改写如下：

```ts
router.get(new RegExp("^/\\d+$"), async function(ctx) {

    ctx.response.send("You are visiting a number page.");
})
```

如果正则表达式内有子表达式（被括号括起来的部分），这部分子表达式的匹配结果可以通过
`context.params` 读取出来，此时的 `context.params` 是一个数组，例如：

```ts
router.get(new RegExp("^/users/(\\d+)$"), async function(ctx) {

    ctx.response.send(`Your ID is ${ctx.params[0]}`);
})
```

> 此时 `context.params` 元素的下标从 0 开始，与 String.prototype.match 结果不同。

> ### **路由的先入优先原则**
>
> 如果存在两个这样的正则匹配规则：
>
> - `router.get(new RegExp("^/users/\\d+$"), handler1);`
> - `router.get(new RegExp("^/users/\\w+$"), handler2);`
>
> 那么对于请求 GET /users/123 ，是执行 handler1 还是 handler2 呢？
>
> 在 LiteRT/HTTP 中，对于每个请求可以有多个中间件，但是只有一个处理器函数。因此
> 处理器函数 handler1 和 handler2 中肯定只有一个会被执行，这个就取决于匹配顺序。
>
> **对于正则表达式和参数表达式，先添加的规则优先匹配。**
>
> 所以上面这个例子， handler1 会被执行。
>
> 如果换成是中间件，则两个都会被（按添加顺序）执行。

## 3. 通过参数表达式匹配

很多时候，如果只用正则表达式或字符串，不能快捷地提取 URI 中的参数，因此 LiteRT/HTTP 
提供了一种简单的匹配方式，叫参数表达式。例如要匹配 `GET /users/123` 并提取其中的 123
作为参数 `id`，就可以使用参数表达式了：

> 虽然参数表达式也是字符串，但是路由器会自动判断是否包含参数规则。

```ts
router.get("/users/{id:uint}", async function(ctx) {

    ctx.response.send(`Your ID is ${ctx.params.id}.`);
});

router.get("/users/{name:string}", async function(ctx) {

    ctx.response.send(`Your name is ${ctx.params.name}.`);
});
```

[参数表达式匹配]: ../apis/types/StandardRouter.md#参数表达式匹配

具体请参考[路由器：参数表达式匹配][参数表达式匹配]。

## 4. 使用不同的 HTTP 方法

前面我们都只使用了 HTTP GET 方法，其实还有很多 HTTP 方法可以使用，包括：

- GET
- POST
- PUT
- TRACE
- DELETE
- OPTIONS
- HEAD
- PATCH
- COPY
- LOCK
- UNLOCK
- MOVE
- MKCOL
- PROPFIND
- PROPPATCH
- REPORT
- MKACTIVITY
- CHECKOUT
- MERGE
- M-SEARCH
- NOTIFY
- SUBSCRIBE
- UNSUBSCRIBE

正确的注册方法是用处理器规则注册函数 `StandardRouter.register`，该函数的签名为：

```ts
type RegisterMethod = (
    method: HTTPMethod,
    path: string | RegExp,
    handler: RequestHandler,
    data?: IDictionary<any>
) => StandardRouter;
```

使用示例：

```ts
router.register("DELETE", "/users", async function(ctx) {

    // do something
});

router.register("NOTIFY", "/users", async function(ctx) {

    // do something
});
```

上面的 GET/POST/PUT/TRACE/DELETE/OPTIONS/HEAD 是 HTTP/1.1 的标准方法（其他均是
WebDAV 的扩展方法），因此他们可以通过快捷函数（以方法的小写名称作为函数名）注册，
签名如下：

```ts
type RegisterShortcutMethod = (
    path: string | RegExp,
    handler: RequestHandler,
    data?: IDictionary<any>
) => StandardRouter;
```

调用示例：

```ts
router.get("/users", async function(ctx) {

    // do something
});

router.put("/users/{id:uint}", async function(ctx) {

    // do something
});

router.delete("/users/{id:uint}", async function(ctx) {

    // do something
});

router.patch("/users/{id:uint}", async function(ctx) {

    // do something
});
```

> 由于 HTTP/1.1 的标准方法 CONNECT 无法用于通用请求，于是将比较常用的 WebDav 方法
> PATCH 补充进去，因此 PATCH 也有快捷注册。
>
> 其他 WebDAV 方法则必须使用 register 函数注册。
>
> 这些用于添加请求处理器规则的函数统称为**路由注册函数**


## 5. 处理 NOT FOUND

对于其他不想处理的请求，可以将他们全部由一个处理器函数来处理：

```ts
router.notFound(async function(ctx) {

    ctx.response.writeHead(
        http.HTTPStatus.NOT_FOUND,
        "FILE NOT FOUND"
    );

    ctx.response.end();
});
```

## 小结

[路径规则]: ../apis/types/StandardRouter.md#路径匹配规则

以上即为路由器的实用示例，更多请参考[路由器路径匹配规则][路径规则]。

> [下一节：处理器函数](./03-handlers.md) | [返回目录](../index.md)
