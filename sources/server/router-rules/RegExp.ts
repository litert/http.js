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

import * as Core from "../Core";
import { IDictionary } from "@litert/core";

class RegExpRouteRule<T> implements Core.RouteRule<T> {

    protected _path: RegExp;

    protected _handler: T;

    protected _data: IDictionary<any>;

    public get handler(): T {

        return this._handler;
    }

    public get data(): IDictionary<any> {

        return this._data;
    }

    public constructor(handler: T, path: RegExp, data: IDictionary<any>) {

        this._data = data;
        this._handler = handler;
        this._path = path;
    }

    public route(path: string, context: Core.RequestContext): boolean {

        let data = path.match(this._path);

        if (data) {

            context.request.params = data.slice(1);
            return true;
        }

        return false;
    }
}

export default RegExpRouteRule;
