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

// tslint:disable:no-console
import * as http from "..";

interface IMyContext extends http.RequestContext {

    requestTime: number;
}

class MyContext extends http.DefaultContext implements IMyContext {

    public requestTime: number;

    public constructor(
        req: http.ServerRequest,
        resp: http.ServerResponse
    ) {
        super(req, resp);

        this.requestTime = Math.floor(this.request.time / 1000);
    }
}

function createMyContext(
    req: http.ServerRequest,
    resp: http.ServerResponse
): IMyContext {

    return new MyContext(req, resp);
}

let router = http.createStandardRouter<IMyContext>();

router.use(async function(context, next) {

    const req = context.request;

    req.loadCookies();

    /**
     * 记录每条访问记录。
     */
    console.log(`${req.method} ${req.url} at ts ${context.requestTime}`);

    if (req.isDoNotTrack()) {

        console.log("Client denies trackings.");
    }

    console.log(req.getAcceptableLanguages());

    console.log(req.getAcceptableTypes());

    console.log(req.getAcceptableEncodings());

    await next();

}).notFound(async function(ctx) {

    ctx.response.statusCode = http.HTTPStatus.NOT_FOUND;
    ctx.response.end("NOT FOUND");

}).get("/", async function(context) {

    context.response.setHeader(
        "Context-Type",
        "text/plain"
    );

    context.response.write(context.request.host + "\n");
    context.response.write(JSON.stringify(context.request.query));
    context.response.write(context.request.path);
});

let server = http.createServer({
    "port": 8080,
    "host": "0.0.0.0",
    "router": router,
    "contextCreator": createMyContext
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start().then(() => {

    console.log("Server started.");

}).catch((e) => {

    console.error(e.toString());
});
