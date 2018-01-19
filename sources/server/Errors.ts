/*
   +----------------------------------------------------------------------+
   | LiteRT HTTP.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/http.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

enum ServerError {
    /**
     * The path is not acceptable.
     */
    INVALID_PATH = 0x00001001,

    /**
     * Failed to start server.
     */
    FAILED_TO_START,

    /**
     * Invalid expression of variable.
     */
    INVALID_VARIABLE_TYPE,

    /**
     * The received body exceed max length restriction.
     */
    EXCEED_MAX_BODY_LENGTH,

    /**
     * Response headers were already sent.
     */
    HEADERS_ALREADY_SENT,

    /**
     * Server is not started.
     */
    SERVER_NOT_WORKING,

    /**
     * Timeout when reading data from request.
     */
    READING_DATA_TIMEOUT,

    /**
     * The connection was closed.
     */
    CONNECTION_CLOESD,

    /**
     * Response has been closed.
     */
    RESPONSE_ALREADY_CLOSED,

    /**
     * The next callback is not called inside middleware.
     */
    MISSING_CALLING_NEXT,

    /**
     * Cannot start a mounted server.
     */
    START_MOUNTED_SERVER,

    /**
     * The host has been added already.
     */
    DUPLICATED_HOST,

    /**
     * The host has not been added yet.
     */
    NON_EXISTENT_HOST,

    /**
     * A server must contains TLS/SSL certificate in a secure host.
     */
    REQUIRE_SSL_CERTIFICATE
}

export default ServerError;
