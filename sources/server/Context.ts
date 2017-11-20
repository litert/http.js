import * as Core from "./Core";
import { IDictionary } from "@litert/core";

class Context implements Core.RequestContext {

    public data: IDictionary<any>;

    public request: Core.ServerRequest;

    public response: Core.ServerResponse;
}

export = Context;
