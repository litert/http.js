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

import { IDictionary } from "@litert/core";
import {
    RequestMiddleware,
    StandardRouter,
    RouteRule,
    HTTPMethod,
    RequestHandler,
    HTTPMethodDictionary,
    RouteResult,
    RequestContext,
    HTTP_METHODS,
    HTTPStatus
} from "./Abstract";
import HttpException from "./Exception";
import ServerError from "./Errors";
import PlainRouteRule from "./router-rules/Plain";
import RegExpRouteRule from "./router-rules/RegExp";
import SmartRouteRule from "./router-rules/Smart";

class Middleware {

    public method!: HTTPMethod;

    public rule!: RouteRule<null>;

    public handler!: RequestMiddleware;
}

export class Router<
    CT extends RequestContext = RequestContext
> implements StandardRouter<CT> {

    protected _stringRouter: HTTPMethodDictionary<
        IDictionary<RouteRule<RequestHandler<CT>>>
    >;

    protected _regexpRouter: HTTPMethodDictionary<
        Array<RouteRule<RequestHandler<CT>>>
    >;

    private _middlewares: HTTPMethodDictionary<Middleware[]>;

    protected _notFoundHandler: RequestHandler<CT>;

    public constructor() {

        /**
         * Remove the sick type-assert error before TypeScript 2.7
         */

        // @ts-ignore
        this._regexpRouter = {};

        // @ts-ignore
        this._stringRouter = {};

        // @ts-ignore
        this._middlewares = {};

        for (let method of HTTP_METHODS) {

            this._middlewares[method] = [];
        }

        this._notFoundHandler = async (ctx) => {

            ctx.response.writeHead(
                HTTPStatus.NOT_FOUND,
                "FILE NOT FOUND"
            );

            ctx.response.end();
        };
    }

    private _isSmartRule(path: string): boolean {

        const p = path.indexOf("{");

        return (p > -1 && p < path.indexOf("}")) ||
                path.indexOf("*") > -1 ||
                path.indexOf("?") > -1;
    }

    private _setupMiddlewareRule(
        middleware: Middleware,
        path: string | RegExp
    ): void {

        if (typeof path === "string") {

            this._checkPath(path);

            if (this._isSmartRule(path)) {

                middleware.rule = new SmartRouteRule<null>(
                    null,
                    path,
                    {}
                );
            }
            else {

                middleware.rule = new PlainRouteRule<null>(
                    null,
                    path,
                    {}
                );
            }
        }
        else if (path instanceof RegExp) {

            middleware.rule = new RegExpRouteRule<null>(null, path, {});
        }
    }

    public use(...args: any[]): this {

        let middleware = new Middleware();
        let arg0 = args[0];

        switch (args.length) {
        case 1:

            middleware.handler = args[0];
            break;

        case 2:

            if (HTTP_METHODS.indexOf(arg0) > -1) {

                middleware.method = <HTTPMethod> arg0;
            }
            else if (Array.isArray(arg0)) {

                for (let el of arg0) {

                    this.use(el, args[1]);
                }

                return this;
            }
            else {

                this._setupMiddlewareRule(
                    middleware,
                    arg0
                );
            }

            middleware.handler = args[1];

            break;

        case 3:

            if (Array.isArray(arg0)) {

                for (let method of arg0) {

                    this.use(method, arguments[1], arguments[2]);
                }

                return this;
            }

            if (Array.isArray(arguments[1])) {

                for (let path of arguments[1]) {

                    this.use(arg0, path, arguments[2]);
                }

                return this;
            }

            middleware.method = arg0;
            this._setupMiddlewareRule(
                middleware,
                arguments[1]
            );
            middleware.handler = arguments[2];
        }

        if (middleware.method) {

            this._middlewares[middleware.method].push(middleware);
        }
        else {

            /**
             * Not limit to specific method.
             *
             * Thus adds it to all methods.
             */
            for (let method of HTTP_METHODS) {

                this._middlewares[method].push(middleware);
            }
        }

        return this;
    }

    public get(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this {

        this.register("GET", path, handler, data);

        return this;
    }

    public post(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this {

        this.register("POST", path, handler, data);

        return this;
    }

    public put(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this {

        this.register("PUT", path, handler, data);

        return this;
    }

    public patch(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this {

        this.register("PATCH", path, handler, data);

        return this;
    }

    public delete(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this {

        this.register("DELETE", path, handler, data);

        return this;
    }

    public options(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this {

        this.register("OPTIONS", path, handler, data);

        return this;
    }

    public head(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this {

        this.register("HEAD", path, handler, data);

        return this;
    }

    public trace(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this {

        this.register("TRACE", path, handler, data);

        return this;
    }

    protected _checkPath(path: string): void {

        if (
            path[0] !== "/"
            || (path.length > 1 && path.endsWith("/"))
        ) {

            throw new HttpException(
                ServerError.INVALID_PATH,
                "The URI is not acceptable."
            );
        }
    }

    public register(
        method: HTTPMethod | HTTPMethod[],
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data: IDictionary<any> = {}
    ): this {

        if (Array.isArray(method)) {

            for (let m of method) {

                this.register(
                    m,
                    path,
                    handler,
                    data
                );
            }

            return this;
        }

        if (path instanceof RegExp) {

            this._addRegExpRule(
                method,
                new RegExpRouteRule(handler, path, data)
            );
        }
        else if (Array.isArray(path)) {

            for (let p of path) {

                this.register(
                    method,
                    p,
                    handler,
                    data
                );
            }
        }
        else {

            this._checkPath(path);

            let collection = this._stringRouter[method];

            if (!collection) {

                this._stringRouter[method] = collection = {};
            }

            if (this._isSmartRule(path)) {

                this._addRegExpRule(
                    method,
                    new SmartRouteRule(handler, path, data)
                );
            }
            else {

                collection[path] = new PlainRouteRule(handler, path, data);
            }
        }

        return this;
    }

    protected _addRegExpRule(
        method: HTTPMethod,
        rule: RouteRule<any>
    ) {

        let collection = this._regexpRouter[method];

        if (!collection) {

            this._regexpRouter[method] = collection = [];
        }

        collection.push(rule);
    }

    public route(
        method: HTTPMethod,
        path: string,
        context: RequestContext
    ): RouteResult {

        let ret: any = {

            "middlewares": this._filterMiddlewares(method, path, context),

            "handler": null
        };

        if (!this._stringRouter[method] && !this._regexpRouter[method]) {

            ret.handler = this._notFoundHandler;
            context.data = {};

            return ret;
        }

        if (this._stringRouter[method] && this._stringRouter[method][path]) {

            ret.handler = this._stringRouter[method][path].handler;
            context.data = this._stringRouter[method][path].data || {};
            return ret;
        }

        if (this._regexpRouter[method]) {

            for (const route of this._regexpRouter[method]) {

                if (route.route(path, context)) {

                    ret.handler = route.handler;
                    context.data = route.data || {};
                    return ret;
                }
            }
        }

        ret.handler = this._notFoundHandler;
        context.data = {};

        return ret;
    }

    protected _filterMiddlewares(
        method: HTTPMethod,
        path: string,
        context: RequestContext
    ): RequestMiddleware[] {

        let ret: RequestMiddleware[] = [];

        for (let middleware of this._middlewares[method]) {

            if (middleware.rule && !middleware.rule.route(path, context)) {

                continue;
            }

            ret.push(middleware.handler);
        }

        return ret;
    }

    public notFound(
        handler: RequestHandler<CT>
    ): this {

        this._notFoundHandler = handler;

        return this;
    }
}

export function createStandardRouter<
    CT extends RequestContext = RequestContext
>(): StandardRouter<CT> {

    return new Router<CT>();
}

export default createStandardRouter;
