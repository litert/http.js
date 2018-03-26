# 内置插件 Base64Parser

用于提供 HTTP 实体数据编码为 BASE64 时的解码器。

## 使用方式

```ts
import * as http from "@litert/http";

let server = http.createServer({

    // ...
    plugins: {

        "parser:base64": http.plugins.createBase64Parser()
    }
});

// 事实上会自动设置 `parser:base64` 为对应的解码器，因此一般不需要手动设置。
// 除非要实现自定义的解码器。
// 或者将之设置为 null，从而禁止对 BASE64 进行解码。
```
