# 抽象接口 RouteResult

## 说明

该抽象接口描述路由器匹配当前请求的匹配结果。

## 接口定义

```ts
interface RouteResult {

    "middlewares": RequestMiddleware[];

    "handler": RequestHandler;
}
```

## 属性介绍

> 根据属性名称按字母表顺序排列。

------------------------------------------------------------------------------

### 属性 handler

handler 属性是该请求处理链中的处理器函数。

```ts
let handler: RequestHandler;
```

------------------------------------------------------------------------------

### 属性 middlewares

middlewares 属性包含该请求处理链中的所有中间件函数。

```ts
let middlewares: RequestMiddleware[];
```
