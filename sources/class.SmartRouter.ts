import { Router } from "./internal";

import { IDictionary, Exception } from "@litert/core";

import * as C from "./common";

import "langext";

/**
 * A smart router-rule, supporting variable extraction.
 */
class SmartRouter<T> implements Router<T> {

    private keys: string[];

    private expr: RegExp;

    public handler: T;

    public options: IDictionary<any>;

    public constructor(expr: string, cb: T, opts: IDictionary<any>) {

        this.options = opts;

        let replacement: string[] = [];
        let keys: string[] = [];

        this.handler = cb;

        if (expr.endsWith("/")) {

            expr = expr.substr(0, expr.length - 1);
        }

        expr = RegExp.escape(expr.replace(/\{\s*\w+\s*:\s*\w+\s*\}/g, function(el: string): string {

            let matchResult: RegExpMatchArray = <any> el.match(/\{\s*(\w+)\s*:\s*(\w+)\s*\}/);

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

                throw new Exception(
                    C.Errors.INVALID_ROUTE_RULE_TYPE,
                    "Invalid type of variable in routing rule."
                );
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

    public route(uri: string, data: IDictionary<any>): boolean {

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

export = SmartRouter;
