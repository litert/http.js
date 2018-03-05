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
import http = require("http");
import HttpException from "./Exception";
import ServerError from "./Errors";
import { RawPromise } from "@litert/core";
import * as Core from "./Core";

function extend(obj: any, name: string, fn: Function) {

    obj[name] = fn;
}

extend(http.IncomingMessage.prototype, "getBodyAsJSON", async function(
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

extend(http.IncomingMessage.prototype, "getBody", async function(
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

extend(http.IncomingMessage.prototype, "loadCookies", function(
    this: any
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

    this.cookies = this._cookiesEncoder.parse(cookies);

    return true;
});

extend(
    http.IncomingMessage.prototype,
    "isCookiesLoaded",
    function isCookiesLoaded(
        this: any
    ): boolean {

        return this.cookies !== undefined;
    }
);
