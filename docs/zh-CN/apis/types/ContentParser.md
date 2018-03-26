# 抽象接口 ContentParser

## 说明

这个抽象接口描述通用 HTTP 实体解码器提供的方法接口。

## 接口定义

```ts
interface ContentParser {

    parse(
        request: ServerRequest,
        opts: GetContentOptions<string>
    ): Promise<any>;
}
```

## 方法介绍

> 根据方法名称按字母表顺序排列。

------------------------------------------------------------------------------

### 方法 parse

该方法提供给 ServerRequest 对象调用，用于解码来自客户端的 HTTP 实体数据。

#### 方法声明

```ts
function parse(
    request: ServerRequest,
    opts: GetContentOptions<string>
): Promise<any>;
```

#### 参数说明

- `request: ServerRequest`

    请求的控制对象。

- `opts: GetContentOptions<string>`

    解码配置信息。

#### 返回值

返回一个 Promise<any> 对象。
