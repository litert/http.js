"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_METHODS = [
    "GET", "POST", "PUT", "TRACE",
    "DELETE", "OPTIONS", "HEAD", "PATCH",
    "COPY", "LOCK", "UNLOCK", "MOVE",
    "MKCOL", "PROPFIND", "PROPPATCH", "REPORT",
    "MKACTIVITY", "CHECKOUT", "MERGE", "M-SEARCH",
    "NOTIFY", "SUBSCRIBE", "UNSUBSCRIBE"
];
var ServerStatus;
(function (ServerStatus) {
    /**
     * Server is created but not started yet.
     */
    ServerStatus[ServerStatus["READY"] = 0] = "READY";
    /**
     * Server is starting.
     */
    ServerStatus[ServerStatus["STARTING"] = 1] = "STARTING";
    /**
     * Server is started and working now.
     */
    ServerStatus[ServerStatus["WORKING"] = 2] = "WORKING";
    /**
     * Server is shutting down.
     */
    ServerStatus[ServerStatus["CLOSING"] = 3] = "CLOSING";
})(ServerStatus = exports.ServerStatus || (exports.ServerStatus = {}));
exports.DEFAULT_PORT = 80;
exports.DEFAULT_SSL_PORT = 443;
exports.DEFAULT_HOST = "0.0.0.0";
exports.DEFAULT_BACKLOG = 512;
exports.DEFAULT_KEEP_ALIVE = 5000;
exports.DEFAULT_EXPECT_REQUEST = false;
/**
 * The default connection timeout of server.
 */
exports.DEFAULT_TIMEOUT = 60000;
exports.EXCEPTION_TYPE = "litert/http";
var HTTPStatus;
(function (HTTPStatus) {
    HTTPStatus[HTTPStatus["CONTINUE"] = 100] = "CONTINUE";
    HTTPStatus[HTTPStatus["SWITCHING_PROTOCOL"] = 101] = "SWITCHING_PROTOCOL";
    HTTPStatus[HTTPStatus["OK"] = 200] = "OK";
    HTTPStatus[HTTPStatus["CREATED"] = 201] = "CREATED";
    HTTPStatus[HTTPStatus["ACCEPTED"] = 202] = "ACCEPTED";
    HTTPStatus[HTTPStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    HTTPStatus[HTTPStatus["PARTIAL"] = 206] = "PARTIAL";
    HTTPStatus[HTTPStatus["MULTI_CHOICES"] = 300] = "MULTI_CHOICES";
    HTTPStatus[HTTPStatus["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    HTTPStatus[HTTPStatus["FOUND"] = 302] = "FOUND";
    HTTPStatus[HTTPStatus["SEE_OTHER"] = 303] = "SEE_OTHER";
    HTTPStatus[HTTPStatus["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HTTPStatus[HTTPStatus["USE_PROXY"] = 305] = "USE_PROXY";
    HTTPStatus[HTTPStatus["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    HTTPStatus[HTTPStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTPStatus[HTTPStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTPStatus[HTTPStatus["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    HTTPStatus[HTTPStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTPStatus[HTTPStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTPStatus[HTTPStatus["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HTTPStatus[HTTPStatus["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    HTTPStatus[HTTPStatus["PROXY_UNAUTHORIZED"] = 407] = "PROXY_UNAUTHORIZED";
    HTTPStatus[HTTPStatus["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    HTTPStatus[HTTPStatus["CONFLICT"] = 409] = "CONFLICT";
    HTTPStatus[HTTPStatus["GONE"] = 410] = "GONE";
    HTTPStatus[HTTPStatus["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    HTTPStatus[HTTPStatus["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    HTTPStatus[HTTPStatus["ENTITY_TOO_LARGE"] = 413] = "ENTITY_TOO_LARGE";
    HTTPStatus[HTTPStatus["URI_TOO_LONG"] = 414] = "URI_TOO_LONG";
    HTTPStatus[HTTPStatus["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    HTTPStatus[HTTPStatus["RANGE_NOT_SATISFIABLE"] = 416] = "RANGE_NOT_SATISFIABLE";
    HTTPStatus[HTTPStatus["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    HTTPStatus[HTTPStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HTTPStatus[HTTPStatus["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HTTPStatus[HTTPStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HTTPStatus[HTTPStatus["SERVER_UNAVAILABLE"] = 503] = "SERVER_UNAVAILABLE";
    HTTPStatus[HTTPStatus["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    HTTPStatus[HTTPStatus["VERSION_UNSUPPORTED"] = 505] = "VERSION_UNSUPPORTED";
})(HTTPStatus = exports.HTTPStatus || (exports.HTTPStatus = {}));
//# sourceMappingURL=Core.js.map