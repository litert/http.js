# 抽象接口 ServerRequest

## 说明

[ServerRequest]: https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_incomingmessage

这个抽象接口描述 HTTP 请求的请求控制对象。

> 方法继承自 Node.js 原生 http 模块的 IncomingMessage 类。
>
> 因此本章节仅介绍扩展的方法，原生接口请参考[官方文档][ServerRequest]。

## 接口定义

```ts
import nodeHTTP = require("http");

interface ServerRequest extends nodeHTTP.IncomingMessage {

    "cookies": IDictionary<string>;

    "path": string;

    "realPath": string;

    "https": boolean;

    "ip": string;

    "query": IDictionary<any>;

    "aborted": boolean;

    "closed": boolean;

    "params": IDictionary<any>;

    "queryString": string;

    "host": string;

    "server": Server;

    "time": number;

    "headers": IDictionary<string>;

    getAcceptableEncodings(): IDictionary<number>;

    getAcceptableLanguages(): IDictionary<number>;

    getAcceptableTypes(): IDictionary<number>;

    getContent(opts: {

        type: "raw";

        maxBytes?: number;

        assert?: boolean;

    }): Promise<Buffer>;

    getContent(opts: {

        type: "string";

        maxBytes?: number;

        assert?: boolean;

    }): Promise<string>;

    getContent<T>(opts: {

        type: "json" | "xml" | "urlencode" | "base64" | "multipart" | "auto" | string;

        maxBytes?: number;

        assert?: boolean;

        [key: string]: any;

    }): Promise<T>;

    isCookiesLoaded(): boolean;

    isDoNotTrack(): boolean;

    loadCookies(): boolean;
}
```

## 属性介绍

> 根据属性名称按字母表顺序排列。

------------------------------------------------------------------------------

### 属性 aborted

aborted 属性为 true 时，表示链接已经被强制关闭。

```ts
let aborted: boolean = false;
```

------------------------------------------------------------------------------

### 属性 closed

closed 属性为 true 时，表示链接已经被关闭。

```ts
let closed: boolean = false;
```

------------------------------------------------------------------------------

### 属性 cookies

cookies 属性内储存从客户端请求读取的 Cookies 数据。

> **该字段在调用 loadCookies 方法之前不可用。**

```ts
let cookies: IDictionary<string>;
```

------------------------------------------------------------------------------

### 属性 headers

headers 属性为请求携带的 HTTP 头字典。

```ts
let headers: IDictionary<string>;
```

------------------------------------------------------------------------------

### 属性 host

host 属性为客户端请求的主机。

> 取自 HTTP 请求报文里的 `Host` （或 `:authority`，对于 HTTP/2） 标头，如果没有，则
> 为空字符串。

```ts
let host: string;
```

------------------------------------------------------------------------------

### 属性 hostDomain

hostDomain 属性为客户端请求的主机名称。

> 取自 HTTP 请求报文里的 `Host` （或 `:authority`，对于 HTTP/2） 标头，如果没有，则
> 为空字符串。

```ts
let hostDomain: string;
```

------------------------------------------------------------------------------

### 属性 hostPort

hostPort 属性为客户端请求的主机端口号。

> 取自 HTTP 请求报文里的 `Host` （或 `:authority`，对于 HTTP/2） 标头，如果没有，则
> 为当前服务器监听的端口号。

```ts
let hostPort: string;
```

------------------------------------------------------------------------------

### 属性 https

https 属性为 true 时，表示请求是通过通过 SSL 链接发送的。

```ts
let https: boolean = false;
```

------------------------------------------------------------------------------

### 属性 ip

ip 属性的内容为客户端的 IP 地址。

```ts
let ip: string;
```

------------------------------------------------------------------------------

### 属性 params

params 属性是当前 HTTP 请求的路由解析参数。

> 参考[路由器教程](../../quick-guide/02-router.md)的第2节和第3节。

```ts
let params: IDictionary<any> | any[];
```

------------------------------------------------------------------------------

### 属性 path

path 属性为客户端请求的（原始）路径。

```ts
let path: string;
```

------------------------------------------------------------------------------

### 属性 query

