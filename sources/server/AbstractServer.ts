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

import * as Abstracts from "./Abstract";
import * as net from "net";
import * as http from "http";
import * as https from "https";
import * as http2 from "http2";
import * as libUrl from "url";
import * as events from "events";
import { RawPromise } from "@litert/core";
import HttpException from "./Exception";
import ServerError from "./Errors";
import createDefaultContext from "./DefaultContext";
import "./Response";
import "./Request";
import Errors from "./Errors";
import * as nodeConstants from "constants";
import {
    InternalServer,
    kStatus,
    kServer,
    cServer
} from "./Internal";
import * as BIPlugins from "./built-in-plugins";

export abstract class AbstractServer
extends events.EventEmitter
implements Abstracts.Server {

    private [kStatus]: Abstracts.ServerStatus;

    private [kServer]: InternalServer;

    protected _router: Abstracts.Router;

    protected _mounted!: boolean;

    protected _opts: Abstracts.ServerOptions;

    public setMounted(): void {

        this._mounted = true;
    }

    public setPlugin(key: string, plugin: any): AbstractServer {

        // @ts-ignore
        this._opts.plugins[key] = plugin;

        return this;
    }

    public hasPlugin(key: string): boolean {

        // @ts-ignore
        return this._opts.plugins[key] !== undefined;
    }

    public constructor(opts: Abstracts.CreateServerOptions) {

        super();

        this._opts = {
            "router": opts.router,
            "contextCreator": opts.contextCreator || createDefaultContext,
            "backlog": opts.backlog || Abstracts.DEFAULT_BACKLOG,
            "host": opts.host || Abstracts.DEFAULT_HOST,
            "expectRequest": opts.expectRequest || Abstracts.DEFAULT_EXPECT_REQUEST,
            "keeyAlive": opts.keeyAlive || Abstracts.DEFAULT_KEEP_ALIVE,
            "timeout": opts.timeout !== undefined ?
                            opts.timeout :
                            Abstracts.DEFAULT_TIMEOUT,
            "version": opts.version || Abstracts.DEFAULT_VERSION,
            "ssl": opts.ssl as Abstracts.SSLConfig,
            "port": opts.port || (opts.ssl ? Abstracts.DEFAULT_SSL_PORT :
                                             Abstracts.DEFAULT_PORT),
            "plugins": opts.plugins || {}
        };

        if (!this._opts.plugins["parser:json"]) {

            this._opts.plugins["parser:json"] = BIPlugins.createJSONParser();
        }

        if (!this._opts.plugins["parser:urlencode"]) {

            this._opts.plugins["parser:urlencode"] = BIPlugins.createURLEncodeParser();
        }

        if (!this._opts.plugins["parser:raw"]) {

            this._opts.plugins["parser:raw"] = BIPlugins.createRawParser();
        }

        if (!this._opts.plugins["parser:base64"]) {

            this._opts.plugins["parser:base64"] = BIPlugins.createBase64Parser();
        }

        if (!this._opts.plugins["parser:string"]) {

            this._opts.plugins["parser:string"] = BIPlugins.createStringParser();
        }

        this._opts.plugins["parser:cookies"] =
                                    this._opts.plugins["parser:cookies"] ||
                                    BIPlugins.createCookiesEncoder();

        this._router = opts.router;

        this[kStatus] = Abstracts.ServerStatus.READY;
    }

    public get host(): string {

        return <string> this._opts.host;
    }

    public get port(): number {

        return <number> this._opts.port;
    }

    public get backlog(): number {

        return <number> this._opts.backlog;
    }

    public get status(): Abstracts.ServerStatus {

        return this[kStatus];
    }

    public get ssl(): Abstracts.SSLConfig {

        return this._opts.ssl as Abstracts.SSLConfig;
    }

    public static __getMinSSLVersionFlag(minVer: string): number {

        const availableVersions = [{
            "name": "SSLv2",
            "flag": nodeConstants.SSL_OP_NO_SSLv2
        }, {
            "name": "SSLv3",
            "flag": nodeConstants.SSL_OP_NO_SSLv3
        }, {
            "name": "TLSv1.0",
            "flag": nodeConstants.SSL_OP_NO_TLSv1
        }, {
            "name": "TLSv1.1",
            "flag": nodeConstants.SSL_OP_NO_TLSv1_1
        }, {
            "name": "TLSv1.2",
            "flag": nodeConstants.SSL_OP_NO_TLSv1_2
        }];

        let ret: number = 0;

        let minPos = availableVersions.findIndex((val) => val.name === minVer);

        if (minPos !== -1) {

            for (let item of availableVersions.slice(0, minPos)) {

                ret |= item.flag;
            }
        }

        return ret;
    }

    public shutdown(): Promise<void> {

        if (this._mounted) {

            return Promise.reject(new HttpException(
                Errors.SHUTDOWN_MOUNTED_SERVER,
                "Cannot shutdown a mounted server."
            ));
        }

        if (this[kStatus] !== Abstracts.ServerStatus.WORKING) {

            return Promise.reject(new HttpException(
                ServerError.SERVER_NOT_WORKING,
                "Server is not started."
            ));
        }

        this[kStatus] = Abstracts.ServerStatus.CLOSING;

        let ret = new RawPromise<void, HttpException>();

        this[kServer].close(() => {

            delete this[kServer][cServer];
            delete this[kServer];
            this[kStatus] = Abstracts.ServerStatus.READY;

            ret.resolve();

            this.emit("closed");
        });

        return ret.promise;
    }

    protected static _createListener(
        opts: Abstracts.CreateServerOptions,
        server: Abstracts.Server,
        params: any,
        requestCode: string
    ) {

        let hostField: string;

        if (opts.version === 2) {

            hostField = ":authority";
        }
        else {

            hostField = "host";
        }

        let fnBody: string = `
return function(request, response) {

    let url = libUrl.parse(request.url);

    response.plugins = request.plugins = plugins;
    request.params = {};
    request.path = url.pathname;
    request.queryString = url.search;
    request.realPath = request.path;
    request.ip = request.connection.remoteAddress;
    request.https = ${opts.ssl ? "true" : "false"};

    if (request.realPath.length > 1 && request.realPath.endsWith("/")) {

        request.realPath = request.realPath.substr(
            0,
            request.realPath.length - 1
        );
    }

    if (request.headers["${hostField}"]) {

        if (typeof request.headers["${hostField}"] === "string") {

            request.host = request.headers["${hostField}"].toLowerCase();
        }
        else {

            request.host = request.headers["${hostField}"][0].toLowerCase();
        }
    }
    else {

        request.host = "";
    }

    if (request.host) {

        let hostInfo = request.host.split(":");

        if (hostInfo.length === 2) {

            request.hostPort = parseInt(hostInfo[1]);
            request.hostDomain = hostInfo[0];
        }
        else {

            request.hostPort = ${opts.port};
            request.hostDomain = request.host;
        }
    }
    else {

        request.hostPort = ${opts.port};
        request.hostDomain = "";
    }

    request.time = Date.now();

    request.once("aborted", new Function("this.aborted = true;"))
    .once("close", new Function("this.closed = true;"));

    let context = createContext(
        request,
        response
    );

    ${requestCode}
};`;

        return (new Function(
            "plugins",
            "createContext",
            "server",
            "libUrl",
            "params",
            "cServer",
            fnBody
        ))(
            opts.plugins || {},
            opts.contextCreator,
            server,
            libUrl,
            params,
            cServer
        );
    }

    protected _getRequestCode(): string {

        return `
    server.__requestEntry(createContext(
        request,
        response
    )).catch(function(e) {
        server.emit("error", e);
    });`;
    }

    protected _getRequestParams(): any {

        return null;
    }

    public start(): Promise<void> {

        if (this._mounted) {

            return Promise.reject(new HttpException(
                Errors.START_MOUNTED_SERVER,
                "Cannot start a mounted server."
            ));
        }

        if (this[kStatus] !== Abstracts.ServerStatus.READY) {

            return Promise.resolve();
        }

        let ret = new RawPromise<void, HttpException>();

        this[kStatus] = Abstracts.ServerStatus.STARTING;

        let sslConfig: any;

        if (this._opts.ssl) {

            const sslItem = this.ssl as Abstracts.SSLConfig;

            sslConfig = {
                "key": sslItem.key,
                "cert": sslItem.certificate,
                "passphrase": sslItem.passphrase
            };

            if (!sslItem.minProtocolVersion) {

                sslItem.minProtocolVersion = Abstracts.DEFAULT_MIN_SSL_VERSION;
            }

            sslConfig.secureOptions = AbstractServer.__getMinSSLVersionFlag(
                sslItem.minProtocolVersion
            );
        }

        if (this._opts.version === 2) {

            if (this._opts.ssl) {

                this[kServer] = <any> http2.createSecureServer(sslConfig);
            }
            else {

                this[kServer] = http2.createServer() as InternalServer;
            }
        }
        else {

            if (this._opts.ssl) {

                this[kServer] = <any> https.createServer(sslConfig);
            }
            else {

                this[kServer] = http.createServer() as InternalServer;
            }
        }

        let callback = AbstractServer._createListener(
            this._opts,
            this,
            this._getRequestParams(),
            this._getRequestCode()
        );

        this[kServer].on("connect", function(
            req: http.IncomingMessage,
            socket: net.Socket
        ) {

            socket.write(
                "HTTP/1.1 405 METHOD NOW ALLOWED\r\nConnection: Close\r\n\r\n"
            );

        }).on(
            "request",
            callback
        );

        if (this._opts.expectRequest) {

            this.on("checkContinue", callback);
            this.on("checkExpectation", callback);
        }

        this[kServer].setTimeout(this._opts.timeout);

        this[kServer].keepAliveTimeout = <number> this._opts.keeyAlive;

        this[kServer].once("error", (err: Error) => {

            ret.reject(new HttpException(
                ServerError.FAILED_TO_START,
                err.message
            ));

            delete this[kServer];

            this[kStatus] = Abstracts.ServerStatus.READY;
        });

        this[kServer].listen(
            this._opts.port,
            this._opts.host,
            this._opts.backlog,
            (): void => {

                this[kStatus] = Abstracts.ServerStatus.WORKING;

                this[kServer].removeAllListeners("error")
                .on("error", (e: Error) => {

                    this.emit("error", e);
                });

                this[kServer][cServer] = this;

                ret.resolve();

                this.emit("started");
            }
        );

        return ret.promise;
    }

    /**
     * The real handler callback for a HTTP request.
     *
     * @param request The HTTP session request controller
     * @param response The HTTP session response controller
     */
    public async __requestEntry(
        context: Abstracts.RequestContext
    ): Promise<void> {

        const request = context.request;
        const response = context.response;

        let routeResult = this._router.route(
            <Abstracts.HTTPMethod> request.method,
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

                return Promise.reject(e);
            }
        }
        finally {

            delete context.request;
            delete context.response;
            delete context.data;
        }
    }

    public async __execute(
        middlewares: Abstracts.RequestMiddleware[],
        handler: Abstracts.RequestHandler,
        context: Abstracts.RequestContext,
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
}

export default AbstractServer;
