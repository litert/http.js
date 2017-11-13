"use strict";
var ServerError;
(function (ServerError) {
    /**
     * The path is not acceptable.
     */
    ServerError[ServerError["INVALID_PATH"] = 4097] = "INVALID_PATH";
    /**
     * Failed to start server.
     */
    ServerError[ServerError["FAILED_TO_START"] = 4098] = "FAILED_TO_START";
    /**
     * Invalid expression of variable.
     */
    ServerError[ServerError["INVALID_VARIABLE_TYPE"] = 4099] = "INVALID_VARIABLE_TYPE";
    /**
     * The received body exceed max length restriction.
     */
    ServerError[ServerError["EXCEED_MAX_BODY_LENGTH"] = 4100] = "EXCEED_MAX_BODY_LENGTH";
    /**
     * Response headers were already sent.
     */
    ServerError[ServerError["HEADERS_ALREADY_SENT"] = 4101] = "HEADERS_ALREADY_SENT";
    /**
     * Server is not started.
     */
    ServerError[ServerError["SERVER_NOT_WORKING"] = 4102] = "SERVER_NOT_WORKING";
    /**
     * Timeout when reading data from request.
     */
    ServerError[ServerError["READING_DATA_TIMEOUT"] = 4103] = "READING_DATA_TIMEOUT";
    /**
     * The connection was closed.
     */
    ServerError[ServerError["CONNECTION_CLOESD"] = 4104] = "CONNECTION_CLOESD";
    /**
     * Response has been closed.
     */
    ServerError[ServerError["RESPONSE_ALREADY_CLOSED"] = 4105] = "RESPONSE_ALREADY_CLOSED";
    /**
     * The next callback is not called inside middleware.
     */
    ServerError[ServerError["MISSING_CALLING_NEXT"] = 4106] = "MISSING_CALLING_NEXT";
})(ServerError || (ServerError = {}));
module.exports = ServerError;
//# sourceMappingURL=Errors.js.map