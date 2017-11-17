# 抽象接口 RequestContext

## 说明

该抽象接口描述 HTTP 请求的上下文对象。

## 接口定义

```ts
interface RequestContext {

    "request": ServerRequest;

    "response": ServerResponse;

    "data": IDictionary<any>;

    "params": IDictionary<any>;
}
```

## 属性介绍

> 根据属性名称按字母表顺序排列。

------------------------------------------------------------------------------

### 属性 data

data 属性是当前 HTTP 请求的上下文数据。

[Data教程]: ../../quick-guide/04-middlewares.md#demo-v-从处理器给中间件配置参数

> 参考[中间件教程：从处理器给中间件配置参数][Data教程]的第2节和第3节。

```ts
let data: IDictionary<any>;
```

------------------------------------------------------------------------------

### 属性 params

params 属性是当前 HTTP 请求的路由解析参数。

> 参考[路由器教程](../../quick-guide/02-router.md)的第2节和第3节。

```ts
let params: IDictionary<any> | any[];
```

------------------------------------------------------------------------------

### 属性 request

request 属性是当前 HTTP 请求的请求控制对象。

```ts
let request: ServerRequest;
```

------------------------------------------------------------------------------

### 属性 response

response 属性是当前 HTTP 请求的响应控制对象。

```ts
let response: ServerResponse;
```
