"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const HttpException = require("./Exception");
const ServerError = require("./Errors");
const Core = require("./Core");
function extend(obj, name, fn) {
    obj[name] = fn;
}
extend(http.ServerResponse.prototype, "send", function (data) {
    if (this.finished) {
        throw new HttpException(ServerError.RESPONSE_ALREADY_CLOSED, "Response has been closed");
    }
    if (!this.headersSent) {
        this.setHeader("Content-Length", Buffer.byteLength(data));
    }
    this.end(data);
    return this;
});
extend(http.ServerResponse.prototype, "redirect", function (target, statusCode = Core.HTTPStatus.TEMPORARY_REDIRECT) {
    if (this.headersSent) {
        throw new HttpException(ServerError.HEADERS_ALREADY_SENT, "Response headers were already sent.");
    }
    this.writeHead(statusCode, { "Location": target });
    return this;
});
extend(http.ServerResponse.prototype, "sendJSON", function (data) {
    if (this.finished) {
        throw new HttpException(ServerError.RESPONSE_ALREADY_CLOSED, "Response has been closed");
    }
    data = JSON.stringify(data);
    if (!this.headersSent) {
        this.setHeader("Content-Type", "application/json");
        this.setHeader("Content-Length", Buffer.byteLength(data));
    }
    this.end(data);
    return this;
});
//# sourceMappingURL=Response.js.map