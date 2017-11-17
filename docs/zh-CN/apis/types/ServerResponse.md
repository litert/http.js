# 抽象接口 ServerResponse

## 说明

[ServerResponse]: https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_serverresponse

这个抽象接口描述当前 HTTP 请求的响应控制对象。

> 方法继承自 Node.js 原生 http 模块的 ServerResponse 类。
>
> 因此本章节仅介绍扩展的方法，原生接口请参考[官方文档][ServerResponse]。

## 接口定义

```ts
import nodeHTTP = require("http");

interface ServerResponse extends nodeHTTP.ServerResponse {

    redirect(target: string, statusCode?: number): ServerResponse;

    sendJSON(data: any): ServerResponse;

    send(data: string | Buffer): ServerResponse;
}
```

## 方法介绍

> 根据方法名称按字母表顺序排列。

------------------------------------------------------------------------------

### 方法 redirect

该方法发送一个 HTTP 跳转响应给客户端。

#### 方法声明

```ts
function redirect(target: string, statusCode?: number): ServerResponse;
```

#### 参数说明

- `target: string`

    跳转的目标 URL/URI。

- `statusCode: number`

    指定返回的状态码（从而指定跳转方式）。

    默认值是 `http.HTTPStatus.TEMPORARY_REDIRECT`。(HTTP 307 TEMPORARY REDIRECT)

#### 返回值

返回该对象本身。

#### 错误处理

当请求响应的 HTTP 头已经发送时，方法执行失败，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 send

该方法发送响应数据给客户端，并关闭链接。

如果此时 HTTP 头尚未发送，则该方法会自动设置 Content-Type 头。

#### 方法声明

```ts
function send(data: string | Buffer): ServerResponse;
```

#### 参数说明

- `data: string | Buffer`

    要发送的数据。

#### 返回值

返回该对象本身。

#### 错误处理

当请求已经关闭时，方法执行失败，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 sendJSON

该方法将响应数据进行 JSON 编码，然后发送给客户端，并关闭链接。

如果此时 HTTP 头尚未发送，则该方法会自动设置 Content-Type 头。

#### 方法声明

```ts
function sendJSON(data: any): ServerResponse;
```

#### 参数说明

- `data: any`

    要发送的数据。

#### 返回值

返回该对象本身。

#### 错误处理

当请求已经关闭时，方法执行失败，抛出一个 http.Exception 类型的错误。
