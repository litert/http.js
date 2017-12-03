## 模块方法 createDefaultContext

### 用途

创建一个默认的 HTTP 请求上下文对象。

> 这个函数是默认的上下文对象工厂函数。

### 方法声明

```ts
let createDefaultContext: ContextCreator;
```

## 使用示例

```ts
import * as libHTTP from "@litert/http";

let router = libHTTP.createStandardRouter();

let server = libHTTP.createServer({
    "router": router,
    "contextCreator": libHTTP.createDefaultContext
});
```
