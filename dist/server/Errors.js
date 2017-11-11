"use strict";
var ServerError;
(function (ServerError) {
    /**
     * The path is not acceptable.
     */
    ServerError[ServerError["INVALID_PATH"] = 4097] = "INVALID_PATH";
    ServerError[ServerError["FAILED_TO_START"] = 4098] = "FAILED_TO_START";
    ServerError[ServerError["INVALID_VARIABLE_TYPE"] = 4099] = "INVALID_VARIABLE_TYPE";
    ServerError[ServerError["EXCEED_MAX_BODY_LENGTH"] = 4100] = "EXCEED_MAX_BODY_LENGTH";
    ServerError[ServerError["HEADERS_ALREADY_SENT"] = 4101] = "HEADERS_ALREADY_SENT";
})(ServerError || (ServerError = {}));
module.exports = ServerError;
//# sourceMappingURL=Errors.js.map