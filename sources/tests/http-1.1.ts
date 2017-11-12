// tslint:disable:no-console
import * as http from "../";

let router = http.createRouter();

router.use(async function(context, next) {

    const req = context.request;

    /**
     * 记录每条访问记录。
     */
    console.log(`${req.method} ${req.url}`);

    await next();

}).use("GET", async function(context, next): Promise<void> {

    if (context.request.url === "/") {

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

}).use("GET", async function(context, next): Promise<void> {

    if (context.request.path.startsWith("/users/")) {

        try {

            console.log("xxx");
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

    context.response.write(context.request.path);

}).get("/test", async function(context) {

    context.response.write(`Requested at ${new Date(context.request.time)}`);

}).get("/users/{user:int}", async function(context) {

    context.response.sendJSON(context.params);

}).get("/redirection", async function(context) {

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
