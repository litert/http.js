import http = require("http");
import { IDictionary } from "@litert/core";
import { EventEmitter } from "events";

export interface ServerRequest extends http.IncomingMessage {

    "path": string;

    "query": IDictionary<any>;

    "queryString": string;

    "server": Server;

    /**
     * Get HTTP request body as raw stream.
     *
     * @param maxLength (uint) Limit the max length of body.
     */
    getBody(maxLength?: number): Promise<Buffer>;

    /**
     * Get HTTP request body as JSON encoded data.
     *
     * @param maxLength (uint) Limit the max length of body.
     */
    getBodyAsJSON(maxLength?: number): Promise<any>;
}

export interface ServerResponse extends http.ServerResponse {

    /**
     * Send a redirection to client.
     */
    redirect(target: string, statusCode?: number): ServerResponse;

    sendJSON(data: any): ServerResponse;
}

export type RequestHandler = (
    context: RequestContext
) => Promise<void>;

export type RequestMiddleware = (
    context: RequestContext,
    next: (end?: boolean) => Promise<void>
) => void;

export interface RequestContext {

    "request": ServerRequest;

    "response": ServerResponse;

    "data": IDictionary<any>;

    "params": IDictionary<any>;
}

export interface RouteResult {

    "middlewares": RequestMiddleware[];

    "handler": RequestHandler;
}

export interface HTTPMethodDictionary<T> {
    "GET": T;
    "POST": T;
    "PUT": T;
    "TRACE": T;
    "DELETE": T;
    "OPTIONS": T;
    "HEAD": T;
    "PATCH": T;
    "COPY": T;
    "LOCK": T;
    "UNLOCK": T;
    "MOVE": T;
    "MKCOL": T;
    "PROPFIND": T;
    "PROPPATCH": T;
    "REPORT": T;
    "MKACTIVITY": T;
    "CHECKOUT": T;
    "MERGE": T;
    "M-SEARCH": T;
    "NOTIFY": T;
    "SUBSCRIBE": T;
    "UNSUBSCRIBE": T;
}

export type HTTPMethod = keyof HTTPMethodDictionary<any>;

export const HTTP_METHODS: HTTPMethod[] = [
    "GET", "POST", "PUT", "TRACE",
    "DELETE", "OPTIONS", "HEAD", "PATCH",
    "COPY", "LOCK", "UNLOCK", "MOVE",
    "MKCOL", "PROPFIND", "PROPPATCH", "REPORT",
    "MKACTIVITY", "CHECKOUT", "MERGE", "M-SEARCH",
    "NOTIFY", "SUBSCRIBE", "UNSUBSCRIBE"
];

export interface SSLConfiguration {

    /**
     * The content of private key for SSL
     */
    "key": string | Buffer;

    /**
     * The content of certificate for SSL.
     */
    "certificate": string | Buffer;

    /**
     * Optional passphrase for the private key.
     */
    "passphrase"?: string;
}

/**
 * The options for creating HTTP server object.
 */
export interface CreateServerOptions {

    /**
     * The host to listen.
     *
     * Default: 0.0.0.0
     */
    "host"?: string;

    /**
     * The port to listen.
     *
     * Default: 80
     */
    "port"?: number;

    /**
     * The backlog to listen.
     *
     * Default: 512
     */
    "backlog"?: number;

    /**
     * The router object.
     */
    "router": RequestRouter;

    "ssl"?: SSLConfiguration;
}

export enum HTTPMethods {
    GET, POST, PUT, TRACE,
    DELETE, OPTIONS, HEAD, PATCH,
    COPY, LOCK, UNLOCK, MOVE,
    MKCOL, PROPFIND, PROPPATCH, REPORT,
    MKACTIVITY, CHECKOUT, MERGE, MSEARCH,
    NOTIFY, SUBSCRIBE, UNSUBSCRIBE
}

export enum ServerStatus {

    /**
     * Server is created but not started yet.
     */
    READY,

    /**
     * Server is starting.
     */
    STARTING,

    /**
     * Server is started and working now.
     */
    WORKING,

    /**
     * Server is closing.
     */
    CLOSING

}

export interface Server extends EventEmitter {

    /**
     * The port of server listening.
     */
    readonly port: number;

    /**
     * The host of server listening.
     */
    readonly host: string;

    /**
     * The backlog of server.
     */
    readonly backlog: number;

    /**
     * The status of server.
     */
    readonly status: ServerStatus;

    /**
     * Start listening.
     */
    start(): Promise<void>;

    /**
     * Stop listening.
     */
    shutdown(): Promise<void>;
}

export interface RequestRouter {

    use(
        method: HTTPMethod,
        path: string | RegExp,
        middleware: RequestMiddleware
    ): RequestRouter;

    use(
        method: HTTPMethod,
        middleware: RequestMiddleware
    ): RequestRouter;

    use(
        path: string | RegExp,
        middleware: RequestMiddleware
    ): RequestRouter;

    use(
        middleware: RequestMiddleware
    ): RequestRouter;

    register(
        method: HTTPMethod,
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): RequestRouter;

    route(
        method: HTTPMethod,
        path: string,
        context: RequestContext
    ): RouteResult;

    notFound(handler: RequestHandler): RequestRouter;

    badMethod(handler: RequestHandler): RequestRouter;
}

export interface RouteRule<T> {

    readonly handler: T;

    readonly data: IDictionary<any>;

    route(path: string, context: RequestContext): boolean;
}

export const DEFAULT_PORT: number = 80;

export const DEFAULT_HOST: string = "0.0.0.0";

export const DEFAULT_BACKLOG: number = 512;

export const EXCEPTION_TYPE: string = "litert/http";

export enum HTTPStatus {

    CONTINUE = 100,
    SWITCHING_PROTOCOL = 101,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    PARTIAL = 206,
    MULTI_CHOICES = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    USE_PROXY = 305,
    TEMPORARY_REDIRECT = 307,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_UNAUTHORIZED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    ENTITY_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVER_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    VERSION_UNSUPPORTED = 505
}
