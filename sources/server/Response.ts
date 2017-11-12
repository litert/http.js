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
    }
}

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
