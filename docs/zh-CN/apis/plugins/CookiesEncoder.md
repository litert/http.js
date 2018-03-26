# 内置插件 CookiesEncoder

用于提供 HTTP Cookies 的编码和解码功能。

## 使用方式

```ts
import * as http from "@litert/http";

let server = http.createServer({

    // ...
    plugins: {

        "parser:cookies": http.plugins.createCookiesEncoder()
    }
});

// 事实上会自动设置 `parser:cookies` 为对应的解码器，因此一般不需要手动设置。
// 除非要实现自定义的解码器。
// 或者将之设置为 null，从而禁止对 Cookies 进行解码。
```

## 构造方法声明

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

[setCookie]: ../types/ServerResponse.md#方法-setcookie

设置 [ServerResponse.setCookie][setCookie] 的默认参数。
