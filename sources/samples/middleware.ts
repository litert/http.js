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
