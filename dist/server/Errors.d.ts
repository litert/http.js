declare enum ServerError {
    /**
     * The path is not acceptable.
     */
    INVALID_PATH = 4097,
    FAILED_TO_START = 4098,
    INVALID_VARIABLE_TYPE = 4099,
    EXCEED_MAX_BODY_LENGTH = 4100,
    HEADERS_ALREADY_SENT = 4101,
}
export = ServerError;
