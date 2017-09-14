"use strict";
const core_1 = require("@litert/core");
const C = require("./common");
require("langext");
/**
 * A smart router-rule, supporting variable extraction.
 */
class SmartRouter {
    constructor(expr, cb, opts) {
        this.options = opts;
        let replacement = [];
        let keys = [];
        this.handler = cb;
        if (expr.endsWith("/")) {
            expr = expr.substr(0, expr.length - 1);
        }
        expr = RegExp.escape(expr.replace(/\{\s*\w+\s*:\s*\w+\s*\}/g, function (el) {
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
                    throw new core_1.Exception(C.Errors.INVALID_ROUTE_RULE_TYPE, "Invalid type of variable in routing rule.");
            }
            keys.push(matchResult[1]);
            return `@::#${replacement.length - 1}#`;
        }));
        for (let index = 0; index < replacement.length; index++) {
            expr = expr.replace(`@::#${index}#`, replacement[index]);
        }
        this.expr = new RegExp(`^${expr}$`);
        this.keys = keys;
    }
    route(uri, data) {
        let ms = uri.match(this.expr);
        if (ms) {
            for (let x = 1; x < ms.length; x++) {
                data[this.keys[x - 1]] = ms[x];
            }
            return true;
        }
        return false;
    }
}
module.exports = SmartRouter;
//# sourceMappingURL=class.SmartRouter.js.map