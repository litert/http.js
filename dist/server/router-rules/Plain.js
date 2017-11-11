"use strict";
class PlainRouteRule {
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
        return path === this._path;
    }
}
module.exports = PlainRouteRule;
//# sourceMappingURL=Plain.js.map