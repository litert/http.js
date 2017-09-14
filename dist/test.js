"use strict";
/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
const HTTP = require(".");
let serv = HTTP.createServer({
    "host": "0.0.0.0",
    "port": 8889
});
serv.register("GET", "/", async function (req, resp) {
    resp.write("Hello World!");
}).register("GET", "/login", async function (req, resp) {
    resp.end("Hello");
}).hook("after-router", null, async function (req, resp) {
    if (req.path !== "/login") {
        if (req.headers["auth-code"] === undefined) {
            resp.setHeader("location", "/login");
            resp.writeHead(302, "REDIRECT");
            resp.end();
            return false;
        }
    }
    return true;
}).hook("end", null, async function (req, resp) {
    console.info(`${req.method} ${req.url} ${resp.statusCode}.`);
    return true;
});
serv.start().on("started", function () {
    console.log("Server is listening on 0.0.0.0:8889.");
}).on("error", function (e) {
    console.error(e);
}).on("close", function () {
    console.info("Server has been shutdown.");
});
//# sourceMappingURL=test.js.map