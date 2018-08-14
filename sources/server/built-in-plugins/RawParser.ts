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

        const contentInfo = request.getContentInfo();

        if (maxLength > 0
            && contentInfo.length > -1
            && contentInfo.length < maxLength
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

        request.once("data", onData)
        .once("end", onEnd)
        .once("close", onClose)
        .once("timeout", onTimeout);

        return ret.promise;
    }
}

export function createRawParser(): ContentParser {

    return new RawParser();
}
