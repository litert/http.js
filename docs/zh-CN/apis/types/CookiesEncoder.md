# 抽象接口 CookiesEncoder

## 说明

这个抽象接口描述通用 Cookies 编解码器提供的方法接口。

## 接口定义

```ts
interface CookiesEncoder {

    parse(cookies: string): IDictionary<string>;

    stringify(cookie: SetCookieConfiguration): string;
}
```

## 方法介绍

> 根据方法名称按字母表顺序排列。

------------------------------------------------------------------------------

### 方法 parse

该方法提供给 ServerRequest 对象调用，用于解码来自客户端的 Cookie 数据。

#### 方法声明

```ts
function parse(cookies: string): IDictionary<string>;
```

#### 参数说明

- `cookies: string`

    从 HTTP 头部获取的原始 Cookie 字段数据。

#### 返回值

返回一个 IDictionary<string> 对象。

------------------------------------------------------------------------------

### 方法 stringify

该方法提供给 ServerResponse 对象调用，用于编码 Cookies 数据和设置。

#### 方法声明

```ts
function stringify(cookie: SetCookieConfiguration): string;
```

#### 参数说明

- `cookie: SetCookieConfiguration`

    Cookies 的详细设置。

#### 返回值

返回编码后的 Cookie 字符串。
