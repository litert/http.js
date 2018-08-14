/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
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

import MountableHost from "./server/MountableHost";
import StandardDispatcher from "./server/StandardDispatcher";
import StandardHost from "./server/StandardHost";

export { createStandardRouter } from "./server/StandardRouter";
export * from "./server/ControllerRouter";
export * from "./client/Client";
import ServerError from "./server/Errors";
import ClientError from "./client/Errors";
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
    ClientError,
    Exception,
    plugins
};

export {
    createDefaultContext,
    DefaultContext
} from "./server/DefaultContext";
