# 内置插件 RawParser

用于提供 HTTP 实体数据编码为 Raw 时的解码器。

## 使用方式

```ts
import * as http from "@litert/http";

let server = http.createServer({

    // ...
    plugins: {

        "parser:raw": http.plugins.createRawParser()
    }
});

// 事实上会自动设置 `parser:raw` 为对应的解码器，因此一般不需要手动设置。
// 除非要实现自定义的解码器。
// 注意：切莫将 `parser:raw` 设置为无效解码器，否则所有内置解码器都无法正常工作。
```
