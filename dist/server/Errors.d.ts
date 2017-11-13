declare enum ServerError {
    /**
     * The path is not acceptable.
     */
    INVALID_PATH = 4097,
    /**
     * Failed to start server.
     */
    FAILED_TO_START = 4098,
    /**
     * Invalid expression of variable.
     */
    INVALID_VARIABLE_TYPE = 4099,
    /**
     * The received body exceed max length restriction.
     */
    EXCEED_MAX_BODY_LENGTH = 4100,
    /**
     * Response headers were already sent.
     */
    HEADERS_ALREADY_SENT = 4101,
    /**
     * Server is not started.
     */
    SERVER_NOT_WORKING = 4102,
    /**
     * Timeout when reading data from request.
     */
    READING_DATA_TIMEOUT = 4103,
    /**
     * The connection was closed.
     */
    CONNECTION_CLOESD = 4104,
    /**
     * Response has been closed.
     */
    RESPONSE_ALREADY_CLOSED = 4105,
    /**
     * The next callback is not called inside middleware.
     */
    MISSING_CALLING_NEXT = 4106,
}
export = ServerError;
