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
 * 创建路由器对象 B
 */
let routerB = http.createStandardRouter();

/**
 * 对于路由B，虽然 URL 都是以 /admin 开头的，但是
 */
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
 * 创建路由器对象 C
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

let serverC = http.createMountableServer({
    "router": routerC
});

let serverB = http.createMountableServer({
    "router": routerB
});

/**
 * 创建一个监听 0.0.0.0:8080 端口的 HTTP 服务器，并指定使用 router 对象作为路由器。
 */
let serverA = http.createMountableServer({
    "port": 8080,
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
