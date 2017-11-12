// tslint:disable:no-console
import * as http from "../";

let router = http.createRouter();

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

}).use("GET", async function(context, next): Promise<void> {

    if (context.request.path.startsWith("/users/")) {

        try {

            await next(true);
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

    ctx.response.statusCode = 404;
    ctx.response.end("NOT FOUND");

}).badMethod(async function(ctx) {

    ctx.response.statusCode = 405;
    ctx.response.end("METHOD NOT ALLOWED");

}).register("GET", "/", async function(context) {

    context.response.write(context.request.path);

}).register("GET", "/test", async function(context) {

    context.response.write("test");

}).register("GET", "/users/{user:int}", async function(context) {

    context.response.sendJSON(context.params);

}).register("GET", "/redirection", async function(context) {

    context.response.redirect("/");
});

let server = http.createServer({
    "port": 8080,
    "router": router
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start();
