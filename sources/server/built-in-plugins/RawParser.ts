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
    GetContentOptions,
    ContentParser
} from "../Abstract";

import { RawPromise } from "@litert/core";

import HttpException from "../Exception";
import ServerError from "../Errors";

const kRawData = Symbol("rawData");
const kRawDataPromise = Symbol("rawDataPromise");

class RawParser implements ContentParser {

    public parse(
        request: any,
        opts: GetContentOptions<string>
    ): Promise<any> {

        if (request[kRawData]) {

            return Promise.resolve(request[kRawData]);
        }

        if (request[kRawDataPromise]) {

            return request[kRawDataPromise];
        }

        const maxLength = opts.maxBytes || 0;

        if (maxLength > 0
            && request.contentInfo.length > -1
            && request.contentInfo.length < maxLength
        ) {

            return Promise.reject(new HttpException(
                ServerError.EXCEED_MAX_BODY_LENGTH,
                "The received body exceed max length restriction."
            ));
        }

        let ret = new RawPromise<Buffer, HttpException>();
        let buf: Buffer[] = [];

        request[kRawDataPromise] = ret.promise;

        type EventCallback = (...args: any[]) => void;

        let onData: EventCallback;
        let onEnd: EventCallback;
        let onClose: EventCallback;
        let onTimeout: EventCallback;

        let doCleanEvents = function() {

            request.removeListener("data", onData);
            request.removeListener("end", onEnd);
            request.removeListener("close", onClose);
            request.removeListener("timeout", onTimeout);
        };

        if (maxLength) {

            let length: number = 0;

            onData = function(d: Buffer) {

                length += d.byteLength;

                if (length > maxLength) {

                    doCleanEvents();

                    return ret.reject(new HttpException(
                        ServerError.EXCEED_MAX_BODY_LENGTH,
                        "The received body exceed max length restriction."
                    ));
                }

                buf.push(d);
            };
        }
        else {

            onData = (d: Buffer) => {

                buf.push(d);
            };
        }

        onEnd = function() {

            request[kRawData] = Buffer.concat(buf);

            // @ts-ignore
            buf = undefined;

            doCleanEvents();

            ret.resolve(request[kRawData]);
        };

        onClose = function() {

            doCleanEvents();

            return ret.reject(new HttpException(
                ServerError.CONNECTION_CLOESD,
                "The connection was closed."
            ));
        };

        onTimeout = function() {

            doCleanEvents();

            return ret.reject(new HttpException(
                ServerError.READING_DATA_TIMEOUT,
                "Timeout when reading data from request."
            ));
        };

        request.on("data", onData)
        .once("end", onEnd)
        .once("close", onClose)
        .once("timeout", onTimeout);

        return ret.promise;
    }
}

export function createRawParser(): ContentParser {

    return new RawParser();
}
