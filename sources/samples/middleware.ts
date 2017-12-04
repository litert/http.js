/*
   +----------------------------------------------------------------------+
   | LiteRT HTTP.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2007-2017 Fenying Studio                               |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/http.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <i.am.x.fenying@gmail.com>                    |
   +----------------------------------------------------------------------+
 */

// tslint:disable:no-console
import * as http from "../";

let router = http.createStandardRouter();

router.use(async function(ctx, next) {

    console.log(`Log: ${ctx.request.method} ${ctx.request.path}`);
    await next();

}).use("POST", async function(ctx, next) {

    // 只处理 POST 请求
    console.log("POST only");
    await next();

}).use("/hello", async function(ctx, next) {

    // 只处理 /hello 请求
    console.log("/hello only");
    await next();

}).use(["POST", "GET"], async function(ctx, next) {

    // 只处理 POST 和 GET 请求
    console.log("GET|POST only");
    await next();

}).use([
    "POST",
    "GET"
], [
    "/admin/{rest:any}",
    "/statics/{rest:any}"
], async function(ctx, next) {

    // 只处理 /admin/ 和 /statics/ 路径下的 POST 和 GET 请求
    console.log("GET|POST admin|statics only");
    await next();

}).use(["/admin/{rest:any}", "/statics/{rest:any}"], async function(ctx, next) {

    // 只处理 /admin/ 和 /statics/ 路径下的请求
    console.log("admin|statics only");
    await next();

}).notFound(async (ctx) => {

    ctx.response.writeHead(http.HTTPStatus.NOT_FOUND);

    ctx.response.send("NOT FOUND");
});

let server = http.createServer({
    "port": 8080,
    "host": "0.0.0.0",
    "router": router
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start().then(() => {

    console.log("Server started.");

}).catch((e) => {

    console.error(e.toString());
});
