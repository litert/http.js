import { Router } from "./internal";

import { IDictionary } from "@litert/core";

class RegExpRouter<T> implements Router<T> {

    private _path: RegExp;

    public handler: T;

    public options: IDictionary<any>;

    public constructor(rule: RegExp, cb: T, opts: IDictionary<any>) {

        this.options = opts;

        this._path = rule;

        this.handler = cb;
    }

    public route(path: string): boolean {

        return this._path.exec(path) ? true : false;
    }
}

export = RegExpRouter;
