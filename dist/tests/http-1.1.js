"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const http = require("../");
let router = http.createRouter();
router.use(async function (context, next) {
    const req = context.request;
    /**
     * 记录每条访问记录。
     */
    console.log(`${req.method} ${req.url}`);
    await next();
}).use("GET", async function (context, next) {
    if (context.request.path === "/") {
        try {
            await next();
            context.response.write("<br>bye bye");
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        await next();
    }
}).use("GET", async function (context, next) {
    if (context.request.path.startsWith("/users/")) {
        try {
            console.log(`Requesting user ${context.params.id}`);
            await next();
            console.log("responsed");
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        await next();
    }
}).notFound(async function (ctx) {
    ctx.response.statusCode = http.HTTPStatus.NOT_FOUND;
    ctx.response.end("NOT FOUND");
}).get("/", async function (context) {
    context.response.setHeader("Context-Type", "text/plain");
    context.response.write(context.request.host);
    context.response.write(JSON.stringify(context.request.query));
    context.response.write(context.request.path);
}).get("/test", async function (context) {
    context.response.write(`Requested at ${new Date(context.request.time)}`);
}).get("/users/{id:hex-string[5]}", async function (context) {
    context.response.sendJSON(context.params);
}).get(new RegExp("^/article/(.+)$"), async function (context) {
    context.response.sendJSON(context.params);
}).get("/redirection", async function (context) {
    context.response.redirect("/");
});
let server = http.createServer({
    "port": 8080,
    "router": router
});
server.on("error", function (err) {
    console.log(err);
});
server.start();
//# sourceMappingURL=http-1.1.js.map