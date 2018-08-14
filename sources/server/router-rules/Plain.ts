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

import * as Core from "../Abstract";
import { IDictionary } from "@litert/core";

class PlainRouteRule<T> implements Core.RouteRule<T> {

    protected _path: string;

    protected _handler: T;

    protected _data: IDictionary<any>;

    public get handler(): T {

        return this._handler;
    }

    public get data(): IDictionary<any> {

        return this._data;
    }

    public constructor(handler: T, path: string, data: IDictionary<any>) {

        this._data = data;
        this._handler = handler;
        this._path = path;
    }

    public route(path: string, context: Core.RequestContext): boolean {

        return path === this._path;
    }
}

export default PlainRouteRule;
