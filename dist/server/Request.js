"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const HttpException = require("./Exception");
const ServerError = require("./Errors");
const core_1 = require("@litert/core");
function extend(obj, name, fn) {
    obj[name] = fn;
}
extend(http.IncomingMessage.prototype, "getBodyAsJSON", async function (maxLength = 0) {
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
    let onData;
    let onEnd;
    let onClose;
    let onTimeout;
    let doCleanEvents = () => {
        this.removeListener("data", onData);
        this.removeListener("end", onEnd);
        this.removeListener("close", onClose);
        this.removeListener("timeout", onTimeout);
    };
    if (maxLength) {
        let length = 0;
        onData = (d) => {
            length += d.byteLength;
            if (length > maxLength) {
                doCleanEvents();
                return ret.reject(new HttpException(ServerError.EXCEED_MAX_BODY_LENGTH, "The received body exceed max length restriction."));
            }
            buf.push(d);
        };
    }
    else {
        onData = (d) => {
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
        return ret.reject(new HttpException(ServerError.CONNECTION_CLOESD, "The connection was closed."));
    };
    onTimeout = () => {
        doCleanEvents();
        return ret.reject(new HttpException(ServerError.READING_DATA_TIMEOUT, "Timeout when reading data from request."));
    };
    this.on("data", onData)
        .on("end", onEnd)
        .on("close", onClose)
        .on("timeout", onTimeout);
    return ret.promise;
});
//# sourceMappingURL=Request.js.map