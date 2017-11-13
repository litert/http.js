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

            context.params = data.slice(1);
            return true;
        }

        return false;
    }
}

export = RegExpRouteRule;
