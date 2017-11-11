import * as Core from "../Core";
import { IDictionary } from "@litert/core";
declare class PlainRouteRule<T> implements Core.RouteRule<T> {
    protected _path: string;
    protected _handler: T;
    protected _data: IDictionary<any>;
    readonly handler: T;
    readonly data: IDictionary<any>;
    constructor(handler: T, path: string, data: IDictionary<any>);
    route(path: string, context: Core.RequestContext): boolean;
}
export = PlainRouteRule;
