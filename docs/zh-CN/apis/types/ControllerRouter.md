# 抽象接口 ControllerRouter

## 说明

这个抽象接口描述标准路由器对象提供的方法接口。

## 接口定义

```ts
export interface ControllerRouter<
    CT extends RequestContext = RequestContext
> extends StandardRouter<CT> {

    /**
     * Load request handlers from controller files.
     *
     * @param root The root path of controller classes.
     */
    loadControllers(root: string): this;

    /**
     * Load request middlewares from middleware files.
     *
     * @param root The root path of middleware classes.
     */
    loadMiddlewares(root: string): this;
}
```

## 类型参数

-   `CT extends RequestContext`

    指定请求上下文对象的类型，默认是 RequestContext。

## 方法介绍

> 根据方法名称按字母表顺序排列。

------------------------------------------------------------------------------

### 方法 loadControllers

该方法用于从指定目录中搜索并加载所有控制器（包括子目录下的文件）。

> 可以多次调用该方法，从多个目录加载控制器。

#### 方法声明

```ts
function loadControllers(
    root: string
): this;
```

#### 参数说明

- `root: string`

    指定要搜索的目录。

#### 返回值

返回该路由器对象本身。

------------------------------------------------------------------------------

### 方法 loadMiddlewares

该方法用于从指定目录中搜索并加载所有中间件（包括子目录下的文件）。

#### 方法声明

```ts
function loadMiddlewares(
    root: string | string[]
): this;
```

#### 参数说明

- `root: string | string[]`

    指定要搜索的目录，如果有多个目录，则可以用字符串数组。

#### 返回值

返回该路由器对象本身。
