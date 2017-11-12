import http = require("http");
import HttpException = require("./Exception");
import ServerError = require("./Errors");
import * as Core from "./Core";

declare module "http" {

    export class ServerResponse implements ServerResponse {

        public sendJSON(data: any): ServerResponse;

        public redirect(
            target: string,
            statusCode?: number
        ): ServerResponse;

        public send(data: string | Buffer): ServerResponse;
    }
}

http.ServerResponse.prototype.send = function(
    data: string | Buffer
): Core.ServerResponse {

    if (this.finished) {

        throw new HttpException(
            ServerError.RESPONSE_ALREADY_CLOSED,
            "Response has been closed"
        );
    }

    data = data instanceof Buffer ? data : Buffer.from(data);

    if (!this.headersSent) {

        this.setHeader(
            "Content-Length",
            data.byteLength.toString()
        );
    }

    this.end(data);

    return this;
};

http.ServerResponse.prototype.redirect = function(
    target: string,
    statusCode: number = Core.HTTPStatus.TEMPORARY_REDIRECT
): Core.ServerResponse {

    if (this.headersSent) {

        throw new HttpException(
            ServerError.HEADERS_ALREADY_SENT,
            "Response headers were already sent."
        );
    }

    this.writeHead(statusCode, {"Location": target});

    return this;
};

http.ServerResponse.prototype.sendJSON = function(
    data: any
): http.ServerResponse {

    if (this.finished) {

        throw new HttpException(
            ServerError.RESPONSE_ALREADY_CLOSED,
            "Response has been closed"
        );
    }

    data = JSON.stringify(data);

    if (!this.headersSent) {

        this.setHeader("Content-Type", "application/json");
        this.setHeader("Content-Length", data.length);
    }

    this.end(data);

    return this;
};
