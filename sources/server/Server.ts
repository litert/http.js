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

import * as Core from "./Core";
import net = require("net");
import http = require("http");
import https = require("https");
import * as http2 from "http2";
import { RawPromise } from "@litert/core";
import HttpException from "./Exception";
import ServerError from "./Errors";
import createDefaultContext from "./DefaultContext";
import libUrl = require("url");
import events = require("events");
import "./Response";
import "./Request";

interface InternalServer extends http.Server {

    controlServer: Core.Server;
}

class Server extends events.EventEmitter implements Core.Server {

    protected _port: number;

    protected _host: string;

    protected _backlog: number;

    protected _keepAlive: number;

    protected _status: Core.ServerStatus;

    private _server: InternalServer;

    protected _router: Core.Router;

    protected _ssl: Core.SSLConfiguration;

    protected _expectRequest: boolean;

    protected _contextCreator: Core.ContextCreator<Core.RequestContext>;

    protected _timeout: number;

    protected _cookiesEncoder: Core.CookiesEncoder;

    protected _version: number;

    public constructor(opts: Core.CreateServerOptions) {

        super();

        this._contextCreator = opts.contextCreator || createDefaultContext;
        this._host = opts.host || Core.DEFAULT_HOST;
        this._backlog = opts.backlog || Core.DEFAULT_BACKLOG;
        this._router = opts.router;
        this._expectRequest = opts.expectRequest || Core.DEFAULT_EXPECT_REQUEST;
        this._keepAlive = opts.keeyAlive || Core.DEFAULT_KEEP_ALIVE;
        this._timeout = opts.timeout !== undefined ?
                            opts.timeout :
                            Core.DEFAULT_TIMEOUT;

        this._version = opts.version || Core.DEFAULT_VERSION;

        if (opts.ssl) {

            this._port = opts.port || Core.DEFAULT_SSL_PORT;
            this._ssl = opts.ssl;
        }
        else {

            this._port = opts.port || Core.DEFAULT_PORT;
        }

        this._status = Core.ServerStatus.READY;

        if (opts.cookies) {

            this._cookiesEncoder = opts.cookies;
        }
    }

    public get host(): string {

        return this._host;
    }

    public get port(): number {

        return this._port;
    }

    public get backlog(): number {

        return this._backlog;
    }

    public get status(): Core.ServerStatus {

        return this._status;
    }

    public start(): Promise<void> {

        if (this._status !== Core.ServerStatus.READY) {

            return Promise.resolve();
        }

        let ret = new RawPromise<void, HttpException>();

        this._status = Core.ServerStatus.STARTING;

        if (this._version === 2) {

            if (this._ssl) {

                this._server = <any> http2.createSecureServer({

                    "key": this._ssl.key,

                    "cert": this._ssl.certificate,

                    "passphrase": this._ssl.passphrase
                });
            }
            else {

                this._server = http2.createServer() as InternalServer;
            }
        }
        else {

            if (this._ssl) {

                this._server = <any> https.createServer({

                    "key": this._ssl.key,

                    "cert": this._ssl.certificate,

                    "passphrase": this._ssl.passphrase
                });
            }
            else {

                this._server = http.createServer() as InternalServer;
            }
        }

        this._server.on("connect", function(
            req: http.IncomingMessage,
            socket: net.Socket
        ) {

            socket.write(
                "HTTP/1.1 405 METHOD NOW ALLOWED\r\nConnection: Close\r\n\r\n"
            );

        }).on(
            "request",
            this.__requestCallback.bind(this)
        );

        if (this._expectRequest) {

            this.on("checkContinue", this.__requestCallback.bind(this));
            this.on("checkExpectation", this.__requestCallback.bind(this));
        }

        this._server.setTimeout(this._timeout);

        this._server.keepAliveTimeout = this._keepAlive;

        this._server.once("error", (err: Error) => {

            ret.reject(new HttpException(
                ServerError.FAILED_TO_START,
                err.message
            ));

            delete this._server;

            this._status = Core.ServerStatus.READY;
        });

        this._server.listen(
            this._port,
            this._host,
            this._backlog,
            (): void => {

                this._status = Core.ServerStatus.WORKING;

                this._server.removeAllListeners("error")
                .on("error", (e: Error) => {

                    this.emit("error", e);
                });

                this._server.controlServer = this;

                ret.resolve();

                this.emit("started");
            }
        );

        return ret.promise;
    }

    protected __initializeRequest(
        request: Core.ServerRequest,
        response: Core.ServerResponse
    ): void {

        let url = libUrl.parse(request.url as string);

        request.params = {};

        // @ts-ignore
        request.path = url.pathname;

        // @ts-ignore
        request.queryString = url.search;

        request.realPath = request.path;

        if (request.realPath.length > 1 && request.realPath.endsWith("/")) {

            request.realPath = request.realPath.substr(
                0,
                request.realPath.length - 1
            );
        }

        request.time = Date.now();

        request.on("aborted", function(this: Core.ServerRequest) {

            this.aborted = true;

        }).on("close", function(this: Core.ServerRequest) {

            this.closed = true;
        });
    }

    protected async __requestCallback(
        request: Core.ServerRequest,
        response: Core.ServerResponse
    ): Promise<void> {

        this.__initializeRequest(request, response);

        let context = this._contextCreator(
            request,
            response
        );

        let routeResult = this._router.route(
            <Core.HTTPMethod> request.method,
            request.realPath,
            context
        );

        try {

            await this.__execute(
                routeResult.middlewares,
                routeResult.handler,
                context
            );

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

        delete context.request;
        delete context.response;
        delete context.data;
    }

    protected async __execute(
        middlewares: Core.RequestMiddleware[],
        handler: Core.RequestHandler,
        context: Core.RequestContext,
        index: number = 0
    ): Promise<void> {

        try {

            if (middlewares[index]) {

                let called: boolean = false;

                await middlewares[index](context, (end: boolean = false) => {

                    called = true;

                    return this.__execute(
                        middlewares,
                        handler,
                        context,
                        end ? -1 : index + 1
                    );
                });

                if (!called) {

                    return Promise.reject(new HttpException(
                        ServerError.MISSING_CALLING_NEXT,
                        "The next callback is not called inside middleware."
                    ));
                }
            }
            else if (index !== -1) {

                await handler(context);
            }
        }
        catch (e) {

            return Promise.reject(e);
        }
    }

    public shutdown(): Promise<void> {

        if (this._status !== Core.ServerStatus.WORKING) {

            return Promise.reject(new HttpException(
                ServerError.SERVER_NOT_WORKING,
                "Server is not started."
            ));
        }

        this._status = Core.ServerStatus.CLOSING;

        let ret = new RawPromise<void, HttpException>();

        this._server.close(() => {

            delete this._server.controlServer;
            delete this._server;
            this._status = Core.ServerStatus.READY;

            ret.resolve();

            this.emit("closed");
        });

        return ret.promise;
    }
}

export default function(opts: Core.CreateServerOptions): Core.Server {

    return new Server(opts);
}
