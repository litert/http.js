# 方法装饰器工厂 Head

### 用途

该装饰器工厂用于将一个控制器方法设置为，当没有任何路由规则成功匹配时，默认的
请求处理器。

### 方法声明

```ts
function NotFound(): Core.MethodDecorator;
```

## 使用示例

```ts
import * as http from "@litert/http";

class MyControllers {

    @http.NotFound()
    public async onNotFound(ctx: http.RequestContext): Promise<void> {

        ctx.response.statusCode = 404;
        ctx.response.statusMessage = "NOT FOUND";
        ctx.response.setHeader("Context-Length", 9);
        ctx.response.end("NOT FOUND");
    }
}

export default MyControllers;
```
