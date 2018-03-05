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
import * as Core from "./Core";

function extend(obj: any, name: string, fn: Function) {

    obj[name] = fn;
}

extend(http.ServerResponse.prototype, "send", function(
    this: Core.ServerResponse,
    data: string | Buffer
): Core.ServerResponse {

    if (this.finished) {

        throw new HttpException(
            ServerError.RESPONSE_ALREADY_CLOSED,
            "Response has been closed"
        );
    }

    if (!this.headersSent) {

        this.setHeader(
            "Content-Length",
            Buffer.byteLength(data)
        );
    }

    this.end(data);

    return this;
});

extend(http.ServerResponse.prototype, "redirect", function(
    this: Core.ServerResponse,
    target: string,
    statusCode: number = Core.HTTPStatus.TEMPORARY_REDIRECT
): Core.ServerResponse {

    if (this.headersSent) {

        throw new HttpException(
            ServerError.HEADERS_ALREADY_SENT,
            "Response headers were already sent."
        );
    }

    this.writeHead(statusCode, {"Location": target});

    return this;
});

extend(http.ServerResponse.prototype, "sendJSON", function(
    this: Core.ServerResponse,
    data: any
): http.ServerResponse {

    if (this.finished) {

        throw new HttpException(
            ServerError.RESPONSE_ALREADY_CLOSED,
            "Response has been closed"
        );
    }

    data = JSON.stringify(data);

    if (!this.headersSent) {

        this.setHeader("Content-Type", "application/json");
        this.setHeader("Content-Length", Buffer.byteLength(data));
    }

    this.end(data);

    return this;
});

extend(http.ServerResponse.prototype, "setCookie", function(
    this: any,
    ...args: any[]
): http.ServerResponse {

    if (this.headersSent) {

        throw new HttpException(
            ServerError.HEADERS_ALREADY_SENT,
            "Response headers were already sent."
        );
    }

    let cookieText: string;

    if (args.length === 1) {

        cookieText = this._cookiesDecoder.stringify(args[0]);
    }
    else {

        cookieText = this._cookiesDecoder.stringify({
            "name": args[0],
            "value": args[1],
            "ttl": args[2],
            "httpOnly": args[3],
            "secureOnly": args[4],
            "path": args[5],
            "domain": args[6]
        });
    }

    if (this.hasHeader("Set-Cookie")) {

        let cookies = this.getHeaders()["set-cookie"];

        cookies.push(cookieText);

        this.setHeader(
            "Set-Cookie",
            cookies
        );
    }
    else {

        this.setHeader("Set-Cookie", [cookieText]);
    }

    return this;
});
