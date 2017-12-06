# 抽象接口 StandardRouter

## 说明

这个抽象接口描述标准路由器对象提供的方法接口。

## 接口定义

```ts
interface StandardRouter<
    CT extends RequestContext = RequestContext
> extends Router {

    use(
        method: HTTPMethod | HTTPMethod[],
        path: string | RegExp | Array<string | RegExp>,
        middleware: RequestMiddleware<CT>
    ): this;

    use(
        method: HTTPMethod | HTTPMethod[],
        middleware: RequestMiddleware<CT>
    ): this;

    use(
        path: string | RegExp | Array<string | RegExp>,
        middleware: RequestMiddleware<CT>
    ): this;

    use(
        middleware: RequestMiddleware<CT>
    ): this;

    register(
        method: HTTPMethod | HTTPMethod[],
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

    notFound(handler: RequestHandler<CT>): this;

    get(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

    post(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

    put(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

    patch(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

    delete(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

    options(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

    head(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

    trace(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;
}
```

## 类型参数

-   `CT extends RequestContext`

    指定请求上下文对象的类型，默认是 RequestContext。

## 方法介绍

> 根据方法名称按字母表顺序排列。

------------------------------------------------------------------------------

### 方法 delete

该方法用于注册一个 HTTP DELETE 请求的处理规则到路由表。

> 该方法事实上是 register 方法的快捷方式，自动将 DELETE 传给 register 方法，
> 作为第一个参数。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md)。

#### 方法声明

```ts
function delete(
    path: string | RegExp | Array<string | RegExp>,
    handler: RequestHandler<CT>,
    data?: IDictionary<any>
): this;
```

#### 参数说明

- `path: string | RegExp | Array<string | RegExp>`

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

- `data?: IDictionary<any>`

    （可选参数）

    指定该请求的上下文初始数据。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 get

该方法用于注册一个 HTTP GET 请求的处理规则到路由表。

> 该方法事实上是 register 方法的快捷方式，自动将 GET 传给 register 方法，
> 作为第一个参数。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md)。

#### 方法声明

```ts
function get(
    path: string | RegExp | Array<string | RegExp>,
    handler: RequestHandler<CT>,
    data?: IDictionary<any>
): this;
```

#### 参数说明

- `path: string | RegExp | Array<string | RegExp>`

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

- `data?: IDictionary<any>`

    （可选参数）

    指定该请求的上下文初始数据。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 head

该方法用于注册一个 HTTP HEAD 请求的处理规则到路由表。

> 该方法事实上是 register 方法的快捷方式，自动将 HEAD 传给 register 方法，
> 作为第一个参数。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md)。

#### 方法声明

```ts
function head(
    path: string | RegExp | Array<string | RegExp>,
    handler: RequestHandler<CT>,
    data?: IDictionary<any>
): this;
```

#### 参数说明

- `path: string | RegExp | Array<string | RegExp>`

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

- `data?: IDictionary<any>`

    （可选参数）

    指定该请求的上下文初始数据。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 notFound

该方法用于注册一个默认的请求处理规则到路由表，当路由器找不到可以适配的规则时，就会使用
该处理规则进行处理。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md#5-处理-not-found)。

#### 方法声明

```ts
function notFound(
    handler: RequestHandler<CT>
): this;
```

#### 参数说明

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

#### 返回值

返回该路由器对象本身。

------------------------------------------------------------------------------

### 方法 options

该方法用于注册一个 HTTP OPTIONS 请求的处理规则到路由表。

> 该方法事实上是 register 方法的快捷方式，自动将 OPTIONS 传给 register 方法，
> 作为第一个参数。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md)。

#### 方法声明

```ts
function options(
    path: string | RegExp | Array<string | RegExp>,
    handler: RequestHandler<CT>,
    data?: IDictionary<any>
): this;
```

#### 参数说明

- `path: string | RegExp | Array<string | RegExp>`

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

- `data?: IDictionary<any>`

    （可选参数）

    指定该请求的上下文初始数据。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 patch

该方法用于注册一个 HTTP PATCH 请求的处理规则到路由表。

> 该方法事实上是 register 方法的快捷方式，自动将 PATCH 传给 register 方法，
> 作为第一个参数。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md)。

#### 方法声明

```ts
function patch(
    path: string | RegExp | Array<string | RegExp>,
    handler: RequestHandler<CT>,
    data?: IDictionary<any>
): this;
```

#### 参数说明

- `path: string | RegExp | Array<string | RegExp>`

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

- `data?: IDictionary<any>`

    （可选参数）

    指定该请求的上下文初始数据。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 post

该方法用于注册一个 HTTP POST 请求的处理规则到路由表。

> 该方法事实上是 register 方法的快捷方式，自动将 POST 传给 register 方法，
> 作为第一个参数。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md)。

#### 方法声明

```ts
function post(
    path: string | RegExp | Array<string | RegExp>,
    handler: RequestHandler<CT>,
    data?: IDictionary<any>
): this;
```

#### 参数说明

- `path: string | RegExp | Array<string | RegExp>`

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

- `data?: IDictionary<any>`

    （可选参数）

    指定该请求的上下文初始数据。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 put

该方法用于注册一个 HTTP PUT 请求的处理规则到路由表。

> 该方法事实上是 register 方法的快捷方式，自动将 PUT 传给 register 方法，
> 作为第一个参数。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md)。

#### 方法声明

