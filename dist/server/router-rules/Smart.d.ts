import * as Core from "../Core";
import { IDictionary } from "@litert/core";
declare class SmartRouteRule<T> implements Core.RouteRule<T> {
    private keys;
    private expr;
    protected _handler: T;
    protected _data: IDictionary<any>;
    readonly handler: T;
    readonly data: IDictionary<any>;
    constructor(handler: T, path: string, data: IDictionary<any>);
    private __compile(path);
    route(path: string, context: Core.RequestContext): boolean;
}
export = SmartRouteRule;