query 属性为客户端请求的 QueryString 解码后得到的字典变量。

```ts
let query: IDictionary<any>;
```

------------------------------------------------------------------------------

### 属性 queryString

queryString 属性为客户端请求的 QueryString。

```ts
let queryString: string;
```

------------------------------------------------------------------------------

### 属性 realPath

realPath 属性为处理当前请求的有效路径，这个路径用于路由匹配。

> 如果使用挂载服务器，则 realPath 属性为去除了挂载点前缀后的路径。

```ts
let realPath: string;
```

------------------------------------------------------------------------------

### 属性 server

server 属性为处理当前请求的服务器对象。

```ts
let server: Server;
```

------------------------------------------------------------------------------

### 属性 time

time 属性为服务器收到请求时的时间（时间戳）。

```ts
let time: number;
```

------------------------------------------------------------------------------

### 属性 url

url 属性为服务器收到请求时的 URL （不包括域部分）。

```ts
let url: string;
```

## 方法介绍

> 根据方法名称按字母表顺序排列。

------------------------------------------------------------------------------

### 方法 GetAcceptableEncodings

获取请求头中 Accept-Encoding 字段解析后的字典，键为编码代号，值为权重。

```ts
function GetAcceptableEncodings(): IDictionary<number>;
```

------------------------------------------------------------------------------

### 方法 GetAcceptableLanguages

获取请求头中 Accept-Language 字段解析后的字典，键为语言代号，值为权重。

```ts
function GetAcceptableLanguages(): IDictionary<number>;
```

------------------------------------------------------------------------------

### 方法 GetAcceptableTypes

获取请求头中 Accept 字段解析后的字典，键为 MIME 代号，值为权重。

```ts
function GetAcceptableLanguages(): IDictionary<number>;
```

------------------------------------------------------------------------------

### 方法 getContent

该方法用于从客户端读取请求的 HTTP Body 数据，并自动解码。

#### 方法声明

```ts
async function getContent(opts: {

    type: "raw";

    maxBytes?: number;

    assert?: boolean;

}): Promise<Buffer>;

async function getContent(opts: {

    type: "string";

    maxBytes?: number;

    assert?: boolean;

}): Promise<string>;

async function getContent<T = any>(opts?: {

    type: "json" | "xml" | "urlencode" | "base64" | "multipart" | "auto" | string;

    maxBytes?: number;

    assert?: boolean;

    [key: string]: any;

}): Promise<T>;
```

#### 参数说明

- `opts.type: string`

    使用的解码方式，如果设置为 auto，则会根据 Content-Type 自动识别并使用对应的解码
    方式。

- `opts.maxBytes?: number`

    允许的最大的 HTTP Body 长度（单位：字节）。

    默认为 0，即不限制。

- `opts.assert?: boolean`

    是否对 Content-Type 进行校验，设置为 true 则强制校验，否则不校验。

    校验失败抛出一个异常。

#### 返回值

如果 type=raw，则返回 Buffer 类型的 Promise 对象。
如果 type=string，则返回 string 类型的 Promise 对象。
其他则返回类型参数 T 类型的 Promise 对象，T 默认为 any。

#### 错误处理

通过 Promise 对象的 catch 分支捕获 http.Exception 异常对象。

------------------------------------------------------------------------------

### 方法 isCookiesLoaded

该方法用于判断是否已经加载 Cookies，即判断 cookies 属性是否可用。

#### 方法声明

```ts
function isCookiesLoaded(): boolean;
```

#### 返回值

若 Cookies 已经加载，则返回 true。否则返回 false。

------------------------------------------------------------------------------

### 方法 isDoNotTrack

该方法用于判断客户端是否发送了 DNT 头，以防止服务器追踪客户信息。

```ts
function isDoNotTrack(): boolean;
```

------------------------------------------------------------------------------

### 方法 loadCookies

该方法用于从请求的 HTTP 头部 Cookie 字段里读取 Cookies 数据，并存到 cookies 属性。

#### 方法声明

```ts
function loadCookies(): boolean;
```

#### 返回值

如果有 Cookies 数据，则返回 true；否则返回 false。
