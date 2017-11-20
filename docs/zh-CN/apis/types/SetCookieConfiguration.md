# 抽象接口 SetCookieConfiguration

## 说明

该抽象接口描述 Cookie 的名称和值。

> 该接口继承自 [CookieConfiguration](./CookieConfiguration.md)。

## 接口定义

```ts
interface SetCookieConfiguration extends CookieConfiguration {

    "name": string;

    "value": string;
}
```

## 属性介绍

> 根据属性名称按字母表顺序排列。

------------------------------------------------------------------------------

### 属性 name

Cookie 的名称。

```ts
let name: string;
```

------------------------------------------------------------------------------

### 属性 value

Cookie 的内容。

```ts
let value: string;
```
