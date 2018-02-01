/*
   +----------------------------------------------------------------------+
   | LiteRT HTTP.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/http.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

import * as Core from "./Abstract";
import { IDictionary } from "@litert/core";

export class DefaultContext implements Core.RequestContext {

    public data!: IDictionary<any>;

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
