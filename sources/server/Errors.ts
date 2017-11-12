enum ServerError {
    /**
     * The path is not acceptable.
     */
    INVALID_PATH = 0x00001001,

    FAILED_TO_START,
    INVALID_VARIABLE_TYPE,
    EXCEED_MAX_BODY_LENGTH,
    HEADERS_ALREADY_SENT,
    SERVER_NOT_WORKING,
    RESPONSE_ALREADY_CLOSED,

    /**
     * The next callback is not called inside middleware.
     */
    MISSING_CALLING_NEXT
}

export = ServerError;
