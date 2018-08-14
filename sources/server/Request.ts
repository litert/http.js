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
import * as http2 from "http2";
import { IDictionary } from "@litert/core";
import * as Abstracts from "./Abstract";
import * as libUrl from "url";
import * as queryString from "querystring";
import { InternalRequest, cServer } from "./Internal";

function _extend(obj: any, name: keyof InternalRequest, fn: Function) {

    obj[name] = fn;
}

function extend(name: keyof InternalRequest, fn: Function) {

    _extend(http.IncomingMessage.prototype, name, fn);
    _extend(http2.Http2ServerRequest.prototype, name, fn);
}

function extenDef(name: keyof InternalRequest, fn: Object) {

    Object.defineProperty(http.IncomingMessage.prototype, name, fn);
    Object.defineProperty(http2.Http2ServerRequest.prototype, name, fn);
}

extend("getContent", function(
    this: Abstracts.ServerRequest,
    opts?: Abstracts.GetContentOptions<string>
): Promise<any> {

    if (!opts) {

        opts = {
            type: "auto"
        };
    }

    if (opts.type === "auto") {

        switch (this.getContentInfo().type) {
        case "application/json":

            opts.type = "json";
            break;

        case "application/x-www-form-urlencoded":

            opts.type = "urlencode";
            break;

        case "text/plain":

            opts.type = "string";
            break;

        case "application/xml":
        case "application/atom+xml":

            opts.type = "xml";
            break;

        case "application/base64":

            opts.type = "base64";
            break;

        case "multipart/form-data":

            opts.type = "multipart";
            break;

        default:
        case "application/plain":
        case "application/octed-stream":

            opts.type = "buffer";
            break;
        }
    }

    // @ts-ignore
    return this.connection.server[cServer]._opts.plugins[
        `parser:${opts.type}`
    ].parse(this, opts);
});

extend("isDoNotTrack", function(
    this: Abstracts.ServerRequest
): boolean {

    return this.headers["dnt"] ? true : false;
});

extenDef("server", {
    get(this: any): http.Server {

        delete this.server;

        Object.defineProperty(this, "server", {
            "value": this.connection.server[cServer]
        });

        return this.server;
    }
});

function _splitWeightString(val: string): IDictionary<number> {

    let ret: IDictionary<number> = {};

    let tmp = val.replace(/\s/g, "").split(",").map(
        (x: string) => x.split(";", 2)
    );

    for (let lang of tmp) {

        if (!lang[1] || !lang[1].startsWith("q=")) {

            ret[lang[0].toLowerCase()] = 1;
        }
        else {

            ret[lang[0].toLowerCase()] = parseFloat(lang[1].substr(2));
        }
    }

    return ret;
}

extend("getAcceptableLanguages", function(
    this: Abstracts.ServerRequest
): IDictionary<number> {

    const raw = this.headers["accept-language"];

    return raw ? _splitWeightString(raw) : {};
});

extend("getAcceptableTypes", function(
    this: Abstracts.ServerRequest
): IDictionary<number> {

    const raw = this.headers["accept"];

    return raw ? _splitWeightString(raw) : {};
});

extend("getAcceptableEncodings", function(
    this: Abstracts.ServerRequest
): IDictionary<number> {

    const raw = this.headers["accept-encoding"];

    return raw ? _splitWeightString(raw) : {};
});

extend("getContentInfo", function(
    this: Abstracts.ServerRequest
): Abstracts.ContentInfo {

    let ret: Abstracts.ContentInfo = {
        "type": "",
        "extras": {},
        "length": -1
    };

    let data: any;

    if (data = this.headers["content-length"]) {

        ret.length = parseInt(data);
    }

    if (data = this.headers["content-type"]) {

        data = data.toLowerCase().split(";").map((x: string) => x.trim());

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

    return ret;
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

extend("loadCookies", function(
    this: any
): boolean {

    if (this.isCookiesLoaded()) {

        return true;
    }

    let data = this.headers["cookie"];

    if (!data) {

        return false;
    }

    this.cookies = this.connection.server[cServer]._opts.plugins[
        "parser:cookies"
    ].parse(data);

    return true;
});

extend("isCookiesLoaded", function(this: any): boolean {

    return this.cookies !== undefined;
});
