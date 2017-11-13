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
        let data = path.match(this._path);
        if (data) {
            context.params = data.slice(1);
            return true;
        }
        return false;
    }
}
module.exports = RegExpRouteRule;
//# sourceMappingURL=RegExp.js.map