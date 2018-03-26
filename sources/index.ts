/*
   +----------------------------------------------------------------------+
   | LiteRT HTTP.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/http.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

export {

    RequestContext,
    RequestHandler,
    RequestMiddleware,
    StandardRouter,
    ControllerRouter,
    Router,
    MiddlewareNextCallback,
    ServerRequest,
    ServerResponse,
    ServerStatus,
    DEFAULT_BACKLOG,
    DEFAULT_HOST,
    DEFAULT_PORT,
    DEFAULT_SSL_PORT,
    DEFAULT_EXPECT_REQUEST,
    DEFAULT_KEEP_ALIVE,
    EXCEPTION_TYPE,
    HTTP_METHODS,
    HTTPMethod,
    HTTPStatus,
    Server,
    RouteResult,

    // Cookies

    SetCookieConfiguration,
    CookieConfiguration,
    CookiesEncoding,
    CookiesEncoder

} from "./server/Abstract";

import * as plugins from "./server/built-in-plugins";

export {

    /**
     * @deprecated Use method `createCookiesEncoder` instead, this method will
     *             be removed in v0.5.0.
     */
    createCookiesEncoder as createStandardCookiesEncoder
} from "./server/built-in-plugins";

import MountableHost from "./server/MountableHost";
import StandardDispatcher from "./server/StandardDispatcher";
import StandardHost from "./server/StandardHost";

export { createStandardRouter } from "./server/StandardRouter";
export * from "./server/ControllerRouter";
import ServerError from "./server/Errors";
import Exception from "./server/Exception";
import {
    CreateServerOptions,
    Server,
    CreateMountableServerOptions,
    CreateHostDispatcherOptions,
} from "./server/Abstract";

export function createServer(opts: CreateServerOptions): Server {

    return new StandardHost(opts);
}

export function createMountableServer(
    opts: CreateMountableServerOptions
): Server {

    return new MountableHost(opts);
}

export function createVirtualDispatcher(
    opts: CreateHostDispatcherOptions
): Server {

    return new StandardDispatcher(opts);
}

export {
    ServerError,
    Exception,
    plugins
};

export {
    createDefaultContext,
    DefaultContext
} from "./server/DefaultContext";
