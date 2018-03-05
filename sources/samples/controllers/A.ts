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
import * as http from "../..";

class A {

    @http.Get("/")
    public async readItem(ctx: http.RequestContext): Promise<void> {

        ctx.response.sendJSON({
            "message": "ok"
        });
    }

    @http.NotFound()
    public async onNotFound(ctx: http.RequestContext): Promise<void> {

        ctx.response.statusCode = 404;
        ctx.response.statusMessage = "NOT FOUND";
        ctx.response.sendJSON({
            "message": "resource not found."
        });
    }
}

export default A;
