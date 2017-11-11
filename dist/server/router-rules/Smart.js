"use strict";
const HttpException = require("../Exception");
const ServerError = require("../Errors");
class SmartRouteRule {
    constructor(handler, path, data) {
        this._data = data;
        this._handler = handler;
        this.__compile(path);
    }
    get handler() {
        return this._handler;
    }
    get data() {
        return this._data;
    }
    __compile(path) {
        let keys = [];
        let replacement = [];
        path = path.replace(/\{\s*\w+\s*:\s*\w+\s*\}/g, function (el) {
            let matchResult = el.match(/\{\s*(\w+)\s*:\s*(\w+)\s*\}/);
            switch (matchResult[2]) {
                case "int":
                    replacement.push("([-\\+]?\\d+)");
                    break;
                case "uint":
                    replacement.push("(\\d+)");
                    break;
                case "hex":
                    replacement.push("([\\dA-fa-f]+)");
                    break;
                case "string":
                    replacement.push("([^\\/]+)");
                    break;
                case "any":
                    replacement.push("(.+)");
                    break;
                default:
                    throw new HttpException(ServerError.INVALID_VARIABLE_TYPE, "Invalid type of variable in routing rule.");
            }
            keys.push(matchResult[1]);
            return `@::#${replacement.length - 1}#`;
        }).replace(/([\*\.\?\+\$\^\[\]\(\)\{\}\|\\])/g, "\\$1");
        for (let index = 0; index < replacement.length; index++) {
            path = path.replace(`@::#${index}#`, replacement[index]);
        }
        this.expr = new RegExp(`^${path}$`);
        this.keys = keys;
    }
    route(path, context) {
        let ms = path.match(this.expr);
        if (ms) {
            for (let x = 1; x < ms.length; x++) {
                context.params[this.keys[x - 1]] = ms[x];
            }
            return true;
        }
        return false;
    }
}
module.exports = SmartRouteRule;
//# sourceMappingURL=Smart.js.map