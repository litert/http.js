# 方法装饰器工厂 Head

### 用途

该装饰器工厂用于给控制器方法添加 HTTP HEAD 方法的路由规则。

### 方法声明

```ts
function Head(
    path: string | RegExp,
    data?: Core.IDictionary<any>
): Core.MethodDecorator;
```

## 参数说明

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

    @http.Head("/")
    public async homepage(ctx: http.RequestContext): Promise<void> {

        ctx.response.end("hello");
    }
}

export default MyControllers;
```
