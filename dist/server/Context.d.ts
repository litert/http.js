import * as Core from "./Core";
import { IDictionary } from "@litert/core";
declare class Context implements Core.RequestContext {
    data: IDictionary<any>;
    params: IDictionary<any>;
    request: Core.ServerRequest;
    response: Core.ServerResponse;
}
export = Context;
