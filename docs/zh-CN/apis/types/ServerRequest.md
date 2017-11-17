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

    "path": string;

    "https": boolean;

    "ip": string;

    "query": IDictionary<any>;

    "aborted": boolean;

    "closed": boolean;

    "queryString": string;

    "host": string;

    "server": Server;

    "time": number;

    getBody(maxLength?: number): Promise<Buffer>;

    getBodyAsJSON(maxLength?: number): Promise<any>;
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

### 属性 host

path 属性为客户端请求的主机名称。

```ts
let host: string;
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

### 属性 server

server 属性为处理当前请求的服务器对象

```ts
let server: Server;
```

------------------------------------------------------------------------------

### 属性 time

time 属性为服务器收到请求时的时间（时间戳）。

```ts
let time: number;
```

## 方法介绍

> 根据方法名称按字母表顺序排列。

------------------------------------------------------------------------------

### 方法 getBody

该方法用于从客户端读取请求的 HTTP Body 数据。

#### 方法声明

```ts
async function getBody(maxLength?: number): Promise<Buffer>;
```

#### 参数说明

- `maxLength?: number`

    允许的最大的 HTTP Body 长度（单位：字节）。

    默认为 0，即不限制。

#### 返回值

返回 Buffer 类型的 Promise 对象。

#### 错误处理

通过 Promise 对象的 catch 分支捕获 http.Exception 异常对象。

------------------------------------------------------------------------------

### 方法 getBodyAsJSON

该方法用于从客户端读取请求的 HTTP Body 数据，并将其以 JSON 解码后返回。

#### 方法声明

```ts
async function getBodyAsJSON(maxLength?: number): Promise<any>;
```

#### 参数说明

- `maxLength?: number`

    允许的最大的 HTTP Body 长度（单位：字节）。

    默认为 0，即不限制。

#### 返回值

返回 any 类型的 Promise 对象。

#### 错误处理

通过 Promise 对象的 catch 分支捕获 http.Exception 异常对象。
