
import { Router } from "./internal";

import { IDictionary } from "@litert/core";

class PlainRouter<T> implements Router<T> {

    private _path: string | null;

    public handler: T;

    public options: IDictionary<any>;

    public constructor(rule: string | null, cb: T, opts: IDictionary<any>) {

        this.options = opts;

        if (rule && rule.endsWith("/")) {

            this._path = rule.substr(0, rule.length - 1);
        }
        else {

            this._path = rule;
        }

        this.handler = cb;
    }

    public route(path: string): boolean {

        return this._path === null || path === this._path;
    }
}

export = PlainRouter;
