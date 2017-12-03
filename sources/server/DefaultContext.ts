import * as Core from "./Core";
import { IDictionary } from "@litert/core";

export class DefaultContext implements Core.RequestContext {

    public data: IDictionary<any>;

    public request: Core.ServerRequest;

    public response: Core.ServerResponse;

    public constructor(
        req: Core.ServerRequest,
        resp: Core.ServerResponse
    ) {

        this.request = req;
        this.response = resp;
    }
}

export function createDefaultContext(
    request: Core.ServerRequest,
    response: Core.ServerResponse
): Core.RequestContext {

    return new DefaultContext(request, response);
}

export default createDefaultContext;
