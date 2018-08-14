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
 * 用于处理 a.local.org 以及默认的请求。
 */
let routerA = http.createStandardRouter();

routerA.get("/", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting a.local.org or default host ${req.realPath}. (Request Path: ${req.path})`);

}).get("/a", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting a.local.org or default host ${req.realPath}. (Request Path: ${req.path})`);
});

/**
 * 用于处理 b.local.org 的请求。
 */
let routerB = http.createStandardRouter();

routerB.get("/", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting b.local.org ${req.realPath}. (Request Path: ${req.path})`);

}).get("/a", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting b.local.org ${req.realPath}. (Request Path: ${req.path})`);
});

let serverB = http.createServer({
    "router": routerB
});

let serverA = http.createServer({
    "router": routerA
});

/**
 * 创建一个监听 0.0.0.0:80 端口的虚拟主机分发器，注意这里不需要 router。
 */
let dispatcher = http.createVirtualDispatcher({
    "port": 80,
    "hosts": {
        "default": serverA,
        "a.local.org": serverA,
        "b.local.org": serverB
    }
});

// 启动服务器
dispatcher.start().then(() => {

    console.log("服务器成功启动。");

}).catch((e) => {

    console.error(e);
});
