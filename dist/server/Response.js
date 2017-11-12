"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const HttpException = require("./Exception");
const ServerError = require("./Errors");
const Core = require("./Core");
http.ServerResponse.prototype.send = function (data) {
    if (this.finished) {
        throw new HttpException(ServerError.RESPONSE_ALREADY_CLOSED, "Response has been closed");
    }
    data = data instanceof Buffer ? data : Buffer.from(data);
    if (!this.headersSent) {
        this.setHeader("Content-Length", data.byteLength.toString());
    }
    this.end(data);
    return this;
};
http.ServerResponse.prototype.redirect = function (target, statusCode = Core.HTTPStatus.TEMPORARY_REDIRECT) {
    if (this.headersSent) {
        throw new HttpException(ServerError.HEADERS_ALREADY_SENT, "Response headers were already sent.");
    }
    this.writeHead(statusCode, { "Location": target });
    return this;
};
http.ServerResponse.prototype.sendJSON = function (data) {
    if (this.finished) {
        throw new HttpException(ServerError.RESPONSE_ALREADY_CLOSED, "Response has been closed");
    }
    data = JSON.stringify(data);
    if (!this.headersSent) {
        this.setHeader("Content-Type", "application/json");
        this.setHeader("Content-Length", data.length);
    }
    this.end(data);
    return this;
};
//# sourceMappingURL=Response.js.map