# 内置插件 JSONParser

用于提供 HTTP 实体数据编码为 JSON 时的解码器。

## 使用方式

```ts
import * as http from "@litert/http";

let server = http.createServer({

    // ...
    plugins: {

        "parser:json": http.plugins.createJSONParser()
    }
});

// 事实上会自动设置 `parser:json` 为对应的解码器，因此一般不需要手动设置。
// 除非要实现自定义的解码器。
// 或者将之设置为 null，从而禁止对 JSON 进行解码。
```