```ts
function put(
    path: string | RegExp | Array<string | RegExp>,
    handler: RequestHandler<CT>,
    data?: IDictionary<any>
): this;
```

#### 参数说明

- `path: string | RegExp | Array<string | RegExp>`

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

- `data?: IDictionary<any>`

    （可选参数）

    指定该请求的上下文初始数据。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 register

该方法用于注册一个 HTTP 请求的处理规则到路由表。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md)。

#### 方法声明

```ts
function register(
    method: HTTPMethod | HTTPMethod[],
    path: string | RegExp | Array<string | RegExp>,
    handler: RequestHandler<CT>,
    data?: IDictionary<any>
): this;
```

#### 参数说明

- `method: HTTPMethod | HTTPMethod[]`

    指定该规则适配的请求方法，参考 [HTTPMethod](./HTTPMethod.md) 的说明。

- `path: string | RegExp | Array<string | RegExp>`

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

- `data?: IDictionary<any>`

    （可选参数）

    指定该请求的上下文初始数据。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 trace

该方法用于注册一个 HTTP TRACE 请求的处理规则到路由表。

> 该方法事实上是 register 方法的快捷方式，自动将 TRACE 传给 register 方法，
> 作为第一个参数。

> 可以参考[路由器使用教程](../../quick-guide/02-router.md)。

#### 方法声明

```ts
function trace(
    path: string | RegExp | Array<string | RegExp>,
    handler: RequestHandler<CT>,
    data?: IDictionary<any>
): this;
```

#### 参数说明

- `path: string | RegExp | Array<string | RegExp>`

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `handler: RequestHandler<CT>`

    指定该规则的处理器函数。

- `data?: IDictionary<any>`

    （可选参数）

    指定该请求的上下文初始数据。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

------------------------------------------------------------------------------

### 方法 use

该方法用于注册一个中间件函数的处理规则到路由表。

> 可以参考[中间件使用教程](../../quick-guide/04-middlewares.md)。

#### 方法声明

```ts
function use(
    middleware: RequestMiddleware<CT>
): this;

@override
function use(
    method: HTTPMethod | HTTPMethod[],
    middleware: RequestMiddleware<CT>
): this;

@override
function use(
    path: string | RegExp | Array<string | RegExp>,
    middleware: RequestMiddleware<CT>
): this;

@override
function use(
    method: HTTPMethod | HTTPMethod[],
    path: string | RegExp | Array<string | RegExp>,
    middleware: RequestMiddleware<CT>
): this;
```

#### 参数说明

- `method: HTTPMethod | HTTPMethod[]`

    （可选参数）

    指定该规则适配的请求方法，参考 [HTTPMethod](./HTTPMethod.md) 的说明。

- `path: string | RegExp | Array<string | RegExp>`

    （可选参数）

    指定该规则适配的请求路径。

    > 更多请参考[路径匹配规则](#路径匹配规则)。

- `middleware: RequestMiddleware<CT>`

    指定该规则的中间件函数。

#### 返回值

返回该路由器对象本身。

#### 错误处理

当路径格式有误时，抛出一个 http.Exception 类型的错误。

## 路径匹配规则

路径是指 URL 中，请求域后第一个 `/` 开始到第一个 `?` 或 `#` 之前的内容。路由器则是
根据这个请求的路径和方法来判断，应该使用哪个方法。

路径匹配有以下几条通用规则：

- 在收到一个请求的时候，服务器会自动将路径尾部的 `/` 去除，因此在填写路径的时候请不要
填写路径尾部的 `/`。
- 路径必须以 `/` 开头。

### 字符串匹配

字符串匹配满足如下条件：

- 请求的路径与路由器规则里的路径进行字符串比较并完全匹配。

- 字符串匹配是大小写敏感的。

    > e.g. 路径规则 `/a` 不匹配请求路径 `/A`。

- 不进行 `//` 合并。

    > e.g. 因此对于路径规则 `/abc` 无法匹配请求路径 `//abc`。

- 不对路径中的 `..` 和 `.` 处理。

    > e.g. 因此对于路径规则 `/abc` 无法匹配请求路径 `/a/../abc`。

### 正则表达式匹配

字面意思，就是用一个正则表达式去匹配请求路径。

正则表达式中如果含有子表达式，则所有子表达式的匹配结果会被放入一个数组，作为请求的
上下文初始数据。

### 参数表达式匹配

正则表达式匹配的结果是数组，并且正则表达式作为路由可读性比较差，因此 LiteRT/HTTP 提供
了一种简单的匹配方式，叫参数表达式。参数表达式是指一种包含 `{name:type}` 格式内容的
字符串。

> 例如要匹配 `GET /users/123` 并提取其中的 123 作为参数 `id`，可以写作：

```ts
router.get("/users/{id:uint}", async function(ctx) {

    // do something
});
```

使用参数表达式有如下规则：

- 参数表达式统一格式为 `{变量名:类型}`，里面不能包含空格。

- 支持如下类型：

    类型表达式     | 匹配内容                          | 结果类型
    --------------|----------------------------------|-----------
    number        | 任何数值                          | number
    int           | 任何整数                          | number
    uint          | 任何非负整数                       | number
    string        | 不包含"/"的字符串                  | string
    hex-string    | 只包含十六进制字符的字符串          | string
    hex-uint      | 十六进制字符                       | number
    any           | 任意长度字符串                     | string
    string[x]     | 长度为x，不包含"/"的字符串          | string
    hex-string[x] | 长度为x，只包含十六进制字符的字符串  | string
