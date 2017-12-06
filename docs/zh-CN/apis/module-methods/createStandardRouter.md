## 模块方法 createStandardRouter

### 用途

创建一个 HTTP 标准路由器对象。

### 方法声明

```ts
function createStandardRouter<
    CT extends RequestContext = RequestContext
>(): this;
```

## 使用示例

```ts
import * as libHTTP from "@litert/http";

let router = libHTTP.createStandardRouter();
```
