import { Router } from "./internal";
import { IDictionary } from "@litert/core";
declare class PlainRouter<T> implements Router<T> {
    private _path;
    handler: T;
    options: IDictionary<any>;
    constructor(rule: string | null, cb: T, opts: IDictionary<any>);
    route(path: string): boolean;
}
export = PlainRouter;
