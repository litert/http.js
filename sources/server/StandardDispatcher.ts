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

import * as Abstracts from "./Abstract";
import AbstractServer from "./AbstractServer";
import { IDictionary } from "@litert/core";
import HttpException from "./Exception";
import Errors from "./Errors";
import * as https from "https";

export class StandardDispatcher extends AbstractServer {

    protected _hosts: IDictionary<AbstractServer>;

    protected _default: AbstractServer;

    protected _subSSL: IDictionary<Abstracts.SSLConfig>;

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

        for (let domain in this._hosts) {

            this._subSSL[domain] = this._hosts[domain].ssl;
        }
    }

    public async start(): Promise<void> {

        await super.start();

        for (let domain in this._subSSL) {

            const item = this._subSSL[domain];

            (<any> this._server as https.Server).addContext(
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

        request.connection.server.controlServer = host;

        request.plugins = response.plugins = host._opts.plugins;

        return host.__requestEntry(createContext(
            request,
            response
        )).catch(function(e) {
            server.emit("error", e);
        });
    }

    request.connection.server.controlServer = params["default"];

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
