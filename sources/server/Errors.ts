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
    MISSING_CALLING_NEXT
}

export default ServerError;
