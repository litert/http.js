# 方法装饰器工厂 Route

### 用途

该装饰器工厂将类的一个静态方法设置为一个中间件处理器。

> 中间件处理器必须是类的静态方法。

### 方法声明

```ts
function Middleware(priority: number = 10): Core.MethodDecorator;

function Middleware(
    method: HTTPMethod | HTTPMethod[],
    priority: number = 10
): Core.MethodDecorator;

function Middleware(
    path: string | RegExp | Array<string | RegExp>,
    priority: number = 10
): Core.MethodDecorator;

function Middleware(
    method: HTTPMethod | HTTPMethod[],
    path: string | RegExp | Array<string | RegExp>,
    priority: number = 10
): Core.MethodDecorator;
```

## 参数说明

### 参数 method

```ts
let method: HTTPMethod;
```

method 参数用于指定路由规则匹配的 HTTP 协议方法。

### 参数 path

```ts
let path: string | RegExp;
```

path 参数用于指定路由规则的匹配路径，支持字符串匹配、正则表达式匹配、参数表达式匹配以及
通配符表达式匹配。

### 参数 priority

```ts
let priority: number = 10;
```

priority 参数用于指定中间件的优先级，优先级高的中间件会被先执行。

## 使用示例

```ts
import * as http from "@litert/http";

class MyControllers {

    @http.Middleware()
    public static async logger(
        ctx: http.RequestContext
        next: http.MiddlewareNextCallback
    ): Promise<void> {

        const req = ctx.request;
        const resp = ctx.response;

        console.log(`Requested ${req.method} ${req.path}`);

        await next();

        console.log(`Responsed ${resp.statusCode} ${resp.statusMessage}`);
    }

    @http.Middleware("GET", "/statics/*")
    public static async logger(
        ctx: http.RequestContext
        next: http.MiddlewareNextCallback
    ): Promise<void> {

        const req = ctx.request;

        console.log(`Requested static file ${req.path}`);

        await next();
    }
}

export default MyControllers;
```
