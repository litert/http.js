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
import * as http from "..";

interface IMyContext extends http.RequestContext {

    requestTime: number;
}

class MyContext extends http.DefaultContext implements IMyContext {

    public requestTime: number;

    public constructor(
        req: http.ServerRequest,
        resp: http.ServerResponse
    ) {
        super(req, resp);

        this.requestTime = Math.floor(this.request.time / 1000);
    }
}

function createMyContext(
    req: http.ServerRequest,
    resp: http.ServerResponse
): IMyContext {

    return new MyContext(req, resp);
}

let router = http.createStandardRouter<IMyContext>();

router.use(async function(context, next) {

    const req = context.request;

    req.loadCookies();

    /**
     * 记录每条访问记录。
     */
    console.log(`${req.method} ${req.url} at ts ${context.requestTime}`);

    await next();

}).notFound(async function(ctx) {

    ctx.response.statusCode = http.HTTPStatus.NOT_FOUND;
    ctx.response.end("NOT FOUND");

}).get("/", async function(context) {

    context.response.setHeader(
        "Context-Type",
        "text/plain"
    );

    context.response.write(context.request.host + "\n");
    context.response.write(JSON.stringify(context.request.query));
    context.response.write(context.request.path);
});

let server = http.createServer({
    "port": 8080,
    "host": "0.0.0.0",
    "router": router,
    "contextCreator": createMyContext
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start().then(() => {

    console.log("Server started.");

}).catch((e) => {

    console.error(e.toString());
});
