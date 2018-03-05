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
// tslint:disable:no-console
import * as http from "../..";

class A {

    @http.Middleare()
    public static async writeLogs(
        ctx: http.RequestContext,
        next: http.MiddlewareNextCallback
    ): Promise<void> {

        console.log(`${ctx.request.method} ${ctx.request.path}`);

        return next();
    }

    @http.Middleare("GET")
    public static async writeLogs2(
        ctx: http.RequestContext,
        next: http.MiddlewareNextCallback
    ): Promise<void> {

        const resp = ctx.response;

        console.log(`Visited from ${ctx.request.ip}`);

        await next();

        console.log(`Response: ${resp.statusCode} ${resp.statusMessage}`);
    }
}

export default A;
