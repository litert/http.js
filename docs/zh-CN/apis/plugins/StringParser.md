# 内置插件 StringParser

用于提供 HTTP 实体数据编码为裸文本时的解码器。

## 使用方式

```ts
import * as http from "@litert/http";

let server = http.createServer({

    // ...
    plugins: {

        "parser:string": http.plugins.createStringParser()
    }
});

// 事实上会自动设置 `parser:string` 为对应的解码器，因此一般不需要手动设置。
// 除非要实现自定义的解码器。
// 或者将之设置为 null，从而禁止对裸文本进行解码。
```
