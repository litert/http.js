# 抽象接口 CookieConfiguration

## 说明

该抽象接口描述 Cookie 的属性。

## 接口定义

```ts
interface CookieConfiguration {

    "ttl"?: number;

    "secureOnly"?: boolean;

    "httpOnly"?: boolean;

    "path"?: string;

    "domain"?: string;
}
```

## 属性介绍

> 根据属性名称按字母表顺序排列。

------------------------------------------------------------------------------

### 属性 domain

设置 Cookie 的有效域名。

```ts
let domain: string;
```

------------------------------------------------------------------------------

### 属性 httpOnly

设为 true 则使 Cookie 为 HttpOnly 的。

```ts
let httpOnly: boolean;
```

------------------------------------------------------------------------------

### 属性 path

设置 Cookie 的有效路径。

```ts
let path: string;
```

------------------------------------------------------------------------------

### 属性 secureOnly

设为 true 使 Cookie 为 Secure 的。

```ts
let secureOnly: boolean;
```

------------------------------------------------------------------------------

### 属性 ttl

Cookie 的有效期。

> - 设置为负数，则使 Cookie 立即过期。
> - 设置为 0，则使 Cookie 在会话期间有效。
> - 该字段将同时设置 Cookie 的 Expires 和 Max-Age 属性。

```ts
let ttl: number;
```
