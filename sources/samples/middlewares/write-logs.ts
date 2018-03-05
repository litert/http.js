// tslint:disable:no-console
import * as http from "../..";

class A {

    @http.Middleare()
    public static async writeLogs(
        ctx: http.RequestContext,
        next: http.MiddlewareNextCallback
    ): Promise<void> {

        console.log(`${ctx.request.method} ${ctx.request.path}`);

        return next();
    }

    @http.Middleare("GET")
    public static async writeLogs2(
        ctx: http.RequestContext,
        next: http.MiddlewareNextCallback
    ): Promise<void> {

        const resp = ctx.response;

        console.log(`Visited from ${ctx.request.ip}`);

        await next();

        console.log(`Response: ${resp.statusCode} ${resp.statusMessage}`);
    }
}

export default A;
