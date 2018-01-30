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
    "router": routerB,
    "ssl": {
        "key": fs.readFileSync("b.local.org-privkey.pem"),
        "certificate": fs.readFileSync("b.local.org-cert.pem")
    }
});

let serverA = http.createServer({
    "router": routerA,
    "ssl": {
        "key": fs.readFileSync("a.local.org-privkey.pem").toString(),
        "certificate": fs.readFileSync("a.local.org-cert.pem").toString()
    }
});

/**
 * 创建一个监听 0.0.0.0:443 端口的虚拟主机分发器，注意这里不需要 router。
 */
let dispatcher = http.createVirtualDispatcher({
    "port": 443,
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
