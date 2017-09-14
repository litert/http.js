"use strict";
class RegExpRouter {
    constructor(rule, cb, opts) {
        this.options = opts;
        this._path = rule;
        this.handler = cb;
    }
    route(path) {
        return this._path.exec(path) ? true : false;
    }
}
module.exports = RegExpRouter;
//# sourceMappingURL=class.RegExpRouter.js.map