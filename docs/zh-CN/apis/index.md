# LiteRT/HTTP.js API 文档

## 目录

[CSCE]: ./module-methods/createStandardCookiesEncoder.md

- 类

    - [DefaultContext](./classes/DefaultContext.md)

- 模块方法

    - [createControllerRouter](./module-methods/createControllerRouter.md)
    - [createMountableServer](./module-methods/createMountableServer.md)
    - [createServer](./module-methods/createServer.md)
    - [createStandardCookiesEncoder][CSCE]
    - [createStandardRouter](./module-methods/createStandardRouter.md)
    - [createDefaultContext](./module-methods/createDefaultContext.md)
    - [createVirtualDispatcher](./module-methods/createVirtualDispatcher.md)

- 抽象接口

    - [ControllerRouter](./types/ControllerRouter.md)
    - [ContentParser](./types/ContentParser.md)
    - [CookiesEncoder](./types/CookiesEncoder.md)
    - [Router](./types/Router.md)
    - [StandardRouter](./types/StandardRouter.md)
    - [Server](./types/Server.md)

- 装饰器

    - [Delete](./decorators/Delete.md)
    - [Get](./decorators/Get.md)
    - [Head](./decorators/Head.md)
    - [Middleware](./decorators/Middleware.md)
    - [NotFound](./decorators/NotFound.md)
    - [Options](./decorators/Options.md)
    - [Patch](./decorators/Patch.md)
    - [Post](./decorators/Post.md)
    - [Put](./decorators/Put.md)
    - [Route](./decorators/Route.md)

- 数据类型

    - [ContextCreator](./types/ContextCreator.md)
    - [CookieConfiguration](./types/CookieConfiguration.md)
    - [HTTPMethod](./types/HTTPMethod.md)
    - [MiddlewareNextCallback](./types/MiddlewareNextCallback.md)
    - [RequestContext](./types/RequestContext.md)
    - [RequestHandler](./types/RequestHandler.md)
    - [RequestMiddleware](./types/RequestMiddleware.md)
    - [RouteResult](./types/RouteResult.md)
    - [ServerRequest](./types/ServerRequest.md)
    - [ServerResponse](./types/ServerResponse.md)
    - [SetCookieConfiguration](./types/SetCookieConfiguration.md)

- 枚举常量

    - [CookiesEncoding](./constants/CookiesEncoding.md)
    - [HTTPStatus](./constants/HTTPStatus.md)
    - [ServerStatus](./constants/ServerStatus.md)
    - [ServerError](./constants/ServerError.md)

- 其他常量

    - [DEFAULT_BACKLOG](./constants/Others.md#DEFAULT_BACKLOG)
    - [DEFAULT_HOST](./constants/Others.md#DEFAULT_HOST)
    - [DEFAULT_PORT](./constants/Others.md#DEFAULT_PORT)
    - [DEFAULT_SSL_PORT](./constants/Others.md#DEFAULT_SSL_PORT)
    - [DEFAULT_EXPECT_REQUEST](./constants/Others.md#DEFAULT_EXPECT_REQUEST)
    - [DEFAULT_KEEP_ALIVE](./constants/Others.md#DEFAULT_KEEP_ALIVE)
    - [EXCEPTION_TYPE](./constants/Others.md#EXCEPTION_TYPE)
    - [HTTP_METHODS](./constants/Others.md#HTTP_METHODS)

- 内置插件

    - [Base64Parser](./plugins/Base64Parser.md#)
    - [CookiesEncoder](./plugins/CookiesEncoder.md#)
    - [JSONParser](./plugins/JSONParser.md#)
    - [RawParser](./plugins/RawParser.md#)
    - [StringParser](./plugins/StringParser.md#)
    - [URLEncodeParser](./plugins/URLEncodeParser.md#)
