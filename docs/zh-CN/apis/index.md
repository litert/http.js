# LiteRT/HTTP.js API 文档

## 目录

[CSCE]: ./module-methods/createStandardCookiesEncoder.md

- 模块方法

    - [createServer](./module-methods/createServer.md)
    - [createStandardRouter](./module-methods/createStandardRouter.md)
    - [createStandardCookiesEncoder][CSCE]

- 抽象接口

    - [CookiesEncoder](./types/CookiesEncoder.md)
    - [Router](./types/Router.md)
    - [StandardRouter](./types/StandardRouter.md)
    - [Server](./types/Server.md)

- 数据类型

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

- 其他常量

    - [DEFAULT_BACKLOG](./constants/Others.md#DEFAULT_BACKLOG)
    - [DEFAULT_HOST](./constants/Others.md#DEFAULT_HOST)
    - [DEFAULT_PORT](./constants/Others.md#DEFAULT_PORT)
    - [DEFAULT_SSL_PORT](./constants/Others.md#DEFAULT_SSL_PORT)
    - [DEFAULT_EXPECT_REQUEST](./constants/Others.md#DEFAULT_EXPECT_REQUEST)
    - [DEFAULT_KEEP_ALIVE](./constants/Others.md#DEFAULT_KEEP_ALIVE)
    - [EXCEPTION_TYPE](./constants/Others.md#EXCEPTION_TYPE)
    - [HTTP_METHODS](./constants/Others.md#HTTP_METHODS)
