# 方法装饰器工厂 Route

### 用途

该装饰器工厂用于给控制器方法添加指定 HTTP 方法的路由规则。

> 只有 HTTP/1.1 标准方法（以及 PATCH）含有单独的装饰器工厂函数，其他 WebDav 方法的
> 路由规则都只能使用 Route 装饰器注册。

### 方法声明

```ts
function Route(
    method: HTTPMethod,
    path: string | RegExp,
    data?: Core.IDictionary<any>
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

### 参数 data

```ts
let data?: Core.IDictionary<any>;
```

（可选参数）data 参数用于配置该类请求的上下文初始数据。

## 使用示例

```ts
import * as http from "@litert/http";

class MyControllers {

    @http.Route("MOVE", "/")
    public async homepage(ctx: http.RequestContext): Promise<void> {

        ctx.response.end("hello");
    }
}

export default MyControllers;
```
