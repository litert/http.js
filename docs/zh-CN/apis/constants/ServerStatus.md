# 枚举常量 ServerStatus

该枚举类型列举了服务器对象的状态。

```ts
enum ServerStatus {

    /**
     * 服务器尚未启动
     */
    READY,

    /**
     * 服务器正在启动中
     */
    STARTING,

    /**
     * 服务器正常监听中
     */
    WORKING,

    /**
     * 服务器正在停止
     */
    CLOSING
}
```
