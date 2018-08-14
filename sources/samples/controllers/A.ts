/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
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
