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

import { IDictionary } from "@litert/core";
import {
    SetCookieConfiguration,
    CookieConfiguration,
    CookiesEncoder,
    CookiesEncoding
} from "../Abstract";

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
        case CookiesEncoding.URLENCODE:
            cookieText.push(
                `${cfg.name}=${encodeURIComponent(cfg.value)}`
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

            cookieText.push(`Domain=${domain}`);
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

            let pos = item.indexOf("=");

            let [k, v] = [item.substr(0, pos), item.substr(pos + 1)];

            switch (this._encoding) {
            case CookiesEncoding.BASE64:
                ret[k] = Buffer.from(v, "base64").toString();
                break;
            case CookiesEncoding.HEX:
                ret[k] = Buffer.from(v, "hex").toString();
                break;
            case CookiesEncoding.URLENCODE:
                ret[k] = decodeURIComponent(v);
                break;
            default:
                ret[k] = v;
                break;
            }
        }

        return ret;
    }
}

export function createCookiesEncoder(
    cfg?: CookiesEncoderConfig
): CookiesEncoder {

    return new DefaultEncoder(cfg || {});
}
