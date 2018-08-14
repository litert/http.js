/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
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
     * The content data is unparsable by the parser of determined type.
     */
    UNACCEPTABLE_CONTENT_TYPE,

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
     * Cannot shutdown a mounted server.
     */
    SHUTDOWN_MOUNTED_SERVER,

    /**
     * The host has been added already.
     */
    DUPLICATED_HOST,

    /**
     * The host has not been added yet.
     */
    NON_EXISTENT_HOST,

    /**
     * A server must contains SSL/TLS certificate in a secure host.
     */
    REQUIRE_SSL_CERTIFICATE,

    /**
     * The path of controllers/middlewares doesn't exist.
     */
    PATH_NOT_EXIST
}

export default ServerError;
