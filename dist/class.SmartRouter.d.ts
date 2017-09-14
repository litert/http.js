import { Router } from "./internal";
import { IDictionary } from "@litert/core";
import "langext";
/**
 * A smart router-rule, supporting variable extraction.
 */
declare class SmartRouter<T> implements Router<T> {
    private keys;
    private expr;
    handler: T;
    options: IDictionary<any>;
    constructor(expr: string, cb: T, opts: IDictionary<any>);
    route(uri: string, data: IDictionary<any>): boolean;
}
export = SmartRouter;
