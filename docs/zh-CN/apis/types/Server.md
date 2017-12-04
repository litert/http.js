# 抽象接口 Server

## 说明

这个抽象接口描述标准路由器对象提供的方法接口。

## 接口定义

```ts
interface Server extends EventEmitter {

    readonly port: number;

    readonly host: string;

    readonly backlog: number;

    readonly status: ServerStatus;

    shutdown(): Promise<void>;

    start(): Promise<void>;
}
```

## 属性介绍

### 属性 host

```ts
public readonly host: string;
```

该（只读）属性返回服务器对象监听的主机名。

### 属性 port

```ts
public readonly port: number;
```

该（只读）属性返回服务器对象监听的端口号。

### 属性 backlog

```ts
public readonly backlog: number;
```

该（只读）属性返回服务器对象监听的最大队列长度。

### 属性 status

```ts
public readonly status: ServerStatus;
```

该（只读）属性返回服务器对象的状态。

## 方法介绍

> 根据方法名称按字母表顺序排列。

### 方法 shutdown

该方法用于关闭服务器，停止监听请求。

> 该方法将触发 closed 事件。

#### 方法声明

```ts
async function shutdown(): Promise<void>;
```

#### 返回值

返回一个 void 类型的 Promise 对象。

#### 错误处理

通过 Promise 对象的 catch 分支捕获 http.Exception 异常对象。

### 方法 start

该方法用于启动服务器，开始监听请求。

> 该方法将触发 started 事件。

#### 方法声明

```ts
async function start(): Promise<void>;
```

#### 返回值

返回一个 void 类型的 Promise 对象。

#### 错误处理

通过 Promise 对象的 catch 分支捕获 http.Exception 异常对象。

## 事件介绍

### `closed` 事件

该事件在服务器成功停止监听后触发。

### 使用方式

```ts
server.on("closed", function() {

    console.info(`Server bas been shutted down.`);
});
```

### `error` 事件

该事件在服务器发生错误时（内部错误，或者来自处理器、中间件未处理的异常）触发。

### 使用方式

```ts
server.on("error", function(e: any) {

    console.error(e);
});
```

### `started` 事件

该事件在服务器成功监听端口后触发。

### 使用方式

```ts
server.on("started", function() {

    console.info(`Server started listening.`);
});
```
