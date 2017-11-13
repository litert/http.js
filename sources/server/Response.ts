import http = require("http");
import HttpException = require("./Exception");
import ServerError = require("./Errors");
import * as Core from "./Core";

function extend(obj: any, name: string, fn: Function) {

    obj[name] = fn;
}

extend(http.ServerResponse.prototype, "send", function(
    this: Core.ServerResponse,
    data: string | Buffer
): Core.ServerResponse {

    if (this.finished) {

        throw new HttpException(
            ServerError.RESPONSE_ALREADY_CLOSED,
            "Response has been closed"
        );
    }

    if (!this.headersSent) {

        this.setHeader(
            "Content-Length",
            Buffer.byteLength(data)
        );
    }

    this.end(data);

    return this;
});

extend(http.ServerResponse.prototype, "redirect", function(
    this: Core.ServerResponse,
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
});

extend(http.ServerResponse.prototype, "sendJSON", function(
    this: Core.ServerResponse,
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
        this.setHeader("Content-Length", Buffer.byteLength(data));
    }

    this.end(data);

    return this;
});
