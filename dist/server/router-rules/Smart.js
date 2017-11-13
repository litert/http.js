"use strict";
const HttpException = require("../Exception");
const ServerError = require("../Errors");
var VarType;
(function (VarType) {
    VarType[VarType["STRING"] = 0] = "STRING";
    VarType[VarType["NUMERIC"] = 1] = "NUMERIC";
    VarType[VarType["INT"] = 2] = "INT";
    VarType[VarType["HEX_UINT"] = 3] = "HEX_UINT";
})(VarType || (VarType = {}));
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
        let types = [];
        path = path.replace(/\{.+?:.+?\}/g, function (el) {
            let matchResult = el.match(/\{(.+?):(.+?)\}/);
            switch (matchResult[2]) {
                case "int":
                    replacement.push("([-\\+]?\\d+)");
                    types.push(VarType.INT);
                    break;
                case "uint":
                    replacement.push("(\\d+)");
                    types.push(VarType.INT);
                    break;
                case "hex-uint":
                    replacement.push("(\\d+)");
                    types.push(VarType.HEX_UINT);
                    break;
                case "hex-string":
                    replacement.push("([\\dA-fa-f]+)");
                    types.push(VarType.STRING);
                    break;
                case "string":
                    replacement.push("([^\\/]+)");
                    types.push(VarType.STRING);
                    break;
                case "any":
                    replacement.push("(.+)");
                    types.push(VarType.STRING);
                    break;
                case "number":
                    replacement.push("(\\+?\\d+\\.\\d+|-\\d+\\.\\d+|\\+?\\d+|-\\d+)");
                    types.push(VarType.NUMERIC);
                    break;
                default:
                    let mat = matchResult[2].match(/^string\[(\d+)\]$/);
                    if (mat) {
                        replacement.push(`([^\\/]{${mat[1]}})`);
                        types.push(VarType.STRING);
                        break;
                    }
                    else if (mat = matchResult[2].match(/^hex-string\[(\d+)\]$/)) {
                        replacement.push(`([a-fA-F0-9]{${mat[1]}})`);
                        types.push(VarType.STRING);
                        break;
                    }
                    throw new HttpException(ServerError.INVALID_VARIABLE_TYPE, `Invalid expression ${el} of variable.`);
            }
            keys.push(matchResult[1]);
            return `@::#${replacement.length - 1}#`;
        }).replace(/([\*\.\?\+\$\^\[\]\(\)\{\}\|\\])/g, "\\$1");
        for (let index = 0; index < replacement.length; index++) {
            path = path.replace(`@::#${index}#`, replacement[index]);
        }
        this.expr = new RegExp(`^${path}$`);
        this.keys = keys;
        this.varTypes = types;
    }
    route(path, context) {
        let ms = path.match(this.expr);
        if (ms) {
            for (let x = 1; x < ms.length; x++) {
                let val = ms[x];
                switch (this.varTypes[x - 1]) {
                    case VarType.HEX_UINT:
                        val = parseInt(val, 16);
                        break;
                    case VarType.INT:
                        val = parseInt(val);
                    case VarType.NUMERIC:
                        val = parseFloat(val);
                }
                context.params[this.keys[x - 1]] = val;
            }
            return true;
        }
        return false;
    }
}
module.exports = SmartRouteRule;
//# sourceMappingURL=Smart.js.map