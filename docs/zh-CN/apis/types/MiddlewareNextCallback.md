# 类型 MiddlewareNextCallback

该类型是所有中间件函数参数中 Next 回调函数的签名。

请求处理链的递进回调函数，用于调用下一个中间件或者调用请求处理器。

## 定义

```ts
type MiddlewareNextCallback = (end?: boolean) => Promise<void>;
```

## 参数说明

- `end: boolean = true`

    设置为 true 则终止请求处理链，不再执行下一个中间件和请求处理器。
