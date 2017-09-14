"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libHTTP = require("http");
const libEvents = require("events");
const libURL = require("url");
const RegExpRouter = require("./class.RegExpRouter");
const SmartRouter = require("./class.SmartRouter");
const PlainRouter = require("./class.PlainRouter");
const common_1 = require("./common");
exports.EVENT_SHUTTING_DOWN = "SHUTTING_DOWN";
exports.EVENT_NOT_FOUND = "NOT_FOUND";
exports.EVENT_HANDLER_FAILURE = "HANDLER_FAILURE";
exports.EVENT_METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED";
class Server extends libEvents.EventEmitter {
    constructor(opts) {
        super();
        this._opts = {};
        this._status = common_1.ServerStatus.IDLE;
        this._handlers = {
            "GET": [],
            "POST": [],
            "PUT": [],
            "PATCH": [],
            "DELETE": [],
            "OPTIONS": [],
            "HEAD": [],
            "ERROR": {}
        };
        this._middlewares = {
            "after-router": [],
            "before-router": [],
            "end": []
        };
        if (opts) {
            this._opts.backlog = (typeof opts.backlog === "number" ? opts.backlog : common_1.DEFAULT_BACKLOG);
            this._opts.port = (typeof opts.port === "number" ? opts.port : common_1.DEFAULT_PORT);
            this._opts.host = (typeof opts.host === "string" ? opts.host : common_1.DEFAULT_HOST);
        }
        else {
            this._opts.backlog = common_1.DEFAULT_BACKLOG;
            this._opts.port = common_1.DEFAULT_PORT;
            this._opts.host = common_1.DEFAULT_HOST;
        }
        this.register("ERROR", exports.EVENT_SHUTTING_DOWN, async (req, resp) => {
            this.displayHTTPError(resp, 500, "SYSTEM MAINTANCING");
            req.destroy();
            return;
        });
        this.register("ERROR", exports.EVENT_NOT_FOUND, async (req, resp) => {
            this.displayHTTPError(resp, 404, "NOT FOUND");
            return;
        });
        this.register("ERROR", exports.EVENT_HANDLER_FAILURE, async (req, resp) => {
            if (!resp.finished) {
                this.displayHTTPError(resp, 500, "INTERNAL ERROR");
            }
            return;
        });
        this.register("ERROR", exports.EVENT_METHOD_NOT_ALLOWED, async (req, resp) => {
            if (!resp.finished) {
                this.displayHTTPError(resp, 405, "METHOD NOT ALLOWED");
            }
            return;
        });
    }
    displayHTTPError(resp, code, msg) {
        resp.writeHead(code, msg);
        resp.end(`<!doctype html>
<html lang="en_US">
    <head>
        <meta charset="utf-8">
        <title>${msg}</title>
    </head>
    <body>
        <h1 style="text-align: center">HTTP ${code}</h1>
        <h2 style="text-align: center">${msg}</h2>
    </body>
</html>`);
    }
    get status() {
        return this._status;
    }
    close() {
        if (this._status !== common_1.ServerStatus.WORKING) {
            return this;
        }
        this._status = common_1.ServerStatus.CLOSING;
        this._server.close(() => {
            this._status = common_1.ServerStatus.IDLE;
            delete this._server;
            this.emit("close");
        });
        return this;
    }
    register(method, uri, ...args) {
        let handler;
        let options;
        if (args.length === 2) {
            options = args[0];
            handler = args[1];
        }
        else {
            handler = args[0];
            options = {};
        }
        if (method === "ERROR") {
            if (typeof uri !== "string") {
                if (this.listenerCount("error")) {
                    this.emit("error", new Error("Invalid type of ERROR handler."));
                    return this;
                }
                else {
                    throw new Error("Invalid type for ERROR.");
                }
            }
            this._handlers["ERROR"][uri] = handler;
            return this;
        }
        if (typeof uri === "string") {
            if (uri.indexOf("{") > -1) {
                this._handlers[method].push(new SmartRouter(uri, handler, options));
            }
            else {
                this._handlers[method].push(new PlainRouter(uri, handler, options));
            }
        }
        else {
            this._handlers[method].push(new RegExpRouter(uri, handler, options));
        }
        return this;
    }
    hook(type, ...args) {
        let uri;
        let handler;
        let router;
        if (args.length === 2) {
            uri = args[0];
            handler = args[1];
        }
        else {
            uri = null;
            handler = args[0];
        }
        if (typeof uri === "string") {
            if (uri.indexOf("{") > -1) {
                router = new SmartRouter(uri, handler, {});
            }
            else {
                router = new PlainRouter(uri, handler, {});
            }
        }
        else if (uri === null) {
            router = new PlainRouter(null, handler, {});
        }
        else {
            router = new RegExpRouter(uri, handler, {});
        }
        if (type === "before-all") {
            this._middlewares["before-router"].unshift(router);
        }
        else {
            this._middlewares[type].push(router);
        }
        return this;
    }
    /**
     * This private method helps execute a handler.
     *
     * @param handler The handler to be executed.
     * @param req The request controlling object.
     * @param resp The response controlling object.
     */
    async _executeHandler(handler, req, resp) {
        try {
            await handler(req, resp);
            if (!resp.finished) {
                resp.end();
            }
        }
        catch (e) {
            handler = this._handlers["ERROR"][exports.EVENT_HANDLER_FAILURE];
            await handler(req, resp);
            if (!resp.finished) {
                resp.end();
            }
        }
    }
    start() {
        if (this._server) {
            return this;
        }
        this._status = common_1.ServerStatus.STARTING;
        this._server = libHTTP.createServer(async (req, resp) => {
            req.params = {};
            let url = libURL.parse(req.url, true);
            req.server = this;
            if (url.pathname.endsWith("/")) {
                req.path = url.pathname.substr(0, url.pathname.length - 1);
            }
            else {
                req.path = url.pathname;
            }
            req.queries = url.query;
            req.queryString = url.search;
            url = undefined;
            let handler;
            if (!this._handlers[req.method]) {
                this._executeHandler(this._handlers["ERROR"][exports.EVENT_METHOD_NOT_ALLOWED], req, resp);
                return;
            }
            if (this._status === common_1.ServerStatus.CLOSING) {
                handler = this._handlers["ERROR"][exports.EVENT_SHUTTING_DOWN];
                this._executeHandler(handler, req, resp);
                return;
            }
            for (let item of this._middlewares["before-router"]) {
                if (item.route(req.path, req.params)) {
                    try {
                        if (await item.handler(req, resp) === false) {
                            return;
                        }
                    }
                    catch (e) {
                        return;
                    }
                }
            }
            for (let item of this._handlers[req.method]) {
                if (item.route(req.path, req.params)) {
                    handler = item.handler;
                    req.handlerOptions = item.options;
                    break;
                }
            }
            if (!handler) {
                handler = this._handlers["ERROR"][exports.EVENT_NOT_FOUND];
            }
            else {
                for (let item of this._middlewares["after-router"]) {
                    if (item.route(req.path, req.params)) {
                        try {
                            if (await item.handler(req, resp) === false) {
                                return;
                            }
                        }
                        catch (e) {
                            return;
                        }
                    }
                }
            }
            await this._executeHandler(handler, req, resp);
            for (let item of this._middlewares["end"]) {
                if (item.route(req.path, req.params)) {
                    try {
                        if (await item.handler(req, resp) === false) {
                            return;
                        }
                    }
                    catch (e) {
                        return;
                    }
                }
            }
        });
        this._server.listen(this._opts.port, this._opts.host, this._opts.backlog, () => {
            this._status = common_1.ServerStatus.WORKING;
            this.emit("started");
        });
        this._server.on("error", (e) => {
            this.emit("error", e);
        });
        return this;
    }
}
function createServer(opts) {
    return new Server(opts);
}
exports.createServer = createServer;
//# sourceMappingURL=class.Server.js.map