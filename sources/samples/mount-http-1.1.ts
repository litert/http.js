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

/**
 * 创建路由器对象 A
 */
let routerA = http.createStandardRouter();

routerA.get("/", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system A ${req.realPath}. (Request Path: ${req.path})`);

}).get("/a", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system A ${req.realPath}. (Request Path: ${req.path})`);
});

/**
 * 创建路由器对象 B，虽然真实 URI 是以 /admin 开头，但是作为挂载点，前缀会被自动
 * 去除。因此 /admin 前缀不需要在路由中填写。
 */
let routerB = http.createStandardRouter();

routerB.get("/", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system B ${req.realPath}. (Request Path: ${req.path})`);

}).get("/a", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system B ${req.realPath}. (Request Path: ${req.path})`);
});

/**
 * 创建路由器对象 C，虽然真实 URI 是以 /statics 开头，但是作为挂载点，前缀会被自动
 * 去除。因此 /statics 前缀不需要在路由中填写。
 */
let routerC = http.createStandardRouter();

routerC.get("/", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system C ${req.realPath}. (Request Path: ${req.path})`);

}).get("/a", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system C ${req.realPath}. (Request Path: ${req.path})`);
});

let serverC = http.createServer({
    "router": routerC
});

let serverB = http.createServer({
    "router": routerB
});

/**
 * 创建一个监听 0.0.0.0:8080 端口的 HTTP 服务器，并指定使用 router 对象作为路由器。
 */
let serverA = http.createMountableServer({
    "port": 80,
    "router": routerA,
    "mounts": {
        "/admin": serverB,
        "/statics": serverC
    }
});

// 启动服务器
serverA.start().then(() => {

    console.log("服务器成功启动");

}).catch((e) => {

    console.error(e);
});
