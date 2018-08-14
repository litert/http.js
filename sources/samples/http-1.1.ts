/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
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

    ctx.response.write(await ctx.request.getContent({"type": "raw"}));
    ctx.response.write(JSON.stringify(await ctx.request.getContent()));
    ctx.response.write(await ctx.request.getContent({"type": "string"}));
    ctx.response.end(JSON.stringify(ctx.request.getContentInfo()));
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
