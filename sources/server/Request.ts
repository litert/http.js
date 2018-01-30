/*
   +----------------------------------------------------------------------+
   | LiteRT HTTP.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/http.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

import * as http from "http";
import * as http2 from "http2";
import HttpException from "./Exception";
import ServerError from "./Errors";
import { RawPromise, IDictionary } from "@litert/core";
import * as Abstracts from "./Abstract";
import * as libUrl from "url";
import * as queryString from "querystring";

declare module "http2" {

    export class Http2ServerRequest {
    }
}

interface InternalRequest extends Abstracts.ServerRequest {

    server: Abstracts.Server;

    __rawData?: Buffer;
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
    this: Abstracts.ServerRequest,
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

extenDef("contentInfo", {
    get(this: any): http.Server {

        delete this.contentInfo;

        let ret: Abstracts.ContentInfo = {
            "type": "",
            "extras": {},
            "length": -1
        };

        let data: any;

        if (data = this.headers["content-length"]) {

            ret.length = typeof data === "string" ?
                parseInt(data) :
                parseInt(data[0]);
        }

        if (data = this.headers["content-type"]) {

            data = typeof data === "string" ?
                data.toLowerCase().split(";") :
                data[0].toLowerCase().split(";");

            data = data.map((x: string) => x.trim());

            for (let el of data) {

                if (el.indexOf("=") > -1) {

                    let kv = el.split("=", 2);
                    // @ts-ignore
                    ret.extras[kv[0]] = kv[1];
                }
                else {

                    ret.type = el;
                }
            }
        }

        Object.defineProperty(this, "contentInfo", {
            "value": ret
        });

        return this.contentInfo;
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

extend("getBody", async function(
    this: InternalRequest,
    maxLength: number = 0
): Promise<Buffer> {

    if (this.__rawData) {

        return Promise.resolve(this.__rawData);
    }

    if (maxLength > 0
        && this.contentInfo.length > -1
        && this.contentInfo.length < maxLength
    ) {

        return Promise.reject(new HttpException(
            ServerError.EXCEED_MAX_BODY_LENGTH,
            "The received body exceed max length restriction."
        ));
    }

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

        this.__rawData = Buffer.concat(buf);

        // @ts-ignore
        buf = undefined;

        doCleanEvents();

        ret.resolve(this.__rawData);
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

    this.once("data", onData)
    .once("end", onEnd)
    .once("close", onClose)
    .once("timeout", onTimeout);

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

    this.cookies = this.plugins.cookies.parse(cookies);

    return true;
});

extend("isCookiesLoaded", function(this: any): boolean {

    return this.cookies !== undefined;
});
