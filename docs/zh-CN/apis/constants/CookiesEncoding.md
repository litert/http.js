# 枚举常量 CookiesEncoding

该枚举类型列举了 HTTP Cookies 值的编码方式。

```ts
enum CookiesEncoding {

    /**
     * 明文编码。
     */
    PLAIN,

    /**
     * Base64 编码
     */
    BASE64,

    /**
     * 十六进制编码
     */
    HEX,

    /**
     * 使用 URL 安全编码
     */
    URLENCODE,

    /**
     * 其他方式，仅用于自定义的 Cookies 编解码器。
     */
    OTHER
}
```
