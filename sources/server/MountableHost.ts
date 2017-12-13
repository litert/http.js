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

import * as Core from "./Core";

import AbstractServer from "./AbstractServer";
import { IDictionary } from "@litert/core";

export class MountableHost extends AbstractServer {

    protected _mounts: IDictionary<AbstractServer>;

    public constructor(
        opts: Core.CreateServerOptions
    ) {

        super(opts);

        if (opts.mounts) {

            this._mounts = opts.mounts as IDictionary<AbstractServer>;

            for (let prefix in this._mounts) {

                // @ts-ignore
                this._mounts[prefix]._mounted = true;
            }
        }
    }

    protected __requestEntry(
        request: Core.ServerRequest,
        response: Core.ServerResponse
    ): Promise<void> {

        if (this._mounts) {

            for (let prefix in this._mounts) {

                if (request.realPath.startsWith(prefix)) {

                    request.realPath = request.realPath.substr(prefix.length);

                    if (0 === request.realPath.length) {

                        request.realPath = "/";
                    }

                    // @ts-ignore
                    return this._mounts[prefix].__requestEntry(
                        request,
                        response
                    );
                }
            }
        }

        return super.__requestEntry(request, response);
    }
}

export default MountableHost;
