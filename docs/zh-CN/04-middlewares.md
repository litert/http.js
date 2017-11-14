# 中间件函数

> [上一节：处理器函数](./03-handlers.md) | [返回目录](./index.md)

中间件是指在调用处理器之前进行预处理，或者在调用处理器之后进行收尾工作的函数。
为什么需要中间件呢？举个例子，你所有的请求都需要进行登陆验证，难道你要在所有的处理器
函数中都写一遍登陆验证吗？当然不想。

中间件是用来做这种事情的——在执行处理器函数之前，对请求进行预处理，或者拦截，或者在
处理器函数执行完毕之后，进行收尾工作——例如记录访问日志。

> 中间件函数可以有多个，按照注册顺序调用，形成一个队列，这叫**请求处理链**。
> 在**请求处理链**中，先执行的叫**上级中间件**，后执行的叫**下级中间件**。
> 处理器函数其实也是一个特殊的中间件，只是它没有 `next` 回调。所以处理器函数也是
> **请求处理链**的一部分。

先来看看中间件函数的签名：

```ts
type RequestMiddleware = (
    context: RequestContext,
    next: MiddlewareNextCallback
) => Promise<void>;

type MiddlewareNextCallback = (end?: boolean) => Promise<void>;
```

与处理器函数对比下，唯一的区别就是，中间件函数的参数多了一个 next 回调函数，它的用途
是什么呢？很简单，就是调用下一个中间件函数——如果没有下一个中间件函数，那就调用处理器
函数。

可以看出 `next` 回调也是 async function，因此可以通过 await 语法等待它执行完毕，于是
我们得到函数调用堆栈图如下：（A、B、C 都是中间件）

```
请求开始 → A → B → C
                  ↓
               Handler
                  ↓
请求结束 ← A ← B ← C
```

对于某个中间件，在 `await next();` 之后，这个中间件后面的所有中间件函数和处理器函数
都已经调用完毕了，当前中间件就可以进行收尾工作了。

此外，我们注意到 `next: MiddlewareNextCallback` 回调是有一个可选参数 `end` 的。
如果传递一个 `true` 给 `next`，则会终止**请求处理链**，也就是说后面的中间件和处理器
函数都不会被执行了，直接终结在当前中间件。这个功能可以用于防火墙之类的功能，或者用于
维护状态检测等等。

-------------------------------------------------------------------------------

## Demo I: 第一个中间件

根据上面说的，先来写一个中间件试试手，就做打印访问日志功能吧。

```ts
router.use(async function(context, next) {

    console.log(`Visited ${context.url}`);

    await next(); // next 是必须调用的，具体原因看下文。
});
```

在路由器设置里加入这么一句，就可以了。

试试访问页面，看看服务器调试控制台里会打印什么？

-------------------------------------------------------------------------------

## Demo II: 更完整的日志

按照 Demo I，实现了简单的日志打印，但是却无法打印出执行的结果。试想 Nginx 等服务器的
日志都是很详细的。那要怎么做呢？答案很简单：

```ts
router.use(async function(ctx, next) {

    await next();

    // 想想 next 回调的用途。

    // 把记录写到 await next(); 后面，就可以了。

    console.log(`Visited ${ctx.url}`);
    console.log(`Response: ${ctx.response.statusCode} ${ctx.response.statusMessage}`);
});
```

-------------------------------------------------------------------------------

## Demo III: 错误处理

在处理器函数和中间件函数中遇到错误了怎么办？ JavaScript 中所有错误都是通过异常抛出的。
这里也不例外，对于 async function，可以通过 try catch 捕获下级中间件和处理器函数抛出
的异常。

```ts

router.use(async function(ctx, next) {

    try {

        await next();
    }
    catch (e) {

        if (!ctx.response.headersSent) {

            ctx.response.writeHead(http.HTTPStatus.INTERNAL_SERVER_ERROR);
        }

        ctx.end();

        console.error(e);
    }

}).use(async function(ctx, next) {

    // 在 async function 中，返回一个 Rejected Promise 就是向上抛出异常。

    return Promise.reject(new Error("test error"));
});
```

因为异常只能往上传递，因此只有上级中间件才能捕获到下级中间件和处理器函数抛出的异常。
捕获的方式就是对 next 回调 try catch。

-------------------------------------------------------------------------------

## Demo IV: 定向中间件

很多时候，并不是所有的中间件都要被调用的，比如只对 GET 请求或 POST 请求生效的中间件，
或者只对 /admin/ 路径下的请求生效的中间件。

这里可以用以下几种方式设置中间件的筛选条件：

```ts
router.use(async function(ctx, next) {

    // 处理所有的请求
    await next();

}).use("GET", async function(ctx, next) {

    // 只处理 GET 请求
    await next();

}).use("POST", async function(ctx, next) {

    // 只处理 POST 请求
    await next();

}).use("POST", "/admin/{rest:any}", async function(ctx, next) {

    // 只处理 /admin/ 路径下的 POST 请求
    await next();

}).use("/articles/{rest:any}", async function(ctx, next) {

    // 只处理 /articles/ 路径下的请求
    await next();
});
```

> 参考 `http.RequestMiddleware.use` 的多种定义。

-------------------------------------------------------------------------------

## Demo V: 从处理器给中间件配置参数

这个标题可能比较难以理解，因为中间件是在处理器函数前面执行的，如何从处理器给中间件配置
参数呢？事实上这是指根据处理器规则，配置请求的 `context.data` 字段的默认数据。中间件
可以随意访问 `context` 对象，自然也可以随意访问 `context.data` 的数据了。
（可以通过**路由注册函数**的最后一个参数设置）

这个有什么用呢？比如说，有的请求需要检验登陆状态，有的请求不需要检验登陆状态，那就可以
根据这个需求设置一个 `require-login` 标志。然后在中间件里通过判断 `require-login`
标志决定是否要检测登陆状态。

示例代码如下：

```ts
router.use(async function(context, next) {

    if (context.data["require-login"]) {

        /**
         * 检测当前客户端的登陆状态。
         */
        if (login()) {

            await next();
        }
        else {

            context.response.writeHead(
                http.HTTPStatus.UNAUTHORIZED
            );

            context.response.send("Please login first.");

            /**
             * 未登录，终止请求处理链，不再往下执行。
             */
            await next(true);
        }
    }
    else {

        await next();
    }
}).get("/login", async function(ctx) {

    // 登陆页面当然不需要登陆就可以访问了。
    
}).get("/admincp", async function(ctx) {
    
    // 管理页面是需要登陆才能访问的

}, {
    "require-login": true
})
```

> [下一节：API 文档](./api-index.md) | [返回目录](./index.md)
