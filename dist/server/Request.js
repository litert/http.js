"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const HttpException = require("./Exception");
const ServerError = require("./Errors");
const core_1 = require("@litert/core");
function extend(obj, name, fn) {
    obj[name] = fn;
}
extend(http.IncomingMessage.prototype, "getBody", async function (maxLength = 0) {
    try {
        return JSON.parse((await this.getBody(maxLength)).toString());
    }
    catch (e) {
        return Promise.reject(e);
    }
});
extend(http.IncomingMessage.prototype, "getBody", async function (maxLength = 0) {
    let ret = new core_1.RawPromise();
    let buf = [];
    if (maxLength) {
        let length = 0;
        this.on("data", (d) => {
            length += d.byteLength;
            if (length > maxLength) {
                this.removeAllListeners("end");
                this.removeAllListeners("data");
                return ret.reject(new HttpException(ServerError.EXCEED_MAX_BODY_LENGTH, "The received body exceed max length restriction."));
            }
            buf.push(d);
        });
    }
    else {
        this.on("data", (d) => {
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
//# sourceMappingURL=Request.js.map