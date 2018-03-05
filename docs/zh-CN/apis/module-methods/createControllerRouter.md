## 模块方法 createControllerRouter

### 用途

创建一个可以加载控制器的路由器对象。

### 方法声明

```ts
function createControllerRouter<
    CT extends RequestContext = RequestContext
>(): this;
```

## 使用示例

```ts
import * as libHTTP from "@litert/http";

let router = libHTTP.createControllerRouter();
```
