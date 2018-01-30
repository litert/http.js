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

export class MountableHost extends AbstractServer {

    protected _mounts: IDictionary<AbstractServer>;

    public constructor(
        opts: Abstracts.CreateMountableServerOptions
    ) {
        super(opts);

        this._mounts = opts.mounts as IDictionary<AbstractServer>;

        for (let prefix in this._mounts) {

            this._mounts[prefix].setMounted();

            for (let k in this._opts.plugins as IDictionary<any>) {

                if (!this._mounts[prefix].hasPlugin(k)) {

                    this._mounts[prefix].setPlugin(
                        k,
                        // @ts-ignore
                        this._opts.plugins[k]
                    );
                }
            }
        }
    }

    public __requestEntry(
        context: Abstracts.RequestContext
    ): Promise<void> {

        const request = context.request;
        const response = context.response;

        for (let prefix in this._mounts) {

            if (request.realPath.startsWith(prefix)) {

                request.realPath = request.realPath.substr(prefix.length);

                if (0 === request.realPath.length) {

                    request.realPath = "/";
                }

                // @ts-ignore
                request.connection.server.controlServer = this._mounts[prefix];

                // @ts-ignore
                request.plugins = response.plugins = this._opts.plugins;

                return this._mounts[prefix].__requestEntry(
                    context
                );
            }
        }

        return super.__requestEntry(context);
    }
}

export default MountableHost;
