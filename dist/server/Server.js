"use strict";
const Core = require("./Core");
const http = require("http");
const https = require("https");
const core_1 = require("@litert/core");
const HttpException = require("./Exception");
const ServerError = require("./Errors");
const Context = require("./Context");
const libUrl = require("url");
const events = require("events");
const queryString = require("querystring");
require("./Response");
require("./Request");
class Server extends events.EventEmitter {
    constructor(opts) {
        super();
        this._port = opts.port || Core.DEFAULT_PORT;
        this._host = opts.host || Core.DEFAULT_HOST;
        this._backlog = opts.backlog || Core.DEFAULT_BACKLOG;
        this._router = opts.router;
        this._expectRequest = opts.expectRequest || Core.DEFAULT_EXPECT_REQUEST;
        this._keepAlive = opts.keeyAlive || Core.DEFAULT_KEEP_ALIVE;
        if (opts.ssl) {
            this._ssl = opts.ssl;
        }
        this._status = Core.ServerStatus.READY;
    }
    get host() {
        return this._host;
    }
    get port() {
        return this._port;
    }
    get backlog() {
        return this._backlog;
    }
    get status() {
        return this._status;
    }
    start() {
        if (this._status !== Core.ServerStatus.READY) {
            return Promise.resolve();
        }
        let ret = new core_1.RawPromise();
        this._status = Core.ServerStatus.STARTING;
        if (this._ssl) {
            this._server = https.createServer({
                "key": this._ssl.key,
                "cert": this._ssl.certificate,
                "passphrase": this._ssl.passphrase
            });
        }
        else {
            this._server = http.createServer();
        }
        this._server.on("error", function (err) {
            ret.reject(new HttpException(ServerError.FAILED_TO_START, err.message));
        }).on("connect", function (req, socket) {
            socket.write("HTTP/1.1 405 METHOD NOW ALLOWED\r\nConnection: Close\r\n\r\n");
        }).on("request", this.__requestCallback.bind(this));
        if (this._expectRequest) {
            this.on("checkContinue", this.__requestCallback.bind(this));
            this.on("checkExpectation", this.__requestCallback.bind(this));
        }
        this._server.setTimeout(30000);
        this._server.keepAliveTimeout = this._keepAlive;
        this._server.listen(this._port, this._host, this._backlog, () => {
            this._status = Core.ServerStatus.WORKING;
            ret.resolve();
        });
        return ret.promise;
    }
    __initializeRequest(request) {
        let url = libUrl.parse(request.url);
        // @ts-ignore
        request.path = url.pathname;
        // @ts-ignore
        request.queryString = url.search;
        if (typeof url.query === "string") {
            request.query = queryString.parse(url.query);
        }
        else {
            request.query = url.query || {};
        }
        request.server = this;
        request.time = Date.now();
        if (request.headers["host"]) {
            if (typeof request.headers["host"] === "string") {
                // @ts-ignore
                request.host = request.headers["host"];
            }
            else {
                request.host = request.headers["host"][0];
            }
        }
        else {
            request.host = this._host;
        }
        request.on("aborted", function () {
            this.aborted = true;
        }).on("close", function () {
            this.closed = true;
        });
    }
    async __requestCallback(request, response) {
        this.__initializeRequest(request);
        let path = request.path;
        if (path.length > 1 && path.endsWith("/")) {
            path = path.substr(0, path.length - 1);
        }
        let context = new Context();
        context.params = {};
        let routeResult = this._router.route(request.method, path, context);
        context.request = request;
        context.response = response;
        try {
            await this.__execute(routeResult.middlewares, routeResult.handler, context);
            if (!response.finished) {
                response.end();
            }
        }
        catch (e) {
            if (this.listenerCount("error")) {
                this.emit("error", e);
            }
            else {
                throw e;
            }
        }
    }
    async __execute(middlewares, handler, context, index = 0) {
        try {
            if (middlewares[index]) {
                let called = false;
                await middlewares[index](context, (end = false) => {
                    called = true;
                    return this.__execute(middlewares, handler, context, end ? -1 : index + 1);
                });
                if (!called) {
                    return Promise.reject(new HttpException(ServerError.MISSING_CALLING_NEXT, "The next callback is not called inside middleware."));
                }
            }
            else {
                await handler(context);
            }
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    shutdown() {
        if (this._status !== Core.ServerStatus.WORKING) {
            return Promise.reject(new HttpException(ServerError.SERVER_NOT_WORKING, "Server is not started."));
        }
        this._status = Core.ServerStatus.CLOSING;
        let ret = new core_1.RawPromise();
        this._server.close(() => {
            delete this._server;
            this._status = Core.ServerStatus.READY;
            ret.resolve();
        });
        return ret.promise;
    }
}
module.exports = function (opts) {
    return new Server(opts);
};
//# sourceMappingURL=Server.js.map