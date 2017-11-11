"use strict";
class RegExpRouteRule {
    constructor(handler, path, data) {
        this._data = data;
        this._handler = handler;
        this._path = path;
    }
    get handler() {
        return this._handler;
    }
    get data() {
        return this._data;
    }
    route(path, context) {
        return this._path.test(path);
    }
}
module.exports = RegExpRouteRule;
//# sourceMappingURL=RegExp.js.map