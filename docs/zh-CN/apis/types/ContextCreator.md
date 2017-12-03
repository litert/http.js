# 类型 ContextCreator

该类型定义一个上下文对象工厂函数的签名。

## 定义

```ts
type ContextCreator<T extends RequestContext> = (
    request: ServerRequest,
    response: ServerResponse
) => T;
```

## 参数说明

-   `request: ServerRequest`

    一个请求的请求控制对象。

-   `response: ServerResponse`

    一个请求的响应控制对象。
