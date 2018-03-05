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

// tslint:disable:no-console
import * as http from "../";

let router = http.createControllerRouter();

router.loadControllers("./controllers");
router.loadMiddlewares("./middlewares");

let server = http.createServer({
    "port": 80,
    "router": router,
    "version": 1.1
});

server.on("error", function(err: Error) {

    console.log(err);
});

server.start().then(() => {

    console.log("服务器成功启动。");

}).catch((e) => {

    console.error(e);
});
