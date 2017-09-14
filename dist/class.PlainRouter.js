"use strict";
class PlainRouter {
    constructor(rule, cb, opts) {
        this.options = opts;
        if (rule && rule.endsWith("/")) {
            this._path = rule.substr(0, rule.length - 1);
        }
        else {
            this._path = rule;
        }
        this.handler = cb;
    }
    route(path) {
        return this._path === null || path === this._path;
    }
}
module.exports = PlainRouter;
//# sourceMappingURL=class.PlainRouter.js.map