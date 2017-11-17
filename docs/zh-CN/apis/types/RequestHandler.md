# 类型 RequestHandler

该类型是所有处理器函数的函数签名。

## 定义

```ts
export type RequestHandler = (
    context: RequestContext
) => Promise<void>;
```

## 参数说明

- `context: RequestContext`

    请求的上下文对象。
