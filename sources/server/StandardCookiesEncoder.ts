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

import { IDictionary } from "@litert/core";
import {
    SetCookieConfiguration,
    CookieConfiguration,
    CookiesEncoder,
    CookiesEncoding
} from "./Core";

export interface CookiesEncoderConfig {

    "encoding"?: CookiesEncoding;

    "defaults"?: CookieConfiguration;
}

const DEFAULT_CONFIG: CookieConfiguration = {

    "secureOnly": false,

    "httpOnly": false,

    "path": "/"
};

class DefaultEncoder implements CookiesEncoder {

    protected _encoding: CookiesEncoding;

    protected _defaults: CookieConfiguration;

    public constructor(cfg: CookiesEncoderConfig) {

        this._encoding = cfg.encoding || CookiesEncoding.PLAIN;

        if (!cfg.defaults) {

            this._defaults = DEFAULT_CONFIG;
        }
        else {

            this._defaults = {};

            for (let k in ["ttl", "secureOnly", "httpOnly", "path", "domain"]) {
                // @ts-ignore
                this._defaults[k] = cfg.defaults[k] || DEFAULT_CONFIG[k];
            }
        }
    }

    public stringify(cfg: SetCookieConfiguration): string {

        let cookieText: string[] = [];

        let ttl = cfg.ttl || this._defaults.ttl;
        let secureOnly = cfg.secureOnly || this._defaults.secureOnly;
        let httpOnly = cfg.httpOnly || this._defaults.httpOnly;
        let domain = cfg.domain || this._defaults.domain;
        let path = cfg.path || this._defaults.path;

        switch (this._encoding) {
        case CookiesEncoding.BASE64:
            cookieText.push(
                `${cfg.name}=${Buffer.from(cfg.value).toString("base64")}`
            );
            break;
        case CookiesEncoding.HEX:
            cookieText.push(
                `${cfg.name}=${Buffer.from(cfg.value).toString("hex")}`
            );
            break;
        default:
            cookieText.push(`${cfg.name}=${cfg.value}`);
            break;
        }

        if (ttl) {

            let endTime = new Date(Date.now() + ttl * 1000);

            cookieText.push(`Expires=${endTime.toUTCString()}`);
            cookieText.push(`Max-Age=${ttl}`);
        }

        if (path) {

            cookieText.push(`Path=${encodeURI(path)}`);
        }

        if (domain) {

            if (domain[0] === "." || /^\d+(\.\d+){3}$/.test(domain)) {

                cookieText.push(`Domain=${domain}`);
            }
            else {

                cookieText.push(`Domain=.${domain}`);
            }
        }

        if (secureOnly) {

            cookieText.push(`Secure`);
        }

        if (httpOnly) {

            cookieText.push(`HttpOnly`);
        }

        return cookieText.join(";");
    }

    public parse(cookies: string): IDictionary<string> {

        let ret: IDictionary<string> = {};

        for (let item of cookies.split(";")) {

            item = item.trim();

            if (!item) {

                continue;
            }

            let pair = item.trim().split("=", 2);

            if (pair.length !== 2) {

                continue;
            }

            switch (this._encoding) {
            case CookiesEncoding.BASE64:
                ret[pair[0]] = Buffer.from(pair[1], "base64").toString();
                break;
            case CookiesEncoding.HEX:
                ret[pair[0]] = Buffer.from(pair[1], "hex").toString();
                break;
            default:
                ret[pair[0]] = pair[1];
                break;
            }
        }

        return ret;
    }
}

export function createStandardCookiesEncoder(
    cfg?: CookiesEncoderConfig
): CookiesEncoder {

    return new DefaultEncoder(cfg || {});
}
