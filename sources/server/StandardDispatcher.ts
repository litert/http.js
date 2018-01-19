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

export class StandardDispatcher extends AbstractServer {

    protected _hosts: IDictionary<AbstractServer>;

    protected _default: AbstractServer;

    public constructor(
        opts: Abstracts.CreateHostDispatcherOptions
    ) {
        super(<any> opts);

        this._hosts = opts.hosts as IDictionary<AbstractServer>;

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

        if (this._hosts["default"]) {

            this._default = this._hosts["default"];
        }
        else {

            this._default = this._hosts[Object.keys(this._hosts)[0]];
        }
    }

    protected _getRequestCode(): string {

        return `
    if (params["hosts"][request.hostDomain]) {

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
            "defaultHost": this._default
        };
    }

    public __requestEntry(
        context: Abstracts.RequestContext
    ): Promise<void> {

        return Promise.resolve();
    }
}

export default StandardDispatcher;
