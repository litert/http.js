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
import * as http from "../";
import fs = require("fs");

let router = http.createStandardRouter();

router.use("GET", async function(context, next): Promise<void> {

    if (context.request.url === "/") {

        try {

            await next(true);
            context.response.write("<br>bye bye");
        }
        catch (e) {

            return Promise.reject(e);
        }
    }
    else {

        await next();
    }

}).notFound(async function(ctx) {

    ctx.response.statusCode = 404;
    ctx.response.end("NOT FOUND");

}).get("/", async function(context) {

    context.response.write(context.request.path);

}).get("/test", async function(context) {

    context.response.write(`Requested at ${new Date(context.request.time)}`);

}).get("/users/{user:int}", async function(context) {

    context.response.write(JSON.stringify(context.request.params));

}).get("/redirection", async function(context) {

    context.response.redirect("/");

}).post("/content", async function(context) {

    context.response.write(await context.request.getContent({type: "raw"}));
    context.response.write(await context.request.getContent({type: "raw"}));

    context.response.end("/");
});

let server = http.createServer({
    "router": router,
    "ssl": {
        "key": fs.readFileSync("a.local.org-privkey.pem"),
        "certificate": fs.readFileSync("a.local.org-cert.pem")
    }
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start();
