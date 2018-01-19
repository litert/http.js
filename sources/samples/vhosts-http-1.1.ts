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

/**
 * 创建路由器对象 B，虽然真实 URI 是以 /admin 开头，但是作为挂载点，前缀会被自动
 * 去除。因此 /admin 前缀不需要在路由中填写。
 */
let routerA = http.createStandardRouter();

routerA.get("/", async function(ctx) {

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
let routerB = http.createStandardRouter();

routerB.get("/", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system C ${req.realPath}. (Request Path: ${req.path})`);

}).get("/a", async function(ctx) {

    const req = ctx.request;
    const resp = ctx.response;

    resp.send(`Visiting system C ${req.realPath}. (Request Path: ${req.path})`);
});

let serverB = http.createServer({
    "router": routerB
});

let serverA = http.createServer({
    "router": routerA
});

/**
 * 创建一个监听 0.0.0.0:80 端口的 HTTP 服务器，并指定使用 router 对象作为路由器。
 */
let dispatcher = http.createVirtualDispatcher({
    "port": 80,
    "hosts": {
        "default": serverA,
        "wp.local.org": serverA,
        "m.local.org": serverB
    }
});

// 启动服务器
dispatcher.start().then(() => {

    console.log("服务器成功启动");

}).catch((e) => {

    console.error(e);
});
