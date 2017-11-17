# 其他常量

## `DEFAULT_BACKLOG`

模块方法 `createServer` 的 `backlog` 参数的默认值。

```ts
const DEFAULT_BACKLOG: number = 512;
```

## `DEFAULT_PORT`

非 SSL 模式下，模块方法 `createServer` 的 `port` 参数的默认值。

```ts
const DEFAULT_PORT: number = 80;
```

## `DEFAULT_SSL_PORT`

SSL 模式下，模块方法 `createServer` 的 `port` 参数的默认值。

```ts
const DEFAULT_SSL_PORT: number = 443;
```

## `DEFAULT_HOST`

模块方法 `createServer` 的 `host` 参数的默认值。

```ts
const DEFAULT_HOST: string = "0.0.0.0";
```

## `DEFAULT_KEEP_ALIVE`

模块方法 `createServer` 的 `keeyAlive` 参数的默认值。

```ts
const DEFAULT_KEEP_ALIVE: number = 5000;
```

## `DEFAULT_EXPECT_REQUEST`

模块方法 `createServer` 的 `expectRequest` 参数的默认值。

```ts
const DEFAULT_EXPECT_REQUEST: boolean = false;
```

## `DEFAULT_TIMEOUT`

模块方法 `createServer` 的 `timeout` 参数的默认值。

```ts
const DEFAULT_TIMEOUT: number = 60000;
```

## `EXCEPTION_TYPE`

http.Exception 类的 type 属性值。

```ts
const EXCEPTION_TYPE: string = "litert/http";
```

## `HTTP_METHODS`

LiteRT/HTTP 支持的 HTTP 方法列表。

```ts
const HTTP_METHODS: HTTPMethod[] = [
    "GET", "POST", "PUT", "TRACE",
    "DELETE", "OPTIONS", "HEAD", "PATCH",
    "COPY", "LOCK", "UNLOCK", "MOVE",
    "MKCOL", "PROPFIND", "PROPPATCH", "REPORT",
    "MKACTIVITY", "CHECKOUT", "MERGE", "M-SEARCH",
    "NOTIFY", "SUBSCRIBE", "UNSUBSCRIBE"
]
```
