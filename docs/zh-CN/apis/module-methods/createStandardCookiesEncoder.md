## 模块方法 createStandardCookiesEncoder

### 用途

创建一个标准的 HTTP Cookies 编解码器对象。

### 方法声明

```ts
function createStandardCookiesEncoder(cfg?: {

    /**
     * Cookies 的编码方式。
     * 
     * 默认值：CookiesEncoding.PLAIN
     */
    "encoding"?: CookiesEncoding;

    /**
     * Cookies 数据的默认配置。
     * 
     * 具体用途参考 ServerResponse.setCookie 方法
     */
    "defaults"?: CookieConfiguration;

}): CookiesEncoder;
```

## 参数说明

### 参数 encoding

```ts
let encoding: CookiesEncoding = CookiesEncoding.PLAIN;
```

通过设置 encoding 可以将 Cookies 的数据进行 BASE64/HEX 转码。

### 参数 defaults

```ts
let defaults: CookieConfiguration = {

    "ttl": 0,

    "secureOnly": false,

    "httpOnly": false,

    "path": "/"
};
```

[setCookie]: ../types/ServerResponse.md#方法-setCookie

设置 [ServerResponse.setCookie][setCookie] 的默认参数。

## 使用示例

```ts
import * as libHTTP from "@litert/http";

let cookies = libHTTP.createStandardCookiesEncoder();
```
