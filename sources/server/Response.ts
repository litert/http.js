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

import * as http from "http";
import HttpException from "./Exception";
import ServerError from "./Errors";
import * as Abstracts from "./Abstract";
import * as http2 from "http2";
import { IDictionary } from "@litert/core";
import { cServer } from "./Internal";

declare module "http2" {

    export class Http2ServerResponse {
    }
}

interface InternalResponse extends Abstracts.ServerResponse {

    server: Abstracts.Server;

    plugins: IDictionary<any>;
}

function _extend(obj: any, name: string, fn: Function) {

    obj[name] = fn;
}

function extend(name: string, fn: Function) {

    _extend(http.ServerResponse.prototype, name, fn);
    _extend(http2.Http2ServerResponse.prototype, name, fn);
}

function extenDef(name: string, fn: Object) {

    Object.defineProperty(http.ServerResponse.prototype, name, fn);
    Object.defineProperty(http2.Http2ServerResponse.prototype, name, fn);
}

extend("send", function(
    this: Abstracts.ServerResponse,
    data: string | Buffer
): Abstracts.ServerResponse {

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

extenDef("server", {
    get(this: any): http.Server {
        return this.connection.server[cServer];
    }
});

extend("redirect", function(
    this: Abstracts.ServerResponse,
    target: string,
    statusCode: number = Abstracts.HTTPStatus.TEMPORARY_REDIRECT
): Abstracts.ServerResponse {

    if (this.headersSent) {

        throw new HttpException(
            ServerError.HEADERS_ALREADY_SENT,
            "Response headers were already sent."
        );
    }

    this.writeHead(statusCode, {"Location": target});

    return this;
});

extend("sendJSON", function(
    this: Abstracts.ServerResponse,
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

extend("setCookie", function(
    this: InternalResponse,
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

        cookieText = this.plugins["parser:cookies"].stringify(args[0]);
    }
    else {

        cookieText = this.plugins["parser:cookies"].stringify({
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

        let cookies = this.getHeaders()["set-cookie"] as string[];

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
