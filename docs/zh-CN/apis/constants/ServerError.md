# 枚举常量 ServerError

该枚举类型列举了 HTTP.js 可能的异常号。

```ts
enum ServerError {
    /**
     * 路径不可用。
     */
    INVALID_PATH = 0x00001001,

    /**
     * 无法启动服务器。
     */
    FAILED_TO_START,

    /**
     * 智能路由变量的类型无法识别。
     */
    INVALID_VARIABLE_TYPE,

    /**
     * 读取的数据超过最大长度。
     */
    EXCEED_MAX_BODY_LENGTH,

    /**
     * 响应报头已经发送。
     */
    HEADERS_ALREADY_SENT,

    /**
     * 服务器未启动。
     */
    SERVER_NOT_WORKING,

    /**
     * 读取数据超时。
     */
    READING_DATA_TIMEOUT,

    /**
     * 客户端链接已经关闭。
     */
    CONNECTION_CLOESD,

    /**
     * 响应输出流已经被关闭，不能再向客户端发送数据了。
     */
    RESPONSE_ALREADY_CLOSED,

    /**
     * 中间件中 next 回调未被调用。
     */
    MISSING_CALLING_NEXT,

    /**
     * 不能启动一个已经挂载到别的服务器上的服务器对象。
     */
    START_MOUNTED_SERVER,

    /**
     * 参数指定的控制器或者中间件的扫描路径不存在。
     */
    PATH_NOT_EXIST
}
```
