## 模块方法 createServer

### 用途

创建一个 HTTP(S) 服务器控制对象。

### 方法声明

```ts
function createServer(cfg: {

    /**
     * 服务器监听的 IP 地址。
     *
     * 默认值: 0.0.0.0
     */
    "host"?: string;

    /**
     * 服务器监听的端口号。
     *
     * 默认值: 80 (如果开启了 SSL，则默认为 443 端口)
     */
    "port"?: number;

    /**
     * 截取带 HTTP 头 Expect: xxx 的请求。
     * 
     * 设为 true 则可以在处理器中自行处理这个请求，否则自动接受。
     *
     * 默认值: false
     */
    "expectRequest"?: boolean;

    /**
     * 保持 HTTP Keep-Alive 的时间，设为 0 则禁用 Keep Alive。
     *
     * 默认值: 5000 (ms)
     */
    "keeyAlive"?: number;

    /**
     * 服务器能处理的最大队列长度。
     *
     * 默认值: 512
     */
    "backlog"?: number;

    /**
     * 路由器对象。
     */
    "router": Router;

    /**
     * 处理链接的超时时长。
     *
     * 默认值: 60000 (ms)
     */
    "timeout"?: number;

    /**
     * SSL 配置信息，需要 HTTPS 请配置该字段，否则请留空。
     *
     * 默认值: 无
     */
    "ssl"?: {

        /**
         * SSL 私钥内容。
         */
        "key": string | Buffer;

        /**
         * SSL 证书内容。
         */
        "certificate": string | Buffer;

        /**
         * SSL 私钥的加密口令。
         */
        "passphrase"?: string;
    };

    /**
     * HTTP Cookies 编码器对象。
     */
    "cookies"?: CookiesEncoder;

}): Server;
```

## 参数说明

### 参数 host

```ts
let host: string = "0.0.0.0";
```

host 参数指定 HTTP 网关要监听的主机地址，一般是一个 IP 地址。如果要监听本机的默认
地址，直接指定 **0.0.0.0** 或者留空（默认值）即可。

> 需要注意的是，**127.0.0.1** 与 **0.0.0.0** 并不是等价的。

### 参数 port

```ts
let port: number = 80;
```

port 参数指定 HTTP 网关要监听的端口号。默认值是 80，如果开启了 SSL，则默认是 443。
你可以手动设置这个参数。

> 在 Linux 下， 1024 以下的端口必须以 root 用户启动才能监听。（或者用 sudo 命令）

### 参数 expectRequest

```ts
let expectRequest: boolean = false;
```

在某些情况下，HTTP 客户端会发送携带类似 HTTP 头 `Expect: 100-Continue` 的请求，
不带 HTTP Body 数据。这些请求要求服务器响应一个 **HTTP 100 Continue**，然后客户端
才会把 HTTP Body 数据继续发送给服务器。

参数 **expectRequest** 就是用于开启这些请求的处理开关。默认这个开关是关闭的，服务器
将默认返回 100 Continue 响应。（对于非 100-Continue 的 Expect 请求，服务器会返回
一个 417 EXPECTATION_FAILED 响应）

开启这个开关后，可以在中间件和处理器函数中处理这类请求。

### 参数 keeyAlive

```ts
let keeyAlive: number = 5000;
```

keeyAlive 参数用于设定 HTTP Keep Alive 链接复用时，空闲链接的维持时长，超过此时长后
服务器将自动关闭链接。（单位：毫秒）

### 参数 backlog

```ts
let backlog: number = 512;
```

backlog 参数用于设定服务器的最大监听队列长度，也就是说同一时间能有多少个请求在等待
处理。

### 参数 router

```ts
let router: Router;
```

router 参数指定 HTTP 请求的路由器对象。

### 参数 timeout

```ts
let timeout: number = 60000;
```

timeout 参数指定，一个请求在多长时间后会被关闭。（单位：毫秒）

### 参数 ssl

```ts
let ssl: {

    /**
     * SSL 私钥内容。
     */
    "key": string | Buffer;

    /**
     * SSL 证书内容。
     */
    "certificate": string | Buffer;

    /**
     * SSL 私钥的加密口令。
     */
    "passphrase"?: string;
};
```

ssl 参数用于配置并开启 HTTP 服务器的 SSL 模式。

### 参数 cookies

```ts
let cookies: CookiesEncoder;
```

cookies 参数用于配置服务器的 HTTP Cookies 编解码器对象。

## 使用示例

```ts
import * as libHTTP from "@litert/http";

let router = libHTTP.createStandardRouter();

let server = libHTTP.createServer({
    "host": "127.0.0.1",
    "port": 80,
    "router": router
});
```

## 注意事项

该方法用于创建一个服务器对象，而不会自动启动服务器。