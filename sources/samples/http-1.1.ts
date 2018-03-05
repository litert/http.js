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

let router = http.createStandardRouter();

router.notFound(async function(ctx) {

    ctx.response.statusCode = 404;
    ctx.response.end("NOT FOUND");

}).get("/", async function(context) {

    const request = context.request;
    const response = context.response;

    response.setHeader("Content-Type", "text/html; charset=utf-8");

    response.write(
        `Method: ${request.method}<br>`
    );
    response.write(
        `URL Path: ${request.path}<br>`
    );
    response.write(
        `Handler Path: ${request.realPath}<br>`
    );
    response.write(
        `Search: ${request.queryString}<br>`
    );
    response.write(
        `Request Host: ${request.host}<br>`
    );
    response.write(
        `Request Domain: ${request.hostDomain}<br>`
    );
    response.write(
        `Request Port: ${request.hostPort}<br>`
    );
    response.write(
        `Server Host: ${request.server.host}<br>`
    );
    response.write(
        `Server Port: ${request.server.port}<br>`
    );
    response.write(
        `SSL: ${request.https ? "Yes" : "No"}<br>`
    );
    response.write(
        `Remote IP: ${request.ip}<br>`
    );
    response.write(
        `Date: ${new Date(request.time).toUTCString()}<br>`
    );

}).get("/test", async function(context) {

    context.response.write(`Requested at ${new Date(context.request.time)}`);

}).get("/statics/*.txt", async function(context) {

    context.response.write(`Requested at ${new Date(context.request.time)}`);

}).get("/statics/ABC?F.txt", async function(context) {

    context.response.write(`Requested at ${new Date(context.request.time)}`);

}).get("/users/{user:int}", async function(context) {

    context.response.write(JSON.stringify(context.request.params));

}).get("/redirection", async function(context) {

    context.response.redirect("/");

}).post("/test", async function(ctx) {

    ctx.response.write(await ctx.request.getBody());
    ctx.response.write(await ctx.request.getBody());
    ctx.response.end(JSON.stringify(ctx.request.contentInfo));
});

let server = http.createServer({
    "port": 8080,
    "router": router,
    "version": 1.1
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start().then(() => {

    console.log("服务器成功启动。");

}).catch((e) => {

    console.error(e);
});
