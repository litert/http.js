
import { IDictionary } from "@litert/core";

import {
    MiddlewareHandler
} from "./common";

export interface Router<T> {

    handler: T;

    options: IDictionary<any>;

    route(path: string, data?: any): boolean;
}

export interface Middleware {

    handler: MiddlewareHandler;

    route(path: string, data?: any): boolean;
}
