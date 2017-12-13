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
import * as http from "@litert/http";

interface ServerResponse extends nodeHTTP.ServerResponse {

    "server": http.Server;

    redirect(target: string, statusCode?: number): this;

    sendJSON(data: any): this;

    send(data: string | Buffer): this;

    setCookie(
        name: string,
        value: string,
        ttl?: number,
        httpOnly?: boolean,
        secureOnly?: boolean,
        path?: string,
        domain?: string
    ): this;

    setCookie(
        cookie: SetCookieConfiguration
    ): this;
}
```

## 属性介绍

------------------------------------------------------------------------------

### 属性 server

server 属性用于获取当前响应控制对象所属的 Server 对象。

```ts
let server: http.Server;
```

## 方法介绍

> 根据方法名称按字母表顺序排列。

------------------------------------------------------------------------------

### 方法 redirect

该方法发送一个 HTTP 跳转响应给客户端。

#### 方法声明

```ts
function redirect(target: string, statusCode?: number): this;
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
function send(data: string | Buffer): this;
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
function sendJSON(data: any): this;
```

#### 参数说明

- `data: any`

    要发送的数据。

#### 返回值

返回该对象本身。

#### 错误处理

当请求已经关闭时，方法执行失败，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 setCookie

该方法将指定的 Cookies 添加到 HTTP 响应头中。

如果此时 HTTP 头尚未发送，则该方法会自动设置 Content-Type 头。

[AAA]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

> [查看 HTTP Set-Cookie 头参考文档][AAA]

#### 方法声明

```ts
function setCookie(
    name: string,
    value: string,
    ttl?: number,
    httpOnly?: boolean,
    secureOnly?: boolean,
    path?: string,
    domain?: string
): this;

function setCookie(
    cookie: SetCookieConfiguration
): this;
```

#### 参数说明

> 如果使用 StandardCookiesEncoder，则下列参数的默认值可能会被
> StandardCookiesEncoder 改写。

- `name: string`

    Cookie 的名称。

- `value: string`

    Cookie 的内容。

- `ttl: number = 0`

    （可选参数）

    Cookie 的有效期。

    > - 设置为负数，则使 Cookie 立即过期。
    > - 设置为 0，则使 Cookie 在会话期间有效。
    > - 该字段将同时设置 Cookie 的 Expires 和 Max-Age 属性。

- `httpOnly: boolean = false`

    （可选参数）

    设为 true 则使 Cookie 为 HttpOnly 的。

- `secureOnly: boolean = false`

    （可选参数）

    设为 true 使 Cookie 为 Secure 的。

- `path: string = "/"`

    （可选参数）

    设置 Cookie 的有效路径。

- `domain: string`

    （可选参数）

    设置 Cookie 的有效域名。默认不设置。

- `cookie: SetCookieConfiguration`

    如果使用 cookie 参数，则可以将上述参数打包成 JSON 对象传递。

#### 返回值

返回该对象本身。

#### 错误处理

当请求响应的 HTTP 头已经发送时，方法执行失败，抛出一个 http.Exception 类型的错误。
