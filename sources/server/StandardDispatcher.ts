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
import AbstractServer from "./AbstractServer";
import { IDictionary } from "@litert/core";
import HttpException from "./Exception";
import Errors from "./Errors";
import * as https from "https";
import { kServer } from "./Internal";

export class StandardDispatcher extends AbstractServer {

    protected _hosts: IDictionary<AbstractServer>;

    protected _default: AbstractServer;

    protected _subSSL!: IDictionary<Abstracts.SSLConfig>;

    public constructor(
        opts: Abstracts.CreateHostDispatcherOptions
    ) {
        super(<any> opts);

        this._hosts = opts.hosts as IDictionary<AbstractServer>;

        this.__inheritPlugins();

        if (this._hosts["default"]) {

            this._default = this._hosts["default"];
            delete this._hosts["default"];
        }
        else {

            this._default = this._hosts[Object.keys(this._hosts)[0]];
        }

        this._registerSSL();
    }

    protected __inheritPlugins() {

        for (let prefix in this._hosts) {

            this._hosts[prefix].setMounted();

            for (let k in this._opts.plugins as IDictionary<any>) {

                if (!this._hosts[prefix].hasPlugin(k)) {

                    this._hosts[prefix].setPlugin(
                        k,
                        // @ts-ignore
                        this._opts.plugins[k]
                    );
                }
            }
        }
    }

    protected _isEnabledSSL(): boolean {

        if (this._opts.ssl) {

            return true;
        }

        let enabled: number = 0;
        let disabled: number = 0;

        for (let domain in this._hosts) {

            const host = this._hosts[domain];

            if (host.ssl) {

                if (disabled) {

                    throw new HttpException(

                        Errors.REQUIRE_SSL_CERTIFICATE,
                        `The host of ${domain} lacks of SSL certificate.`
                    );
                }

                enabled++;
            }
            else {

                if (enabled) {

                    throw new HttpException(

                        Errors.REQUIRE_SSL_CERTIFICATE,
                        `One of the host lacks of SSL certificate.`
                    );
                }

                disabled++;
            }
        }

        return enabled ? true : false;
    }

    protected _registerSSL(): void {

        if (!this._isEnabledSSL()) {

            return;
        }

        if (this._opts.port === Abstracts.DEFAULT_PORT) {

            this._opts.port = Abstracts.DEFAULT_SSL_PORT;
        }

        this._subSSL = {};

        if (this._default.ssl) {

            this._opts.ssl = this._default.ssl;
        }
        else {

            this._opts.ssl = this._hosts[Object.keys(this._hosts)[0]].ssl;
        }

        let minSSL = this._opts.ssl.minProtocolVersion ||
                            Abstracts.DEFAULT_MIN_SSL_VERSION;

        for (let domain in this._hosts) {

            const sslVersion = this._hosts[domain].ssl.minProtocolVersion;
            this._subSSL[domain] = this._hosts[domain].ssl;

            if (sslVersion !== undefined && minSSL > sslVersion) {

                minSSL = sslVersion;
            }
        }

        this._opts.ssl.minProtocolVersion = minSSL;
    }

    public async start(): Promise<void> {

        await super.start();

        for (let domain in this._subSSL) {

            const item = this._subSSL[domain];

            (<any> this[kServer] as https.Server).addContext(
                domain,
                <any> {
                    "key": item.key,
                    "cert": item.certificate
                }
            );
        }
    }

    protected _getPEMType(val: any): string {

        if (Array.isArray(val)) {

            return this._getPEMType(val[0]) + "[]";
        }
        else if (typeof val === "string") {

            return "string";
        }
        else if (val instanceof Buffer) {

            return "buffer";
        }

        return "unknown";
    }

    protected _getRequestCode(): string {

        return `    if (params["hosts"][request.hostDomain]) {

        const host = params["hosts"][request.hostDomain];

        request.connection.server[cServer] = host;

        request.plugins = response.plugins = host._opts.plugins;

        return host.__requestEntry(createContext(
            request,
            response
        )).catch(function(e) {
            server.emit("error", e);
        });
    }

    request.connection.server[cServer] = params["default"];

    request.plugins = response.plugins = params["default"]._opts.plugins;

    params["default"].__requestEntry(createContext(
        request,
        response
    )).catch(function(e) {
        server.emit("error", e);
    });`;
    }

    protected _getRequestParams(): any {

        return {

            "hosts": this._hosts,
            "default": this._default
        };
    }

    public __requestEntry(
        context: Abstracts.RequestContext
    ): Promise<void> {

        return Promise.resolve();
    }
}

export default StandardDispatcher;
