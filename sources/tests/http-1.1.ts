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

let router = http.createStandardRouter();

router.use(async function(context, next) {

    const req = context.request;

    req.loadCookies();

    /**
     * 记录每条访问记录。
     */
    console.log(`${req.method} ${req.url}`);

    console.log("Cookies", req.cookies);

    await next();

}).use("GET", async function(context, next): Promise<void> {

    if (context.request.path === "/") {

        try {

            await next();
            context.response.write("\nbye bye");
        }
        catch (e) {

            return Promise.reject(e);
        }
    }
    else {

        await next();
    }

}).use("GET", async function(context, next): Promise<void> {

    context.response.setCookie({
        "name": "hello",
        "value": "go",
        "ttl": 3600,
        "httpOnly": true,
        "domain": "127.0.0.1"
    });

    context.response.setCookie({
        "name": "user",
        "value": "yubo",
        "path": "/我"
    });

    if (context.request.path.startsWith("/users/")) {

        try {

            console.log(`Requesting user ${context.request.params.id}`);
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

}).notFound(async function(ctx) {

    ctx.response.statusCode = http.HTTPStatus.NOT_FOUND;
    ctx.response.end("NOT FOUND");

}).get("/", async function(context) {

    context.response.setHeader(
        "Context-Type",
        "text/plain"
    );

    context.response.write(context.request.host + "\n");
    context.response.write(JSON.stringify(context.request.query));
    context.response.write(context.request.path);

}).get(["/test", "/test2"], async function(context) {

    context.response.write(`Requested at ${new Date(context.request.time)}`);

}).register(["POST", "GET"], ["/test3", "/test4"], async function(context) {

    context.response.write(`Requested at ${new Date(context.request.time)}`);

}).get("/users/{id:hex-string[5]}", async function(context) {

    context.response.writeHead(200, {
        "Test": "hello",
        "TTTT": ["a", "b"]
    });

    context.response.sendJSON(context.request.params);

}).post("/users/{id:uint}", async function(context) {

    try {

        console.log((await context.request.getBody()).toString());
    }
    catch (e) {

        console.error(e);
    }

    context.response.sendJSON(context.request.params);

}).get(new RegExp("^/article/(.+)$"), async function(context) {

    context.response.sendJSON(context.request.params);

}).get("/redirection", async function(context) {

    context.response.redirect("/");

}).get("/client", async function(ctx) {

    ctx.response.statusCode = http.HTTPStatus.OK;
    ctx.response.statusMessage = "OK";
    ctx.response.setHeader("Content-Type", "text/plain");
    let content = `
IP Address:     ${ctx.request.ip}
HTTPS:          ${ctx.request.https ? "Yes" : "No"}
Request Host:   ${ctx.request.host}
Request URL:    ${ctx.request.url}
Request Path:   ${ctx.request.path}
Request Search: ${ctx.request.queryString}
Request Time:   ${new Date(ctx.request.time)}
Request Query:  ${JSON.stringify(ctx.request.query)}
`;

    ctx.response.setHeader(
        "Content-Length",
        Buffer.byteLength(content)
    );

    ctx.response.send(content);
});

let cookies = http.createStandardCookiesEncoder({
    "encoding": http.CookiesEncoding.BASE64
});

let server = http.createServer({
    "port": 8080,
    "host": "0.0.0.0",
    "router": router,
    "cookies": cookies
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start().then(() => {

    console.log("Server started.");

}).catch((e) => {

    console.error(e.toString());
});
