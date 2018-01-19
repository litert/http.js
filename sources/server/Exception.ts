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

import { Exception as AbstractException } from "@litert/core";
import { EXCEPTION_TYPE } from "./Abstract";

class HttpException extends AbstractException {

    public constructor(error: number, message: string) {

        super(error, message);

        this._type = EXCEPTION_TYPE;
    }
}

export default HttpException;
