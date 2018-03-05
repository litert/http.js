import * as http from "../../..";

class B {

    @http.Get("/bsss")
    public async readItem(ctx: http.RequestContext): Promise<void> {

        ctx.response.sendJSON({
            "message": "hei"
        });
    }
}

export default B;
