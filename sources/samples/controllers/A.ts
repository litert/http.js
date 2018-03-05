import * as http from "../..";

class A {

    @http.Get("/")
    public async readItem(ctx: http.RequestContext): Promise<void> {

        ctx.response.sendJSON({
            "message": "ok"
        });
    }

    @http.NotFound()
    public async onNotFound(ctx: http.RequestContext): Promise<void> {

        ctx.response.statusCode = 404;
        ctx.response.statusMessage = "NOT FOUND";
        ctx.response.sendJSON({
            "message": "resource not found."
        });
    }
}

export default A;
