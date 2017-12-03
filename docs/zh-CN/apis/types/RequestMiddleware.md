# 类型 RequestMiddleware

该类型是所有中间件函数的函数签名。

## 定义

```ts
type RequestMiddleware<CT extends RequestContext = RequestContext> = (
    context: CT,
    next: MiddlewareNextCallback
) => Promise<void>;
```

## 参数说明

-   类型参数 `CT extends RequestContext`

    指定请求上下文对象的类型，默认是 RequestContext。

- `context: RequestContext`

    请求的上下文对象。

- `next: MiddlewareNextCallback`

    请求处理链的递进回调函数，用于调用下一个中间件或者调用请求处理器。
