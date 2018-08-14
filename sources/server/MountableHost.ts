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
import { cServer } from "./Internal";

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
                request.connection.server[cServer] = this._mounts[prefix];

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
