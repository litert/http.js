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
