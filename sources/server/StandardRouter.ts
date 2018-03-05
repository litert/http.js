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
} from "./Core";
import HttpException from "./Exception";
import ServerError from "./Errors";
import PlainRouteRule = require("./router-rules/Plain");
import RegExpRouteRule = require("./router-rules/RegExp");
import SmartRouteRule = require("./router-rules/Smart");

class Middleware {

    public method!: HTTPMethod;

    public rule!: RouteRule<null>;

    public handler!: RequestMiddleware;
}

class Router implements StandardRouter {

    protected _stringRouter: HTTPMethodDictionary<
        IDictionary<RouteRule<RequestHandler>>
    >;

    protected _regexpRouter: HTTPMethodDictionary<
        Array<RouteRule<RequestHandler>>
    >;

    protected _middlewares: HTTPMethodDictionary<Middleware[]>;

    protected _notFoundHandler: RequestHandler;

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

    protected _setupMiddlewareRule(
        middleware: Middleware,
        path: string | RegExp
    ): void {

        if (typeof path === "string") {

            this._checkPath(path);

            if (path.indexOf("{") > -1) {

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

    public use(...args: any[]): StandardRouter {

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
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter {

        this.register("GET", path, handler, data);

        return this;
    }

    public post(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter {

        this.register("POST", path, handler, data);

        return this;
    }

    public put(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter {

        this.register("PUT", path, handler, data);

        return this;
    }

    public patch(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter {

        this.register("PATCH", path, handler, data);

        return this;
    }

    public delete(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter {

        this.register("DELETE", path, handler, data);

        return this;
    }

    public options(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter {

        this.register("OPTIONS", path, handler, data);

        return this;
    }

    public head(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter {

        this.register("HEAD", path, handler, data);

        return this;
    }

    public trace(
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter {

        this.register("TRACE", path, handler, data);

        return this;
    }

    protected _checkPath(path: string): void {

        if (
            path[0] !== "/"
            || path.indexOf("?") > -1
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
        handler: RequestHandler,
        data: IDictionary<any> = {}
    ): StandardRouter {

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

            if (path.indexOf("{") > -1) {

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
        handler: RequestHandler
    ): StandardRouter {

        this._notFoundHandler = handler;

        return this;
    }
}

export default function(): StandardRouter {

    return new Router();
}
