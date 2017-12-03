// tslint:disable:no-console
import * as http from "../";
import fs = require("fs");

let router = http.createStandardRouter();

router.use("GET", async function(context, next): Promise<void> {

    if (context.request.url === "/") {

        try {

            await next(true);
            context.response.write("<br>bye bye");
        }
        catch (e) {

            return Promise.reject(e);
        }
    }
    else {

        await next();
    }

}).notFound(async function(ctx) {

    ctx.response.statusCode = 404;
    ctx.response.end("NOT FOUND");

}).get("/", async function(context) {

    context.response.write(context.request.path);

}).get("/test", async function(context) {

    context.response.write(`Requested at ${new Date(context.request.time)}`);

}).get("/users/{user:int}", async function(context) {

    context.response.write(JSON.stringify(context.request.params));

}).get("/redirection", async function(context) {

    context.response.redirect("/");
});

let server = http.createServer({
    "port": 8080,
    "router": router,
    "ssl": {
        "key": fs.readFileSync("localhost-privkey.pem"),
        "certificate": fs.readFileSync("localhost-cert.pem")
    }
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start();
