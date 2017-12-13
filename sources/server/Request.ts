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

import * as http from "http";
import * as http2 from "http2";
import HttpException from "./Exception";
import ServerError from "./Errors";
import { RawPromise, IDictionary } from "@litert/core";
import * as Core from "./Core";
import * as libUrl from "url";
import * as queryString from "querystring";

declare module "http2" {

    export class Http2ServerRequest {
    }
}

interface InternalServer extends Core.Server {

    _cookiesEncoder: Core.CookiesEncoder;

    _version: Core.HTTPVersion;

    _ssl: any;
}

interface InternalRequest extends Core.ServerRequest {

    server: InternalServer;

    _host: string;

    __initializeHostName(): void;
}

function _extend(obj: any, name: string, fn: Function) {

    obj[name] = fn;
}

function extend(name: string, fn: Function) {

    _extend(http.IncomingMessage.prototype, name, fn);
    _extend(http2.Http2ServerRequest.prototype, name, fn);
}

function extenDef(name: string, fn: Object) {

    Object.defineProperty(http.IncomingMessage.prototype, name, fn);
    Object.defineProperty(http2.Http2ServerRequest.prototype, name, fn);
}

extend("getBodyAsJSON", async function(
    this: Core.ServerRequest,
    maxLength: number = 0
): Promise<any> {

    try {

        return JSON.parse(
            (await this.getBody(maxLength)).toString()
        );
    }
    catch (e) {

        return Promise.reject(e);
    }
});

extenDef("server", {
    get(this: any): http.Server {

        delete this.server;

        Object.defineProperty(this, "server", {
            "value": this.connection.server.controlServer
        });

        return this.server;
    }
});

extenDef("https", {

    get(this: InternalRequest): boolean {

        delete this.https;

        Object.defineProperty(this, "https", {
            "value": this.server._ssl !== undefined
        });

        return this.https;
    }
});

extend("__initializeHostName", function(this: InternalRequest) {

    delete this.hostPort;
    delete this.hostDomain;

    if (this.host) {

        let hostInfo = this.host.split(":");

        if (hostInfo.length === 2) {

            Object.defineProperty(this, "hostPort", {
                "value": parseInt(hostInfo[1])
            });

            Object.defineProperty(this, "hostDomain", {
                "value": hostInfo[0]
            });
        }
        else {

            Object.defineProperty(this, "hostPort", {
                // @ts-ignore
                "value": this.connection.server.controlServer.port
            });

            Object.defineProperty(this, "hostDomain", {
                "value": this.host
            });
        }
    }
    else {

        Object.defineProperty(this, "hostPort", {
            // @ts-ignore
            "value": this.connection.server.controlServer.port
        });

        Object.defineProperty(this, "hostDomain", {
            "value": ""
        });
    }

});

extenDef("hostDomain", {

    get(this: InternalRequest): string {

        this.__initializeHostName();

        return this.hostDomain;
    }
});

extenDef("hostPort", {

    get(this: InternalRequest): number {

        this.__initializeHostName();

        return this.hostPort;
    },
    set(): void {
        //
    }
});

Object.defineProperty(http.IncomingMessage.prototype, "host", {

    get(this: InternalRequest): string {

        delete this.host;

        if (this.headers["host"]) {

            if (typeof this.headers["host"] === "string") {

                Object.defineProperty(this, "host", {
                    "value": this.headers["host"]
                });
            }
            else {

                Object.defineProperty(this, "host", {
                    "value": this.headers["host"][0]
                });
            }
        }
        else {

            Object.defineProperty(this, "host", {
                "value": ""
            });
        }

        return this.host;
    }
});

Object.defineProperty(http2.Http2ServerRequest.prototype, "host", {

    get(this: InternalRequest): string {

        delete this.host;

        if (this.headers[":authority"]) {

            if (typeof this.headers[":authority"] === "string") {

                Object.defineProperty(this, "host", {
                    "value": this.headers[":authority"]
                });
            }
            else {

                Object.defineProperty(this, "host", {
                    "value": this.headers[":authority"][0]
                });
            }
        }
        else {

            Object.defineProperty(this, "host", {
                "value": ""
            });
        }

        return this.host;
    }
});

extenDef("query", {

    get(this: InternalRequest): IDictionary<any> {

        delete this.query;

        let url = libUrl.parse(this.url as string);

        if (typeof url.query === "string") {

            Object.defineProperty(this, "query", {
                "value": queryString.parse(url.query)
            });
        }
        else {

            Object.defineProperty(this, "query", {
                "value": url.query || {}
            });
        }

        return this.query;
    }
});

extenDef("ip", {

    get(this: InternalRequest): string {

        delete this.ip;

        Object.defineProperty(this, "ip", {
            "value": this.connection.remoteAddress
        });

        return this.ip;
    }
});

extend("getBody", async function(
    this: Core.ServerRequest,
    maxLength: number = 0
): Promise<Buffer> {

    let ret = new RawPromise<Buffer, HttpException>();

    let buf: Buffer[] = [];

    type EventCallback = (...args: any[]) => void;

    let onData: EventCallback;
    let onEnd: EventCallback;
    let onClose: EventCallback;
    let onTimeout: EventCallback;

    let doCleanEvents = () => {

        this.removeListener("data", onData);
        this.removeListener("end", onEnd);
        this.removeListener("close", onClose);
        this.removeListener("timeout", onTimeout);
    };

    if (maxLength) {

        let length: number = 0;

        onData = (d: Buffer) => {

            length += d.byteLength;

            if (length > maxLength) {

                doCleanEvents();

                return ret.reject(new HttpException(
                    ServerError.EXCEED_MAX_BODY_LENGTH,
                    "The received body exceed max length restriction."
                ));
            }

            buf.push(d);
        };
    }
    else {

        onData = (d: Buffer) => {

            buf.push(d);
        };
    }

    onEnd = () => {

        let data = Buffer.concat(buf);

        // @ts-ignore
        buf = undefined;

        doCleanEvents();

        ret.resolve(data);
    };

    onClose = () => {

        doCleanEvents();

        return ret.reject(new HttpException(
            ServerError.CONNECTION_CLOESD,
            "The connection was closed."
        ));
    };

    onTimeout = () => {

        doCleanEvents();

        return ret.reject(new HttpException(
            ServerError.READING_DATA_TIMEOUT,
            "Timeout when reading data from request."
        ));
    };

    this.on("data", onData)
    .on("end", onEnd)
    .on("close", onClose)
    .on("timeout", onTimeout);

    return ret.promise;
});

extend("loadCookies", function(
    this: InternalRequest
): boolean {

    if (this.isCookiesLoaded()) {

        return true;
    }

    let cookies: string;
    let data = this.headers["cookie"];

    if (!data) {

        return false;
    }

    if (typeof data === "string") {

        cookies = data;
    }
    else {

        cookies = data.join(";");
    }

    this.cookies = this.server._cookiesEncoder.parse(cookies);

    return true;
});

extend("isCookiesLoaded", function(this: any): boolean {

    return this.cookies !== undefined;
});
