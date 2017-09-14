"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServerStatus;
(function (ServerStatus) {
    ServerStatus[ServerStatus["IDLE"] = 0] = "IDLE";
    ServerStatus[ServerStatus["STARTING"] = 1] = "STARTING";
    ServerStatus[ServerStatus["WORKING"] = 2] = "WORKING";
    ServerStatus[ServerStatus["CLOSING"] = 3] = "CLOSING";
})(ServerStatus = exports.ServerStatus || (exports.ServerStatus = {}));
var Errors;
(function (Errors) {
    Errors[Errors["INVALID_ROUTE_RULE_TYPE"] = 0] = "INVALID_ROUTE_RULE_TYPE";
})(Errors = exports.Errors || (exports.Errors = {}));
exports.HTTPMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
    "HEAD"
];
var ServerError;
(function (ServerError) {
    ServerError[ServerError["CLIENT_ERROR"] = 0] = "CLIENT_ERROR";
    ServerError[ServerError["APP_BUG"] = 1] = "APP_BUG";
})(ServerError = exports.ServerError || (exports.ServerError = {}));
/**
 * The default value of the hostname for a server.
 */
exports.DEFAULT_HOST = "0.0.0.0";
/**
 * The default value of the port for a server.
 */
exports.DEFAULT_PORT = 80;
/**
 * The default value of the max length of a waiting queue for a server.
 */
exports.DEFAULT_BACKLOG = 511;
/**
 * The default value of the max time that a request can be waited.
 */
exports.DEFAULT_MAX_TIME = 60;
//# sourceMappingURL=common.js.map