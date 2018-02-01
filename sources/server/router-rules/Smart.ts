/*
   +----------------------------------------------------------------------+
   | LiteRT HTTP.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/http.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

import * as Core from "../Abstract";
import HttpException from "../Exception";
import ServerError from "../Errors";
import { IDictionary } from "@litert/core";

enum VarType {
    STRING,
    NUMERIC,
    INT,
    HEX_UINT
}

class SmartRouteRule<T> implements Core.RouteRule<T> {

    private keys!: string[];

    private varTypes!: VarType[];

    private expr!: RegExp;

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
        let types: VarType[] = [];

        path = path.replace(/\{.+?:.+?\}/g, function(el: string): string {

            let matchResult: RegExpMatchArray = <any> el.match(/\{(.+?):(.+?)\}/);

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

                throw new HttpException(
                    ServerError.INVALID_VARIABLE_TYPE,
                    `Invalid expression ${el} of variable.`
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

        this.varTypes = types;
    }

    public route(path: string, context: Core.RequestContext): boolean {

        let ms = path.match(this.expr);

        if (ms) {

            for (let x = 1; x < ms.length; x++) {

                let val: any = ms[x];

                switch (this.varTypes[x - 1]) {
                case VarType.HEX_UINT:
                    val = parseInt(val, 16);
                    break;
                case VarType.INT:
                    val = parseInt(val);
                case VarType.NUMERIC:
                    val = parseFloat(val);
                }

                context.request.params[this.keys[x - 1]] = val;
            }

            return true;
        }

        return false;
    }
}

export default SmartRouteRule;
