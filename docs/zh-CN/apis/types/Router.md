# 抽象接口 Router

## 说明

这个抽象接口描述通用路由器对象提供的方法接口。

## 接口定义

```ts
interface Router {

    route(
        method: HTTPMethod,
        path: string,
        context: RequestContext
    ): RouteResult;
}
```

## 方法介绍

> 根据方法名称按字母表顺序排列。

### 方法 route

该方法提供给 Server 对象调用，用于进行请求匹配。

#### 方法声明

```ts
function route(
    method: HTTPMethod,
    path: string,
    context: RequestContext
): RouteResult;
```

#### 参数说明

- `method: HTTPMethod`

    要进行匹配的请求路径方法。

- `path: string`

    要进行匹配的请求路径（已去除尾部 `/`）

- `context: RequestContext`

    请求的上下文对象。

    > 参考 [RequestContext](./RequestContext.md)。

#### 返回值

返回一个 [RouteResult](./RouteResult.md) 对象。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。
