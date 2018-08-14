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
import fs = require("fs");

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

    request.loadCookies();

    console.log(request.cookies);

}).get("/test", async function(context) {

    context.response.setCookie("a", "2333");

}).get("/cookies", async function(context) {

    context.request.loadCookies();
    context.response.sendJSON(context.request.cookies);

}).get("/users/{user:int}", async function(context) {

    context.response.write(JSON.stringify(context.request.params));

}).get("/redirection", async function(context) {

    context.response.redirect("/");

}).post("/content", async function(context) {

    context.response.write(await context.request.getContent({type: "raw"}));
    context.response.write(await context.request.getContent({type: "raw"}));

    context.response.end("/");
});

let cookies = http.plugins.createCookiesEncoder();

let server = http.createServer({
    "port": 443,
    "router": router,
    "ssl": {
        "key": fs.readFileSync("a.local.org-privkey.pem"),
        "certificate": fs.readFileSync("a.local.org-cert.pem")
    },
    "version": 2,
    "plugins": {

        "parser:cookies": cookies
    }
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start();
