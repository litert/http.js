/*
   +----------------------------------------------------------------------+
   | LiteRT HTTP.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2007-2017 Fenying Studio                               |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/http.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <i.am.x.fenying@gmail.com>                    |
   +----------------------------------------------------------------------+
 */

export {

    RequestContext,
    RequestHandler,
    RequestMiddleware,
    StandardRouter,
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

} from "./server/Core";

export * from "./server/StandardCookiesEncoder";

import MountableHost from "./server/MountableHost";
import StandardHost from "./server/StandardHost";

import createStandardRouter from "./server/StandardRouter";
import ServerError from "./server/Errors";
import Exception from "./server/Exception";
import {
    CreateServerOptions,
    Server
} from "./server/Core";

export function createServer(opts: CreateServerOptions): Server {

    if (opts.mounts) {

        return new MountableHost(opts);
    }

    return new StandardHost(opts);
}

export {
    createStandardRouter,
    createServer as createMountableServer,
    ServerError,
    Exception
};

export {
    createDefaultContext,
    DefaultContext
} from "./server/DefaultContext";
