import http = require("http");
import HttpException = require("./Exception");
import ServerError = require("./Errors");
import { RawPromise } from "@litert/core";
import * as Core from "./Core";

function extend(obj: any, name: string, fn: Function) {

    obj[name] = fn;
}

extend(http.IncomingMessage.prototype, "getBodyAsJSON", async function(
    this: Core.ServerRequest,
    maxLength: number = 0
): Promise<any> {

    try {

        return JSON.parse(
            (await this.getBody(maxLength)).toString()
        );
    }
    catch (e) {

        return Promise.reject(e);
    }
});

extend(http.IncomingMessage.prototype, "getBody", async function(
    this: Core.ServerRequest,
    maxLength: number = 0
): Promise<Buffer> {

    let ret = new RawPromise<Buffer, HttpException>();

    let buf: Buffer[] = [];

    let onData: any;
    let onEnd: any;
    let onClose: any;
    let onTimeout: any;

    let doCleanEvents = () => {

        this.removeListener("data", onData);
        this.removeListener("end", onEnd);
        this.removeListener("close", onClose);
        this.removeListener("timeout", onTimeout);
    };

    if (maxLength) {

        let length: number = 0;

        onData = (d: Buffer) => {

            length += d.byteLength;

            if (length > maxLength) {

                this.removeListener("end", onEnd);
                this.removeListener("data", onData);

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

    onEnd = () => {

        let data = Buffer.concat(buf);

        // @ts-ignore
        buf = undefined;

        doCleanEvents();

        ret.resolve(data);
    };

    onClose = () => {

        doCleanEvents();

        return ret.reject(new HttpException(
            ServerError.CONNECTION_CLOESD,
            "The connection was closed."
        ));
    };

    onTimeout = () => {

        doCleanEvents();

        return ret.reject(new HttpException(
            ServerError.READING_DATA_TIMEOUT,
            "Timeout when reading data from request."
        ));
    };

    this.on("data", onData)
    .on("end", onEnd)
    .on("close", onClose)
    .on("timeout", onTimeout);

    return ret.promise;
});
