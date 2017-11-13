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

    if (maxLength) {

        let length: number = 0;

        this.on("data", (d: Buffer) => {

            length += d.byteLength;

            if (length > maxLength) {

                this.removeAllListeners("end");
                this.removeAllListeners("data");

                return ret.reject(new HttpException(
                    ServerError.EXCEED_MAX_BODY_LENGTH,
                    "The received body exceed max length restriction."
                ));
            }

            buf.push(d);
        });
    }
    else {

        this.on("data", (d: Buffer) => {

            buf.push(d);
        });
    }

    this.on("end", () => {

        let data = Buffer.concat(buf);

        // @ts-ignore
        buf = undefined;

        ret.resolve(data);
    });

    return ret.promise;
});
