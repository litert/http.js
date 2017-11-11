import * as Core from "../Core";
import HttpException = require("../Exception");
import ServerError = require("../Errors");
import { IDictionary } from "@litert/core";

class SmartRouteRule<T> implements Core.RouteRule<T> {

    private keys: string[];

    private expr: RegExp;

    protected _handler: T;

    protected _data: IDictionary<any>;

    public get handler(): T {

        return this._handler;
    }

    public get data(): IDictionary<any> {

        return this._data;
    }

    public constructor(handler: T, path: string, data: IDictionary<any>) {

        this._data = data;

        this._handler = handler;

        this.__compile(path);
    }

    private __compile(path: string): void {

        let keys: string[] = [];
        let replacement: string[] = [];

        path = path.replace(/\{\s*\w+\s*:\s*\w+\s*\}/g, function(el: string): string {

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

                throw new HttpException(
                    ServerError.INVALID_VARIABLE_TYPE,
                    "Invalid type of variable in routing rule."
                );
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

    public route(path: string, context: Core.RequestContext): boolean {

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

export = SmartRouteRule;
