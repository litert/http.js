import * as Core from "./Core";
import net = require("net");
import http = require("http");
import https = require("https");
import { RawPromise } from "@litert/core";
import HttpException from "./Exception";
import ServerError from "./Errors";
import Context = require("./Context");
import libUrl = require("url");
import events = require("events");
import queryString = require("querystring");
import "./Response";
import "./Request";

class Server extends events.EventEmitter implements Core.Server {

    protected _port: number;

    protected _host: string;

    protected _backlog: number;

    protected _keepAlive: number;

    protected _status: Core.ServerStatus;

    protected _server: http.Server | https.Server;

    protected _router: Core.Router;

    protected _ssl: Core.SSLConfiguration;

    protected _expectRequest: boolean;

    protected _timeout: number;

    protected _cookies: Core.CookiesEncoder;

    public constructor(opts: Core.CreateServerOptions) {

        super();

        this._host = opts.host || Core.DEFAULT_HOST;
        this._backlog = opts.backlog || Core.DEFAULT_BACKLOG;
        this._router = opts.router;
        this._expectRequest = opts.expectRequest || Core.DEFAULT_EXPECT_REQUEST;
        this._keepAlive = opts.keeyAlive || Core.DEFAULT_KEEP_ALIVE;
        this._timeout = opts.timeout !== undefined ?
                            opts.timeout :
                            Core.DEFAULT_TIMEOUT;

        if (opts.ssl) {

            this._port = opts.port || Core.DEFAULT_SSL_PORT;
            this._ssl = opts.ssl;
        }
        else {

            this._port = opts.port || Core.DEFAULT_PORT;
        }

        this._status = Core.ServerStatus.READY;

        if (opts.cookies) {

            this._cookies = opts.cookies;
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

        this._server.on("connect", function(
            req: http.IncomingMessage,
            socket: net.Socket
        ) {

            socket.write("HTTP/1.1 405 METHOD NOW ALLOWED\r\nConnection: Close\r\n\r\n");

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

                ret.resolve();
            }
        );

        return ret.promise;
    }

    protected __initializeRequest(
        request: Core.ServerRequest,
        response: Core.ServerResponse
    ): void {

        let url = libUrl.parse(<string> request.url);

        request.params = {};

        // @ts-ignore
        request.path = url.pathname;

        // @ts-ignore
        request.queryString = url.search;

        request.realPath = request.path;

        if (request.realPath.length > 1 && request.realPath.endsWith("/")) {

            request.realPath = request.realPath.substr(0, request.realPath.length - 1);
        }

        if (typeof url.query === "string") {

            request.query = queryString.parse(url.query);
        }
        else {

            request.query = url.query || {};
        }

        // @ts-ignore
        request.ip = request.connection.remoteAddress;

        request.server = this;
        request.time = Date.now();

        if (request.headers["host"]) {

            if (typeof request.headers["host"] === "string") {

                // @ts-ignore
                request.host = request.headers["host"];
            }
            else {

                // @ts-ignore
                request.host = request.headers["host"][0];
            }
        }
        else {

            request.host = this._host;
        }

        if (this._ssl) {

            request.https = true;
        }

        request.on("aborted", function(this: Core.ServerRequest) {

            this.aborted = true;

        }).on("close", function(this: Core.ServerRequest) {

            this.closed = true;
        });

        // @ts-ignore
        request._cookiesEncoder = this._cookies;
        // @ts-ignore
        response._cookiesDecoder = this._cookies;
    }

    protected async __requestCallback(
        request: Core.ServerRequest,
        response: Core.ServerResponse
    ): Promise<void> {

        this.__initializeRequest(request, response);

        let context = new Context();

        context.request = request;
        context.response = response;

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

            delete this._server;
            this._status = Core.ServerStatus.READY;

            ret.resolve();
        });

        return ret.promise;
    }
}

export default function(opts: Core.CreateServerOptions): Core.Server {

    return new Server(opts);
}
