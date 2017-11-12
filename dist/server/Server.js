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
class Server extends events.EventEmitter {
    constructor(opts) {
        super();
        this._port = opts.port || Core.DEFAULT_PORT;
        this._host = opts.host || Core.DEFAULT_HOST;
        this._backlog = opts.backlog || Core.DEFAULT_BACKLOG;
        this._router = opts.router;
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
            }, this.__requestCallback.bind(this));
        }
        else {
            this._server = http.createServer(this.__requestCallback.bind(this));
        }
        this._server.listen(this._port, this._host, this._backlog, () => {
            this._status = Core.ServerStatus.WORKING;
            ret.resolve();
        }).on("error", function (err) {
            ret.reject(new HttpException(ServerError.FAILED_TO_START, err.message));
        }).on("connect", function (req, socket) {
            socket.write("HTTP/1.1 405 METHOD NOW ALLOWED\r\nConnection: Close\r\n\r\n");
        });
        return ret.promise;
    }
    __initializeRequest(request, url) {
        // @ts-ignore
        request.path = url.path;
        request.queryString = url.query;
        request.query = url.query ? queryString.parse(url.query) : {};
        request.getBodyAsJSON = async function (maxLength = 0) {
            try {
                return JSON.parse((await this.getBody(maxLength)).toString());
            }
            catch (e) {
                return Promise.reject(e);
            }
        };
        request.getBody = async function (maxLength = 0) {
            let ret = new core_1.RawPromise();
            let buf = [];
            if (maxLength) {
                let length = 0;
                request.on("data", function (d) {
                    length += d.byteLength;
                    if (length > maxLength) {
                        request.removeAllListeners("end");
                        request.removeAllListeners("data");
                        return ret.reject(new HttpException(ServerError.EXCEED_MAX_BODY_LENGTH, "The received body exceed max length restriction."));
                    }
                    buf.push(d);
                });
            }
            else {
                request.on("data", function (d) {
                    buf.push(d);
                });
            }
            request.on("end", function () {
                let data = Buffer.concat(buf);
                // @ts-ignore
                buf = undefined;
                ret.resolve(data);
            });
            return ret.promise;
        };
    }
    __initializeResponse(response) {
        response.redirect = function (target, statusCode = Core.HTTPStatus.TEMPORARY_REDIRECT) {
            if (this.headersSent) {
                throw new HttpException(ServerError.HEADERS_ALREADY_SENT, "Response headers were already sent.");
            }
            this.writeHead(statusCode, { "Location": target });
            return this;
        };
        response.sendJSON = function (data) {
            if (this.finished) {
                throw new HttpException(ServerError.RESPONSE_ALREADY_CLOSED, "Response has been closed");
            }
            data = JSON.stringify(data);
            if (!this.headersSent) {
                this.setHeader("Content-Type", "application/json");
                this.setHeader("Content-Length", data.length);
            }
            this.end(data);
            return this;
        };
    }
    async __requestCallback(request, response) {
        let url = libUrl.parse(request.url);
        let path = url.pathname;
        this.__initializeRequest(request, url);
        this.__initializeResponse(response);
        // @ts-ignore
        url = null;
        if (path.length > 1 && path.endsWith("/")) {
            path = path.substr(0, path.length - 1);
        }
        let context = new Context();
        context.params = {};
        let routeResult = this._router.route(request.method, path, context);
        context.request = request;
        context.response = response;
        context.data = {};
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
                await middlewares[index](context, (end = false) => {
                    return this.__execute(middlewares, handler, context, end ? -1 : index + 1);
                });
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