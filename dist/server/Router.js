"use strict";
const Core_1 = require("./Core");
const HttpException = require("./Exception");
const ServerError = require("./Errors");
const PlainRouteRule = require("./router-rules/Plain");
const RegExpRouteRule = require("./router-rules/RegExp");
const SmartRouteRule = require("./router-rules/Smart");
class Middleware {
}
class Router {
    constructor() {
        /**
         * Remove the sick type-assert error before TypeScript 2.7
         */
        // @ts-ignore
        this._regexpRouter = {};
        // @ts-ignore
        this._stringRouter = {};
        this._middlewares = [];
    }
    use() {
        let middleware = new Middleware();
        for (const arg of arguments) {
            if (typeof arg === "string") {
                if (Core_1.HTTP_METHODS.indexOf(arg) > -1) {
                    middleware.method = arg;
                }
                else {
                    this._checkPath(arg);
                    if (arg.indexOf("{")) {
                        middleware.rule = new SmartRouteRule(null, arg, {});
                    }
                    else {
                        middleware.rule = new PlainRouteRule(null, arg, {});
                    }
                }
            }
            else if (arg instanceof RegExp) {
                middleware.rule = new RegExpRouteRule(null, arg, {});
            }
            else if (typeof arg === "function") {
                middleware.handler = arg;
            }
        }
        this._middlewares.push(middleware);
        return this;
    }
    _checkPath(path) {
        if (path[0] !== "/"
            || path.indexOf("?") > -1
            || (path.length > 1 && path.endsWith("/"))) {
            throw new HttpException(ServerError.INVALID_PATH, "The URI is not acceptable.");
        }
    }
    register(method, path, handler, data = {}) {
        if (path instanceof RegExp) {
            this._addRegExpRule(method, new RegExpRouteRule(handler, path, data));
        }
        else {
            this._checkPath(path);
            let collection = this._stringRouter[method];
            if (!collection) {
                this._stringRouter[method] = collection = {};
            }
            if (path.indexOf("{") > -1) {
                this._addRegExpRule(method, new SmartRouteRule(handler, path, data));
            }
            else {
                collection[path] = new PlainRouteRule(handler, path, data);
            }
        }
        return this;
    }
    _addRegExpRule(method, rule) {
        let collection = this._regexpRouter[method];
        if (!collection) {
            this._regexpRouter[method] = collection = [];
        }
        collection.push(rule);
    }
    route(method, path, context) {
        let ret = {
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
    _filterMiddlewares(method, path, context) {
        let ret = [];
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
    notFound(handler) {
        this._notFoundRouter = handler;
        return this;
    }
    badMethod(handler) {
        this._badMethodRouter = handler;
        return this;
    }
}
module.exports = function () {
    return new Router();
};
//# sourceMappingURL=Router.js.map