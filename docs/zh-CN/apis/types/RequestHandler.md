# 类型 RequestHandler

该类型是所有处理器函数的函数签名。

## 定义

```ts
type RequestHandler<CT extends RequestContext = RequestContext> = (
    context: CT
) => Promise<void>;
```

## 参数说明

-   类型参数 `CT extends RequestContext`

    指定请求上下文对象的类型，默认是 RequestContext。

-   `context: RequestContext`

    请求的上下文对象。
