import * as Core from "./Core";
import net = require("net");
import http = require("http");
import { RawPromise } from "@litert/core";
import HttpException = require("./Exception");
import ServerError = require("./Errors");
import Context = require("./Context");
import libUrl = require("url");
import events = require("events");
import queryString = require("querystring");

class Server extends events.EventEmitter implements Core.Server {

    protected _port: number;

    protected _host: string;

    protected _backlog: number;

    protected _status: Core.ServerStatus;

    protected _server: http.Server;

    protected _router: Core.RequestRouter;

    public constructor(opts: Core.CreateServerOptions) {

        super();

        this._port = opts.port || Core.DEFAULT_PORT;
        this._host = opts.host || Core.DEFAULT_HOST;
        this._backlog = opts.backlog || Core.DEFAULT_BACKLOG;
        this._router = opts.router;

        this._status = Core.ServerStatus.READY;
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

        this._server = http.createServer(this.__requestCallback.bind(this));

        this._server.listen(
            this._port,
            this._host,
            this._backlog,
            (): void => {

                this._status = Core.ServerStatus.WORKING;
                ret.resolve();
            }
        ).on("error", function(err: Error) {

            ret.reject(new HttpException(
                ServerError.FAILED_TO_START,
                err.message
            ));

        }).on("connect", function(
            req: http.IncomingMessage,
            socket: net.Socket
        ) {

            socket.write("HTTP/1.1 405 METHOD NOW ALLOWED\r\nConnection: Close\r\n\r\n");
        });

        return ret.promise;
    }

    protected _initializeRequest(
        request: Core.ServerRequest,
        url: libUrl.Url
    ): void {

        // @ts-ignore
        request.path = url.path;
        request.queryString = url.query;
        request.query = url.query ? queryString.parse(url.query) : {};

        request.getBody = async function(
            maxLength: number = 0
        ): Promise<Buffer> {

            let ret = new RawPromise<Buffer, HttpException>();

            let buf: Buffer[] = [];

            if (maxLength) {

                let length: number = 0;

                request.on("data", function(d: Buffer) {

                    length += d.byteLength;

                    if (length > maxLength) {

                        request.removeAllListeners("end");
                        request.removeAllListeners("data");

                        return ret.reject(new HttpException(
                            ServerError.EXCEED_MAX_BODY_LENGTH,
                            "The received body exceed max length restriction."
                        ));
                    }

                    buf.push(d);
                });
            }
            else {

                request.on("data", function(d: Buffer) {

                    buf.push(d);
                });
            }

            request.on("end", function() {

                let data = Buffer.concat(buf);

                // @ts-ignore
                buf = undefined;

                ret.resolve(data);
            });

            return ret.promise;
        };
    }

    protected _initializeResponse(
        response: Core.ServerResponse
    ): void {

        response.sendRedirection = function(
            target: string,
            statusCode: number = Core.HTTPStatus.TEMPORARY_REDIRECT
        ): void {

            if (this.headersSent) {

                throw new HttpException(
                    ServerError.HEADERS_ALREADY_SENT,
                    "Response headers were already sent."
                );
            }

            this.writeHead(statusCode, {"Location": target});
        };
    }

    protected async __requestCallback(
        request: Core.ServerRequest,
        response: Core.ServerResponse
    ): Promise<void> {

        let url = libUrl.parse(<string> request.url);

        let path = <string> url.pathname;

        this._initializeRequest(request, url);
        this._initializeResponse(response);

        // @ts-ignore
        url = null;

        if (path.length > 1 && path.endsWith("/")) {

            path = path.substr(0, path.length - 1);
        }

        let context = new Context();

        context.params = {};

        let routeResult = this._router.route(
            <Core.HTTPMethod> request.method,
            path,
            context
        );

        context.request = request;
        context.response = response;
        context.data = {};

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
    }

    protected async __execute(
        middlewares: Core.RequestMiddleware[],
        handler: Core.RequestHandler,
        context: Core.RequestContext,
        index: number = 0
    ): Promise<void> {

        try {

            if (middlewares[index]) {

                await middlewares[index](context, (end: boolean = false) => {

                    return this.__execute(
                        middlewares,
                        handler,
                        context,
                        end ? -1 : index + 1
                    );
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

    public shutdown(): Promise<void> {

        return Promise.resolve();
    }
}

export = function(opts: Core.CreateServerOptions): Core.Server {

    return new Server(opts);
};
