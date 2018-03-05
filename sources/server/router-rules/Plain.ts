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
import * as Core from "../Core";
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

export = PlainRouteRule;
