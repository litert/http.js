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

import {
    ServerRequest,
    GetContentOptions,
    ContentParser
} from "../Abstract";

class StringParser implements ContentParser {

    public async parse(
        request: ServerRequest,
        opts: GetContentOptions<string>
    ): Promise<any> {

        const data = await request.getContent({
            type: "raw",
            maxBytes: opts.maxBytes
        });

        return data.toString();
    }
}

export function createStringParser(): ContentParser {

    return new StringParser();
}
