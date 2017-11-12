import { IDictionary } from "@litert/core";
import {
    RequestMiddleware,
    RequestRouter,
    RouteRule,
    HTTPMethod,
    RequestHandler,
    HTTPMethodDictionary,
    RouteResult,
    RequestContext,
    HTTP_METHODS
} from "./Core";
import HttpException = require("./Exception");
import ServerError = require("./Errors");
import PlainRouteRule = require("./router-rules/Plain");
import RegExpRouteRule = require("./router-rules/RegExp");
import SmartRouteRule = require("./router-rules/Smart");

class Middleware {

    public method: HTTPMethod;

    public rule: RouteRule<null>;

    public handler: RequestMiddleware;
}

class Router implements RequestRouter {

    protected _stringRouter: HTTPMethodDictionary<
        IDictionary<RouteRule<RequestHandler>>
    >;

    protected _regexpRouter: HTTPMethodDictionary<
        Array<RouteRule<RequestHandler>>
    >;

    protected _middlewares: Middleware[];

    protected _notFoundRouter: RequestHandler;

    protected _badMethodRouter: RequestHandler;

    public constructor() {

        /**
         * Remove the sick type-assert error before TypeScript 2.7
         */

        // @ts-ignore
        this._regexpRouter = {};

        // @ts-ignore
        this._stringRouter = {};

        this._middlewares = [];
    }

    public use(): RequestRouter {

        let middleware = new Middleware();

        for (const arg of arguments) {

            if (typeof arg === "string") {

                if (HTTP_METHODS.indexOf(<HTTPMethod> arg) > -1) {

                    middleware.method = <HTTPMethod> arg;
                }
                else {

                    this._checkPath(arg);

                    if (arg.indexOf("{")) {

                        middleware.rule = new SmartRouteRule<null>(null, arg, {});
                    }
                    else {

                        middleware.rule = new PlainRouteRule<null>(null, arg, {});
                    }
                }
            }
            else if (arg instanceof RegExp) {

                middleware.rule = new RegExpRouteRule<null>(null, arg, {});
            }
            else if (typeof arg === "function") {

                middleware.handler = arg;
            }
        }

        this._middlewares.push(middleware);

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
        method: HTTPMethod,
        path: string | RegExp,
        handler: RequestHandler,
        data: IDictionary<any> = {}
    ): RequestRouter {

        if (path instanceof RegExp) {

            this._addRegExpRule(
                method,
                new RegExpRouteRule(handler, path, data)
            );
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

            ret.handler = this._badMethodRouter;

            return ret;
        }

        if (this._stringRouter[method] && this._stringRouter[method][path]) {

            ret.handler = this._stringRouter[method][path].handler;
            return ret;
        }

        if (this._regexpRouter[method]) {

            for (const route of this._regexpRouter[method]) {

                if (route.route(path, context)) {

                    ret.handler = route.handler;
                    return ret;
                }
            }
        }

        ret.handler = this._notFoundRouter;

        return ret;
    }

    protected _filterMiddlewares(
        method: HTTPMethod,
        path: string,
        context: RequestContext
    ): RequestMiddleware[] {

        let ret: RequestMiddleware[] = [];

        for (let middleware of this._middlewares) {

            if (middleware.method && method !== middleware.method) {

                continue;
            }

            if (middleware.rule && !middleware.rule.route(path, context)) {

                continue;
            }

            ret.push(middleware.handler);
        }

        return ret;
    }

    public notFound(
        handler: RequestHandler
    ): RequestRouter {

        this._notFoundRouter = handler;

        return this;
    }

    public badMethod(
        handler: RequestHandler
    ): RequestRouter {

        this._badMethodRouter = handler;

        return this;
    }
}

export = function(): RequestRouter {

    return new Router();
};