import { Router } from "./internal";
import { IDictionary } from "@litert/core";
declare class RegExpRouter<T> implements Router<T> {
    private _path;
    handler: T;
    options: IDictionary<any>;
    constructor(rule: RegExp, cb: T, opts: IDictionary<any>);
    route(path: string): boolean;
}
export = RegExpRouter;
