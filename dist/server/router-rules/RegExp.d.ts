import * as Core from "../Core";
import { IDictionary } from "@litert/core";
declare class RegExpRouteRule<T> implements Core.RouteRule<T> {
    protected _path: RegExp;
    protected _handler: T;
    protected _data: IDictionary<any>;
    readonly handler: T;
    readonly data: IDictionary<any>;
    constructor(handler: T, path: RegExp, data: IDictionary<any>);
    route(path: string, context: Core.RequestContext): boolean;
}
export = RegExpRouteRule;
