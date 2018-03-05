# 使用控制器类

v0.3.0 版本中，增加了控制器支持，可以将一个类的方法映射为特定规则的 HTTP 请求处理器。

## 1. 使用请求控制器类

规则如下：

1.  每个控制器类单独一个文件，并将该类作为 default 导出对象

    ```ts
    // File: ./controllers/MyController.ts

    class MyController {

    }

    export default MyController;
    ```

2.  在控制器类中，使用 http.js 带的装饰器工厂方法，给一个控制器类的成员方法添加注解，
    就可以将这个方法注册为请求处理器：

    ```ts
    // File: ./controllers/MyController.ts

    import * as Http from "@litert/http";
    class MyController {

        @Http.Get("/")
        public async homepage(ctx: Http.RequestContext): Promise<void> {

            ctx.response.send("Hello world!");
        }

        @Http.NotFound()
        public async onNotFound(ctx: http.RequestContext): Promise<void> {

            ctx.response.statusCode = 404;
            ctx.response.statusMessage = "NOT FOUND";
            ctx.response.sendJSON({
                "message": "resource not found."
            });
        }
    }

    export default MyController;
    ```

3.  创建控制器路由对象，并指定控制器文件所在目录：

    ```ts
    // File: ./router.ts

    import * as Http from "@litert/http";
    function createMyRouter() {

        let router = Http.createControllerRouter();

        router.loadControllers("./controllers");

        return router;
    }
    ```

这样，将这个路由对象装入服务器即可。

## 2. 使用类的中间件方法

前面讲解了如何使用控制器处理请求，本节介绍如何为控制器注册中间件：

> ControllerRouter 继承自 StandardRouter，因此你仍可以把它当成 StandardRouter
> 使用。

注册中间件处理器的方法和请求处理器很相似，两者的区别主要是：

1. 中间件处理器使用静态成员方法。
2. 中间件处理器统一使用 Http.Middleware 装饰器注册。

```ts
// File: ./middlewares/Sample.ts

import * as Http from "@litert/http";

class SampleMiddleware {

    @Http.Middleware("GET", "/statics/*")
    public static async logger(
        ctx: Http.RequestContext
        next: Http.MiddlewareNextCallback
    ): Promise<void> {

        const req = ctx.request;

        console.log(`Requested static file ${req.path}`);

        await next();
    }
}

// File: ./router.ts

import * as Http from "@litert/http";
function createMyRouter() {

    let router = Http.createControllerRouter();

    router.loadControllers("./controllers");
    router.loadMiddlewares("./middlewares");

    return router;
}
```

更多请参考 API 文档。
